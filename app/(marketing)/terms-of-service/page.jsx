import TermsOfServicePage from '@marketing/components/legal/TermsOfServicePage'

export const metadata = {
  title: 'Terms of Service | Make My Lesson',
  description:
    'Terms of Service for Make My Lesson — eligibility, accounts, AI content, credits, liability, and contact for Qismat Ventures W.L.L.',
  alternates: { canonical: '/terms-of-service' },
  robots: { index: true, follow: true },
}

export default function TermsOfServiceRoutePage() {
  return <TermsOfServicePage />
}
