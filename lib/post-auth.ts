import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

import { sendWelcomeEmail } from "@/services/auth-email.service";
import {
  ensureUserDocument,
  fetchUserProfile,
  userDocRef,
} from "@/firebase/firestore";
import { signOutUser } from "@/firebase/auth";
import { callFunction } from "@/firebase/functions";
import { authLog } from "@/lib/auth-logger";
import { ROUTES } from "@/lib/urls";
import {
  ensureFreeGenerationCreditsForUser,
  mergeTrialUsageIntoAccountCredits,
  sealWebTrialWhenFreeAccountExhausted,
} from "@/services/user-account.service";
import { useAuthStore } from "@/store/auth-store";

function isSocialProvider(user: User): boolean {
  return user.providerData.some(
    (p) => p.providerId === "google.com" || p.providerId === "apple.com",
  );
}

async function maybeSendSocialWelcomeEmail(user: User, wasCreated: boolean) {
  if (!isSocialProvider(user)) return;
  const snap = await getDoc(userDocRef(user.uid));
  const data = snap.data() ?? {};
  if (!wasCreated && data.welcomeEmailSentAt != null) return;
  try {
    await sendWelcomeEmail();
    await setDoc(
      userDocRef(user.uid),
      { welcomeEmailSentAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch {
    // Non-blocking
  }
}

async function ensureOrgMembership() {
  try {
    await callFunction<Record<string, never>>(
      "ensureOrganizationMembershipForCurrentUser",
      {},
    );
  } catch {
    // Non-blocking
  }
}

/**
 * After Firebase Auth sign-in: ensure user doc, org membership, then route.
 * Returns the path to navigate to.
 */
export async function resolvePostAuthDestination(user: User): Promise<string> {
  authLog.info("post_auth.start", {
    uid: user.uid,
    email: authLog.email(user.email),
  });
  const wasCreated = await ensureUserDocument({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  });
  authLog.info("post_auth.user_doc", { uid: user.uid, wasCreated });

  if (user.displayName?.trim()) {
    await setDoc(
      userDocRef(user.uid),
      { displayName: user.displayName.trim(), updatedAt: serverTimestamp() },
      { merge: true },
    );
  }

  try {
    await ensureFreeGenerationCreditsForUser(user.uid);
    await mergeTrialUsageIntoAccountCredits(user.uid);
    await sealWebTrialWhenFreeAccountExhausted(user.uid);
  } catch (e) {
    authLog.warn("post_auth.free_credits_failed", {
      uid: user.uid,
      message: String(e),
    });
  }

  await maybeSendSocialWelcomeEmail(user, wasCreated);
  await ensureOrgMembership();

  const profile = await fetchUserProfile(user.uid);
  useAuthStore.getState().setProfile(profile);

  if (profile?.banned) {
    authLog.warn("post_auth.banned", { uid: user.uid });
    await signOutUser();
    useAuthStore.getState().reset();
    const reason = encodeURIComponent(
      "Your account has been suspended. Please contact support.",
    );
    return `${ROUTES.signIn}?reason=${reason}`;
  }

  if (!profile || profile.needsCompletion) {
    authLog.info("post_auth.needs_profile", { uid: user.uid });
    return ROUTES.completeProfile;
  }

  authLog.success("post_auth.ready", { uid: user.uid, dest: ROUTES.stage1 });
  return ROUTES.stage1;
}
