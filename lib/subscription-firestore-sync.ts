import type { AccountPlanTier } from "@/types/account";
import { tryParsePlanTier } from "@/types/user-profile";

import { deviceFreeCreditsFallback } from "@/lib/device-free-signup";

/** Mirrors Flutter `OrgBillingConstants`. */
export const ANNUAL_CREDITS_PER_SEAT = 360;
export const CREDIT_TOP_UP_POOL = 50;
export const FREE_GENERATION_CREDIT_CAP = 5;
export const MONTHLY_GENERATION_CREDIT_CAP = 30;

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
      return MONTHLY_GENERATION_CREDIT_CAP;
    case "free":
    default:
      return FREE_GENERATION_CREDIT_CAP;
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
 * Infer a paid tier from Firestore cap / remaining when the plan string is
 * missing, `"free"`, or unrecognized (stale after purchase).
 */
export function inferPaidPlanTierFromBalance(params: {
  firestoreCap: number | null;
  generationCredits: number | null;
}): AccountPlanTier | null {
  const { firestoreCap, generationCredits } = params;

  if (firestoreCap != null) {
    if (firestoreCap >= ANNUAL_CREDITS_PER_SEAT) return "individualAnnual";
    if (firestoreCap === CREDIT_TOP_UP_POOL) return "creditTopUp50";
    if (firestoreCap >= MONTHLY_GENERATION_CREDIT_CAP) {
      return "individualMonthly";
    }
  }

  if (generationCredits != null && generationCredits > FREE_GENERATION_CREDIT_CAP) {
    if (generationCredits >= ANNUAL_CREDITS_PER_SEAT) return "individualAnnual";
    if (generationCredits > MONTHLY_GENERATION_CREDIT_CAP) {
      return "creditTopUp50";
    }
    return "individualMonthly";
  }

  return null;
}

/**
 * Mirrors Flutter `SubscriptionFirestoreSync.parsePlanTier`, with recovery when
 * `subscriptionPlan` stays `"free"` (or unknown) after a paid purchase write.
 *
 * Preference order:
 * 1. Explicit paid `subscriptionPlan`
 * 2. Explicit paid `planTier`
 * 3. Cap / credits heuristics when string says free/unknown but balance is paid
 * 4. Explicit free / default free
 */
export function parsePlanTierFromUserDoc(
  data: Record<string, unknown>,
): AccountPlanTier {
  const subscriptionRaw =
    typeof data.subscriptionPlan === "string"
      ? data.subscriptionPlan
      : null;
  const planTierRaw =
    typeof data.planTier === "string" ? data.planTier : null;

  const fromSubscription = tryParsePlanTier(subscriptionRaw);
  const fromPlanTier = tryParsePlanTier(planTierRaw);

  if (fromSubscription && fromSubscription !== "free") {
    return fromSubscription;
  }
  if (fromPlanTier && fromPlanTier !== "free") {
    return fromPlanTier;
  }

  const inferred = inferPaidPlanTierFromBalance({
    firestoreCap: toInt(data.generationCreditCap),
    generationCredits: toInt(data.generationCredits),
  });
  if (inferred) return inferred;

  if (fromSubscription === "free" || fromPlanTier === "free") {
    return "free";
  }

  // Unrecognized / empty plan strings with no paid balance signals.
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
 *
 * Guest / local trial credits are never read here — callers must keep using
 * `lib/guest-credits` while the session is guest.
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
  const remoteCredits = toInt(data.generationCredits);
  const remoteUsed = toInt(data.creditsUsed);
  const firestoreCap = toInt(data.generationCreditCap);

  let planTier = parsePlanTierFromUserDoc(data);

  // Belt-and-suspenders: never keep free if remote balance clearly exceeds free.
  if (planTier === "free") {
    const inferred = inferPaidPlanTierFromBalance({
      firestoreCap,
      generationCredits: remoteCredits,
    });
    if (inferred) planTier = inferred;
  }

  let cap = resolveCreditCap({ tier: planTier, firestoreCap });

  // Paid remaining must not be clamped under a stale free cap of 5.
  if (isPaidPlanTier(planTier)) {
    const floor = Math.max(
      cap,
      firestoreCap ?? 0,
      remoteCredits ?? 0,
      remoteUsed != null && remoteCredits != null
        ? remoteUsed + remoteCredits
        : 0,
    );
    if (floor > cap) cap = floor;
  }

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
    generationCreditCap: FREE_GENERATION_CREDIT_CAP,
    creditsUsed: FREE_GENERATION_CREDIT_CAP,
  };
}

/** First account on this device — same fields Flutter/CF use for free tier. */
export function freeTierStarterCreditsPayload(): Record<string, unknown> {
  return {
    planTier: "free",
    subscriptionPlan: "free",
    generationCredits: FREE_GENERATION_CREDIT_CAP,
    generationCreditCap: FREE_GENERATION_CREDIT_CAP,
    creditsUsed: 0,
  };
}

/** Seed free-tier balance from web trial remaining (0–5). */
export function freeTierPayloadFromTrialRemaining(
  remaining: number,
  cap = FREE_GENERATION_CREDIT_CAP,
): Record<string, unknown> {
  const clamped = clampInt(remaining, 0, cap);
  return {
    planTier: "free",
    subscriptionPlan: "free",
    generationCredits: clamped,
    generationCreditCap: cap,
    creditsUsed: cap - clamped,
  };
}


