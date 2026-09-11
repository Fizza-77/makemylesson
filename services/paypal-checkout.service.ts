import { callFunction } from "@/lib/firebase/functions";
import { ROUTES } from "@/lib/urls";
import type { AccountPlanTier } from "@/types/account";

/** PayPal plan keys accepted by Cloud Functions (`paypal_web.js`). */
export type PayPalPlanKey =
  | "individual_monthly"
  | "individual_annual"
  | "credit_topup_50"
  | "department"
  | "school";

export type PricingQuotePlan = {
  price: string;
  label: string;
};

export type MmlWebPricingQuote = {
  currencyCode: string;
  currencySymbol: string;
  regionLine: string;
  plans: Partial<Record<PayPalPlanKey, PricingQuotePlan>>;
};

export type CreatePayPalOrderResult = {
  approvalUrl: string;
  orderId: string;
  currencyCode?: string;
  value?: string;
};

export type FinalizePayPalOrderResult = {
  success: boolean;
  orgId?: string | null;
};

/** Hardcoded USD fallbacks when quote callable fails (mirrors Flutter web cards). */
export const FALLBACK_PRICES: Record<PayPalPlanKey, string> = {
  individual_monthly: "12.99",
  individual_annual: "99.99",
  credit_topup_50: "29.99",
  department: "349.00",
  school: "599.00",
};

export const PLAN_KEY_TO_TIER: Record<PayPalPlanKey, AccountPlanTier> = {
  individual_monthly: "individualMonthly",
  individual_annual: "individualAnnual",
  credit_topup_50: "creditTopUp50",
  department: "department",
  school: "school",
};

export const ANNUAL_CREDITS_PER_SEAT = 360;

const APP_ORIGIN_FALLBACK =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/$/, "") ??
  "https://makemylesson.ai";

function checkoutBaseUrl(): string {
  if (typeof window === "undefined") {
    return `${APP_ORIGIN_FALLBACK}${ROUTES.pricing}`;
  }
  return `${window.location.origin}${ROUTES.pricing}`;
}

export function returnUrlForPlan(planKey: PayPalPlanKey): string {
  return `${checkoutBaseUrl()}?paypal_sub_done=1&plan=${encodeURIComponent(planKey)}`;
}

export function cancelUrl(): string {
  return `${checkoutBaseUrl()}?paypal_cancel=1`;
}

export async function getMmlWebPricingQuote(): Promise<MmlWebPricingQuote> {
  return callFunction<Record<string, never>, MmlWebPricingQuote>(
    "getMmlWebPricingQuote",
    {},
  );
}

export async function createPayPalAccessOrder(
  planKey: PayPalPlanKey,
): Promise<CreatePayPalOrderResult> {
  const data = await callFunction<
    { planKey: PayPalPlanKey; returnUrl: string; cancelUrl: string },
    CreatePayPalOrderResult
  >("createPayPalAccessOrder", {
    planKey,
    returnUrl: returnUrlForPlan(planKey),
    cancelUrl: cancelUrl(),
  });
  const approvalUrl = (data.approvalUrl ?? "").trim();
  const orderId = (data.orderId ?? "").trim();
  if (!approvalUrl || !orderId) {
    throw new Error("PayPal did not return an approval link.");
  }
  return { ...data, approvalUrl, orderId };
}

export async function finalizePayPalAccessOrder(
  orderId: string,
): Promise<FinalizePayPalOrderResult> {
  const data = await callFunction<
    { orderId: string },
    FinalizePayPalOrderResult
  >("finalizePayPalAccessOrder", { orderId });
  const orgId = (data.orgId ?? "").toString().trim();
  return {
    success: data.success === true,
    orgId: orgId || null,
  };
}

export function successMessageForPlanKey(planKey: string): string {
  switch (planKey) {
    case "individual_monthly":
      return "Individual Monthly is active.";
    case "individual_annual":
      return "Individual Annual is active.";
    case "credit_topup_50":
      return "One-Time Credit Top-Up is active.";
    case "department":
      return "Department plan is active.";
    case "school":
      return "School plan is active.";
    default:
      return "Purchase completed.";
  }
}

export function formatUsdPrice(
  price: string,
  symbol = "$",
): string {
  const n = Number.parseFloat(price);
  if (!Number.isFinite(n)) return `${symbol}${price}`;
  return `${symbol}${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

export function priceForPlan(
  quote: MmlWebPricingQuote | null,
  planKey: PayPalPlanKey,
): string {
  const fromQuote = quote?.plans?.[planKey]?.price?.trim();
  return fromQuote || FALLBACK_PRICES[planKey];
}

export function currencySymbol(quote: MmlWebPricingQuote | null): string {
  return quote?.currencySymbol?.trim() || "$";
}


