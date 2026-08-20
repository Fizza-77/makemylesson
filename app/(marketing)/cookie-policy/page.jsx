import CookiePolicyPage from '@marketing/components/legal/CookiePolicyPage'

export const metadata = {
  title: { absolute: 'Cookie Policy | Make My Lesson' },
  description:
    'Learn how Make My Lesson uses essential, preference and analytics cookies, why they are used, and how you can manage cookie choices in your browser.',
  alternates: { canonical: '/cookie-policy' },
  robots: { index: true, follow: true },
}

export default function CookiePolicyRoutePage() {
  return <CookiePolicyPage />
}
