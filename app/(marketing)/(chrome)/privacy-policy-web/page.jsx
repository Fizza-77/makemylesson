import WebPrivacyPolicyPage from '@marketing/components/legal/WebPrivacyPolicyPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Privacy Policy | Make My Lesson'
const PAGE_DESCRIPTION =
  'Read how Make My Lesson collects, uses and protects your data, including Free-plan Google AdMob rewarded ads and your privacy rights.'
const PAGE_PATH = '/privacy-policy-web'

export const metadata = {
  title: { absolute: PAGE_NAME },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function WebPrivacyPolicyRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <WebPrivacyPolicyPage />
    </>
  )
}


