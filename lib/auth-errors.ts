import { FirebaseError } from "firebase/app";

import { sanitizeUserMessage, toUserMessage } from "@/lib/user-facing-error";

export function isAuthSignInCancelled(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  return (
    error.code === "auth/popup-closed-by-user" ||
    error.code === "auth/cancelled-popup-request"
  );
}

/** Expected user mistakes (wrong password, etc.) — not app failures. */
export function isExpectedAuthCredentialError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  return (
    error.code === "auth/invalid-credential" ||
    error.code === "auth/wrong-password" ||
    error.code === "auth/user-not-found" ||
    error.code === "auth/invalid-email"
  );
}

export function mapFirebaseAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
      case "auth/invalid-email":
        return "That email or password doesn’t match our records. Double-check both, or reset your password. If you signed up with Google or Apple, use that button instead.";
      case "auth/user-disabled":
        return "Your account has been suspended. Please contact support.";
      case "auth/too-many-requests":
        return "Your account has been temporarily locked after too many failed sign-in attempts. Try again in 15 minutes, or reset your password.";
      case "auth/network-request-failed":
        return "No internet connection. Please check your connection and try again.";
      case "auth/account-exists-with-different-credential":
        return "This email is already registered. Sign in with your password, or use the same method you used when you first signed up.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled.";
      case "auth/popup-blocked":
        return "Your browser blocked the sign-in popup. Allow popups and try again.";
      case "auth/unauthorized-domain":
        return "Sign-in isn’t available from this website address. Please contact support.";
      default:
        return "Something went wrong. Please try again in a moment.";
    }
  }
  return toUserMessage(
    error,
    "Something went wrong. Please try again in a moment.",
  );
}

/** Maps Cloud Functions HTTPS callable errors (FunctionsError / FirebaseError). */
export function mapFunctionsError(error: unknown): string {
  if (error instanceof FirebaseError) {
    const code = error.code.replace(/^functions\//, "");
    const message = (error.message ?? "").toLowerCase();
    switch (code) {
      case "already-exists":
        return "An account with this email already exists. Sign in instead?";
      case "invalid-argument":
        if (message.includes("verification code")) {
          return "Invalid, expired, or used verification code.";
        }
        return (
          sanitizeUserMessage(
            error.message,
            "Please check your details and try again.",
          ) || "Please check your details and try again."
        );
      case "resource-exhausted":
        if (message.includes("60")) {
          return "Email resent. Please wait 60 seconds before trying again.";
        }
        return "You've made too many requests. Please wait a moment and try again.";
      case "deadline-exceeded":
        return "This is taking longer than expected. Please check your connection and try again.";
      case "unavailable":
        return "Make My Lesson is currently undergoing maintenance. We'll be back shortly.";
      case "unauthenticated":
        return "Please sign in again to continue.";
      case "permission-denied":
        return "You don’t have permission to do that.";
      case "not-found":
        return "We couldn’t find what you were looking for.";
      case "internal":
        return "Something went wrong. Please try again in a moment.";
      default:
        return (
          sanitizeUserMessage(
            error.message,
            "Something went wrong. Please try again in a moment.",
          ) || "Something went wrong. Please try again in a moment."
        );
    }
  }
  return toUserMessage(
    error,
    "Something went wrong. Please try again in a moment.",
  );
}

export function mapSocialAuthError(error: unknown, provider: "google" | "apple"): string {
  if (error instanceof FirebaseError) {
    if (isAuthSignInCancelled(error)) {
      return "Sign-in was cancelled.";
    }
    if (error.code === "auth/unauthorized-domain") {
      return "Sign-in isn’t available from this website address. Please contact support.";
    }
    if (error.code === "auth/operation-not-allowed") {
      return provider === "google"
        ? "Google sign-in isn’t available right now. Please try email sign-in, or contact support."
        : "Apple sign-in isn’t available right now. Please try email sign-in, or contact support.";
    }
  }
  const mapped = mapFirebaseAuthError(error);
  if (mapped.includes("Something went wrong")) {
    return provider === "google"
      ? "Google sign-in failed. Please try again."
      : "Apple sign-in failed. Please try again.";
  }
  return mapped;
}
