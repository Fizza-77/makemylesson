import PricingPage from '@marketing/views/PricingPage'

export const metadata = {
  title: { absolute: 'AI Lesson Planner Pricing and Plans | Make My Lesson' },
  description:
    'Compare Make My Lesson plans for individual teachers, departments and schools. Review credits, included teaching tools, exports and billing options.',
  keywords: [
    'AI lesson planner pricing',
    'lesson planning app subscription',
    'teaching pack generator cost',
    'teacher workload savings',
  ],
  alternates: { canonical: '/pricing' },
  robots: { index: true, follow: true },
}

export default function PricingRoutePage() {
  return <PricingPage />
}
