import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getDoc } from "firebase/firestore";

import { getFirebaseAuth } from "@/lib/firebase/config";
import { userDocRef } from "@/lib/firebase/firestore";
import { callFunction } from "@/lib/firebase/functions";
import { authLog } from "@/lib/auth-logger";

const DELETE_MY_ACCOUNT_ATTEMPTS = 3;

async function requireUser(): Promise<User> {
  const user = getFirebaseAuth().currentUser;
  if (!user || !user.email) {
    throw new Error("Please sign in again and try one more time.");
  }
  return user;
}

/** Same flow as Flutter AccountSecurityService.reauthenticateWithPassword */
export async function reauthenticateWithPassword(currentPassword: string) {
  const user = await requireUser();
  authLog.info("reauthenticate.start", { email: authLog.email(user.email) });
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  authLog.success("reauthenticate.ok", { uid: user.uid });
}

export async function updateAccountPassword(params: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = await requireUser();
  authLog.info("password_change.start", { uid: user.uid });
  await reauthenticateWithPassword(params.currentPassword);
  await updatePassword(user, params.newPassword);
  await callFunction<Record<string, never>>("sendPasswordChangedEmail", {});
  authLog.success("password_change.ok", { uid: user.uid });
}

export async function startEmailChangeVerification(newEmail: string) {
  authLog.info("email_change.start", { newEmail: authLog.email(newEmail) });
  await callFunction<{ newEmail: string }>("startEmailChangeVerification", {
    newEmail: newEmail.trim(),
  });
  authLog.success("email_change.otp_sent", {
    newEmail: authLog.email(newEmail),
  });
}

export async function updateAccountEmail(params: {
  currentPassword: string;
  newEmail: string;
}) {
  await reauthenticateWithPassword(params.currentPassword);
  await startEmailChangeVerification(params.newEmail);
}

export async function completeEmailChangeVerification(params: {
  newEmail: string;
  otp: string;
}) {
  authLog.info("email_change.verify", {
    newEmail: authLog.email(params.newEmail),
  });
  await callFunction<{ newEmail: string; otp: string }>(
    "completeEmailChangeVerification",
    {
      newEmail: params.newEmail.trim(),
      otp: params.otp.trim(),
    },
  );
  authLog.success("email_change.ok", {
    newEmail: authLog.email(params.newEmail),
  });
}

/**
 * Calls existing `deleteMyAccount` Cloud Function (same as Flutter).
 * Retries transient callable errors; treats Auth removal / unauthenticated as success.
 */
export async function deleteAccountAndData(currentPassword: string) {
  const user = await requireUser();
  const uid = user.uid;
  const email = user.email!;
  authLog.warn("account_delete.start", { uid });
  await reauthenticateWithPassword(currentPassword);

  let lastError: unknown;

  for (let attempt = 0; attempt < DELETE_MY_ACCOUNT_ATTEMPTS; attempt++) {
    try {
      // Same callable as Flutter; empty object matches other no-arg callables in this app.
      await callFunction<Record<string, never>>("deleteMyAccount", {});
      authLog.success("account_delete.ok", { uid });
      await signOut(getFirebaseAuth());
      return;
    } catch (error) {
      lastError = error;
      const code = getCallableErrorCode(error);

      if (await isAccountAlreadyDeleted(error)) {
        authLog.success("account_delete.ok_after_auth_race", { uid, code });
        await signOut(getFirebaseAuth());
        return;
      }

      if (
        code === "functions/unauthenticated" &&
        attempt > 0
      ) {
        authLog.success("account_delete.ok_after_unauthenticated_retry", {
          uid,
          code,
        });
        await signOut(getFirebaseAuth());
        return;
      }

      const retriesLeft = attempt < DELETE_MY_ACCOUNT_ATTEMPTS - 1;
      const profileGone = await isUserProfileDocGone(uid);
      if (
        isDeleteCallableTransportError(error) &&
        (retriesLeft || profileGone)
      ) {
        authLog.info("account_delete.retry", {
          uid,
          attempt: attempt + 1,
          code,
          profileGone,
        });
        await delay(profileGone ? 1500 : 2500 * (attempt + 1));
        await refreshSessionIfPossible();
        continue;
      }

      if (await confirmAccountRemovedViaSignIn(email, currentPassword, error)) {
        authLog.success("account_delete.ok_after_sign_in_check", { uid, code });
        await signOut(getFirebaseAuth());
        return;
      }

      break;
    }
  }

  throw lastError;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function refreshSessionIfPossible() {
  const user = getFirebaseAuth().currentUser;
  if (!user) return;
  try {
    await user.getIdToken(true);
  } catch {
    // Session may already be cleared server-side.
  }
}

async function isUserProfileDocGone(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(userDocRef(uid));
    return !snap.exists();
  } catch {
    return false;
  }
}

/** True when Firebase Auth no longer has this account on the server. */
async function authUserGoneOnServer(): Promise<boolean> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return true;

  try {
    await user.reload();
  } catch (e) {
    if (isAuthUserMissingError(e)) return true;
    return false;
  }

  try {
    await user.getIdToken(true);
    return false;
  } catch (e) {
    return isAuthUserMissingError(e);
  }
}

function isAuthUserMissingError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  return (
    error.code === "auth/user-not-found" ||
    error.code === "auth/user-disabled" ||
    error.code === "auth/user-token-expired" ||
    error.code === "auth/invalid-user-token"
  );
}

function getCallableErrorCode(error: unknown): string | undefined {
  if (error instanceof FirebaseError) return error.code;
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code?: string }).code);
  }
  return undefined;
}

function isDeleteCallableTransportError(error: unknown): boolean {
  const code = getCallableErrorCode(error);
  return (
    code === "functions/internal" ||
    code === "functions/unauthenticated" ||
    code === "functions/deadline-exceeded" ||
    code === "internal"
  );
}

/**
 * Callable may return `internal` while Auth is already gone; reload can lag.
 * Sign out and try signing in — deleted accounts cannot authenticate.
 */
async function confirmAccountRemovedViaSignIn(
  email: string,
  password: string,
  error: unknown,
): Promise<boolean> {
  if (!isDeleteCallableTransportError(error)) return false;

  const auth = getFirebaseAuth();
  try {
    await signOut(auth);
  } catch {
    // ignore
  }

  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    return false;
  } catch (e) {
    if (!(e instanceof FirebaseError)) return false;
    return (
      e.code === "auth/user-not-found" ||
      e.code === "auth/invalid-credential" ||
      e.code === "auth/invalid-login-credentials"
    );
  }
}

/**
 * After `deleteMyAccount`, the Auth user is removed before the callable response
 * finishes — web often reports `functions/internal`. Confirm with `reload()`.
 */
async function isAccountAlreadyDeleted(error: unknown): Promise<boolean> {
  if (!isDeleteCallableTransportError(error)) return false;

  for (let attempt = 0; attempt < 6; attempt++) {
    if (await authUserGoneOnServer()) return true;
    await delay(400 + attempt * 350);
  }

  return false;
}


