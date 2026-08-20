import TermsOfServicePage from '@marketing/components/legal/TermsOfServicePage'

export const metadata = {
  title: { absolute: 'Terms of Service | Make My Lesson' },
  description:
    'Review the terms governing Make My Lesson accounts, AI-generated teaching materials, subscriptions, acceptable use, intellectual property and liability.',
  alternates: { canonical: '/terms-of-service' },
  robots: { index: true, follow: true },
}

export default function TermsOfServiceRoutePage() {
  return <TermsOfServicePage />
}
