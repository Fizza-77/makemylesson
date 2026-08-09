import PricingPage from '@marketing/views/PricingPage'

export const metadata = {
  title: 'Pricing — AI Lesson Planner & Teaching Pack Plans | Make My Lesson',
  description:
    'Pricing for the AI lesson planner and teaching pack generator: free credits, monthly and annual plans, add-on credits, school and department seats—reduce lesson planning cost per teacher.',
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
