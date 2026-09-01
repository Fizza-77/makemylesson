import ContactPage from '@marketing/views/ContactPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Contact Make My Lesson'
const PAGE_DESCRIPTION =
  'Contact Make My Lesson support for help with AI lesson planning, curriculum-aligned teaching packs, billing, and school plans.'
const PAGE_PATH = '/contact'

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
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Make My Lesson: Teacher and School Support',
    description:
      'Contact Make My Lesson for help with accounts, billing, school plans, technical support or platform questions. Our support team is ready to assist.',
    url: PAGE_PATH,
    type: 'website',
  },
}

export default async function ContactRoutePage({ searchParams }) {
  const params = await searchParams
  const rawSubject = params?.subject
  const initialSubject = (
    Array.isArray(rawSubject) ? rawSubject[0] : rawSubject
  )?.trim() || ''

  return (
    <>
      <MarketingPageJsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          type: 'ContactPage',
          mainEntityOrganization: true,
        })}
      />
      <ContactPage initialSubject={initialSubject} />
    </>
  )
}
