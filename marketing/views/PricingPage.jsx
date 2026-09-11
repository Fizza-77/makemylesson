'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, Lock, Minus, Plus } from 'lucide-react'
import { PageShell } from '@marketing/components/layout/Container'
import { AccessPlanCard, localizeAccessPlans } from '@marketing/components/AccessPlanCards'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'
import { usePayPalCheckout } from '@/features/billing/usePayPalCheckout'
import { priceForPlan } from '@/services/paypal-checkout.service'

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CAD', symbol: 'C$', rate: 1.37 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
]

const USD = CURRENCIES[0]

function formatMoney(usdAmount, currency) {
  const value = usdAmount * currency.rate
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 100) / 100
  const display =
    Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.00$/, '')
  return `${currency.symbol} ${display}`
}

function PricingPlansStaticFallback() {
  const plans = localizeAccessPlans(USD)
  return (
    <PageShell
      variant="content"
      className="pricing-page-shell !bg-white border-t-transparent"
      contentClassName="pricing-page-inner !max-w-none !px-0 !py-0 !pt-2 pb-0"
    >
      <section
        id="pricing-plans"
        className="pricing-plans relative z-[1] px-2 pb-[1cm] pt-8 sm:px-3 md:px-4"
        aria-label="Pricing plans"
      >
        <div className="mml-pr-grid pricing-hero-plans !mt-0">
          {plans.map((plan) => (
            <AccessPlanCard key={plan.key} plan={plan} />
          ))}
        </div>
        <PricingLegalNotes />
      </section>
    </PageShell>
  )
}

function PricingLegalNotes() {
  return (
    <div className="mx-auto mt-6 max-w-[1100px] space-y-3 px-2 text-center text-[13px] leading-relaxed text-[#1a2438]/85 sm:px-3">
      <p className="inline-flex flex-wrap items-center justify-center gap-2">
        <Lock size={13} strokeWidth={2.4} aria-hidden className="shrink-0" />
        <span>
          All prices are in USD and exclude any applicable taxes, which are shown at checkout. Your bank may apply a
          currency conversion fee. Subscriptions bought on this website are sold by Skyen Systems Pty Ltd (ACN 701 564
          730). Cancel anytime from your account.
        </span>
      </p>
      <p>
        Schools and departments. We offer plans for teaching teams, with individual accounts and separate credits for each
        teacher. Email{' '}
        <a href="mailto:hello@makemylesson.ai" className="font-semibold text-[#1E9A98] underline-offset-2 hover:underline">
          hello@makemylesson.ai
        </a>{' '}
        and we will put a quote together.
      </p>
      <p>
        Credits are available throughout your plan period and do not carry over. Any unused credits expire when the period
        ends.
      </p>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingPlansStaticFallback />}>
      <PricingPageInner />
    </Suspense>
  )
}

function PricingPageInner() {
  const [billing] = useState('monthly')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const {
    quote,
    quoteLoading,
    finalizing,
    startCheckout,
    loadingPlan,
  } = usePayPalCheckout()

  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0],
    [currencyCode],
  )

  const topUpUsd = Number.parseFloat(priceForPlan(quote, 'credit_topup_50')) || 29.99
  const departmentUsd = Number.parseFloat(priceForPlan(quote, 'department')) || 349
  const schoolUsd = Number.parseFloat(priceForPlan(quote, 'school')) || 599

  const schoolSeatPrice = schoolUsd / 10 / 12
  const addonPrice = topUpUsd

  const localizedPlans = useMemo(() => localizeAccessPlans(currency), [currency])

  return (
    <PageShell
      variant="content"
      className="pricing-page-shell !bg-white border-t-transparent"
      contentClassName="pricing-page-inner !max-w-none !px-0 !py-0 !pt-2 pb-0"
    >
      {finalizing ? (
        <div className="pricing-section-inner mb-4">
          <div className="rounded-2xl border border-[#35BEBC]/40 bg-[#EAF5F6] px-4 py-3 text-center text-[14px] font-medium text-[#1A1E3A]">
            Confirming your PayPal payment…
          </div>
        </div>
      ) : null}

      <div className="pricing-section-inner pricing-hero-band">
      <div className="pricing-canvas relative overflow-hidden rounded-[32px] bg-[#aae4e3] sm:rounded-[40px]">
        <div
          className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-[#35BEBC] sm:-top-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[12%] -left-24 h-72 w-72 rounded-full bg-[#9ddad4]/55"
          aria-hidden
        />

        {/* Hero: headline + billing controls */}
        <section
          className="pricing-hero relative z-[1] flex flex-col items-center px-5 pb-8 pt-10 text-center sm:px-8 sm:pb-10 sm:pt-12 md:px-10 lg:px-12"
          aria-labelledby="pricing-heading"
        >
          <div className="flex flex-col items-center">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1A1E3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3db8b0]" aria-hidden />
              Pricing
            </p>

            <h1
              id="pricing-heading"
              className="text-[clamp(1.85rem,4.6vw,3.35rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
            >
              Fair for one teacher.
              <br />
              Built for a{' '}
              <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
                whole school.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#1a2438]/80 sm:text-base xl:max-w-none xl:whitespace-nowrap">
              Start free with 5 credits. Upgrade only when you are generating every week. No card
              required to try the full workflow.
            </p>
            {quoteLoading ? (
              <p className="mt-2 text-[12px] text-black">Loading live prices…</p>
            ) : quote?.regionLine ? (
              <p className="mt-2 text-[12px] text-black">{quote.regionLine}</p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <CurrencySelect currencyCode={currencyCode} setCurrencyCode={setCurrencyCode} />
            </div>
          </div>
        </section>

        {/* Plans */}
        <section
          id="pricing-plans"
          className="pricing-plans relative z-[1] px-2 pb-[1cm] pt-0 sm:px-3 md:px-4"
          aria-label="Pricing plans"
        >
          <div className="mml-pr-grid pricing-hero-plans !mt-0">
            {localizedPlans.map((plan) => (
              <AccessPlanCard
                key={plan.key}
                plan={plan}
                onCheckout={
                  plan.planKey
                    ? (key) => {
                        void startCheckout(key)
                      }
                    : undefined
                }
                checkoutLoading={Boolean(plan.planKey && loadingPlan(plan.planKey))}
              />
            ))}
          </div>

          <PricingLegalNotes />

          <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 lg:grid-cols-2 xl:gap-6">
            <article className="flex flex-col justify-between rounded-[28px] bg-[#1A1E3A] px-7 py-6 text-white sm:px-8 sm:py-7 xl:rounded-[32px] xl:px-10 xl:py-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white xl:text-[12px]">
                  Need more?
                </p>
                <h2 className="mt-2 text-[1.55rem] font-bold tracking-tight xl:text-[1.8rem]">
                  Add-On Credits
                </h2>
                <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-white xl:max-w-[42ch] xl:text-[15px]">
                  Top up any plan without changing your subscription.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-3 xl:mt-8">
                <span className="text-[1.85rem] font-bold leading-none xl:text-[2.15rem]">
                  {formatMoney(addonPrice, currency)}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/35 px-3.5 py-1.5 text-[12px] font-semibold text-white xl:px-4 xl:py-2 xl:text-[13px]">
                    50 credits
                  </span>
                  <button
                    type="button"
                    disabled={loadingPlan('credit_topup_50')}
                    onClick={() => void startCheckout('credit_topup_50')}
                    className="rounded-full bg-[#35BEBC] px-3.5 py-1.5 text-[12px] font-semibold text-[#1A1E3A] disabled:opacity-60 xl:px-4 xl:py-2 xl:text-[13px]"
                  >
                    {loadingPlan('credit_topup_50') ? '…' : 'Buy top-up'}
                  </button>
                </div>
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-[28px] bg-[#35BEBC] px-7 py-6 text-[#1A1E3A] sm:px-8 sm:py-7 xl:rounded-[32px] xl:px-10 xl:py-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A] xl:text-[12px]">
                  For teams
                </p>
                <h2 className="mt-2 text-[1.55rem] font-bold tracking-tight xl:text-[1.8rem]">
                  School &amp; Department
                </h2>
                <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-black xl:max-w-[42ch] xl:text-[15px]">
                  Department from {formatMoney(departmentUsd, currency)}/yr · School from{' '}
                  {formatMoney(schoolUsd, currency)}/yr.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 xl:mt-8">
                <button
                  type="button"
                  disabled={loadingPlan('department')}
                  onClick={() => void startCheckout('department')}
                  className="rounded-full bg-[#1A1E3A] px-3.5 py-1.5 text-[12px] font-semibold text-white disabled:opacity-60 xl:px-4 xl:py-2 xl:text-[13px]"
                >
                  {loadingPlan('department') ? '…' : 'Department'}
                </button>
                <button
                  type="button"
                  disabled={loadingPlan('school')}
                  onClick={() => void startCheckout('school')}
                  className="rounded-full border border-[#1A1E3A]/40 bg-white/20 px-3.5 py-1.5 text-[12px] font-semibold text-[#1A1E3A] disabled:opacity-60 xl:px-4 xl:py-2 xl:text-[13px]"
                >
                  {loadingPlan('school') ? '…' : 'School'}
                </button>
                <span className="text-[11px] font-medium text-black xl:text-[12px]">
                  ~{formatMoney(schoolSeatPrice, currency)} / seat / mo
                </span>
              </div>
            </article>
          </div>
        </section>
      </div>
      </div>

      <PlanFitCalculator startCheckout={startCheckout} loadingPlan={loadingPlan} billing={billing} />
      <HowCreditsWork />
      <PlanCompare />
      <SchoolsDepartments startCheckout={startCheckout} loadingPlan={loadingPlan} />
      <PricingFaq />
    </PageShell>
  )
}

const STAGE_LABELS = {
  1: '1 stage',
  2: '2 stages',
  3: '3 stages',
  4: 'Full pack (4)',
}

const WEEKS_PER_MONTH = 52 / 12

function PlanFitCalculator({ startCheckout, loadingPlan, billing }) {
  const [lessonsPerWeek, setLessonsPerWeek] = useState(4)
  const [stagesPerLesson, setStagesPerLesson] = useState(4)

  const creditsPerMonth = useMemo(
    () => Math.round(lessonsPerWeek * WEEKS_PER_MONTH * stagesPerLesson),
    [lessonsPerWeek, stagesPerLesson],
  )

  const hoursSaved = useMemo(() => Math.round(creditsPerMonth * 0.75), [creditsPerMonth])

  const recommendation = useMemo(() => {
    if (creditsPerMonth <= 5) {
      return {
        plan: 'Free Trial',
        blurb: `Around ${creditsPerMonth} credits a month — the Free Trial is enough to try this workload.`,
        cta: 'Start free',
        href: MML_APP.signUp,
        planKey: null,
      }
    }
    if (creditsPerMonth > 120) {
      return {
        plan: 'School & Department',
        blurb: `Around ${creditsPerMonth} credits a month — a team plan is the best fit for this workload.`,
        cta: 'Subscribe School',
        href: null,
        planKey: 'school',
      }
    }
    return {
      plan: 'Individual',
      blurb: `Around ${creditsPerMonth} credits a month — the Individual plan is the best fit for this workload.`,
      cta: 'Choose Individual',
      href: null,
      planKey: billing === 'annual' ? 'individual_annual' : 'individual_monthly',
    }
  }, [billing, creditsPerMonth])

  return (
    <section
      id="plan-fit"
      className="pricing-plan-fit-section relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#aae4e3] py-14 sm:mt-14 sm:py-20"
      aria-labelledby="plan-fit-heading"
    >
      <div className="pricing-plan-fit-inner">
        <header className="pricing-plan-fit-header mx-auto flex flex-col items-center text-center">
          <p className="mb-4 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
            </span>
            Which plan fits you?
          </p>
          <h2
            id="plan-fit-heading"
            className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-[#1A1E3A] xl:text-[clamp(2rem,3.2vw,3rem)]"
          >
            Slide it. We&apos;ll do{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              the maths.
            </span>
          </h2>
          <p className="pricing-plan-fit-lead mx-auto mt-4 text-[15px] leading-relaxed text-[#1a2438]/75 sm:text-base xl:max-w-none xl:whitespace-nowrap xl:text-[17px]">
            Estimate your monthly credit use from the number of lessons you prepare and how much of
            the pack you usually generate.
          </p>
        </header>

        <div className="pricing-plan-fit-card mt-7 overflow-hidden rounded-[32px] bg-white shadow-[0_8px_40px_rgba(15,27,45,0.08)] sm:mt-8 lg:grid lg:grid-cols-[1.15fr_0.95fr] xl:rounded-[36px] 2xl:grid-cols-[1.2fr_1fr]">
          {/* Inputs */}
          <div className="pricing-plan-fit-inputs flex flex-col justify-center gap-8 px-7 py-7 sm:gap-9 sm:px-10 sm:py-9 xl:gap-11 xl:px-14 xl:py-12 2xl:px-16 2xl:py-14">
            <PricingSlider
              id="lessons-per-week"
              label="Lessons per week"
              min={1}
              max={12}
              step={1}
              value={lessonsPerWeek}
              displayValue={String(lessonsPerWeek)}
              onChange={setLessonsPerWeek}
            />
            <PricingSlider
              id="stages-per-lesson"
              label="Stages per lesson"
              min={1}
              max={4}
              step={1}
              value={stagesPerLesson}
              displayValue={STAGE_LABELS[stagesPerLesson]}
              onChange={setStagesPerLesson}
            />
          </div>

          {/* Result */}
          <div className="pricing-plan-fit-result flex flex-col justify-center bg-[#1A1E3A] px-7 py-9 text-white sm:px-10 sm:py-11 xl:px-14 xl:py-12 2xl:px-16 2xl:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC] xl:text-[12px]">
              Your best fit
            </p>
            <h3 className="mt-3 text-[2rem] font-bold tracking-tight sm:text-[2.35rem] xl:text-[2.75rem] 2xl:text-[3rem]">
              {recommendation.plan}
            </h3>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white sm:text-[15px] xl:max-w-xl xl:text-[16px] 2xl:max-w-2xl 2xl:text-[17px]">
              {recommendation.blurb}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 xl:mt-8 xl:gap-3">
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white xl:px-4 xl:py-2 xl:text-[13px]">
                Credits / month: {creditsPerMonth}
              </span>
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white xl:px-4 xl:py-2 xl:text-[13px]">
                Est. hours saved: {hoursSaved}
              </span>
            </div>
            {recommendation.href ? (
              <Link
                href={recommendation.href}
                className="mt-8 inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[#35BEBC] px-8 py-3.5 text-center text-[15px] font-bold text-white no-underline transition hover:bg-[#4ec9c7] xl:max-w-[300px] xl:px-10 xl:py-4 xl:text-[16px]"
              >
                {recommendation.cta}
              </Link>
            ) : (
              <button
                type="button"
                disabled={recommendation.planKey ? loadingPlan(recommendation.planKey) : false}
                onClick={() =>
                  recommendation.planKey
                    ? void startCheckout(recommendation.planKey)
                    : undefined
                }
                className="mt-8 inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[#35BEBC] px-8 py-3.5 text-center text-[15px] font-bold text-white transition hover:bg-[#4ec9c7] disabled:opacity-60 xl:max-w-[300px] xl:px-10 xl:py-4 xl:text-[16px]"
              >
                {recommendation.planKey && loadingPlan(recommendation.planKey)
                  ? 'Redirecting to PayPal…'
                  : recommendation.cta}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSlider({ id, label, min, max, step, value, displayValue, onChange }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-semibold text-[#1A1E3A]">
          {label}
        </label>
        <span className="shrink-0 text-[15px] font-semibold text-[#35BEBC]">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="pricing-range"
        style={{ '--pricing-range-pct': `${pct}%` }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
      />
    </div>
  )
}

function CurrencySelect({ currencyCode, setCurrencyCode }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <span className="sr-only">Currency</span>
      <select
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
        className="appearance-none rounded-full border-0 bg-white py-2.5 pl-5 pr-10 text-sm font-semibold text-[#1A1E3A] shadow-[0_1px_2px_rgba(18,21,42,0.06)] outline-none ring-0 focus:ring-2 focus:ring-[#35BEBC]/45"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} {c.symbol}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 h-4 w-4 text-black"
        aria-hidden
      />
    </label>
  )
}

const CREDIT_STAGES = [
  { stage: 'Stage 1', title: 'Lesson Plan', tone: 'mint' },
  { stage: 'Stage 2', title: 'Slides + Notes', tone: 'navy' },
  { stage: 'Stage 3', title: 'Activity + Key', tone: 'navy' },
  { stage: 'Stage 4', title: 'Test + Mark Scheme', tone: 'mint' },
]

function HowCreditsWork() {
  return (
    <section
      id="how-credits-work"
      className="pricing-how-credits relative z-[1] pb-10 pt-10 sm:pb-12 sm:pt-14"
      aria-labelledby="how-credits-heading"
    >
      <div className="pricing-section-inner mx-auto grid w-full max-w-none gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5 lg:items-stretch xl:gap-6 2xl:gap-8">
        <article className="relative flex min-h-[320px] flex-col overflow-hidden rounded-[32px] bg-[#1A1E3A] p-8 text-white sm:min-h-[380px] sm:p-10 xl:min-h-[420px] xl:rounded-[36px] xl:p-12 2xl:min-h-[460px] 2xl:p-14">
          <div
            className="pointer-events-none absolute -bottom-36 -right-28 h-[260px] w-[260px] rounded-full bg-[#35BEBC] sm:-bottom-40 sm:-right-32 xl:h-[300px] xl:w-[300px]"
            aria-hidden
          />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-white xl:text-[12px]">
            How credits work
          </p>
          <h2
            id="how-credits-heading"
            className="relative mt-5 max-w-[16ch] text-[clamp(1.65rem,3.2vw,2.35rem)] font-bold leading-[1.15] tracking-tight xl:max-w-[18ch] xl:text-[clamp(1.9rem,2.8vw,2.65rem)]"
          >
            One credit, one stage. Four credits, the complete pack.
          </h2>
          <p className="relative mt-4 max-w-md text-[14px] leading-relaxed text-white sm:text-[15px] xl:max-w-lg xl:text-[16px] 2xl:max-w-xl 2xl:text-[17px]">
            Generate only what you need — or run all four stages to create the full seven-document
            teaching pack.
          </p>
          <div className="relative mt-auto flex gap-3 pt-10 xl:gap-3.5 xl:pt-12" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className="pricing-credit-chip inline-flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-[#1A1E3A] shadow-[0_6px_16px_rgba(18,21,42,0.25)] xl:h-12 xl:w-12 xl:text-[16px]"
              >
                1
              </span>
            ))}
          </div>
        </article>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 xl:gap-5 2xl:gap-6">
          {CREDIT_STAGES.map((item) => {
            const mint = item.tone === 'mint'
            return (
              <article
                key={item.stage}
                className={cn(
                  'flex min-h-[150px] flex-col justify-between rounded-[28px] p-6 sm:min-h-[170px] sm:p-7 xl:min-h-[190px] xl:rounded-[32px] xl:p-8 2xl:min-h-[210px] 2xl:p-9',
                  mint ? 'bg-[#b8ebe4] text-[#1A1E3A]' : 'bg-[#1A1E3A] text-white',
                )}
              >
                <span
                  className={cn(
                    'inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold xl:px-3.5 xl:text-[12px]',
                    mint ? 'bg-white/70 text-[#1A1E3A]' : 'bg-white/10 text-white',
                  )}
                >
                  {item.stage}
                </span>
                <div>
                  <h3 className="text-[1.35rem] font-bold leading-tight tracking-tight sm:text-[1.5rem] xl:text-[1.65rem] 2xl:text-[1.75rem]">
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-3 text-[14px] font-semibold xl:text-[15px]',
                      mint ? 'text-black' : 'text-white',
                    )}
                  >
                    1 credit
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const COMPARE_ROWS = [
  {
    feature: 'Credits included',
    free: { type: 'text', value: '5 one-time' },
    individual: { type: 'text', value: '100 / month' },
    school: { type: 'text', value: 'Pooled' },
  },
  {
    feature: '71 Curriculums',
    free: { type: 'yes' },
    individual: { type: 'yes' },
    school: { type: 'yes' },
  },
  {
    feature: 'Ayla AI co-pilot',
    free: { type: 'no' },
    individual: { type: 'yes' },
    school: { type: 'yes' },
  },
  {
    feature: 'Export Options',
    free: { type: 'no' },
    individual: { type: 'yes' },
    school: { type: 'yes' },
  },
  {
    feature: 'Support',
    free: { type: 'text', value: 'Email' },
    individual: { type: 'text', value: 'Priority' },
    school: { type: 'text', value: 'Dedicated' },
  },
]

function CompareCell({ cell }) {
  if (cell.type === 'yes') {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#35BEBC] text-[#1A1E3A]"
        aria-label="Included"
      >
        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
      </span>
    )
  }
  if (cell.type === 'no') {
    return (
      <span className="text-[18px] font-semibold leading-none text-[#1A1E3A]/45" aria-label="Not included">
        —
      </span>
    )
  }
  return (
    <span className="text-[14px] font-semibold text-[#1A1E3A] sm:text-[15px]">{cell.value}</span>
  )
}

function PlanCompare() {
  return (
    <section
      id="plan-compare"
      className="pricing-compare-section relative left-1/2 mb-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#1A1E3A] py-14 sm:mb-14 sm:py-16 lg:py-20"
      aria-labelledby="plan-compare-heading"
    >
      <div className="pricing-section-inner">
        <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            Side by side
          </p>
          <h2
            id="plan-compare-heading"
            className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-white"
          >
            Every plan, on{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              one sheet.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white sm:text-[15px]">
            Compare the essentials without opening four separate pricing cards.
          </p>
        </header>

        <div className="mt-10 overflow-x-auto rounded-[28px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:mt-12">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e8eef5] bg-[#f4fbfb]">
                {['Feature', 'Free', 'Individual', 'School'].map((label, i) => (
                  <th
                    key={label}
                    scope="col"
                    className={cn(
                      'px-5 py-4 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1A1E3A] sm:px-7 sm:py-5',
                      i === 0 ? 'text-left' : 'text-center',
                      i === 2 && 'bg-[#35BEBC]/15',
                    )}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, rowIndex) => (
                <tr
                  key={row.feature}
                  className={cn(
                    'border-b border-[#e8eef5] last:border-b-0',
                    rowIndex % 2 === 1 && 'bg-[#f8fafc]',
                  )}
                >
                  <th
                    scope="row"
                    className="px-5 py-4 text-[14px] font-semibold text-[#1A1E3A] sm:px-7 sm:py-5 sm:text-[15px]"
                  >
                    {row.feature}
                  </th>
                  <td className="px-5 py-4 text-center sm:px-7 sm:py-5">
                    <span className="inline-flex justify-center">
                      <CompareCell cell={row.free} />
                    </span>
                  </td>
                  <td className="bg-[#35BEBC]/08 px-5 py-4 text-center sm:px-7 sm:py-5">
                    <span className="inline-flex justify-center">
                      <CompareCell cell={row.individual} />
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center sm:px-7 sm:py-5">
                    <span className="inline-flex justify-center">
                      <CompareCell cell={row.school} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const SCHOOL_FEATURES = [
  'Admin dashboard with teacher usage',
  'Pooled credits across the team',
  'Shared department library',
  'Centralised billing and invoicing',
]

const SCHOOL_TEACHERS = [
  { initials: 'SR', name: 'S. Rahman', pct: 82, avatar: 'bg-[#35BEBC] text-white' },
  { initials: 'JT', name: 'J. Torres', pct: 64, avatar: 'bg-[#dce8f5] text-[#1A1E3A]' },
  { initials: 'AK', name: 'A. Khan', pct: 91, avatar: 'bg-[#d4c8e8] text-[#1A1E3A]' },
  { initials: 'MC', name: 'M. Chen', pct: 42, avatar: 'bg-[#f0dcc8] text-[#1A1E3A]' },
]

function SchoolsDepartments({ startCheckout, loadingPlan }) {
  return (
    <section
      id="schools-departments"
      className="pricing-schools-section overflow-hidden"
      aria-labelledby="schools-heading"
    >
      <div className="grid lg:grid-cols-2">
        <div className="pricing-schools-copy flex flex-col justify-center bg-[#35BEBC] py-12 sm:py-16 lg:py-20">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" aria-hidden />
            Schools &amp; Departments
          </p>
          <h2
            id="schools-heading"
            className="max-w-[14ch] text-[clamp(1.85rem,3.6vw,2.85rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] xl:max-w-[16ch]"
          >
            One bill. Every teacher covered.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white sm:text-base xl:max-w-lg">
            Bring departments onto one workspace with pooled credits and clear admin visibility
          </p>
          <ul className="mt-8 space-y-3.5">
            {SCHOOL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-[15px] font-medium text-[#1A1E3A]">
                <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#1A1E3A]" strokeWidth={2.75} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={loadingPlan('department')}
              onClick={() => void startCheckout('department')}
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#242845] disabled:opacity-60"
            >
              {loadingPlan('department') ? 'Redirecting…' : 'Subscribe Department'}
            </button>
            <button
              type="button"
              disabled={loadingPlan('school')}
              onClick={() => void startCheckout('school')}
              className="inline-flex items-center justify-center rounded-full border-2 border-[#1A1E3A] bg-transparent px-7 py-3.5 text-[15px] font-bold text-[#1A1E3A] transition hover:bg-[#1A1E3A]/10 disabled:opacity-60"
            >
              {loadingPlan('school') ? 'Redirecting…' : 'Subscribe School'}
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-4 py-3.5 text-[14px] font-semibold text-[#1A1E3A] no-underline underline-offset-2 hover:underline"
            >
              Request a custom quote
            </Link>
          </div>
        </div>

        <div className="pricing-schools-visual flex items-center justify-center bg-[#1A1E3A] py-12 sm:py-16 lg:py-20">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-white/5 p-6 sm:p-7 xl:max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              Department of Science — 5 seats
            </p>
            <ul className="mt-6 space-y-3">
              {SCHOOL_TEACHERS.map((teacher) => (
                <li
                  key={teacher.initials}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5"
                >
                  <div className="mb-2.5 flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                        teacher.avatar,
                      )}
                    >
                      {teacher.initials}
                    </span>
                    <span className="text-[14px] font-semibold text-white">{teacher.name}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#35BEBC]"
                      style={{ width: `${teacher.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

const PRICING_FAQS = [
  {
    q: 'Do unused credits expire?',
    a: 'Free trial credits do not expire. Individual plan credits roll over for one month. Add-on credit packs do not expire. Confirm the final commercial policy before publishing.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Individual plans can be cancelled any time from your account. You keep access through the end of the current billing period. School plans follow the terms on your quote or invoice.',
  },
  {
    q: 'What counts as one credit?',
    a: 'One credit generates one stage — lesson plan, slides, activity pack, or assessment. A full four-stage teaching pack uses four credits.',
  },
  {
    q: 'Do you support school purchase orders?',
    a: 'Yes. Schools and departments can request a quote and pay by purchase order or invoice. Contact us and we will set up seats and billing for your team.',
  },
  {
    q: 'Which currencies can I pay in?',
    a: 'Prices are set in USD and shown in local equivalents at checkout, including AUD, GBP, CAD, and EUR. The underlying plan price is the same globally.',
  },
]

function PricingFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section
      id="pricing-faq"
      className="pricing-faq-section relative left-1/2 mt-10 mb-0 w-screen max-w-[100vw] -translate-x-1/2 bg-[#1A1E3A] py-14 sm:mt-14 sm:py-16 lg:py-20"
      aria-labelledby="pricing-faq-heading"
    >
      <div className="pricing-faq-inner">
        <header className="min-w-0">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
            Pricing questions
          </p>
          <h2 id="pricing-faq-heading" className="pricing-faq-heading">
            Before you ask the{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              bursar...
            </span>
          </h2>
          <p className="pricing-faq-copy">
            Clear answers to the practical questions teachers and schools usually ask before
            upgrading.
          </p>
        </header>

        <div className="pricing-faq-list">
          {PRICING_FAQS.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={item.q} className="pricing-faq-item">
                <button
                  type="button"
                  className="pricing-faq-trigger"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="pricing-faq-question">{item.q}</span>
                  <span
                    className={cn(
                      'relative h-4 w-4 shrink-0 text-[#35BEBC] transition-transform duration-300 ease-out',
                      open && 'rotate-180',
                    )}
                    aria-hidden
                  >
                    <Plus
                      className={cn(
                        'absolute inset-0 h-4 w-4 transition-opacity duration-300 ease-out',
                        open ? 'opacity-0' : 'opacity-100',
                      )}
                      strokeWidth={2.5}
                    />
                    <Minus
                      className={cn(
                        'absolute inset-0 h-4 w-4 transition-opacity duration-300 ease-out',
                        open ? 'opacity-100' : 'opacity-0',
                      )}
                      strokeWidth={2.5}
                    />
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className={cn(
                        'pricing-faq-answer transition-opacity duration-300 ease-out',
                        open ? 'pb-5 opacity-100 sm:pb-6' : 'pb-0 opacity-0',
                      )}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


