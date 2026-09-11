import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import {
  ensureAuthPersistence,
  signInAnonymouslyIfNeeded,
  signInWithCustomAuthToken,
} from "@/firebase/auth";
import { ensureUserDocument } from "@/firebase/firestore";
import { getFirebaseAuth } from "@/firebase/config";
import { getGuestCreditsRemaining } from "@/lib/guest-credits";
import {
  isGuestWebUid,
  readStoredGuestAuthUid,
  writeStoredGuestAuthUid,
} from "@/lib/guest-auth-id";
import {
  bootstrapWebTrialCredits,
  consumeWebTrialCreditOnServer,
} from "@/lib/trial-api.client";

/** Web trial user — unsigned, anonymous Firebase, or guest custom token. */
export function isGuestUser(user: User | null | undefined): boolean {
  if (!user) return true;
  if (user.isAnonymous) return true;
  return isGuestWebUid(user.uid);
}

/** Signed in with email, Google, Apple, etc. — not a web trial session. */
export function isRegisteredUser(user: User | null | undefined): boolean {
  return Boolean(user && !isGuestUser(user));
}

export function shouldSkipLibrarySave(): boolean {
  return isGuestUser(getFirebaseAuth().currentUser);
}

async function signInViaGuestCustomToken(): Promise<User> {
  const guestUid = readStoredGuestAuthUid();
  const response = await fetch("/api/auth/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestUid: guestUid ?? undefined }),
  });

  let payload: { customToken?: string; guestUid?: string; error?: string } = {};
  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      payload.error ??
        "Trial generation is unavailable. Enable Anonymous sign-in in Firebase Console, or set FIREBASE_SERVICE_ACCOUNT_JSON.",
    );
  }

  const token = String(payload.customToken ?? "").trim();
  const uid = String(payload.guestUid ?? "").trim();
  if (!token || !uid) {
    throw new Error("Trial sign-in token is missing.");
  }

  writeStoredGuestAuthUid(uid);
  const credential = await signInWithCustomAuthToken(token);
  return credential.user;
}

/**
 * Cloud Functions require a Firebase user. Web trial users get a silent session
 * (anonymous, or custom token when Anonymous Auth is disabled).
 */
export async function ensureGuestAuth(): Promise<User> {
  await ensureAuthPersistence();
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await auth.currentUser.getIdToken();
    return auth.currentUser;
  }

  let user: User;
  try {
    const credential = await signInAnonymouslyIfNeeded();
    user = credential.user;
  } catch (error) {
    if (!isGuestAuthDisabledError(error)) throw error;
    user = await signInViaGuestCustomToken();
  }

  await user.getIdToken();

  if (user.isAnonymous) {
    try {
      await ensureUserDocument({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    } catch (e) {
      console.warn("[Guest] user doc bootstrap skipped", e);
    }
  }

  return user;
}

/** Sync IP trial pool to guest Firestore credits and UI cache. */
export async function syncGuestTrialCredits(user: User): Promise<{
  remaining: number;
  configured: boolean;
}> {
  const result = await bootstrapWebTrialCredits(user);
  return {
    remaining: result.remaining,
    configured: result.configured,
  };
}

/** Reserve one IP trial credit before generation (server-enforced). */
export async function consumeGuestTrialCreditBeforeGenerate(): Promise<boolean> {
  if (!shouldSkipLibrarySave()) return true;

  const user = getFirebaseAuth().currentUser;
  if (!user) return false;

  const before = getGuestCreditsRemaining();
  if (before <= 0) return false;

  try {
    const after = await consumeWebTrialCreditOnServer(user);
    return after < before;
  } catch (error) {
    console.warn("[Guest] consume trial before generate failed", error);
    return false;
  }
}

export async function afterGuestGenerationSuccess(): Promise<void> {
  if (!shouldSkipLibrarySave()) return;

  const user = getFirebaseAuth().currentUser;
  if (user) {
    await bootstrapWebTrialCredits(user).catch(() => null);
  }
}

export function isGuestAuthDisabledError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  return (
    error.code === "auth/operation-not-allowed" ||
    error.code === "auth/admin-restricted-operation"
  );
}

export function isGuestSignInUnavailableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("trial generation is unavailable") ||
      message.includes("trial sign-in")
    );
  }
  return false;
}


