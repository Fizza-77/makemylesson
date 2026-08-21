import HomeLandingPage from '@marketing/home-landing/HomeLandingPage'
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
const siteOrigin = SITE_URL.replace(/\/$/, '')

/** Rich result copy for SoftwareApplication JSON-LD (distinct from meta description). */
const softwareApplicationDescription =
  'AI-powered lesson planning platform for teachers. Generates complete, curriculum-aligned teaching packs including lesson plan, classroom presentation, student activity and summative assessment. Supports 71 curriculum routes across Australia, United Kingdom, Canada, International Baccalaureate and United States.'

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

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Make My Lesson',
  url: homeCanonical,
  description: homeMetaDescription,
  publisher: {
    '@type': 'Organization',
    name: 'Qismat Ventures W.L.L',
    url: SITE_URL,
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Make My Lesson',
  applicationCategory: 'EducationApplication',
  operatingSystem: 'Web, iOS, Android',
  description: softwareApplicationDescription,
  url: siteOrigin,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: '5 free generation credits on signup. No credit card required.',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Make My Lesson',
    url: siteOrigin,
    logo: `${siteOrigin}/logo.png`,
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteJsonLd, softwareJsonLd]),
        }}
      />
      <HomeLandingPage />
    </>
  )
}
