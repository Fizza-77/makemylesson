import HomeLandingPage from '@marketing/home-landing/HomeLandingPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_URL,
} from '@marketing/lib/siteUrl'

/** Homepage technical SEO — title ≤60 chars.*/
const homeTitle = 'Online AI Lesson Planner for Teachers | Make My Lesson'

const homeMetaDescription =
  'Plan complete, curriculum-aligned lessons in minutes with AI. Create lesson plans, slides, activities and assessments in one connected teaching pack.'

const homeOgTwitterDescription = homeMetaDescription

const homeCanonical = `${SITE_URL.replace(/\/$/, '')}/`

export const metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeMetaDescription,
  keywords: [
    'AI lesson planner',
    'lesson plan generator',
    'curriculum aligned teaching packs',
    'GCSE lesson plan',
    'HSC lesson plan',
    'IB lesson planner',
    'save time lesson planning',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: homeCanonical,
    languages: {
      en: homeCanonical,
      'en-au': homeCanonical,
      'en-gb': homeCanonical,
      'en-ca': homeCanonical,
      'en-us': homeCanonical,
    },
  },
  openGraph: {
    title: homeTitle,
    description: homeOgTwitterDescription,
    url: homeCanonical,
    siteName: 'Make My Lesson',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: DEFAULT_OG_IMAGE_WIDTH,
        height: DEFAULT_OG_IMAGE_HEIGHT,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeOgTwitterDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: DEFAULT_OG_IMAGE_WIDTH,
        height: DEFAULT_OG_IMAGE_HEIGHT,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <MarketingPageJsonLd />
      <HomeLandingPage />
    </>
  )
}
