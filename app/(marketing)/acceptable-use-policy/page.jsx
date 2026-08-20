import AcceptableUsePolicyPage from '@marketing/components/legal/AcceptableUsePolicyPage'

export const metadata = {
  title: { absolute: 'Acceptable Use Policy | Make My Lesson' },
  description:
    'Review permitted educational uses, prohibited conduct, content standards and user responsibilities for Make My Lesson and its AI-generated materials.',
  alternates: { canonical: '/acceptable-use-policy' },
  robots: { index: true, follow: true },
}

export default function AcceptableUsePolicyRoutePage() {
  return <AcceptableUsePolicyPage />
}
