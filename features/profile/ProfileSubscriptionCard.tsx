"use client";

import { PricingLink } from "@/components/common/PricingLink";
import { ProfileCardShell } from "@/features/profile/ProfileMenuPrimitives";
import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import {
  isPaidPlan,
  PLAN_LABELS,
  profileSubscriptionFootnote,
  type UserAccountView,
} from "@/services/user-account.service";

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M12 3 5 6.2v5.3c0 4.2 2.8 8.1 7 9.5 4.2-1.4 7-5.3 7-9.5V6.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12.1 1.9 1.9 3.8-3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileSubscriptionCard({
  account,
}: {
  account: UserAccountView;
}) {
  const paid = isPaidPlan(account.planTier);
  const remaining = Math.max(0, account.generationCredits);
  const cap = Math.max(1, account.generationCreditCap);
  const footnote = profileSubscriptionFootnote(account);
  const planLabel = PLAN_LABELS[account.planTier];
  const freeDots = account.planTier === "free";
  const displayCap = freeDots ? 5 : Math.min(8, Math.max(1, cap));
  const displayRemaining = freeDots
    ? Math.max(0, Math.min(5, remaining))
    : remaining;
  const filled = freeDots
    ? displayRemaining
    : Math.round((remaining / cap) * displayCap);

  return (
    <ProfileCardShell
      icon={<ShieldCheckIcon />}
      title="Subscription"
      description="Your teacher pass and credits"
      className="border-[#D5DCE3] shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#D5DCE3] bg-[#EAF7F6] px-5 py-5 sm:px-6">
        {/* Ticket notches */}
        <span
          className="pointer-events-none absolute top-[58%] left-0 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute top-[58%] right-0 size-[18px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          aria-hidden
        />

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#128C89] uppercase">
            Current Plan
          </p>
          <span className="rounded-full border border-[#D5DCE3] bg-white px-3 py-1 text-[11px] font-semibold text-[#128C89]">
            {planLabel}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-[#0D1430] sm:text-[22px]">
          {displayRemaining} generation credit
          {displayRemaining === 1 ? "" : "s"}
        </h3>
        {footnote ? (
          <p className="mt-1.5 text-sm leading-relaxed text-[#8A93A3]">
            {footnote}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {Array.from({ length: displayCap }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-xs font-bold shadow-[0_4px_10px_rgba(32,170,167,0.28)]",
                i < filled
                  ? "bg-[#20AAA7] text-white"
                  : "bg-white/80 text-[#9AA2A8] shadow-none ring-1 ring-[#D5DCE3]",
              )}
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#8A93A3]">
          <span>Credits available</span>
          <span className="font-semibold text-[#0D1430]">
            {displayRemaining} / {freeDots ? 5 : cap}
          </span>
        </div>

        <PricingLink
          href={ROUTES.subscription}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#20AAA7] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(32,170,167,0.7)] transition hover:bg-[#1a9592]"
        >
          {paid ? "Manage Subscription" : "Upgrade Plan"}
        </PricingLink>
      </div>
    </ProfileCardShell>
  );
}
