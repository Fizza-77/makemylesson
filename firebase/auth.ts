import { FirebaseError } from "firebase/app";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCustomToken,
  signOut,
  confirmPasswordReset,
  verifyPasswordResetCode,
  type User,
  type UserCredential,
} from "firebase/auth";

import { getFirebaseAuth } from "./config";

let persistenceReady: Promise<void> | null = null;

export async function ensureAuthPersistence() {
  if (!persistenceReady) {
    persistenceReady = setPersistence(
      getFirebaseAuth(),
      browserLocalPersistence,
    ).then(() => undefined);
  }
  return persistenceReady;
}

let googlePopupInFlight: Promise<UserCredential> | null = null;
let applePopupInFlight: Promise<UserCredential> | null = null;

function buildGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  return provider;
}

function buildAppleProvider() {
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  return provider;
}

/** Popup only — same as Flutter web (no full-page Google account chooser). */
async function signInWithProviderPopup(
  provider: GoogleAuthProvider | OAuthProvider,
): Promise<UserCredential> {
  await ensureAuthPersistence();
  const auth = getFirebaseAuth();

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    // One retry if a prior popup race cancelled this request.
    if (
      error instanceof FirebaseError &&
      error.code === "auth/cancelled-popup-request"
    ) {
      await new Promise((r) => setTimeout(r, 350));
      return signInWithPopup(auth, provider);
    }
    throw error;
  }
}

export async function signInWithGooglePopup(): Promise<UserCredential> {
  if (googlePopupInFlight) return googlePopupInFlight;
  googlePopupInFlight = signInWithProviderPopup(buildGoogleProvider()).finally(
    () => {
      googlePopupInFlight = null;
    },
  );
  return googlePopupInFlight;
}

export async function signInWithApplePopup(): Promise<UserCredential> {
  if (applePopupInFlight) return applePopupInFlight;
  applePopupInFlight = signInWithProviderPopup(buildAppleProvider()).finally(
    () => {
      applePopupInFlight = null;
    },
  );
  return applePopupInFlight;
}

export async function signInWithEmail(email: string, password: string) {
  await ensureAuthPersistence();
  return signInWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim(),
    password,
  );
}

export async function signInWithCustomAuthToken(token: string) {
  await ensureAuthPersistence();
  return signInWithCustomToken(getFirebaseAuth(), token);
}

export async function signOutUser() {
  return signOut(getFirebaseAuth());
}

export async function resetPasswordWithCode(oobCode: string, newPassword: string) {
  return confirmPasswordReset(getFirebaseAuth(), oobCode.trim(), newPassword);
}

export async function verifyResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(getFirebaseAuth(), oobCode.trim());
}

export function getCurrentUser(): User | null {
  return getFirebaseAuth().currentUser;
}
