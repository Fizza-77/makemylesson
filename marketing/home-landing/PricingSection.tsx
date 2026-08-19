import { Info, Lock } from 'lucide-react'

import {
  AccessPlanCard,
  localizeAccessPlans,
} from '@marketing/components/AccessPlanCards'

const USD = { code: 'USD', symbol: '$', rate: 1 }

export default function PricingSection() {
  const plans = localizeAccessPlans(USD)

  return (
    <section className="mml-pr" id="pricing" aria-labelledby="mml-pr-heading">
      <div className="mml-pr-glow mml-pr-glow--left" aria-hidden />
      <div className="mml-pr-glow mml-pr-glow--right" aria-hidden />

      <div className="mml-pr-inner">
        <p className="mml-pr-eyebrow">
          <span className="mml-pr-eyebrow-dots" aria-hidden>
            <span className="mml-pr-eyebrow-dot mml-pr-eyebrow-dot--teal" />
            <span className="mml-pr-eyebrow-dot mml-pr-eyebrow-dot--muted" />
          </span>
          SIMPLE PLANS FOR EVERY TEACHER
        </p>

        <h2 id="mml-pr-heading" className="mml-pr-title">
          Pricing that{' '}
          <span className="mml-pr-title-accent">fits your teaching.</span>
        </h2>

        <p className="mml-pr-sub">
          Start free, then choose the access period that works best for you.
        </p>

        <div className="mml-pr-banner">
          <span className="mml-pr-banner-icon" aria-hidden>
            <Info size={17} strokeWidth={2.4} />
          </span>
          <span className="mml-pr-banner-lines">
            <strong>
              Every new account receives 5 free generation credits — no credit
              card required.
            </strong>
            <span>
              Each credit = one stage generation. A complete 4-stage teaching
              pack costs 4 credits.
            </span>
          </span>
        </div>

        <div className="mml-pr-grid">
          {plans.map((plan) => (
            <AccessPlanCard key={plan.key} plan={plan} />
          ))}
        </div>

        <p className="mml-pr-note">
          <Lock size={13} strokeWidth={2.4} aria-hidden />
          All prices are in USD. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
