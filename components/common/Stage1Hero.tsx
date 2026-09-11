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

/** Stage 1 dark navy hero — Tailwind only + `public/stage1-hero.svg`. */
export function Stage1Hero() {
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
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-28%] right-[28%] z-0 aspect-square w-[min(220px,28%)] rounded-full border-[28px] border-white/10 lg:top-[-30%] lg:right-[26%] lg:w-[min(260px,22%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-6%] bottom-[-28%] z-0 aspect-square w-[min(220px,28%)] rounded-full border-[28px] border-white/10 lg:right-[-4%] lg:bottom-[-32%] lg:w-[min(260px,22%)]"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:gap-8 lg:px-10 lg:py-9">
        <div className="w-full min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            <span className="inline-block h-0.5 w-7 rounded-full bg-teal-400" />
            Stage 1 of 4
          </p>

          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">
              Plan &amp; <span className="text-teal-400">Generate</span>
            </span>
            <span className="block">Lesson</span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 xl:max-w-lg 2xl:max-w-xl">
            Create engaging, classroom ready lessons by entering your
            preferences.
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

        <div className="relative z-10 w-full max-w-lg flex-1 lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
          <Image
            src="/stage1-hero.svg"
            alt="Teacher planner illustration"
            width={580}
            height={332}
            className="h-auto w-full"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}


