import { MML_APP } from '@marketing/lib/appUrls'
import { Reveal } from '../shared'

const PLANS = [
  {
    title: 'Free Trial',
    blurb: 'Try the full workflow with free generation credits, no credit card required.',
  },
  {
    title: 'Individual',
    blurb: 'Monthly or annual subscription for solo teachers who plan lessons every week.',
  },
  {
    title: 'Add-On Credits',
    blurb: 'One-time credit packs when you need extra generations beyond your plan.',
  },
  {
    title: 'School & Department',
    blurb: 'Multi-seat annual plans for teams, with admin controls and per-teacher accounts.',
  },
]

export default function PricingSection() {
  return (
    <section className="pricing" id="pricing">
      <div className="W pricing-inner">
        <Reveal className="pricing-head">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="pricing-head-title">Plans for Every Teacher and Team</h2>
        </Reveal>

        <div className="pricing-grid pricing-grid--plans">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.title} delay={i * 60} className="price-card price-card--summary">
              <div className="plan-name">{plan.title}</div>
              <p className="plan-blurb">{plan.blurb}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={260} className="pricing-view-cta">
          <p className="pricing-view-cta-lead">See full pricing, currencies, add-ons, and school tiers.</p>
          <a href={MML_APP.pricing} className="btn btn-teal btn-lg pricing-view-cta-btn">
            View Pricing
          </a>
          <p className="pricing-view-cta-note">
            Questions?{' '}
            <a href="mailto:hello@makemylesson.ai" className="pricing-view-cta-mail">
              hello@makemylesson.ai
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}


