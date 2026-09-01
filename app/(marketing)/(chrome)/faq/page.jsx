import FaqPage from '@marketing/components/faq/FaqPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { faqItems } from '@marketing/data/faqItems'
import { FAQ_SCHEMA_IDS } from '@marketing/data/faqMeta'
import { buildFaqJsonLd } from '@marketing/lib/faqJsonLd'
import { buildBreadcrumbSchema } from '@marketing/lib/pageSchema'
import { SITE_URL } from '@marketing/lib/siteUrl'

const faqCanonical = `${SITE_URL.replace(/\/$/, '')}/faq`

export const metadata = {
  title: { absolute: 'Make My Lesson FAQs: Features, Pricing and Support' },
  description:
    'Find answers about Make My Lesson, its four teaching stages, curriculum coverage, Ayla, credits, exports, school plans, privacy and classroom use.',
  alternates: { canonical: faqCanonical },
  robots: { index: true, follow: true },
}

export default function FaqRoutePage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ])
  const faqJsonLd = buildFaqJsonLd(faqItems, FAQ_SCHEMA_IDS, faqCanonical)

  return (
    <>
      <MarketingPageJsonLd data={[breadcrumb, faqJsonLd]} />
      <FaqPage />
    </>
  )
}
