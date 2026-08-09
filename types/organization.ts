export type OrganizationSummary = {
  orgId: string;
  planKey: string;
  seatLimit: number;
  ownerUid: string;
  isActive: boolean;
};

export type TeacherSeatUsage = {
  email: string;
  status: string;
  creditsUsed: number;
  creditsRemaining: number;
  linkedUid?: string | null;
};

export type OrganizationDashboardData = {
  orgId: string;
  planKey: string;
  seatLimit: number;
  seatsUsed: number;
  teachers: TeacherSeatUsage[];
  annualCreditsPerSeat?: number | null;
  billingPeriodEnd?: Date | null;
  /** Set when renewOrganizationBillingPeriod renewed credits. */
  lastBillingRenewed?: boolean | null;
};

export function seatsRemaining(dashboard: OrganizationDashboardData): number {
  return Math.max(0, Math.min(dashboard.seatLimit, dashboard.seatLimit - dashboard.seatsUsed));
}

export function teacherSeatFromJson(
  raw: Record<string, unknown>,
): TeacherSeatUsage {
  return {
    email: String(raw.email ?? ""),
    status: String(raw.status ?? ""),
    creditsUsed: Number(raw.creditsUsed ?? 0) || 0,
    creditsRemaining: Number(raw.creditsRemaining ?? 0) || 0,
    linkedUid: raw.linkedUid != null ? String(raw.linkedUid) : null,
  };
}

export function organizationDashboardFromJson(
  json: Record<string, unknown>,
): OrganizationDashboardData {
  const rawTeachers = Array.isArray(json.teachers) ? json.teachers : [];
  const billingMs = json.billingPeriodEndMs;
  return {
    orgId: String(json.orgId ?? ""),
    planKey: String(json.planKey ?? ""),
    seatLimit: Number(json.seatLimit ?? 0) || 0,
    seatsUsed: Number(json.seatsUsed ?? 0) || 0,
    teachers: rawTeachers
      .filter((t): t is Record<string, unknown> => !!t && typeof t === "object")
      .map((t) => teacherSeatFromJson(t)),
    annualCreditsPerSeat:
      json.annualCreditsPerSeat != null
        ? Number(json.annualCreditsPerSeat) || null
        : null,
    billingPeriodEnd:
      typeof billingMs === "number"
        ? new Date(billingMs)
        : null,
    lastBillingRenewed:
      typeof json.renewed === "boolean" ? json.renewed : null,
  };
}
