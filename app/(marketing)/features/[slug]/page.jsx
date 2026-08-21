import { notFound } from 'next/navigation'
import FeaturesPage from '@marketing/views/FeaturesPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import {
  FEATURE_ITEMS,
  FEATURES_BASE,
  getFeatureBySlug,
  getFeaturePath,
} from '@marketing/data/features'
import { getFeatureContent } from '@marketing/data/featureContent'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'
import { SITE_URL } from '@marketing/lib/siteUrl'

export function generateStaticParams() {
  return FEATURE_ITEMS.map((feature) => ({ slug: feature.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) {
    return { title: 'Features | Make My Lesson' }
  }

  const content = getFeatureContent(slug)
  const title = content?.metaTitle
    ? `${content.metaTitle} | Make My Lesson`
    : `${feature.title} | Make My Lesson`
  const description = content?.metaDescription ?? feature.description
  const canonical = `${SITE_URL}${getFeaturePath(feature.slug)}`

  return {
    title: { absolute: title },
    description,
    keywords: [
      feature.label,
      feature.title,
      'Make My Lesson',
      'AI lesson planning',
      'Australian Curriculum',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
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
}

export default async function FeatureStageRoutePage({ params }) {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) notFound()

  const content = getFeatureContent(slug)
  const name = content?.metaTitle ?? feature.title
  const description = content?.metaDescription ?? feature.description
  const path = getFeaturePath(feature.slug)

  const pageJsonLd = buildPageJsonLd({
    name,
    description,
    path,
    aboutSoftware: true,
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Features', path: FEATURES_BASE },
      { name: feature.label, path },
    ],
  })

  return (
    <>
      <MarketingPageJsonLd data={pageJsonLd} />
      <FeaturesPage stageSlug={feature.slug} />
    </>
  )
}
