import FeaturesPage from '@marketing/views/FeaturesPage'
import { FEATURES_BASE } from '@marketing/data/features'
import { SITE_URL } from '@marketing/lib/siteUrl'

const title = 'Features | Make My Lesson'
const description =
  'One teaching pack across four stages: lesson plan, slide deck, classroom activity, and assessment — curriculum-aligned for Australian classrooms.'

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}${FEATURES_BASE}` },
  openGraph: {
    type: 'website',
    title,
    description,
    url: `${SITE_URL}${FEATURES_BASE}`,
    siteName: 'Make My Lesson',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  robots: { index: true, follow: true },
}

export default function FeaturesRoutePage() {
  return <FeaturesPage />
}
