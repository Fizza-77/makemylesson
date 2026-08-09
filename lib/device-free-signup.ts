/**
 * Device-scoped free signup credits (browser localStorage).
 * Mirrors Flutter intent: free credits are one-time per device/install, not per
 * new Firebase account on the same browser.
 *
 * Persists across sign-out and account switches — not tied to `users/{uid}`.
 */

const DEVICE_FREE_SIGNUP_CONSUMED_KEY = "mml_device_free_signup_consumed";

export function isDeviceFreeSignupConsumed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEVICE_FREE_SIGNUP_CONSUMED_KEY) === "1";
}

export function markDeviceFreeSignupConsumed(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEVICE_FREE_SIGNUP_CONSUMED_KEY, "1");
}

/** Local fallback when Firestore has no credit balance fields yet. */
export function deviceFreeCreditsFallback(): number {
  return isDeviceFreeSignupConsumed() ? 0 : 5;
}
