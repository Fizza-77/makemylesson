import { callFunction } from "@/lib/firebase/functions";
import type { AccountPlanTier } from "@/types/account";

/** Server-approved web plan keys. The client cannot send a Stripe Price ID. */
export type StripePlanKey =
  | "individual_monthly"
  | "individual_3_month"
  | "individual_6_month"
  | "individual_annual"
  | "credit_topup_50"
  | "department"
  | "school";

export const STRIPE_PLAN_KEYS: StripePlanKey[] = [
  "individual_monthly",
  "individual_3_month",
  "individual_6_month",
  "individual_annual",
  "credit_topup_50",
  "department",
  "school",
];

export const PLAN_KEY_TO_TIER: Record<StripePlanKey, AccountPlanTier> = {
  individual_monthly: "individualMonthly",
  individual_3_month: "individual3Month",
  individual_6_month: "individual6Month",
  individual_annual: "individualAnnual",
  credit_topup_50: "creditTopUp50",
  department: "department",
  school: "school",
};

export type CreateStripeCheckoutResult = {
  url: string;
  sessionId: string;
  planKey: StripePlanKey;
  subscriptionCancellationScheduled?: boolean;
  subscriptionEndsAtMs?: number;
};

export type StripeCheckoutStatusResult = {
  sessionId: string;
  planKey?: string;
  status?: string;
  paymentStatus?: string;
  paid: boolean;
  entitlementApplied: boolean;
  orgId?: string | null;
  subscriptionPlan?: string | null;
  generationCredits?: number;
};

export function isStripePlanKey(value: string): value is StripePlanKey {
  return (STRIPE_PLAN_KEYS as string[]).includes(value);
}

export async function createStripeCheckoutSession(
  planKey: StripePlanKey,
): Promise<CreateStripeCheckoutResult> {
  if (typeof window === "undefined") {
    throw new Error("Checkout is only available in a browser.");
  }
  const origin = window.location.origin;
  const returnUrl = `${origin}/pricing?stripe_checkout=success&plan=${encodeURIComponent(planKey)}`;
  const cancelUrl = `${origin}/pricing?stripe_checkout=cancel`;
  const data = await callFunction<
    { planKey: StripePlanKey; returnUrl: string; cancelUrl: string },
    {
      checkoutUrl?: string;
      sessionId?: string;
      planKey: StripePlanKey;
      subscriptionCancellationScheduled?: boolean;
      subscriptionEndsAtMs?: number;
    }
  >("createStripeCheckoutSession", { planKey, returnUrl, cancelUrl });
  if (data.subscriptionCancellationScheduled) {
    return {
      ...data,
      url: "",
      sessionId: "",
      subscriptionCancellationScheduled: true,
    };
  }
  const url = (data.checkoutUrl ?? "").trim();
  const sessionId = (data.sessionId ?? "").trim();
  if (!url || !sessionId) {
    throw new Error("Checkout did not return a payment link.");
  }
  return { ...data, url, sessionId };
}

export async function getStripeCheckoutStatus(
  sessionId: string,
): Promise<StripeCheckoutStatusResult> {
  const data = await callFunction<
    { sessionId: string },
    {
      success?: boolean;
      paymentStatus?: string;
      entitlementApplied?: boolean;
      orgId?: string | null;
    }
  >("finalizeStripeCheckoutSession", { sessionId });
  return {
    sessionId,
    paymentStatus: data.paymentStatus,
    paid: data.success === true,
    entitlementApplied: data.entitlementApplied === true,
    orgId: data.orgId?.trim() || null,
  };
}

export function successMessageForPlanKey(planKey: string): string {
  switch (planKey) {
    case "individual_monthly":
      return "Individual Monthly is active.";
    case "individual_3_month":
      return "Individual 3 Months is active.";
    case "individual_6_month":
      return "Individual 6 Months is active.";
    case "individual_annual":
      return "Individual Annual is active.";
    case "credit_topup_50":
      return "Credit top-up added.";
    case "department":
      return "Department plan is active.";
    case "school":
      return "School plan is active.";
    default:
      return "Purchase completed.";
  }
}

export async function waitForStripeEntitlement(params: {
  sessionId: string;
  uid: string;
  refreshAccount: (uid: string) => Promise<unknown>;
  attempts?: number;
  delayMs?: number;
}): Promise<StripeCheckoutStatusResult | null> {
  const attempts = params.attempts ?? 8;
  const delayMs = params.delayMs ?? 1500;
  let last: StripeCheckoutStatusResult | null = null;

  for (let i = 0; i < attempts; i += 1) {
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    try {
      last = await getStripeCheckoutStatus(params.sessionId);
    } catch {
      last = null;
    }
    await params.refreshAccount(params.uid).catch(() => null);
    if (last?.entitlementApplied || last?.paid) {
      if (last.entitlementApplied) return last;
    }
  }

  return last;
}
