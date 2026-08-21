import PricingPage from '@marketing/views/PricingPage'
import JsonLd from '@marketing/components/JsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'AI Lesson Planner Pricing and Plans'
const PAGE_DESCRIPTION =
  'Compare Make My Lesson plans for individual teachers, departments and schools. Review credits, included teaching tools, exports and billing options.'
const PAGE_PATH = '/pricing'

export const metadata = {
  title: { absolute: `${PAGE_NAME} | Make My Lesson` },
  description: PAGE_DESCRIPTION,
  keywords: [
    'AI lesson planner pricing',
    'lesson planning app subscription',
    'teaching pack generator cost',
    'teacher workload savings',
  ],
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function PricingRoutePage() {
  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          aboutSoftware: true,
        })}
      />
      <PricingPage />
    </>
  )
}
