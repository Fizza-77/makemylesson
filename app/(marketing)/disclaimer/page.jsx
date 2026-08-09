import DisclaimerPage from '@marketing/components/legal/DisclaimerPage'

export const metadata = {
  title: 'Disclaimer | Make My Lesson',
  description:
    'Disclaimer for Make My Lesson — AI content, assessments, liability, third-party services, and contact for Qismat Ventures W.L.L.',
  alternates: { canonical: '/disclaimer' },
  robots: { index: true, follow: true },
}

export default function DisclaimerRoutePage() {
  return <DisclaimerPage />
}
