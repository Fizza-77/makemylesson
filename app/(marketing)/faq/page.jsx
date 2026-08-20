import FaqPage from '@marketing/components/faq/FaqPage'
import { faqItems } from '@marketing/data/faqItems'
import { FAQ_SCHEMA_IDS } from '@marketing/data/faqMeta'
import { buildFaqJsonLd } from '@marketing/lib/faqJsonLd'
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
  const jsonLd = buildFaqJsonLd(faqItems, FAQ_SCHEMA_IDS, faqCanonical)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqPage />
    </>
  )
}
