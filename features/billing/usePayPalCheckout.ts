"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { mapFunctionsError } from "@/lib/auth-errors";
import { ROUTES } from "@/lib/urls";
import {
  createPayPalAccessOrder,
  finalizePayPalAccessOrder,
  getMmlWebPricingQuote,
  successMessageForPlanKey,
  type MmlWebPricingQuote,
  type PayPalPlanKey,
} from "@/services/paypal-checkout.service";
import {
  refreshAccountFromServer,
  syncAccountSubscriptionForUser,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const PLAN_KEYS: PayPalPlanKey[] = [
  "individual_monthly",
  "individual_annual",
  "credit_topup_50",
  "department",
  "school",
];

function isPlanKey(value: string): value is PayPalPlanKey {
  return (PLAN_KEYS as string[]).includes(value);
}

/**
 * Shared PayPal checkout for marketing `/pricing`.
 * Firebase callables: getMmlWebPricingQuote → createPayPalAccessOrder → finalizePayPalAccessOrder.
 */
export function usePayPalCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);

  const [quote, setQuote] = useState<MmlWebPricingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<PayPalPlanKey | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const paypalHandledRef = useRef(false);
  const pendingPlanStartedRef = useRef(false);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscriptionForUser(user);
  }, [authReady, user?.uid]);

  useEffect(() => {
    let cancelled = false;
    setQuoteLoading(true);
    void getMmlWebPricingQuote()
      .then((q) => {
        if (!cancelled) setQuote(q);
      })
      .catch(() => {
        if (!cancelled) setQuote(null);
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stripPayPalQuery = useCallback(() => {
    router.replace(ROUTES.pricing);
  }, [router]);

  const requireSignIn = useCallback(
    (planKey?: PayPalPlanKey) => {
      if (user) return true;
      const next = planKey
        ? `${ROUTES.pricing}?plan=${encodeURIComponent(planKey)}`
        : ROUTES.pricing;
      router.push(
        `${ROUTES.signIn}?reason=${encodeURIComponent("Sign in to subscribe or buy credits.")}&next=${encodeURIComponent(next)}`,
      );
      return false;
    },
    [router, user],
  );

  const startCheckout = useCallback(
    async (planKey: PayPalPlanKey) => {
      if (!requireSignIn(planKey)) return;
      setCheckoutPlan(planKey);
      try {
        const order = await createPayPalAccessOrder(planKey);
        window.location.assign(order.approvalUrl);
      } catch (e) {
        setCheckoutPlan(null);
        toast.error(mapFunctionsError(e) || "PayPal checkout failed.");
      }
    },
    [requireSignIn],
  );

  // Stripe return / cancel
  useEffect(() => {
    if (!authReady || paypalHandledRef.current) return;

    const cancelled = searchParams.get("stripe_cancel") === "1";
    const done = searchParams.get("stripe_success") === "1";
    const token = (searchParams.get("session_id") ?? "").trim();
    const planKey = (searchParams.get("plan") ?? "").trim();

    if (cancelled) {
      paypalHandledRef.current = true;
      stripPayPalQuery();
      toast.info("Checkout cancelled.");
      return;
    }

    if (!done || !token) return;

    paypalHandledRef.current = true;
    setFinalizing(true);
    stripPayPalQuery();

    void (async () => {
      try {
        if (!user) {
          toast.info("Sign in to confirm your payment.");
          router.replace(
            `${ROUTES.signIn}?next=${encodeURIComponent(
              `${ROUTES.pricing}?stripe_success=1&session_id=${encodeURIComponent(token)}${
                planKey ? `&plan=${encodeURIComponent(planKey)}` : ""
              }`,
            )}`,
          );
          return;
        }
        const result = await finalizePayPalAccessOrder(token);
        if (user.uid) {
          await refreshAccountFromServer(user.uid).catch(() => null);
        }
        toast.success(
          planKey ? successMessageForPlanKey(planKey) : "Purchase completed.",
        );
        const orgId = result.orgId?.trim();
        if (orgId) {
          router.push(
            `${ROUTES.organizationDashboard}?orgId=${encodeURIComponent(orgId)}`,
          );
        }
      } catch (e) {
        toast.error(
          mapFunctionsError(e) ||
            "Could not confirm payment. If you were charged, contact support.",
        );
      } finally {
        setFinalizing(false);
        setCheckoutPlan(null);
      }
    })();
  }, [authReady, router, searchParams, stripPayPalQuery, user]);

  // After login with ?plan=… resume checkout once
  useEffect(() => {
    if (!authReady || !user || pendingPlanStartedRef.current) return;
    if (searchParams.get("stripe_success") === "1") return;
    if (searchParams.get("stripe_cancel") === "1") return;

    const pending = (searchParams.get("plan") ?? "").trim();
    if (!isPlanKey(pending)) return;

    pendingPlanStartedRef.current = true;
    router.replace(ROUTES.pricing);
    void startCheckout(pending);
  }, [authReady, router, searchParams, startCheckout, user]);

  const loadingPlan = (key: PayPalPlanKey) =>
    checkoutPlan === key || finalizing;

  return {
    authReady,
    user,
    quote,
    quoteLoading,
    finalizing,
    checkoutPlan,
    startCheckout,
    loadingPlan,
  };
}


