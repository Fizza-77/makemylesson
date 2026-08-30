import { markDeviceFreeSignupConsumed } from "@/lib/device-free-signup";

/** Device-local trial credits for web guests (not signed up / signed in). */
export const GUEST_GENERATION_CREDIT_CAP = 5;

const GUEST_CREDITS_REMAINING_KEY = "mml_guest_credits_remaining";

const listeners = new Set<() => void>();

function emitGuestCreditsChanged() {
  listeners.forEach((listener) => listener());
}

export function subscribeGuestCredits(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getGuestCreditsRemaining(): number {
  if (typeof window === "undefined") return GUEST_GENERATION_CREDIT_CAP;
  try {
    const raw = window.localStorage.getItem(GUEST_CREDITS_REMAINING_KEY);
    if (raw == null) return GUEST_GENERATION_CREDIT_CAP;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return GUEST_GENERATION_CREDIT_CAP;
    return Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, n));
  } catch {
    return GUEST_GENERATION_CREDIT_CAP;
  }
}

export function getGuestTrialUsedCount(): number {
  return GUEST_GENERATION_CREDIT_CAP - getGuestCreditsRemaining();
}

/** Reset local trial counter after usage is synced to Firestore. */
export function clearGuestTrialUsageAfterAccountSync(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      GUEST_CREDITS_REMAINING_KEY,
      String(GUEST_GENERATION_CREDIT_CAP),
    );
  } catch {
    /* ignore */
  }
  emitGuestCreditsChanged();
}

/** @returns remaining credits after consumption */
export function consumeGuestCredit(): number {
  const next = Math.max(0, getGuestCreditsRemaining() - 1);
  try {
    window.localStorage.setItem(GUEST_CREDITS_REMAINING_KEY, String(next));
  } catch {
    /* ignore */
  }
  emitGuestCreditsChanged();
  if (next === 0) {
    markDeviceFreeSignupConsumed();
  }
  return next;
}
