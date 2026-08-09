import type { AccountPlanTier } from "@/types/account";
import { parsePlanTier } from "@/types/user-profile";

import { deviceFreeCreditsFallback } from "@/lib/device-free-signup";

/** Mirrors Flutter `OrgBillingConstants`. */
export const ANNUAL_CREDITS_PER_SEAT = 360;
export const CREDIT_TOP_UP_POOL = 50;

/** Coerce Firestore number / numeric string — parity with Dart `num?.toInt()`. */
export function toInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return null;
}

export function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Product caps — mirrors Flutter `AccountPlanTier.generationCreditCap`. */
export function expectedCapForTier(tier: AccountPlanTier): number {
  switch (tier) {
    case "individualAnnual":
    case "department":
    case "school":
    case "school_plus":
      return ANNUAL_CREDITS_PER_SEAT;
    case "creditTopUp50":
      return CREDIT_TOP_UP_POOL;
    case "individualMonthly":
      return 30;
    case "free":
    default:
      return 5;
  }
}

export function isPaidPlanTier(tier: AccountPlanTier): boolean {
  return tier !== "free";
}

export function isLifetimeTopUpTier(tier: AccountPlanTier): boolean {
  return tier === "creditTopUp50";
}

export function isAnnualBillingTier(tier: AccountPlanTier): boolean {
  return (
    tier === "individualAnnual" ||
    tier === "department" ||
    tier === "school" ||
    tier === "school_plus"
  );
}

/**
 * Mirrors Flutter `SubscriptionFirestoreSync.parsePlanTier`.
 * Uses plan string first; falls back to cap heuristics when plan is missing.
 */
export function parsePlanTierFromUserDoc(data: Record<string, unknown>): AccountPlanTier {
  const planRaw =
    ((data.subscriptionPlan ?? data.planTier) as string | null | undefined) ??
    null;
  const trimmed = (planRaw ?? "").trim();
  if (trimmed) {
    return parsePlanTier(trimmed);
  }
  const cap = toInt(data.generationCreditCap);
  if (cap == null) return "free";
  if (cap >= ANNUAL_CREDITS_PER_SEAT) return "individualAnnual";
  if (cap === CREDIT_TOP_UP_POOL) return "creditTopUp50";
  if (cap >= 30) return "individualMonthly";
  return "free";
}

/**
 * Mirrors Flutter `SubscriptionFirestoreSync.resolveCap`.
 * Non-annual tiers always use fixed product caps (ignore stale Firestore caps).
 */
export function resolveCreditCap(params: {
  tier: AccountPlanTier;
  firestoreCap: number | null;
}): number {
  const expected = expectedCapForTier(params.tier);
  if (!isAnnualBillingTier(params.tier)) {
    return expected;
  }
  const cap = params.firestoreCap ?? expected;
  return cap > 0 ? cap : expected;
}

/**
 * Mirrors Flutter `SubscriptionFirestoreSync.resolveRemaining`.
 * Prefer `generationCredits`, else derive from `creditsUsed`, else local fallback.
 */
export function resolveCreditsRemaining(params: {
  cap: number;
  localFallback: number;
  generationCredits: number | null;
  creditsUsed: number | null;
}): number {
  if (params.generationCredits != null) {
    return clampInt(params.generationCredits, 0, params.cap);
  }
  if (params.creditsUsed != null) {
    return clampInt(params.cap - params.creditsUsed, 0, params.cap);
  }
  return clampInt(params.localFallback, 0, params.cap);
}

/**
 * Resolve subscription credit fields from a `users/{uid}` document.
 *
 * When Firestore has no balance fields, use device-scoped fallback (5 only if
 * this browser has not already used its one-time free signup allocation).
 */
export function resolveSubscriptionCredits(
  data: Record<string, unknown>,
  localFallback = deviceFreeCreditsFallback(),
): {
  planTier: AccountPlanTier;
  generationCredits: number;
  generationCreditCap: number;
  creditsUsed: number;
} {
  const planTier = parsePlanTierFromUserDoc(data);
  const firestoreCap = toInt(data.generationCreditCap);
  const cap = resolveCreditCap({ tier: planTier, firestoreCap });
  const remoteCredits = toInt(data.generationCredits);
  const remoteUsed = toInt(data.creditsUsed);
  // When Firestore has a balance field, never invent credits from local default.
  const hasRemoteBalance = remoteCredits != null || remoteUsed != null;
  const generationCredits = resolveCreditsRemaining({
    cap,
    localFallback: hasRemoteBalance ? 0 : localFallback,
    generationCredits: remoteCredits,
    creditsUsed: remoteUsed,
  });
  const creditsUsed = clampInt(cap - generationCredits, 0, cap);
  return {
    planTier,
    generationCredits,
    generationCreditCap: cap,
    creditsUsed,
  };
}

/** True when the user doc has never received a credits balance write. */
export function userDocMissingCreditBalance(
  data: Record<string, unknown>,
): boolean {
  return (
    toInt(data.generationCredits) == null && toInt(data.creditsUsed) == null
  );
}

/** Payload when this device already received its one-time free signup grant. */
export function freeTierExhaustedOnDevicePayload(): Record<string, unknown> {
  return {
    planTier: "free",
    subscriptionPlan: "free",
    generationCredits: 0,
    generationCreditCap: 5,
    creditsUsed: 5,
  };
}

/** First account on this device — same fields Flutter/CF use for free tier. */
export function freeTierStarterCreditsPayload(): Record<string, unknown> {
  return {
    planTier: "free",
    subscriptionPlan: "free",
    generationCredits: 5,
    generationCreditCap: 5,
    creditsUsed: 0,
  };
}
