import AcceptableUsePolicyPage from '@marketing/components/legal/AcceptableUsePolicyPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Acceptable Use Policy'
const PAGE_DESCRIPTION =
  'Review permitted educational uses, prohibited conduct, content standards and user responsibilities for Make My Lesson and its AI-generated materials.'
const PAGE_PATH = '/acceptable-use-policy'

export const metadata = {
  title: { absolute: 'Acceptable Use Policy | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function AcceptableUsePolicyRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <AcceptableUsePolicyPage />
    </>
  )
}


