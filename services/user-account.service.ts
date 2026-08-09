import { updateProfile } from "firebase/auth";
import { getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

import { getFirebaseAuth } from "@/firebase/config";
import { userDocRef } from "@/firebase/firestore";
import { uploadUserFile, deleteUserFile } from "@/firebase/storage";
import { authLog } from "@/lib/auth-logger";
import {
  isDeviceFreeSignupConsumed,
  markDeviceFreeSignupConsumed,
} from "@/lib/device-free-signup";
import {
  freeTierExhaustedOnDevicePayload,
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

/** Mirrors Flutter `AccountSettings.creditsSummaryLine`. */
export function profileCreditsRemainingLine(account: UserAccountView): string {
  const { planTier, generationCredits, generationCreditCap, creditsUsed } =
    account;
  if (planTier === "free") {
    const remaining = Math.max(0, Math.min(5, generationCredits));
    const used = Math.max(0, 5 - remaining);
    return `${remaining} of 5 free generation credits remaining · ${used} used`;
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

/**
 * First-time balance on `users/{uid}`: grant 5 only if this device has not
 * already used its one-time free signup allocation; otherwise 0 (same shape as
 * Flutter `freeTierAfterTopUpExhausted` / exhausted free tier).
 */
export async function ensureFreeGenerationCreditsForUser(
  uid: string,
): Promise<void> {
  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as Record<string, unknown>;
  if (!userDocMissingCreditBalance(data)) return;
  if (parsePlanTierFromUserDoc(data) !== "free") return;

  const payload = isDeviceFreeSignupConsumed()
    ? freeTierExhaustedOnDevicePayload()
    : freeTierStarterCreditsPayload();

  await setDoc(
    ref,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  markDeviceFreeSignupConsumed();

  authLog.info("account.free_credits_initialized", {
    uid,
    granted: payload.generationCredits,
  });
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
