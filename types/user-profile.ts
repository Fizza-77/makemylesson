import { Timestamp } from "firebase/firestore";

import type { AccountPlanTier } from "./account";

function toInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return null;
}

export class UserFirestoreProfile {
  constructor(
    readonly uid: string,
    readonly email: string | null,
    readonly displayName: string | null,
    readonly dateOfBirth: Date | null,
    readonly schoolName: string | null,
    readonly schoolLogoUrl: string | null,
    readonly profilePhotoUrl: string | null,
    readonly profileComplete: boolean,
    readonly banned: boolean,
    readonly planTier: string | null,
    readonly generationCredits: number | null,
    readonly generationCreditCap: number | null,
    readonly creditsUsed: number | null,
  ) {}

  get needsCompletion(): boolean {
    return !this.profileComplete;
  }

  static fromFirestore(uid: string, data: Record<string, unknown>): UserFirestoreProfile {
    const dob = data.dateOfBirth;
    return new UserFirestoreProfile(
      uid,
      (data.email as string) ?? null,
      (data.displayName as string) ?? null,
      dob instanceof Timestamp ? dob.toDate() : null,
      (data.schoolName as string) ?? null,
      (data.schoolLogoUrl as string) ?? null,
      (data.profilePhotoUrl as string) ?? null,
      data.profileComplete === true,
      data.banned === true,
      ((data.subscriptionPlan ?? data.planTier) as string) ?? null,
      toInt(data.generationCredits),
      toInt(data.generationCreditCap),
      toInt(data.creditsUsed),
    );
  }
}

export function parsePlanTier(raw: string | null | undefined): AccountPlanTier {
  return tryParsePlanTier(raw) ?? "free";
}

/**
 * Parse a plan string without collapsing unknown values to `"free"`.
 * Returns `null` when empty/unrecognized so callers can fall back to cap heuristics.
 */
export function tryParsePlanTier(
  raw: string | null | undefined,
): AccountPlanTier | null {
  const value = normalizePlanTierKey(raw);
  if (!value) return null;
  if (value === "free") return "free";

  const map: Record<string, AccountPlanTier> = {
    individualmonthly: "individualMonthly",
    individual_monthly: "individualMonthly",
    individual_month: "individualMonthly",
    monthly: "individualMonthly",
    individual3month: "individual3Month",
    individual_3_month: "individual3Month",
    individual_3month: "individual3Month",
    individual_3mo: "individual3Month",
    "3mo": "individual3Month",
    "3_month": "individual3Month",
    individual6month: "individual6Month",
    individual_6_month: "individual6Month",
    individual_6month: "individual6Month",
    individual_6mo: "individual6Month",
    "6mo": "individual6Month",
    "6_month": "individual6Month",
    individualannual: "individualAnnual",
    individual_annual: "individualAnnual",
    individual_year: "individualAnnual",
    annual: "individualAnnual",
    yearly: "individualAnnual",
    credittopup50: "creditTopUp50",
    credit_topup_50: "creditTopUp50",
    credit_top_up_50: "creditTopUp50",
    credit_topup: "creditTopUp50",
    topup50: "creditTopUp50",
    top_up_50: "creditTopUp50",
    department: "department",
    school: "school",
    schoolplus: "school_plus",
    school_plus: "school_plus",
    school_plus_plan: "school_plus",
  };

  return map[value] ?? null;
}

function normalizePlanTierKey(raw: string | null | undefined): string {
  return (raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}


