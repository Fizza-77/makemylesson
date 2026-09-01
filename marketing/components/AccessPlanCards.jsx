import Link from 'next/link'
import { CalendarDays, Check } from 'lucide-react'
import FreePlanFeaturesScroll from '@marketing/components/FreePlanFeaturesScroll'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'

/** Every paid plan carries the same feature set — only the credit volume changes. */
const PAID_PLAN_POINTS = [
  'Every feature is on every plan.',
  'Longer plans cost less each month.',
  'Nothing else changes.',
]

const FREE_PLAN_FEATURES = [
  'Stage 1 — AI Lesson Plans',
  'Stage 2 — AI Presentations + Speaker Notes',
  'AI-Generated Slide Images',
  'Stage 3 — AI Classroom Activities',
  'Student Worksheet + Teacher Answer Key',
  'Stage 4 — AI Summative Assessments',
  'Student Paper + Mark Scheme',
  '5 Curriculum Families — Australia, UK, Canada, IB & US/AP',
  '16 Teaching Methods',
  'Favourites',
  'Unlimited Manual Editing — No Credits Required',
  'Unlimited Ayla Refinements — No Credits Required',
  'Export to PDF',
  'Export to PowerPoint (PPTX)',
  'Download Complete Teaching Pack (ZIP)',
  'Print',
  'Share to Google Classroom',
  'Share to Microsoft Teams',
  'Share to Other Apps',
]

/**
 * Base plan data in USD — convert with `localizeAccessPlans(currency)`.
 * `discountLabel` comes from the pricing sheet rather than being derived, so the
 * published percentages stay exact after currency conversion.
 */
export const ACCESS_PLANS = [
  {
    key: 'free',
    name: 'Free',
    generations: 5,
    tone: 'teal',
    priceUsd: 0,
    priceLabel: 'Free',
    priceNote: 'Forever Free',
    includedTitle: 'Included on every plan',
    features: FREE_PLAN_FEATURES,
    cta: 'Get Started',
    href: MML_APP.signUp,
  },
  {
    key: 'monthly',
    name: 'Monthly',
    generations: 30,
    tone: 'navy',
    wasPriceUsd: 15.99,
    priceUsd: 9.99,
    discountLabel: '37% OFF',
    features: PAID_PLAN_POINTS,
    cta: 'Choose Monthly',
    planKey: 'individual_monthly',
  },
  {
    key: '3mo',
    name: '3 Months',
    generations: 90,
    tone: 'indigo',
    wasPriceUsd: 47.97,
    priceUsd: 27,
    discountLabel: '44% OFF',
    features: PAID_PLAN_POINTS,
    spreadNote: 'Use your generations in one month or spread them across 3 months.',
    cta: 'Choose 3 Months',
    planKey: 'individual_monthly',
  },
  {
    key: '6mo',
    name: '6 Months',
    generations: 180,
    tone: 'teal',
    popular: true,
    wasPriceUsd: 95.94,
    priceUsd: 50,
    discountLabel: '48% OFF',
    features: PAID_PLAN_POINTS,
    spreadNote: 'Use your generations in one month or spread them across 6 months.',
    cta: 'Choose 6 Months',
    planKey: 'individual_monthly',
  },
  {
    key: 'annual',
    name: 'Annual',
    generations: 360,
    tone: 'navy',
    wasPriceUsd: 191.98,
    priceUsd: 90,
    discountLabel: '53% OFF',
    features: PAID_PLAN_POINTS,
    spreadNote: 'Use your generations in one month or spread them across 12 months.',
    cta: 'Choose Annual',
    planKey: 'individual_annual',
  },
]

export function formatPlanMoney(usdAmount, currency) {
  const value = usdAmount * currency.rate
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 100) / 100
  const display =
    Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.00$/, '')
  return `${currency.symbol}${display}`
}

/** Struck-through list prices keep their cents, so `$15.99` never reads as `$16`. */
export function formatPlanMoneyExact(usdAmount, currency) {
  const value = Math.round(usdAmount * currency.rate * 100) / 100
  const display = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return `${currency.symbol}${display}`
}

export function localizeAccessPlans(currency) {
  return ACCESS_PLANS.map((plan) => ({
    ...plan,
    currencyCode: currency.code,
    price: plan.priceLabel ?? formatPlanMoney(plan.priceUsd, currency),
    wasPrice:
      plan.wasPriceUsd != null ? formatPlanMoneyExact(plan.wasPriceUsd, currency) : undefined,
  }))
}

export function AccessPlanCard({
  plan,
  onCheckout = undefined,
  checkoutLoading = false,
  short = false,
}) {
  const ctaLabel = checkoutLoading ? 'Redirecting…' : plan.cta
  const isFree = !plan.wasPrice

  const renderFeatures = (items, compact = false) => (
    <ul className={cn('mml-pr-features', compact && 'mml-pr-features--compact')}>
      {items.map((feature) => (
        <li key={feature}>
          <span className="mml-pr-feature-icon" aria-hidden>
            <Check size={compact ? 9 : 11} strokeWidth={3.5} />
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <article
      className={cn(
        'mml-pr-card',
        `mml-pr-card--${plan.tone}`,
        plan.popular && 'mml-pr-card--popular',
        isFree && 'mml-pr-card--free',
        short && 'mml-pr-card--short',
      )}
    >
      {plan.popular ? <span className="mml-pr-badge">Most popular</span> : null}

      <header className="mml-pr-head">
        <span className="mml-pr-head-count">{plan.generations}</span>
        <span className="mml-pr-head-label">Generations</span>
      </header>

      <div className="mml-pr-body">
        <h3 className="mml-pr-name">{plan.name}</h3>

        <div className="mml-pr-price-block">
          <div className="mml-pr-was-slot">
            {plan.wasPrice ? (
              <span className="mml-pr-was">
                {plan.wasPrice}{' '}
                <span className="mml-pr-was-code">{plan.currencyCode}</span>
              </span>
            ) : null}
          </div>

          <p className="mml-pr-price">
            <span className="mml-pr-price-main">{plan.price}</span>
            {isFree ? null : (
              <span className="mml-pr-price-suffix">{plan.currencyCode}</span>
            )}
          </p>

          <div className="mml-pr-price-meta">
            {plan.discountLabel ? (
              <span className="mml-pr-discount">{plan.discountLabel}</span>
            ) : null}
            {plan.priceNote ? (
              <p className="mml-pr-price-note">{plan.priceNote}</p>
            ) : null}
          </div>
        </div>

        {short ? null : (
          <>
            {plan.includedTitle ? (
              <p className="mml-pr-included">{plan.includedTitle}</p>
            ) : null}

            {isFree ? (
              <FreePlanFeaturesScroll features={plan.features} />
            ) : (
              renderFeatures(plan.features)
            )}

            {plan.spreadNote ? (
              <p className="mml-pr-spread">
                <CalendarDays size={15} strokeWidth={2.2} aria-hidden />
                <span>{plan.spreadNote}</span>
              </p>
            ) : null}
          </>
        )}

        {/* Wrapper keeps the button bottom-aligned across cards of unequal height. */}
        <div className="mml-pr-cta-wrap">
          {plan.planKey && onCheckout ? (
            <button
              type="button"
              disabled={checkoutLoading}
              onClick={() => onCheckout(plan.planKey)}
              className="mml-pr-cta"
            >
              {ctaLabel}
            </button>
          ) : (
            <Link href={plan.href || MML_APP.pricing} className="mml-pr-cta">
              {plan.cta}
            </Link>
          )}
        </div>
      </div>

      {short ? null : <p className="mml-pr-foot">Affordable education for all</p>}
    </article>
  )
}

