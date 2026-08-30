/**
 * Browser-scoped trial / free-signup tracking (localStorage).
 * Persists across sign-out and account switches on the same browser profile.
 * Cross-profile / cross-account limits on the same network use server IP trial.
 */

const DEVICE_FREE_SIGNUP_CONSUMED_KEY = "mml_device_free_signup_consumed";
const DEVICE_TRIAL_USED_KEY = "mml_device_trial_used_count";
const FREE_CREDIT_CAP = 5;

export function isDeviceFreeSignupConsumed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEVICE_FREE_SIGNUP_CONSUMED_KEY) === "1";
}

export function markDeviceFreeSignupConsumed(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEVICE_FREE_SIGNUP_CONSUMED_KEY, "1");
}

/** Generations already used on this browser profile (guest trial + sign-up pool). */
export function getDeviceTrialUsedCount(): number {
  if (typeof window === "undefined") return 0;
  if (isDeviceFreeSignupConsumed()) return FREE_CREDIT_CAP;
  try {
    const raw = window.localStorage.getItem(DEVICE_TRIAL_USED_KEY);
    if (raw == null) return 0;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(FREE_CREDIT_CAP, n));
  } catch {
    return 0;
  }
}

/** Remember trial usage on this browser profile (monotonic — never decreases). */
export function recordDeviceTrialUsage(totalUsed: number): void {
  if (typeof window === "undefined") return;
  const clamped = Math.max(0, Math.min(FREE_CREDIT_CAP, Math.trunc(totalUsed)));
  const next = Math.max(getDeviceTrialUsedCount(), clamped);
  try {
    window.localStorage.setItem(DEVICE_TRIAL_USED_KEY, String(next));
  } catch {
    /* ignore */
  }
  if (next >= FREE_CREDIT_CAP) {
    markDeviceFreeSignupConsumed();
  }
}

/** Local fallback when Firestore has no credit balance fields yet. */
export function deviceFreeCreditsFallback(): number {
  const used = getDeviceTrialUsedCount();
  if (used > 0) return Math.max(0, FREE_CREDIT_CAP - used);
  return isDeviceFreeSignupConsumed() ? 0 : FREE_CREDIT_CAP;
}
