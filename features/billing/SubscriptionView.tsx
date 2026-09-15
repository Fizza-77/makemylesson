"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { mapFunctionsError } from "@/lib/auth-errors";
import { isRegisteredUser } from "@/lib/guest-session";
import { ROUTES } from "@/lib/urls";
import {
  ANNUAL_CREDITS_PER_SEAT,
  currencySymbol,
  formatUsdPrice,
  getMmlWebPricingQuote,
  priceForPlan,
  type MmlWebPricingQuote,
} from "@/services/paypal-checkout.service";
import {
  createStripeCheckoutSession,
  isStripePlanKey,
  successMessageForPlanKey,
  waitForStripeEntitlement,
  type StripePlanKey,
} from "@/services/stripe-checkout.service";
import { getMyAdminOrganizations } from "@/services/organization.service";
import { isPaidPlan, PLAN_LABELS } from "@/services/user-account.service";
import {
  refreshAccountFromServer,
  syncAccountSubscriptionForUser,
  useAccountStore,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import type { AccountPlanTier } from "@/types/account";
import type { OrganizationSummary } from "@/types/organization";

function PlanBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm leading-snug text-[#1A1C30]">
      <span className="mt-0.5 text-[#28C2C0]" aria-hidden>
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function PlanCard({
  title,
  price,
  priceSubtitle,
  badge,
  highlight,
  bullets,
  ctaLabel,
  ctaEnabled,
  ctaLoading,
  onCta,
}: {
  title: string;
  price: string;
  priceSubtitle?: string;
  badge?: string | null;
  highlight?: boolean;
  bullets: string[];
  ctaLabel: string;
  ctaEnabled: boolean;
  ctaLoading: boolean;
  onCta: () => void;
}) {
  return (
    <Card
      className={
        highlight
          ? "border-[#28C2C0] ring-2 ring-[#28C2C0]/20"
          : undefined
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-[#1A1C30]">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-[#FFF4D3] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#B45309]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-bold text-[#1A1C30]">{price}</p>
      {priceSubtitle ? (
        <p className="mt-1 text-xs text-[#666666]">{priceSubtitle}</p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {bullets.map((b) => (
          <PlanBullet key={b}>{b}</PlanBullet>
        ))}
      </ul>
      <Button
        type="button"
        className="mt-5 w-full"
        variant={ctaEnabled ? "primary" : "outline"}
        disabled={!ctaEnabled || ctaLoading}
        isLoading={ctaLoading}
        onClick={onCta}
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}

function OrgPlanCard({
  title,
  seats,
  price,
  perSeat,
  creditsLine,
  ctaLoading,
  onCta,
  showDashboard,
  onDashboard,
}: {
  title: string;
  seats: string;
  price: string;
  perSeat: string;
  creditsLine: string;
  ctaLoading: boolean;
  onCta: () => void;
  showDashboard?: boolean;
  onDashboard?: () => void;
}) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-[#1A1C30]">{title}</h3>
      <p className="mt-1 text-sm text-[#666666]">{seats}</p>
      <p className="mt-3 text-2xl font-bold text-[#1A1C30]">{price}</p>
      <p className="mt-1 text-xs text-[#666666]">{perSeat}</p>
      <p className="mt-3 text-sm text-[#1A1C30]">{creditsLine}</p>
      <div className="mt-5 flex flex-col gap-2">
        <Button
          type="button"
          className="w-full"
          disabled={ctaLoading}
          isLoading={ctaLoading}
          onClick={onCta}
        >
          Subscribe Annually
        </Button>
        {showDashboard && onDashboard ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onDashboard}
          >
            Open dashboard
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function stripCheckoutQuery(router: ReturnType<typeof useRouter>) {
  router.replace(ROUTES.subscription);
}

export function SubscriptionView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const account = useAccountStore((s) => s.account);

  const [quote, setQuote] = useState<MmlWebPricingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<StripePlanKey | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [ownedOrgs, setOwnedOrgs] = useState<OrganizationSummary[]>([]);
  const checkoutHandledRef = useRef(false);

  const tier: AccountPlanTier = account?.planTier ?? "free";
  const paid = isPaidPlan(tier);
  const symbol = currencySymbol(quote);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscriptionForUser(user);
    if (!user?.uid) {
      queueMicrotask(() => setOwnedOrgs([]));
      return;
    }
    void getMyAdminOrganizations()
      .then(setOwnedOrgs)
      .catch(() => setOwnedOrgs([]));
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

  const requireSignIn = useCallback(() => {
    if (isRegisteredUser(user)) return true;
    router.push(
      `${ROUTES.signIn}?reason=${encodeURIComponent("Sign in to subscribe or buy credits.")}&next=${encodeURIComponent(ROUTES.subscription)}`,
    );
    return false;
  }, [router, user]);

  const startCheckout = useCallback(
    async (planKey: StripePlanKey) => {
      if (!requireSignIn()) return;
      if (!isStripePlanKey(planKey)) {
        toast.error("That plan is not available.");
        return;
      }
      setCheckoutPlan(planKey);
      try {
        const session = await createStripeCheckoutSession(planKey);
        window.location.assign(session.url);
      } catch (e) {
        setCheckoutPlan(null);
        toast.error(mapFunctionsError(e) || "Checkout failed.");
      }
    },
    [requireSignIn],
  );

  useEffect(() => {
    if (!authReady || checkoutHandledRef.current) return;

    const cancelled = searchParams.get("stripe_checkout") === "cancel";
    const done = searchParams.get("stripe_checkout") === "success";
    const sessionId = (searchParams.get("stripe_session_id") ?? "").trim();
    const planKey = (searchParams.get("plan") ?? "").trim();

    if (cancelled) {
      checkoutHandledRef.current = true;
      stripCheckoutQuery(router);
      toast.info("Checkout cancelled.");
      return;
    }

    if (!done) return;

    checkoutHandledRef.current = true;
    stripCheckoutQuery(router);

    void (async () => {
      setFinalizing(true);
      try {
        if (!user) {
          toast.info("Sign in to confirm your payment.");
          router.replace(
            `${ROUTES.signIn}?next=${encodeURIComponent(ROUTES.subscription)}`,
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
        if (user.uid) {
          await refreshAccountFromServer(user.uid).catch(() => null);
        }
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
  }, [authReady, router, searchParams, user]);

  const loadingPlan = (key: StripePlanKey) =>
    checkoutPlan === key || finalizing;

  const departmentOrg = ownedOrgs.find((o) => o.planKey === "department");
  const schoolOrg = ownedOrgs.find(
    (o) => o.planKey === "school" || o.planKey === "school_plus",
  );

  const monthlyPrice = `${formatUsdPrice(priceForPlan(quote, "individual_monthly"), symbol)} / month`;
  const annualPrice = `${formatUsdPrice(priceForPlan(quote, "individual_annual"), symbol)} / year`;
  const topUpPrice = formatUsdPrice(
    priceForPlan(quote, "credit_topup_50"),
    symbol,
  );
  const departmentPrice = `${formatUsdPrice(priceForPlan(quote, "department"), symbol)} / year`;
  const schoolPrice = `${formatUsdPrice(priceForPlan(quote, "school"), symbol)} / year`;

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 pb-10">
      {finalizing ? (
        <Card className="flex items-center gap-3 border-[#28C2C0]/40 bg-[#F5FBFB]">
          <Spinner className="size-5" />
          <p className="text-sm font-medium text-[#1A1C30]">
            Confirming your payment…
          </p>
        </Card>
      ) : null}

      <div>
        <h1 className="text-2xl font-bold text-[#1A1C30]">
          {paid ? "Manage subscription" : "Choose your plan"}
        </h1>
        <p className="mt-2 text-sm text-[#666666]">
          {quote?.regionLine?.trim() ||
            "Pricing is set in USD. Local currency equivalents are shown at checkout based on your region."}
        </p>
        <p className="mt-1 text-sm text-[#666666]">
          30 generation credits per month on paid plans. Cancel anytime on
          monthly billing.
        </p>
        {account ? (
          <p className="mt-3 text-sm font-medium text-[#1A1C30]">
            Current plan:{" "}
            <span className="text-[#28C2C0]">{PLAN_LABELS[tier]}</span>
            {" · "}
            {Math.max(0, account.generationCredits)} credits remaining
          </p>
        ) : null}
        {quoteLoading ? (
          <p className="mt-2 text-xs text-[#999999]">Loading live prices…</p>
        ) : null}
      </div>

      {!user ? (
        <Card className="bg-[#F5FBFB]">
          <p className="text-sm text-[#1A1C30]">
            Sign in to subscribe or buy a credit top-up.
          </p>
          <Link href={ROUTES.signIn} className="mt-3 inline-block">
            <Button type="button">Sign in</Button>
          </Link>
        </Card>
      ) : null}

      <h2 className="text-base font-semibold text-[#1A2130]">
        Individual plans
      </h2>

      <PlanCard
        title="Individual Monthly"
        price={monthlyPrice}
        priceSubtitle="Billed monthly · Cancel anytime"
        badge={tier === "individualMonthly" ? "CURRENT PLAN" : null}
        highlight={tier === "individualMonthly"}
        bullets={[
          "30 generation credits per month",
          "All 4 stages · complete 4-stage pack uses 4 credits",
          "All curriculum routes across 5 families",
          "Full library and favourites",
          "Export to PDF · share downloads",
          "AI-generated images (Stage 2 presentations)",
          "Manual editing always free — never consumes a credit",
        ]}
        ctaLabel={
          tier === "individualMonthly" ? "Current plan" : "Subscribe Monthly"
        }
        ctaEnabled={tier !== "individualMonthly"}
        ctaLoading={loadingPlan("individual_monthly")}
        onCta={() => void startCheckout("individual_monthly")}
      />

      <PlanCard
        title="Individual Annual"
        price={annualPrice}
        priceSubtitle="~$8.33/month · Save 36% vs monthly"
        badge={
          tier === "individualAnnual"
            ? "CURRENT PLAN"
            : !paid
              ? "BEST VALUE"
              : null
        }
        highlight={tier === "individualAnnual" || !paid}
        bullets={["Everything in Monthly"]}
        ctaLabel={
          tier === "individualAnnual" ? "Current plan" : "Subscribe Annually"
        }
        ctaEnabled={tier !== "individualAnnual"}
        ctaLoading={loadingPlan("individual_annual")}
        onCta={() => void startCheckout("individual_annual")}
      />

      <PlanCard
        title="One-Time Credit Top-Up"
        price={topUpPrice}
        priceSubtitle="50 credits · no expiry"
        badge={tier === "creditTopUp50" ? "CURRENT PLAN" : null}
        highlight={tier === "creditTopUp50"}
        bullets={[
          "Buy extra credits any time before your monthly reset",
          "One-time purchase · not a subscription",
          "Credits are used for AI stage generation only",
        ]}
        ctaLabel="Buy Top-Up"
        ctaEnabled
        ctaLoading={loadingPlan("credit_topup_50")}
        onCta={() => void startCheckout("credit_topup_50")}
      />

      <div className="mt-2">
        <h2 className="text-base font-semibold text-[#1A2130]">
          School and department plans
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#666666]">
          Annual billing only. Each teacher gets their own account, library, and{" "}
          {ANNUAL_CREDITS_PER_SEAT} generation credits for the year. One admin
          manages seats — no shared logins.
        </p>
      </div>

      <OrgPlanCard
        title="Department Plan"
        seats="Up to 5 teachers"
        price={departmentPrice}
        perSeat="~$5.83 / seat / month"
        creditsLine={`${ANNUAL_CREDITS_PER_SEAT} credits per teacher per year (yearly pool)`}
        ctaLoading={loadingPlan("department")}
        onCta={() => void startCheckout("department")}
        showDashboard={!!departmentOrg}
        onDashboard={() =>
          router.push(
            `${ROUTES.organizationDashboard}?orgId=${encodeURIComponent(departmentOrg!.orgId)}`,
          )
        }
      />

      <OrgPlanCard
        title="School Plan"
        seats="Up to 10 teachers"
        price={schoolPrice}
        perSeat="~$5.00 / seat / month"
        creditsLine={`${ANNUAL_CREDITS_PER_SEAT} credits per teacher per year (yearly pool)`}
        ctaLoading={loadingPlan("school")}
        onCta={() => void startCheckout("school")}
        showDashboard={!!schoolOrg}
        onDashboard={() =>
          router.push(
            `${ROUTES.organizationDashboard}?orgId=${encodeURIComponent(schoolOrg!.orgId)}`,
          )
        }
      />

      <p className="text-center text-xs text-[#999999]">
        Secure checkout. Credits update automatically after payment.
      </p>
    </div>
  );
}


