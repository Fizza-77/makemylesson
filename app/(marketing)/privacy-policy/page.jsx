import PrivacyPolicyPage from '@marketing/components/legal/PrivacyPolicyPage'

export const metadata = {
  title: 'Privacy Policy | Make My Lesson',
  description:
    'Web Privacy Policy for Make My Lesson — data collection, Firebase, cookies, retention, user rights, and Qismat Ventures W.L.L contact.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyRoutePage() {
  return <PrivacyPolicyPage />
}
