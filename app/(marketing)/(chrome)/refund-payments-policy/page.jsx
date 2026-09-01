import RefundPaymentsPolicyPage from '@marketing/components/legal/RefundPaymentsPolicyPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Refund and Payments Policy'
const PAGE_DESCRIPTION =
  'Review Make My Lesson payment, subscription, credit and refund terms, including billing responsibilities, eligibility and how to request support.'
const PAGE_PATH = '/refund-payments-policy'

export const metadata = {
  title: { absolute: 'Refund and Payments Policy | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function RefundPaymentsPolicyRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <RefundPaymentsPolicyPage />
    </>
  )
}
