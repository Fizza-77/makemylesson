"use client";

import Image from "next/image";

import { PricingLink } from "@/components/common/PricingLink";
import { useAppCredits } from "@/hooks/useAppCredits";
import { ROUTES } from "@/lib/urls";
import { isPaidPlan } from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";

function CrownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden
    >
      <path d="M5 16 3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5Zm0 2h14v2H5v-2Z" />
    </svg>
  );
}

/** Stage 3 hero — same layout/style as Stage 2, Stage 3 copy + `stage3-hero.svg`. */
export function Stage3Hero() {
  const account = useAccountStore((s) => s.account);
  const { summaryLine } = useAppCredits();
  const paid = account ? isPaidPlan(account.planTier) : false;

  return (
    <section
      className="relative overflow-hidden rounded-3xl shadow-lg"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 70% 80% at 85% 50%, rgba(104, 211, 208, 0.25) 0%, rgba(104, 211, 208, 0) 65%)",
          "linear-gradient(90deg, #0D1430 0%, #202B52 50%, #30416F 100%)",
        ].join(", "),
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:gap-8 lg:px-10 lg:py-9">
        <div className="w-full min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            <span className="inline-block h-0.5 w-7 rounded-full bg-teal-400" />
            Stage 3 of 4
          </p>

          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">
              Create <span className="text-teal-400">Formative</span>
            </span>
            <span className="block">Assessment</span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Generate practice worksheets or exit tickets to gauge student
            understanding.
          </p>

          <PricingLink
            href={ROUTES.subscription}
            className="mt-6 inline-flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3 transition hover:bg-white/15"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-400 text-slate-900">
              <CrownIcon />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {paid ? "Your plan" : "Upgrade to Pro"}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {summaryLine}
              </p>
            </div>
          </PricingLink>
        </div>

        <div className="relative z-10 w-full max-w-lg flex-1 lg:max-w-xl">
          <Image
            src="/stage3-hero.svg"
            alt="Formative assessment illustration"
            width={470}
            height={224}
            className="h-auto w-full"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
