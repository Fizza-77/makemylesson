"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { mapFunctionsError } from "@/lib/auth-errors";
import { isRegisteredUser } from "@/lib/guest-session";
import { ROUTES } from "@/lib/urls";
import { getMmlWebPricingQuote } from "@/services/paypal-checkout.service";
import type { MmlWebPricingQuote } from "@/services/paypal-checkout.service";
import {
  createStripeCheckoutSession,
  isStripePlanKey,
  successMessageForPlanKey,
  waitForStripeEntitlement,
  type StripePlanKey,
} from "@/services/stripe-checkout.service";
import {
  refreshAccountFromServer,
  syncAccountSubscriptionForUser,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

/**
 * Web Stripe checkout for marketing `/pricing`.
 * Shared Firebase callable checkout plus webhook-authoritative Firestore state.
 */
export function useStripeCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);

  const [quote, setQuote] = useState<MmlWebPricingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<StripePlanKey | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const stripeHandledRef = useRef(false);
  const pendingPlanStartedRef = useRef(false);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscriptionForUser(user);
  }, [authReady, user]);

  useEffect(() => {
    let cancelled = false;
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

  const stripCheckoutQuery = useCallback(() => {
    router.replace(ROUTES.pricing);
  }, [router]);

  const requireSignIn = useCallback(
    (planKey?: StripePlanKey) => {
      if (isRegisteredUser(user)) return true;
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
    async (planKey: StripePlanKey) => {
      if (!requireSignIn(planKey)) return;
      if (!isStripePlanKey(planKey)) {
        toast.error("That plan is not available.");
        return;
      }
      setCheckoutPlan(planKey);
      try {
        const session = await createStripeCheckoutSession(planKey);
        if (session.subscriptionCancellationScheduled) {
          await refreshAccountFromServer(user?.uid ?? "").catch(() => null);
          const endDate = session.subscriptionEndsAtMs
            ? new Date(session.subscriptionEndsAtMs).toLocaleDateString()
            : "the end of your current billing period";
          toast.info(
            `Your current subscription remains active until ${endDate} and will then cancel. Choose ${successMessageForPlanKey(planKey).replace(" is active.", "")} after it ends.`,
          );
          setCheckoutPlan(null);
          return;
        }
        window.location.assign(session.url);
      } catch (e) {
        setCheckoutPlan(null);
        toast.error(mapFunctionsError(e) || "Checkout failed.");
      }
    },
    [requireSignIn],
  );

  useEffect(() => {
    if (!authReady || stripeHandledRef.current) return;

    const cancelled = searchParams.get("stripe_checkout") === "cancel";
    const done = searchParams.get("stripe_checkout") === "success";
    const sessionId = (searchParams.get("stripe_session_id") ?? "").trim();
    const planKey = (searchParams.get("plan") ?? "").trim();

    if (cancelled) {
      stripeHandledRef.current = true;
      stripCheckoutQuery();
      toast.info("Checkout cancelled.");
      return;
    }

    if (!done) return;

    stripeHandledRef.current = true;
    stripCheckoutQuery();

    void (async () => {
      setFinalizing(true);
      try {
        if (!isRegisteredUser(user) || !user?.uid) {
          toast.info("Sign in to confirm your payment.");
          const resume = sessionId
            ? `${ROUTES.pricing}?stripe_checkout=success&stripe_session_id=${encodeURIComponent(sessionId)}${
                planKey ? `&plan=${encodeURIComponent(planKey)}` : ""
              }`
            : ROUTES.pricing;
          router.replace(
            `${ROUTES.signIn}?next=${encodeURIComponent(resume)}`,
          );
          return;
        }

        const result = sessionId
          ? await waitForStripeEntitlement({
              sessionId,
              uid: user.uid,
              refreshAccount: refreshAccountFromServer,
            })
          : null;

        await refreshAccountFromServer(user.uid).catch(() => null);

        if (result?.entitlementApplied) {
          toast.success(
            planKey
              ? successMessageForPlanKey(planKey)
              : "Purchase completed.",
          );
        } else if (result?.paid) {
          toast.info(
            "Payment received. Your credits will appear in a moment — refresh if they are not updated yet.",
          );
        } else {
          toast.info(
            "We're confirming your payment. Refresh this page if your credits are not updated yet.",
          );
        }

        const orgId = result?.orgId?.trim();
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
  }, [authReady, router, searchParams, stripCheckoutQuery, user]);

  useEffect(() => {
    if (!authReady || !isRegisteredUser(user) || pendingPlanStartedRef.current) {
      return;
    }
    if (searchParams.get("stripe_checkout") === "success") return;
    if (searchParams.get("stripe_checkout") === "cancel") return;

    const pending = (searchParams.get("plan") ?? "").trim();
    if (!isStripePlanKey(pending)) return;

    pendingPlanStartedRef.current = true;
    router.replace(ROUTES.pricing);
    queueMicrotask(() => {
      void startCheckout(pending);
    });
  }, [authReady, router, searchParams, startCheckout, user]);

  const loadingPlan = (key: StripePlanKey) =>
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
