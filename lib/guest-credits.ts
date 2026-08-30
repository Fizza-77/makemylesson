import {
  getDeviceTrialUsedCount,
  markDeviceFreeSignupConsumed,
  recordDeviceTrialUsage,
} from "@/lib/device-free-signup";

/** Device-local trial credits for web guests (not signed up / signed in). */
export const GUEST_GENERATION_CREDIT_CAP = 5;

const GUEST_CREDITS_REMAINING_KEY = "mml_guest_credits_remaining";
const GUEST_TRIAL_SERVER_USED_KEY = "mml_guest_trial_server_used";

const listeners = new Set<() => void>();

function emitGuestCreditsChanged() {
  listeners.forEach((listener) => listener());
}

export function subscribeGuestCredits(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function writeRemainingToStorage(remaining: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      GUEST_CREDITS_REMAINING_KEY,
      String(Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, remaining))),
    );
  } catch {
    /* ignore */
  }
}

function writeServerUsedToStorage(totalUsed: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      GUEST_TRIAL_SERVER_USED_KEY,
      String(Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, totalUsed))),
    );
  } catch {
    /* ignore */
  }
}

function clampRemaining(remaining: number): number {
  return Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, Math.trunc(remaining)));
}

function clampUsed(totalUsed: number): number {
  return Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, Math.trunc(totalUsed)));
}

/** Merge server IP usage and browser-profile usage — never grant extra credits. */
export function setGuestCreditsFromServer(
  remaining: number,
  totalUsed: number,
): void {
  const serverRemaining = clampRemaining(remaining);
  const serverUsed = Math.max(
    clampUsed(totalUsed),
    GUEST_GENERATION_CREDIT_CAP - serverRemaining,
  );

  recordDeviceTrialUsage(serverUsed);

  const deviceUsed = getDeviceTrialUsedCount();
  const mergedUsed = Math.max(serverUsed, deviceUsed);
  const nextRemaining = Math.min(
    serverRemaining,
    Math.max(0, GUEST_GENERATION_CREDIT_CAP - mergedUsed),
  );

  writeRemainingToStorage(nextRemaining);
  writeServerUsedToStorage(mergedUsed);
  if (nextRemaining === 0) {
    markDeviceFreeSignupConsumed();
  }
  emitGuestCreditsChanged();
}

function readRemainingFromStorage(): number {
  if (typeof window === "undefined") return GUEST_GENERATION_CREDIT_CAP;
  try {
    const raw = window.localStorage.getItem(GUEST_CREDITS_REMAINING_KEY);
    if (raw == null) {
      const deviceUsed = getDeviceTrialUsedCount();
      if (deviceUsed > 0) {
        return Math.max(0, GUEST_GENERATION_CREDIT_CAP - deviceUsed);
      }
      return 0;
    }
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return GUEST_GENERATION_CREDIT_CAP;
    return Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, n));
  } catch {
    return GUEST_GENERATION_CREDIT_CAP;
  }
}

export function getGuestCreditsRemaining(): number {
  return readRemainingFromStorage();
}

export function getServerTrialUsedCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(GUEST_TRIAL_SERVER_USED_KEY);
    if (raw == null) return 0;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(GUEST_GENERATION_CREDIT_CAP, n));
  } catch {
    return 0;
  }
}

export function getGuestTrialUsedCount(): number {
  const localUsed = GUEST_GENERATION_CREDIT_CAP - getGuestCreditsRemaining();
  return Math.max(localUsed, getServerTrialUsedCount(), getDeviceTrialUsedCount());
}

/** Reset guest UI cache after trial usage is merged into a signed-in account. */
export function clearGuestTrialUsageAfterAccountSync(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(GUEST_CREDITS_REMAINING_KEY);
    window.localStorage.removeItem(GUEST_TRIAL_SERVER_USED_KEY);
  } catch {
    /* ignore */
  }
  emitGuestCreditsChanged();
}

/** @returns remaining credits after consumption (local cache only) */
export function consumeGuestCreditLocal(): number {
  const before = getGuestCreditsRemaining();
  const next = Math.max(0, before - 1);
  writeRemainingToStorage(next);
  recordDeviceTrialUsage(GUEST_GENERATION_CREDIT_CAP - next);
  emitGuestCreditsChanged();
  if (next === 0) {
    markDeviceFreeSignupConsumed();
  }
  return next;
}
