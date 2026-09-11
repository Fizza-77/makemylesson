import CookiePolicyPage from '@marketing/components/legal/CookiePolicyPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Cookie Policy'
const PAGE_DESCRIPTION =
  'Learn how Make My Lesson uses essential, preference and analytics cookies, why they are used, and how you can manage cookie choices in your browser.'
const PAGE_PATH = '/cookie-policy'

export const metadata = {
  title: { absolute: 'Cookie Policy | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function CookiePolicyRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <CookiePolicyPage />
    </>
  )
}


