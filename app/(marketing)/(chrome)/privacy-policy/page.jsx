import PrivacyPolicyPage from '@marketing/components/legal/PrivacyPolicyPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Privacy Policy | Make My Lesson'
const PAGE_DESCRIPTION =
  'Read how Make My Lesson protects your personal data, and learn about our mobile application advertising practices, Google AdMob disclosures, and your privacy rights.'
const PAGE_PATH = '/privacy-policy'

export const metadata = {
  title: { absolute: PAGE_NAME },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <PrivacyPolicyPage />
    </>
  )
}
