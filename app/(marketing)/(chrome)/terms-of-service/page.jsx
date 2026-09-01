import TermsOfServicePage from '@marketing/components/legal/TermsOfServicePage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Terms of Service'
const PAGE_DESCRIPTION =
  'Review the terms governing Make My Lesson accounts, AI-generated teaching materials, subscriptions, acceptable use, intellectual property and liability.'
const PAGE_PATH = '/terms-of-service'

export const metadata = {
  title: { absolute: 'Terms of Service | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function TermsOfServiceRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <TermsOfServicePage />
    </>
  )
}
