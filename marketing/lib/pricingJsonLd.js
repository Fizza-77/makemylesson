import { ACCESS_PLANS } from '@marketing/components/AccessPlanCards'
import {
  SITE_ORIGIN,
  softwareRef,
} from '@marketing/lib/organizationSchema'

/** Static team / add-on prices shown on the pricing page (USD). */
const EXTRA_OFFERS = [
  {
    key: 'department',
    name: 'Department',
    price: '349',
    description: 'Department plan with pooled credits for teaching teams.',
  },
  {
    key: 'school',
    name: 'School',
    price: '599',
    description: 'School plan with seats, pooled credits, and admin visibility.',
  },
  {
    key: 'credit-topup-50',
    name: '50-credit top-up',
    price: '29.99',
    description: 'Add-on pack of 50 generation credits. Does not change your subscription.',
  },
]

/**
 * Multiple Offer nodes for /pricing.
 * References SoftwareApplication by @id — does not redefine it.
 */
export function buildPricingOffersJsonLd() {
  const pricingUrl = `${SITE_ORIGIN}/pricing`

  const accessOffers = ACCESS_PLANS.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${pricingUrl}#offer-${plan.key}`,
    name: plan.name === 'Free' ? 'Free plan' : `${plan.name} plan`,
    price: String(plan.priceUsd),
    priceCurrency: 'USD',
    url: pricingUrl,
    description:
      plan.key === 'free'
        ? 'Five free generation credits on signup.'
        : `${plan.generations} generation credits. ${plan.priceNote ?? plan.spreadNote ?? 'Cancel anytime.'}`.trim(),
    availability: 'https://schema.org/InStock',
    itemOffered: softwareRef(),
  }))

  const extraOffers = EXTRA_OFFERS.map((offer) => ({
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${pricingUrl}#offer-${offer.key}`,
    name: offer.name,
    price: offer.price,
    priceCurrency: 'USD',
    url: pricingUrl,
    description: offer.description,
    availability: 'https://schema.org/InStock',
    itemOffered: softwareRef(),
  }))

  return [...accessOffers, ...extraOffers]
}
