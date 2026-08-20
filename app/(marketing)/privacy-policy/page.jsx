import PrivacyPolicyPage from '@marketing/components/legal/PrivacyPolicyPage'

export const metadata = {
  title: { absolute: 'Privacy Policy for Make My Lesson Users' },
  description:
    'Read how Make My Lesson collects, uses, stores and protects account, generated-content and technical data, including your privacy rights and choices.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyRoutePage() {
  return <PrivacyPolicyPage />
}
