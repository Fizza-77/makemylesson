/**
 * Mirrors Flutter `EngagementPromptPrefs` — soft upgrade nudge counters
 * and purchase flags, scoped per signed-in uid in localStorage.
 */

const KEYS = {
  uid: "mml_engagement_uid",
  upgradePromptCount: "mml_engagement_upgrade_prompt_count",
  rateUsPromptCount: "mml_engagement_rate_us_prompt_count",
  rateUsRatedHigh: "mml_engagement_rate_us_rated_high",
  hasEverPurchased: "mml_engagement_has_ever_purchased",
} as const;

export const FREE_TIER_MAX_UPGRADE_PROMPTS = 5;

export type EngagementPromptState = {
  upgradePromptCount: number;
  rateUsPromptCount: number;
  rateUsRatedHigh: boolean;
  hasEverPurchased: boolean;
};

function readInt(key: string): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(key);
  const n = raw == null ? NaN : Number(raw);
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
}

function readBool(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "1";
}

function writeInt(key: string, value: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(Math.max(0, Math.trunc(value))));
}

function writeBool(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value ? "1" : "0");
}

function clearEngagementData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.upgradePromptCount);
  window.localStorage.removeItem(KEYS.rateUsPromptCount);
  window.localStorage.removeItem(KEYS.rateUsRatedHigh);
  window.localStorage.removeItem(KEYS.hasEverPurchased);
}

/** Clears engagement data when a different user signs in on this device. */
export function bindEngagementPrefsToUser(uid: string): void {
  const trimmed = uid.trim();
  if (!trimmed || typeof window === "undefined") return;
  const cached = window.localStorage.getItem(KEYS.uid)?.trim() ?? "";
  if (cached && cached !== trimmed) {
    clearEngagementData();
  }
  window.localStorage.setItem(KEYS.uid, trimmed);
}

export function loadEngagementPrefs(): EngagementPromptState {
  return {
    upgradePromptCount: readInt(KEYS.upgradePromptCount),
    rateUsPromptCount: readInt(KEYS.rateUsPromptCount),
    rateUsRatedHigh: readBool(KEYS.rateUsRatedHigh),
    hasEverPurchased: readBool(KEYS.hasEverPurchased),
  };
}

export function incrementUpgradeShown(): number {
  const next = loadEngagementPrefs().upgradePromptCount + 1;
  writeInt(KEYS.upgradePromptCount, next);
  return next;
}

export function incrementRateUsShown(): number {
  const next = loadEngagementPrefs().rateUsPromptCount + 1;
  writeInt(KEYS.rateUsPromptCount, next);
  return next;
}

export function markRatedHigh(): void {
  writeBool(KEYS.rateUsRatedHigh, true);
}

export function markEverPurchased(): void {
  writeBool(KEYS.hasEverPurchased, true);
}
