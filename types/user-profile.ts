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
  const value = (raw ?? "").trim();
  if (!value || value === "free") return "free";
  const map: Record<string, AccountPlanTier> = {
    individualMonthly: "individualMonthly",
    individual_monthly: "individualMonthly",
    individualAnnual: "individualAnnual",
    individual_annual: "individualAnnual",
    creditTopUp50: "creditTopUp50",
    credit_topup_50: "creditTopUp50",
    department: "department",
    school: "school",
    school_plus: "school_plus",
  };
  return map[value] ?? "free";
}
