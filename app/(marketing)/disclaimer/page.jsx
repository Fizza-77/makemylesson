import DisclaimerPage from '@marketing/components/legal/DisclaimerPage'

export const metadata = {
  title: { absolute: 'Educational and AI Disclaimer | Make My Lesson' },
  description:
    'Read the Make My Lesson disclaimer covering AI-generated educational content, curriculum accuracy, professional teacher review and platform limitations.',
  alternates: { canonical: '/disclaimer' },
  robots: { index: true, follow: true },
}

export default function DisclaimerRoutePage() {
  return <DisclaimerPage />
}
