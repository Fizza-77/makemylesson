import ContactPage from '@marketing/views/ContactPage'
import { SITE_URL } from '@marketing/lib/siteUrl'

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Make My Lesson',
  description:
    'Contact Make My Lesson support for help with AI lesson planning, curriculum-aligned teaching packs, billing, and school plans.',
  url: `${SITE_URL}/contact`,
  mainEntity: {
    '@type': 'Organization',
    name: 'Make My Lesson',
    email: 'support@makemylesson.ai',
    url: SITE_URL,
  },
}

export const metadata = {
  title: 'Contact Us — Support for Teachers | Make My Lesson',
  description:
    'Contact Make My Lesson for support with AI lesson planning, curriculum-aligned teaching packs, billing, school plans, and partnerships. We reply within 1–2 business days.',
  keywords: [
    'Make My Lesson contact',
    'AI lesson planner support',
    'teacher lesson planning help',
    'school plan inquiry',
  ],
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Make My Lesson',
    description:
      'Get help with lesson planning, exports, billing, and school plans. Message our team or email support@makemylesson.ai.',
    url: '/contact',
    type: 'website',
  },
}

export default function ContactRoutePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <ContactPage />
    </>
  )
}
