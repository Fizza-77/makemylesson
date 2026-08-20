import RefundPaymentsPolicyPage from '@marketing/components/legal/RefundPaymentsPolicyPage'

export const metadata = {
  title: { absolute: 'Refund and Payments Policy | Make My Lesson' },
  description:
    'Review Make My Lesson payment, subscription, credit and refund terms, including billing responsibilities, eligibility and how to request support.',
  alternates: { canonical: '/refund-payments-policy' },
  robots: { index: true, follow: true },
}

export default function RefundPaymentsPolicyRoutePage() {
  return <RefundPaymentsPolicyPage />
}
