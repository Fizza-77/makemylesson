'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Check, ChevronDown, Folder, Library, Minus, Plus, Users } from 'lucide-react'
import { PageShell } from '@marketing/components/layout/Container'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'
import { usePayPalCheckout } from '@/features/billing/usePayPalCheckout'
import {
  currencySymbol,
  formatUsdPrice,
  priceForPlan,
} from '@/services/paypal-checkout.service'

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CAD', symbol: 'C$', rate: 1.37 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
]

const INDIVIDUAL_FEATURES = [
  'Everything in Free',
  'Ayla AI co-pilot on every stage',
  'Google Classroom & Teams export',
  'Priority generation queue',
]

function formatMoney(usdAmount, currency) {
  const value = usdAmount * currency.rate
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 100) / 100
  const display =
    Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.00$/, '')
  return `${currency.symbol} ${display}`
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <PageShell variant="content" className="pricing-page-shell !bg-white border-t-transparent">
          <div className="flex min-h-[40vh] items-center justify-center text-[#1A1E3A]">
            Loading pricing…
          </div>
        </PageShell>
      }
    >
      <PricingPageInner />
    </Suspense>
  )
}

function PricingPageInner() {
  const [billing, setBilling] = useState('monthly')
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

  const symbol = currencySymbol(quote)
  const monthlyUsd = Number.parseFloat(priceForPlan(quote, 'individual_monthly')) || 12.99
  const annualUsd = Number.parseFloat(priceForPlan(quote, 'individual_annual')) || 99.99
  const topUpUsd = Number.parseFloat(priceForPlan(quote, 'credit_topup_50')) || 29.99
  const departmentUsd = Number.parseFloat(priceForPlan(quote, 'department')) || 349
  const schoolUsd = Number.parseFloat(priceForPlan(quote, 'school')) || 599

  const individualPrice = billing === 'annual' ? annualUsd / 12 : monthlyUsd
  const schoolSeatPrice = billing === 'annual' ? schoolUsd / 10 / 12 : schoolUsd / 10 / 12
  const addonPrice = topUpUsd

  const individualPlanKey = billing === 'annual' ? 'individual_annual' : 'individual_monthly'

  return (
    <PageShell
      variant="content"
      className="pricing-page-shell !bg-white border-t-transparent"
      contentClassName="pricing-page-inner !py-0 !pt-2 pb-10 md:pb-14"
    >
      {finalizing ? (
        <div className="mx-auto mb-4 max-w-[1100px] rounded-2xl border border-[#35BEBC]/40 bg-[#EAF5F6] px-4 py-3 text-center text-[14px] font-medium text-[#1A1E3A]">
          Confirming your PayPal payment…
        </div>
      ) : null}

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
          className="pricing-hero relative z-[1] flex flex-col items-center px-5 pb-8 pt-10 text-center sm:px-8 sm:pb-10 sm:pt-12 md:px-12"
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

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#1a2438]/80 sm:text-base">
              Start free with 5 credits. Upgrade only when you are generating every week. No card
              required to try the full workflow.
            </p>
            {quoteLoading ? (
              <p className="mt-2 text-[12px] text-[#1A1E3A]/55">Loading live prices…</p>
            ) : quote?.regionLine ? (
              <p className="mt-2 text-[12px] text-[#1A1E3A]/55">{quote.regionLine}</p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <BillingToggle billing={billing} setBilling={setBilling} />
              <CurrencySelect currencyCode={currencyCode} setCurrencyCode={setCurrencyCode} />
            </div>
          </div>
        </section>

        {/* Plans */}
        <section
          id="pricing-plans"
          className="pricing-plans relative z-[1] px-4 pb-12 pt-0 sm:px-7 sm:pb-14 md:px-10 lg:px-14"
          aria-label="Pricing plans"
        >
          <div className="mx-auto grid max-w-[1100px] items-stretch gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5">
            {/* Individual */}
            <article className="relative flex min-h-full flex-col overflow-hidden rounded-[32px] bg-[#1A1E3A] p-8 text-left text-white sm:p-10">
              <div
                className="pointer-events-none absolute -bottom-24 -right-16 h-[280px] w-[280px] rounded-full bg-[#35BEBC]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-[#7dded8]/40"
                aria-hidden
              />

              <span className="relative mb-6 inline-flex w-fit rounded-full bg-[#35BEBC] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1A1E3A]">
                Most popular
              </span>

              <h2 className="relative text-[2rem] font-bold leading-none tracking-tight sm:text-[2.35rem]">
                Individual
              </h2>
              <p className="relative mt-3 max-w-[34ch] text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
                For teachers planning every week who want the complete workflow in one place.
              </p>

              <p className="relative mt-7 text-[2.5rem] font-bold leading-none tracking-tight sm:text-[2.75rem]">
                {currencyCode === 'USD'
                  ? formatUsdPrice(String(individualPrice), symbol)
                  : formatMoney(individualPrice, currency)}
                <span className="ml-1.5 text-[1.05rem] font-medium text-white/50">
                  / {billing === 'annual' ? 'mo' : 'month'}
                </span>
              </p>
              {billing === 'annual' ? (
                <p className="relative mt-2 text-sm text-[#35BEBC]">
                  Billed annually · {formatUsdPrice(String(annualUsd), symbol)}/year
                </p>
              ) : null}

              <span className="relative mt-5 inline-flex w-fit rounded-full border border-white/25 bg-[#1A1E3A]/40 px-3.5 py-1.5 text-[12px] font-medium text-[#35BEBC]">
                30 credits / month — complete packs across all stages
              </span>

              <ul className="relative mt-8 space-y-3.5 text-[14px] text-white/90 sm:text-[15px]">
                {INDIVIDUAL_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#35BEBC]" strokeWidth={2.75} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={loadingPlan(individualPlanKey)}
                onClick={() => void startCheckout(individualPlanKey)}
                className="relative mt-10 inline-flex w-full max-w-[280px] items-center justify-center rounded-2xl bg-[#35BEBC] px-8 py-3.5 text-center text-[15px] font-bold text-white transition hover:bg-[#4ec9c7] disabled:opacity-60 sm:mt-auto"
              >
                {loadingPlan(individualPlanKey) ? 'Redirecting to PayPal…' : 'Choose Individual'}
              </button>
            </article>

            {/* Side stack — equal height fill */}
            <div className="flex min-h-0 flex-col gap-4">
              <article className="flex flex-1 flex-col justify-between rounded-[28px] border border-black/[0.04] bg-white px-7 py-6 text-[#1A1E3A] sm:px-8 sm:py-7">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b93a7]">
                    Start here
                  </p>
                  <h2 className="mt-2 text-[1.55rem] font-bold tracking-tight">Free Trial</h2>
                  <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-[#5c657a]">
                    Try the full workflow with no card required.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                  <span className="text-[1.85rem] font-bold leading-none">Free</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#d5dae5] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#3a4258]">
                      5 credits
                    </span>
                    <Link
                      href={MML_APP.signUp}
                      className="rounded-full bg-[#1A1E3A] px-3.5 py-1.5 text-[12px] font-semibold text-white no-underline"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </article>

              <article className="flex flex-1 flex-col justify-between rounded-[28px] bg-[#1A1E3A] px-7 py-6 text-white sm:px-8 sm:py-7">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    Need more?
                  </p>
                  <h2 className="mt-2 text-[1.55rem] font-bold tracking-tight">Add-On Credits</h2>
                  <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-white/50">
                    Top up any plan without changing your subscription.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                  <span className="text-[1.85rem] font-bold leading-none">
                    {currencyCode === 'USD'
                      ? formatUsdPrice(String(addonPrice), symbol)
                      : formatMoney(addonPrice, currency)}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/35 px-3.5 py-1.5 text-[12px] font-semibold text-white">
                      50 credits
                    </span>
                    <button
                      type="button"
                      disabled={loadingPlan('credit_topup_50')}
                      onClick={() => void startCheckout('credit_topup_50')}
                      className="rounded-full bg-[#35BEBC] px-3.5 py-1.5 text-[12px] font-semibold text-[#1A1E3A] disabled:opacity-60"
                    >
                      {loadingPlan('credit_topup_50') ? '…' : 'Buy top-up'}
                    </button>
                  </div>
                </div>
              </article>

              <article className="flex flex-1 flex-col justify-between rounded-[28px] bg-[#35BEBC] px-7 py-6 text-white sm:px-8 sm:py-7">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                    For teams
                  </p>
                  <h2 className="mt-2 text-[1.55rem] font-bold tracking-tight">
                    School &amp; Department
                  </h2>
                  <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-white/85">
                    Department from {formatUsdPrice(String(departmentUsd), symbol)}/yr · School from{' '}
                    {formatUsdPrice(String(schoolUsd), symbol)}/yr.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={loadingPlan('department')}
                    onClick={() => void startCheckout('department')}
                    className="rounded-full bg-[#1A1E3A] px-3.5 py-1.5 text-[12px] font-semibold text-white disabled:opacity-60"
                  >
                    {loadingPlan('department') ? '…' : 'Department'}
                  </button>
                  <button
                    type="button"
                    disabled={loadingPlan('school')}
                    onClick={() => void startCheckout('school')}
                    className="rounded-full border border-[#1A1E3A]/40 bg-white/20 px-3.5 py-1.5 text-[12px] font-semibold text-[#1A1E3A] disabled:opacity-60"
                  >
                    {loadingPlan('school') ? '…' : 'School'}
                  </button>
                  <span className="text-[11px] font-medium text-[#1A1E3A]/70">
                    ~{formatMoney(schoolSeatPrice, currency)} / seat / mo
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <PlanFitCalculator startCheckout={startCheckout} loadingPlan={loadingPlan} billing={billing} />
      <HowCreditsWork />
      <PlanCompare />
      <SchoolsDepartments startCheckout={startCheckout} loadingPlan={loadingPlan} />
      <PricingFaq />
      <StartFreeCta />
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
      <div className="pricing-plan-fit-inner mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
        <header className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
            </span>
            Which plan fits you?
          </p>
          <h2
            id="plan-fit-heading"
            className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-[#1A1E3A]"
          >
            Slide it. We&apos;ll do{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              the maths.
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#1a2438]/75 sm:text-base">
            Estimate your monthly credit use from the number of lessons you prepare and how much of
            the pack you usually generate.
          </p>
        </header>

        <div className="mt-7 overflow-hidden rounded-[32px] bg-white shadow-[0_8px_40px_rgba(15,27,45,0.08)] sm:mt-8 lg:grid lg:grid-cols-[1.15fr_0.95fr]">
          {/* Inputs */}
          <div className="flex flex-col justify-center gap-8 px-7 py-7 sm:gap-9 sm:px-10 sm:py-9">
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
          <div className="flex flex-col justify-center bg-[#1A1E3A] px-7 py-9 text-white sm:px-10 sm:py-11">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
              Your best fit
            </p>
            <h3 className="mt-3 text-[2rem] font-bold tracking-tight sm:text-[2.35rem]">
              {recommendation.plan}
            </h3>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
              {recommendation.blurb}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white/85">
                Credits / month: {creditsPerMonth}
              </span>
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white/85">
                Est. hours saved: {hoursSaved}
              </span>
            </div>
            {recommendation.href ? (
              <Link
                href={recommendation.href}
                className="mt-8 inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[#35BEBC] px-8 py-3.5 text-center text-[15px] font-bold text-white no-underline transition hover:bg-[#4ec9c7]"
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
                className="mt-8 inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[#35BEBC] px-8 py-3.5 text-center text-[15px] font-bold text-white transition hover:bg-[#4ec9c7] disabled:opacity-60"
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

function BillingToggle({ billing, setBilling }) {
  return (
    <div
      className="inline-flex items-center rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(18,21,42,0.06)]"
      role="group"
      aria-label="Billing period"
    >
      <button
        type="button"
        onClick={() => setBilling('monthly')}
        className={cn(
          'rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
          billing === 'monthly'
            ? 'bg-[#1A1E3A] text-white'
            : 'bg-transparent text-[#1A1E3A] hover:bg-black/[0.04]',
        )}
        aria-pressed={billing === 'monthly'}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => setBilling('annual')}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors',
          billing === 'annual'
            ? 'bg-[#1A1E3A] text-white'
            : 'bg-transparent text-[#1A1E3A] hover:bg-black/[0.04]',
        )}
        aria-pressed={billing === 'annual'}
      >
        Annual
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-[10px] font-bold lowercase tracking-wide',
            billing === 'annual' ? 'bg-white/15 text-[#35BEBC]' : 'bg-[#35BEBC] text-[#1A1E3A]',
          )}
        >
          save 20%
        </span>
      </button>
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
        className="pointer-events-none absolute right-3.5 h-4 w-4 text-[#1A1E3A]/65"
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
      className="relative z-[1] px-4 pb-10 pt-10 sm:px-7 sm:pb-12 sm:pt-14 md:px-10 lg:px-14"
      aria-labelledby="how-credits-heading"
    >
      <div className="mx-auto grid max-w-[1100px] gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5 lg:items-stretch">
        <article className="relative flex min-h-[320px] flex-col overflow-hidden rounded-[32px] bg-[#1A1E3A] p-8 text-white sm:min-h-[380px] sm:p-10">
          <div
            className="pointer-events-none absolute -bottom-36 -right-28 h-[260px] w-[260px] rounded-full bg-[#35BEBC] sm:-bottom-40 sm:-right-32"
            aria-hidden
          />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            How credits work
          </p>
          <h2
            id="how-credits-heading"
            className="relative mt-5 max-w-[16ch] text-[clamp(1.65rem,3.2vw,2.35rem)] font-bold leading-[1.15] tracking-tight"
          >
            One credit, one stage. Four credits, the complete pack.
          </h2>
          <p className="relative mt-4 max-w-md text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
            Generate only what you need — or run all four stages to create the full seven-document
            teaching pack.
          </p>
          <div className="relative mt-auto flex gap-3 pt-10" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className="pricing-credit-chip inline-flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-[#1A1E3A] shadow-[0_6px_16px_rgba(18,21,42,0.25)]"
              >
                1
              </span>
            ))}
          </div>
        </article>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
          {CREDIT_STAGES.map((item) => {
            const mint = item.tone === 'mint'
            return (
              <article
                key={item.stage}
                className={cn(
                  'flex min-h-[150px] flex-col justify-between rounded-[28px] p-6 sm:min-h-[170px] sm:p-7',
                  mint ? 'bg-[#b8ebe4] text-[#1A1E3A]' : 'bg-[#1A1E3A] text-white',
                )}
              >
                <span
                  className={cn(
                    'inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold',
                    mint ? 'bg-white/70 text-[#1A1E3A]' : 'bg-white/10 text-white/80',
                  )}
                >
                  {item.stage}
                </span>
                <div>
                  <h3 className="text-[1.35rem] font-bold leading-tight tracking-tight sm:text-[1.5rem]">
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-3 text-[14px] font-semibold',
                      mint ? 'text-[#1A1E3A]/75' : 'text-white/70',
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
    free: { type: 'text', value: '10 one-time' },
    individual: { type: 'text', value: '60 / month' },
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
        className="mx-auto inline-flex h-6 w-9 items-center justify-center rounded-full bg-[#35BEBC]"
        aria-label="Included"
      >
        <span className="h-[2px] w-3 rounded-full bg-white" aria-hidden />
      </span>
    )
  }
  if (cell.type === 'no') {
    return (
      <span className="text-[15px] font-medium text-white/35" aria-label="Not included">
        —
      </span>
    )
  }
  return <span className="text-[14px] font-medium text-white/75 sm:text-[15px]">{cell.value}</span>
}

function PlanCompare() {
  return (
    <section
      id="plan-compare"
      className="pricing-compare-section relative left-1/2 mb-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#1A1E3A] py-14 sm:mb-14 sm:py-16 lg:py-20"
      aria-labelledby="plan-compare-heading"
    >
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
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
          </div>
          <p className="max-w-xs text-[14px] leading-relaxed text-white/50 sm:text-[15px] lg:pb-1 lg:text-right">
            Compare the essentials without opening four separate pricing cards.
          </p>
        </header>

        <div className="mt-10 overflow-x-auto rounded-[28px] border border-white/[0.08] bg-[#222640] sm:mt-12">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {['Feature', 'Free', 'Individual', 'School'].map((label, i) => (
                  <th
                    key={label}
                    scope="col"
                    className={cn(
                      'px-5 py-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:px-7 sm:py-6',
                      i === 0 ? 'text-left' : 'text-center',
                    )}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-white/[0.06] last:border-b-0">
                  <th
                    scope="row"
                    className="px-5 py-5 text-[14px] font-semibold text-white sm:px-7 sm:py-6 sm:text-[15px]"
                  >
                    {row.feature}
                  </th>
                  <td className="px-5 py-5 text-center sm:px-7 sm:py-6">
                    <CompareCell cell={row.free} />
                  </td>
                  <td className="px-5 py-5 text-center sm:px-7 sm:py-6">
                    <CompareCell cell={row.individual} />
                  </td>
                  <td className="px-5 py-5 text-center sm:px-7 sm:py-6">
                    <CompareCell cell={row.school} />
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
        <div className="flex flex-col justify-center bg-[#35BEBC] px-7 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" aria-hidden />
            Schools &amp; Departments
          </p>
          <h2
            id="schools-heading"
            className="max-w-[14ch] text-[clamp(1.85rem,3.6vw,2.85rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            One bill. Every teacher covered.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white sm:text-base">
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

        <div className="flex items-center justify-center bg-[#1A1E3A] px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-white/5 p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
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
      className="pricing-faq-section relative left-1/2 mt-10 mb-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#1A1E3A] py-14 sm:mt-14 sm:mb-14 sm:py-16 lg:py-20"
      aria-labelledby="pricing-faq-heading"
    >
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">
        <header>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
            Pricing questions
          </p>
          <h2
            id="pricing-faq-heading"
            className="max-w-[12ch] text-[clamp(1.85rem,3.8vw,2.85rem)] font-bold leading-[1.12] tracking-tight text-white"
          >
            Before you ask the{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              bursar...
            </span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50 sm:text-base">
            Clear answers to the practical questions teachers and schools usually ask before
            upgrading.
          </p>
        </header>

        <div className="border-t border-white/10">
          {PRICING_FAQS.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={item.q} className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="text-[15px] font-semibold text-white sm:text-base">{item.q}</span>
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
                        'pr-8 text-[14px] leading-relaxed text-white/50 transition-opacity duration-300 ease-out sm:text-[15px]',
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

function StartFreeCta() {
  return (
    <section
      id="start-free"
      className="mt-6 overflow-hidden rounded-[32px] bg-[#ade5df] px-5 py-12 sm:mt-8 sm:rounded-[40px] sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      aria-labelledby="start-free-heading"
    >
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]/45">
            Start free
          </p>
          <h2
            id="start-free-heading"
            className="max-w-[12ch] text-[clamp(2rem,4vw,3.15rem)] font-bold leading-[1.08] tracking-tight text-[#1A1E3A]"
          >
            Try everything before you pay anything.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#1A1E3A]/75 sm:text-base">
            5 free credits — enough to try the full workflow. No card required.
          </p>
          <Link
            href={MML_APP.signUp}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-8 py-3.5 text-[15px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(18,21,42,0.22)] transition hover:bg-[#242845]"
          >
            Start Free
          </Link>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-[540px] sm:h-[400px]">
          {/* School — back right (white) */}
          <article className="absolute right-0 top-8 z-[1] w-[70%] max-w-[235px] rotate-[8deg] rounded-[26px] bg-white p-4 shadow-[0_18px_40px_rgba(26,30,58,0.14)] sm:right-1 sm:top-10 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1A1E3A]/40">
              School
            </p>
            <p className="mt-2 text-[1.65rem] font-bold leading-none text-[#1A1E3A]">Pooled</p>
            <p className="mt-2 text-[11px] leading-snug text-[#1A1E3A]/55">
              Shared credits for whole teaching teams.
            </p>
            <div className="mt-4 rounded-2xl bg-[#eef2f6] p-3">
              <p className="flex items-baseline gap-1.5 font-medium text-[#1A1E3A]/55">
                <span className="text-[1.75rem] font-bold leading-none text-[#1A1E3A]">∞</span>
                <span className="text-[11px]">flexible allocation</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#d7e0e8]">
                <div
                  className="h-full w-[95%] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #1e9a98 0%, #35bebc 50%, #74fffd 100%)',
                  }}
                />
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-[11px] font-medium text-[#1A1E3A]/70">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Users className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Shared team credits
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Library className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                School admin controls
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1E3A]/40">
                For schools
              </span>
              <Link
                href="/contact"
                className="rounded-full bg-[#1A1E3A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white no-underline"
              >
                Contact us
              </Link>
            </div>
          </article>

          {/* Free — mid left (navy) */}
          <article className="absolute left-0 top-12 z-[2] w-[70%] max-w-[235px] -rotate-[9deg] rounded-[26px] bg-[#1A1E3A] p-4 text-white shadow-[0_18px_40px_rgba(26,30,58,0.3)] sm:left-0 sm:top-14 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Free</p>
            <p className="mt-2 text-[1.65rem] font-bold leading-none">10 Credits</p>
            <p className="mt-2 text-[11px] leading-snug text-white/55">
              Explore every stage before upgrading.
            </p>
            <div className="mt-4 rounded-2xl bg-white/[0.06] p-3">
              <p className="flex items-baseline gap-1.5 font-medium text-white/50">
                <span className="text-[1.35rem] font-bold leading-none text-white">10</span>
                <span className="text-[11px]">credits included</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[32%] rounded-full bg-[#35BEBC]" />
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-[11px] font-medium text-white/75">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Folder className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Complete teaching packs
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <BookOpen className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                All creation tools
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                No card required
              </span>
              <Link
                href={MML_APP.signUp}
                className="rounded-full bg-[#35BEBC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A] no-underline"
              >
                Start free
              </Link>
            </div>
          </article>

          {/* Individual — front center (black) */}
          <article className="absolute left-[16%] top-0 z-[3] w-[76%] max-w-[255px] rotate-[2deg] rounded-[28px] bg-[#0a0b12] p-5 text-white shadow-[0_24px_50px_rgba(10,11,18,0.45)] sm:left-[20%] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Individual
            </p>
            <p className="mt-2 text-[1.75rem] font-bold leading-none">
              60
              <span className="ml-1.5 text-[0.95rem] font-semibold text-white/55">/ month</span>
            </p>
            <p className="mt-2 text-[12px] leading-snug text-white/55">
              Built for teachers creating every week.
            </p>
            <div className="mt-4 rounded-2xl bg-white/[0.06] p-3.5">
              <p className="flex items-baseline gap-1.5 font-medium text-white/50">
                <span className="text-[1.35rem] font-bold leading-none text-white">60</span>
                <span className="text-[11px]">monthly credits</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[75%] rounded-full bg-[#35BEBC]" />
              </div>
            </div>
            <ul className="mt-3.5 space-y-2 text-[12px] font-medium text-white/75">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Folder className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Up to 15 complete packs
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Library className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Personal resource library
              </li>
            </ul>
            <div className="mt-5 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                For one teacher
              </span>
              <span className="rounded-full bg-[#35BEBC] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A]">
                Most popular
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
