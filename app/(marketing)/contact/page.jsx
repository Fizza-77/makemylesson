import ContactPage from '@marketing/views/ContactPage'
import { SITE_URL } from '@marketing/lib/siteUrl'
import {
  organizationRef,
  websiteRef,
} from '@marketing/lib/organizationSchema'

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_URL}/contact#webpage`,
  name: 'Contact Make My Lesson',
  description:
    'Contact Make My Lesson support for help with AI lesson planning, curriculum-aligned teaching packs, billing, and school plans.',
  url: `${SITE_URL}/contact`,
  isPartOf: websiteRef(),
  publisher: organizationRef(),
  mainEntity: organizationRef(),
}

export const metadata = {
  title: { absolute: 'Contact Make My Lesson: Teacher and School Support' },
  description:
    'Contact Make My Lesson for help with accounts, billing, school plans, technical support or platform questions. Our support team is ready to assist.',
  keywords: [
    'Make My Lesson contact',
    'AI lesson planner support',
    'teacher lesson planning help',
    'school plan inquiry',
  ],
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Make My Lesson: Teacher and School Support',
    description:
      'Contact Make My Lesson for help with accounts, billing, school plans, technical support or platform questions. Our support team is ready to assist.',
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
