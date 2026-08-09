import CookiePolicyPage from '@marketing/components/legal/CookiePolicyPage'

export const metadata = {
  title: 'Cookie Policy | Make My Lesson',
  description:
    'Cookie Policy for Make My Lesson — cookies, Firebase, analytics, payment providers, and controls. Operated by Qismat Ventures W.L.L.',
  alternates: { canonical: '/cookie-policy' },
  robots: { index: true, follow: true },
}

export default function CookiePolicyRoutePage() {
  return <CookiePolicyPage />
}
