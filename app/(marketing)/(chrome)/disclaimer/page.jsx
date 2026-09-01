import DisclaimerPage from '@marketing/components/legal/DisclaimerPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Educational and AI Disclaimer'
const PAGE_DESCRIPTION =
  'Read the Make My Lesson disclaimer covering AI-generated educational content, curriculum accuracy, professional teacher review and platform limitations.'
const PAGE_PATH = '/disclaimer'

export const metadata = {
  title: { absolute: 'Educational and AI Disclaimer | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function DisclaimerRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <DisclaimerPage />
    </>
  )
}
