"use client";

import { PricingLink } from "@/components/common/PricingLink";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/urls";
import { isPaidPlan, PLAN_LABELS } from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";

/** Compact credits / plan strip for stage headers (Flutter StageUpgradeCard). */
export function StageUpgradeCard() {
  const account = useAccountStore((s) => s.account);
  if (!account) return null;

  const paid = isPaidPlan(account.planTier);
  const credits = Math.max(0, account.generationCredits);

  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 border-[#E5E7EB] bg-[#F8FAFC] p-3 shadow-none">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#1A1C30]">
          {PLAN_LABELS[account.planTier]}
          {" · "}
          {credits} credit{credits === 1 ? "" : "s"} left
        </p>
        <p className="mt-0.5 text-[11px] text-[#666666]">
          {paid
            ? "Credits refresh with your billing period."
            : "Free credits are one-time when you join."}
        </p>
      </div>
      <PricingLink
        href={ROUTES.subscription}
        className="shrink-0 text-xs font-semibold text-[#28C2C0] hover:underline"
      >
        {paid ? "Manage plan" : "Upgrade"}
      </PricingLink>
    </Card>
  );
}
