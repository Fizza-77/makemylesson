"use client";

import { useRouter } from "next/navigation";

import { openPricingPage } from "@/lib/open-pricing";

export type UpgradeDialogReason =
  | "freeExhausted"
  | "paidCreditsExhausted"
  | "subscriptionExpired";

const PLANS = [
  {
    title: "Individual Monthly",
    detail: "30 generation credits every month",
  },
  {
    title: "Individual Annual",
    detail: "Best value — save vs monthly billing",
  },
  {
    title: "Department & School",
    detail: "Team seats with shared yearly credit pools",
  },
  {
    title: "Credit top-up",
    detail: "50 credits · no expiry · $29.99",
  },
] as const;

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-[#151B35]" aria-hidden>
      <path d="M12 2.5l2.4 5.4 5.9.5-4.5 3.9 1.4 5.7L12 15.2l-5.2 2.8 1.4-5.7-4.5-3.9 5.9-.5L12 2.5z" />
    </svg>
  );
}

export function UpgradePlanDialog({
  open,
  reason,
  creditsRemaining,
  onClose,
}: {
  open: boolean;
  reason: UpgradeDialogReason;
  creditsRemaining: number;
  onClose: () => void;
}) {
  const router = useRouter();
  if (!open) return null;

  const title =
    reason === "freeExhausted"
      ? "Unlock unlimited teaching power"
      : reason === "paidCreditsExhausted"
        ? "Renew your subscription"
        : "Your subscription has ended";

  const subtitle =
    reason === "freeExhausted"
      ? creditsRemaining > 0
        ? `${creditsRemaining} of 5 free generation credits left`
        : "You have no free credits left. Please subscribe to continue."
      : reason === "paidCreditsExhausted"
        ? "You've used all credits for this billing period."
        : "Renew to keep generating lessons, presentations, and assessments.";

  const body =
    reason === "freeExhausted"
      ? creditsRemaining > 0
        ? "Go beyond your free trial with plans built for everyday classroom use."
        : "Your 5 free credits are finished. Subscribe now to keep generating lessons."
      : reason === "paidCreditsExhausted"
        ? "Choose a plan to get a fresh credit pool for your next billing period."
        : "Your paid plan has expired. Subscribe again to restore your generation credits.";

  const primaryLabel =
    reason === "freeExhausted" && creditsRemaining > 0
      ? "View plans"
      : reason === "freeExhausted"
        ? "Manage subscription"
        : "View plans";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#151B35]/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-dialog-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — Stage 1 teal wash */}
        <div
          className="px-5 py-5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #E8F8F7 0%, #F5F6FA 55%, #FFFFFF 100%)",
          }}
        >
          <div className="flex items-start gap-3">
            <span
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[#28C2C0]/25 ring-1 ring-[#28C2C0]/30"
              aria-hidden
            >
              <StarIcon />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2
                id="upgrade-dialog-title"
                className="text-lg font-bold tracking-tight text-[#151B35]"
              >
                {title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
          <p className="text-sm leading-relaxed text-[#151B35]">{body}</p>

          <ul className="space-y-3.5">
            {PLANS.map((plan) => (
              <li key={plan.title}>
                <p className="text-sm font-bold text-[#151B35]">{plan.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {plan.detail}
                </p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-1 w-full rounded-full bg-[#28C2C0] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22B0AE]"
            onClick={() => {
              onClose();
              openPricingPage((href) => router.push(href));
            }}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="w-full py-1 text-center text-sm font-bold text-[#151B35] transition hover:text-[#28C2C0]"
            onClick={onClose}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

/** Pick dialog reason from account-ish fields (mirrors Flutter engagement coordinator). */
export function upgradeReasonForCredits(params: {
  credits: number;
  isPaid: boolean;
}): UpgradeDialogReason {
  if (params.isPaid) return "paidCreditsExhausted";
  return "freeExhausted";
}
