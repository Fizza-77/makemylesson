import { getFirebaseAuth } from "@/lib/firebase/config";
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

async function stripeApi<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Please sign in to continue.");
  }
  const token = await user.getIdToken();
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;
  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" && data.error.trim()
        ? data.error
        : "Checkout failed.",
    );
  }
  return data;
}

export async function createStripeCheckoutSession(
  planKey: StripePlanKey,
): Promise<CreateStripeCheckoutResult> {
  const origin =
    typeof window !== "undefined" ? window.location.origin : undefined;
  const data = await stripeApi<CreateStripeCheckoutResult>(
    "/api/stripe/checkout",
    { planKey, origin },
  );
  const url = (data.url ?? "").trim();
  const sessionId = (data.sessionId ?? "").trim();
  if (!url || !sessionId) {
    throw new Error("Checkout did not return a payment link.");
  }
  return { ...data, url, sessionId };
}

export async function getStripeCheckoutStatus(
  sessionId: string,
): Promise<StripeCheckoutStatusResult> {
  const data = await stripeApi<StripeCheckoutStatusResult>(
    "/api/stripe/status",
    { sessionId },
  );
  const orgId = (data.orgId ?? "").toString().trim();
  return {
    ...data,
    paid: data.paid === true,
    entitlementApplied: data.entitlementApplied === true,
    orgId: orgId || null,
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
