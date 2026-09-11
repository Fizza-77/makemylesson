import { updateProfile } from "firebase/auth";
import { getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

import { getFirebaseAuth } from "@/lib/firebase/config";
import { userDocRef } from "@/lib/firebase/firestore";
import { uploadUserFile, deleteUserFile } from "@/lib/firebase/storage";
import { authLog } from "@/lib/auth-logger";
import { isGuestWebUid } from "@/lib/guest-auth-id";
import {
  isDeviceFreeSignupConsumed,
  markDeviceFreeSignupConsumed,
} from "@/lib/device-free-signup";
import {
  getGuestCreditsRemaining,
  getGuestTrialUsedCount,
  GUEST_GENERATION_CREDIT_CAP,
  sealGuestTrialOnDevice,
} from "@/lib/guest-credits";
import {
  fetchWebTrialStatusFromServer,
  sealWebTrialIpOnServer,
} from "@/lib/trial-api.client";
import {
  freeTierExhaustedOnDevicePayload,
  freeTierPayloadFromTrialRemaining,
  freeTierStarterCreditsPayload,
  isLifetimeTopUpTier,
  isPaidPlanTier,
  parsePlanTierFromUserDoc,
  resolveSubscriptionCredits,
  toInt,
  userDocMissingCreditBalance,
} from "@/lib/subscription-firestore-sync";
import type { AccountPlanTier } from "@/types/account";

/** Read model for Profile — mirrors users/{uid} fields Flutter already uses. */
export type UserAccountView = {
  uid: string;
  email: string | null;
  displayName: string;
  schoolName: string | null;
  schoolLogoUrl: string | null;
  schoolLogoName: string | null;
  profilePhotoUrl: string | null;
  ownPicName: string | null;
  avatarSource: string;
  avatarSeed: string | null;
  useSchoolNameInAi: boolean;
  useSchoolLogoInAi: boolean;
  useOwnPicInAi: boolean;
  planTier: AccountPlanTier;
  generationCredits: number;
  generationCreditCap: number;
  creditsUsed: number;
  /** From Firestore `creditsResetEpochMs` or `subscriptionEndsAtMs`. */
  creditsResetUtc: Date | null;
  profileComplete: boolean;
  banned: boolean;
};

export function isPaidPlan(tier: AccountPlanTier): boolean {
  return isPaidPlanTier(tier);
}

/** Shared free-tier credit summary for guests and signed-in free users. */
export function freeCreditsSummaryLine(
  remaining: number,
  cap = GUEST_GENERATION_CREDIT_CAP,
): string {
  const safeRemaining = Math.max(0, Math.min(cap, Math.trunc(remaining)));
  const used = Math.max(0, cap - safeRemaining);
  return `${safeRemaining} of ${cap} free generation credits remaining · ${used} used`;
}

/** Mirrors Flutter `AccountSettings.creditsSummaryLine`. */
export function profileCreditsRemainingLine(account: UserAccountView): string {
  const { planTier, generationCredits, generationCreditCap, creditsUsed } =
    account;
  if (planTier === "free") {
    return freeCreditsSummaryLine(generationCredits);
  }
  if (isLifetimeTopUpTier(planTier)) {
    return `${generationCredits} of ${generationCreditCap} generation credits · ${creditsUsed} used`;
  }
  if (
    planTier === "individualAnnual" ||
    planTier === "department" ||
    planTier === "school" ||
    planTier === "school_plus"
  ) {
    return `${generationCredits} of ${generationCreditCap} generation credits this year · ${creditsUsed} used`;
  }
  return `${generationCredits} of ${generationCreditCap} generation credits this month · ${creditsUsed} used`;
}

export function profileSubscriptionFootnote(
  account: UserAccountView,
): string | null {
  if (account.planTier === "free") {
    return "Free credits are one-time when you join and do not refill each month.";
  }
  if (isLifetimeTopUpTier(account.planTier)) {
    return "Credits never expire";
  }
  if (!account.creditsResetUtc) return null;
  const formatted = account.creditsResetUtc.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (account.planTier === "individualMonthly") {
    return `Credits reset on ${formatted}`;
  }
  if (
    account.planTier === "individualAnnual" ||
    account.planTier === "department" ||
    account.planTier === "school" ||
    account.planTier === "school_plus"
  ) {
    return `Annual plan renews on ${formatted}`;
  }
  return null;
}

function parseCreditsResetUtc(data: Record<string, unknown>): Date | null {
  const ms = toInt(data.subscriptionEndsAtMs) ?? toInt(data.creditsResetEpochMs);
  if (ms == null || !Number.isFinite(ms)) return null;
  return new Date(ms);
}

export function mapUserDoc(
  uid: string,
  data: Record<string, unknown>,
  authEmail?: string | null,
  authDisplayName?: string | null,
): UserAccountView {
  // Same resolution path as Flutter `SubscriptionFirestoreSync`.
  const credits = resolveSubscriptionCredits(data);
  maybeMarkDeviceFreeSignupConsumedFromUserDoc(data);

  const dn =
    ((data.displayName as string) || authDisplayName || "").trim() || "Teacher";

  return {
    uid,
    email: (data.email as string) ?? authEmail ?? null,
    displayName: dn,
    schoolName: (data.schoolName as string) ?? null,
    schoolLogoUrl: (data.schoolLogoUrl as string) ?? null,
    schoolLogoName: (data.schoolLogoName as string) ?? null,
    profilePhotoUrl: (data.profilePhotoUrl as string) ?? null,
    ownPicName: (data.ownPicName as string) ?? null,
    avatarSource:
      (data.avatarSource as string) ??
      (data.avatar_source as string) ??
      "none",
    avatarSeed:
      (data.avatarSeed as string) ?? (data.avatar_seed as string) ?? null,
    useSchoolNameInAi: data.useSchoolNameInAi === true,
    useSchoolLogoInAi: data.useSchoolLogoInAi === true,
    useOwnPicInAi: data.useOwnPicInAi === true,
    planTier: credits.planTier,
    generationCredits: credits.generationCredits,
    generationCreditCap: credits.generationCreditCap,
    creditsUsed: credits.creditsUsed,
    creditsResetUtc: parseCreditsResetUtc(data),
    profileComplete: data.profileComplete === true,
    banned: data.banned === true,
  };
}

export const PLAN_LABELS: Record<AccountPlanTier, string> = {
  free: "Free",
  individualMonthly: "Individual Monthly",
  individualAnnual: "Individual Annual",
  creditTopUp50: "One-Time Credit Top-Up",
  department: "Department",
  school: "School",
  school_plus: "School Plus",
};

/**
 * When a free account on this device has used (or exhausted) signup credits,
 * remember so the next account on the same browser does not get another 5.
 */
function maybeMarkDeviceFreeSignupConsumedFromUserDoc(
  data: Record<string, unknown>,
): void {
  const authUser = getFirebaseAuth().currentUser;
  if (
    authUser &&
    (authUser.isAnonymous || isGuestWebUid(authUser.uid))
  ) {
    return;
  }
  if (parsePlanTierFromUserDoc(data) !== "free") return;
  const credits = toInt(data.generationCredits);
  const used = toInt(data.creditsUsed);
  if (used != null && used > 0) {
    markDeviceFreeSignupConsumed();
    return;
  }
  if (credits != null && credits <= 0) {
    markDeviceFreeSignupConsumed();
  }
}

function resolveInitialFreeTierPayload(): Record<string, unknown> {
  const trialRemaining = getGuestCreditsRemaining();
  const trialUsed = getGuestTrialUsedCount();

  if (trialUsed > 0) {
    return freeTierPayloadFromTrialRemaining(trialRemaining);
  }
  if (isDeviceFreeSignupConsumed()) {
    return freeTierExhaustedOnDevicePayload();
  }
  if (trialRemaining < GUEST_GENERATION_CREDIT_CAP) {
    return freeTierPayloadFromTrialRemaining(trialRemaining);
  }
  return freeTierStarterCreditsPayload();
}

/**
 * First-time balance on `users/{uid}`: seed from web trial remaining when set,
 * otherwise 5 if this device has not used its one-time free signup allocation.
 */
export async function ensureFreeGenerationCreditsForUser(
  uid: string,
): Promise<void> {
  const authUser = getFirebaseAuth().currentUser;
  if (
    authUser?.uid === uid &&
    (authUser.isAnonymous || isGuestWebUid(uid))
  ) {
    return;
  }

  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as Record<string, unknown>;
  if (!userDocMissingCreditBalance(data)) return;
  if (parsePlanTierFromUserDoc(data) !== "free") return;

  try {
    await fetchWebTrialStatusFromServer();
  } catch {
    /* IP trial sync is best-effort */
  }

  const payload = resolveInitialFreeTierPayload();

  await setDoc(
    ref,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  sealGuestTrialOnDevice();

  authLog.info("account.free_credits_initialized", {
    uid,
    granted: payload.generationCredits,
  });
}

/**
 * Existing free accounts: subtract web trial usage from Firestore balance so
 * mobile and web share one lifetime free-credit pool.
 */
export async function mergeTrialUsageIntoAccountCredits(
  uid: string,
): Promise<void> {
  const trialUsed = getGuestTrialUsedCount();
  if (trialUsed <= 0) return;

  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as Record<string, unknown>;
  if (parsePlanTierFromUserDoc(data) !== "free") return;
  if (userDocMissingCreditBalance(data)) return;

  const resolved = resolveSubscriptionCredits(data);
  const cap = resolved.generationCreditCap;
  const current = resolved.generationCredits;
  const newRemaining = Math.max(0, current - trialUsed);

  if (newRemaining === current) {
    if (newRemaining === 0) {
      const user = getFirebaseAuth().currentUser;
      if (user) {
        await sealWebTrialIpOnServer(user).catch(() => null);
      }
    }
    sealGuestTrialOnDevice();
    return;
  }

  await setDoc(
    ref,
    {
      generationCredits: newRemaining,
      generationCreditCap: cap,
      creditsUsed: cap - newRemaining,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (newRemaining === 0) {
    const user = getFirebaseAuth().currentUser;
    if (user) {
      await sealWebTrialIpOnServer(user).catch(() => null);
    }
  }
  sealGuestTrialOnDevice();

  authLog.info("account.trial_merged", {
    uid,
    trialUsed,
    before: current,
    after: newRemaining,
  });
}

/**
 * When a free account has no credits left, seal the IP trial pool too so
 * incognito / other browsers on the same network cannot pick up leftover IP credits.
 */
export async function sealWebTrialWhenFreeAccountExhausted(
  uid: string,
): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (!user) return;

  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return;

  const data = snap.data() as Record<string, unknown>;
  if (parsePlanTierFromUserDoc(data) !== "free") return;
  if (userDocMissingCreditBalance(data)) return;

  const resolved = resolveSubscriptionCredits(data);
  if (resolved.generationCredits > 0) return;

  try {
    await sealWebTrialIpOnServer(user);
    authLog.info("account.ip_trial_sealed", { uid });
  } catch (error) {
    authLog.warn("account.ip_trial_seal_failed", {
      uid,
      message: String(error),
    });
  }

  sealGuestTrialOnDevice();
}

/** Live listener on users/{uid} — read only; no subscription repair writes. */
export function subscribeUserAccount(
  uid: string,
  onData: (view: UserAccountView) => void,
  onError?: (error: unknown) => void,
): () => void {
  const auth = getFirebaseAuth().currentUser;
  return onSnapshot(
    userDocRef(uid),
    (snap) => {
      const data = snap.data() ?? {};
      onData(
        mapUserDoc(
          uid,
          data as Record<string, unknown>,
          auth?.email,
          auth?.displayName,
        ),
      );
    },
    (error) => {
      authLog.error("profile.snapshot", error, { uid });
      onError?.(error);
    },
  );
}

/** Merge-only updates for fields Flutter already writes — never creates new fields. */
export async function updateUserProfileFields(
  uid: string,
  fields: Record<string, unknown>,
) {
  await setDoc(
    userDocRef(uid),
    { ...fields, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function updateDisplayName(uid: string, displayName: string) {
  const name = displayName.trim() || "Teacher";
  const user = getFirebaseAuth().currentUser;
  if (user) {
    try {
      await updateProfile(user, { displayName: name });
    } catch (e) {
      authLog.warn("profile.displayName_auth", { message: String(e) });
    }
  }
  await updateUserProfileFields(uid, { displayName: name });
  authLog.success("profile.displayName_updated", { uid });
}

export async function uploadAndSetProfilePhoto(
  uid: string,
  file: File | Blob,
  fileName?: string,
) {
  const name =
    fileName ?? (file instanceof File ? file.name : "profile.jpg");
  const type = file instanceof File ? file.type : "image/jpeg";
  const url = await uploadUserFile(
    uid,
    "profile_photo",
    file,
    type || "image/jpeg",
  );
  await updateUserProfileFields(uid, {
    profilePhotoUrl: url,
    ownPicName: name,
    avatarSource: "photo",
    avatarSeed: null,
  });
  authLog.success("profile.photo_updated", { uid });
  return url;
}

/** Mirrors Flutter `removeProfilePhoto`. */
export async function removeProfilePhoto(uid: string) {
  await deleteUserFile(uid, "profile_photo");
  await updateUserProfileFields(uid, {
    profilePhotoUrl: null,
    ownPicName: null,
    avatarSource: "none",
    avatarSeed: null,
    useOwnPicInAi: false,
  });
  authLog.success("profile.photo_removed", { uid });
}

/** Mirrors Flutter `setRandomAvatar`. */
export async function setRandomAvatar(uid: string, seed: string) {
  const trimmed = seed.trim();
  if (!trimmed) return;
  await deleteUserFile(uid, "profile_photo");
  await updateUserProfileFields(uid, {
    avatarSource: "random",
    avatarSeed: trimmed,
    profilePhotoUrl: null,
    ownPicName: null,
    useOwnPicInAi: false,
  });
  authLog.success("profile.avatar_set", { uid });
}

/** Upload school logo and merge existing Firestore fields only. */
export async function uploadAndSetSchoolLogo(uid: string, file: File) {
  const url = await uploadUserFile(
    uid,
    "school_logo",
    file,
    file.type || "image/jpeg",
  );
  await updateUserProfileFields(uid, {
    schoolLogoUrl: url,
    schoolLogoName: file.name,
  });
  authLog.success("profile.school_logo_updated", { uid });
  return url;
}


