import Link from 'next/link'
import { Check } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'

/** Base plan data in USD — convert with `localizeAccessPlans(currency)`. */
export const ACCESS_PLANS = [
  {
    key: 'free',
    name: 'Free',
    tone: 'white',
    priceUsd: 0,
    priceNote: 'Forever free',
    features: ['5 total generations', 'All four stages', 'No card required'],
    featureStyle: 'dots',
    cta: 'Get Started',
    href: MML_APP.signUp,
    footnote: 'After 5 gens, upgrade.',
  },
  {
    key: 'monthly',
    name: 'Monthly',
    tone: 'white',
    wasPriceUsd: 14.99,
    priceUsd: 9.99,
    priceSuffix: '/mo',
    priceNote: 'One payment per month of access',
    features: [
      'Total 100 generations for 1 month',
      'Complete teaching packs',
      'Export PDF & Word',
    ],
    featureStyle: 'dots',
    cta: 'Choose Monthly',
    planKey: 'individual_monthly',
    footnote: 'Cancel anytime.',
  },
  {
    key: '3mo',
    name: '3 Months',
    tone: 'white',
    wasPriceUsd: 39.99,
    priceUsd: 26.99,
    perMonthUsd: 8.99,
    priceSuffix: ' total',
    periodLabel: 'one payment per 3 months of access',
    features: [
      'Total 300 generations for 3 months',
      'Everything in Monthly',
      'All creation tools',
    ],
    featureStyle: 'dots',
    cta: 'Choose 3 Months',
    planKey: 'individual_monthly',
    footnote: 'Cancel anytime.',
  },
  {
    key: '6mo',
    name: '6 Months',
    tone: 'white',
    popular: true,
    wasPriceUsd: 74.99,
    priceUsd: 49.99,
    perMonthUsd: 8.33,
    priceSuffix: ' total',
    periodLabel: 'one payment per 6 months of access',
    features: [
      'Total 600 generations for 6 months',
      'Everything in Monthly',
      'All creation tools',
    ],
    featureStyle: 'dots',
    cta: 'Choose 6 Months',
    planKey: 'individual_monthly',
    footnote: 'Cancel anytime.',
  },
  {
    key: 'annual',
    name: 'Annual',
    tone: 'white',
    wasPriceUsd: 139.99,
    priceUsd: 89.99,
    perMonthUsd: 7.5,
    priceSuffix: ' total',
    periodLabel: 'One annual payment',
    features: [
      'Total 1200 generations for 12 months',
      'Everything in Monthly',
      'All creation tools',
    ],
    featureStyle: 'checks',
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

export function localizeAccessPlans(currency) {
  return ACCESS_PLANS.map((plan) => {
    const price = formatPlanMoney(plan.priceUsd, currency)
    const wasPrice =
      plan.wasPriceUsd != null ? formatPlanMoney(plan.wasPriceUsd, currency) : undefined

    let priceNote = plan.priceNote
    if (plan.perMonthUsd != null && plan.periodLabel) {
      priceNote = `${formatPlanMoney(plan.perMonthUsd, currency)}/mo · ${plan.periodLabel}`
    }

    return {
      ...plan,
      price,
      wasPrice,
      priceNote,
    }
  })
}

export function AccessPlanCard({ plan, onCheckout, checkoutLoading }) {
  const ctaClass = 'mml-pr-cta'
  const ctaLabel = checkoutLoading ? 'Redirecting…' : plan.cta

  return (
    <article
      className={cn(
        'mml-pr-card',
        `mml-pr-card--${plan.tone}`,
        plan.popular && 'mml-pr-card--popular',
      )}
    >
      {plan.popular ? <span className="mml-pr-badge">POPULAR</span> : null}

      <h3 className="mml-pr-name">{plan.name}</h3>

      <div className="mml-pr-price-block">
        {plan.wasPrice ? <span className="mml-pr-was">{plan.wasPrice}</span> : null}
        <p className="mml-pr-price">
          <span className="mml-pr-price-main">{plan.price}</span>
          {plan.priceSuffix ? (
            <span className="mml-pr-price-suffix">{plan.priceSuffix}</span>
          ) : null}
        </p>
        <p className="mml-pr-price-note">{plan.priceNote}</p>
      </div>

      <ul className={cn('mml-pr-features', `mml-pr-features--${plan.featureStyle}`)}>
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="mml-pr-feature-icon" aria-hidden>
              {plan.featureStyle === 'checks' ? <Check size={11} strokeWidth={3} /> : null}
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.planKey && onCheckout ? (
        <button
          type="button"
          disabled={checkoutLoading}
          onClick={() => onCheckout(plan.planKey)}
          className={ctaClass}
        >
          {ctaLabel}
        </button>
      ) : (
        <Link href={plan.href || MML_APP.pricing} className={ctaClass}>
          {plan.cta}
        </Link>
      )}

      {plan.footnote ? <p className="mml-pr-footnote">{plan.footnote}</p> : null}
    </article>
  )
}
