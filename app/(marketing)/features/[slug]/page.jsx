import { permanentRedirect } from 'next/navigation'
import { FEATURE_ITEMS, getFeatureBySlug, getFeaturePath } from '@marketing/data/features'

export function generateStaticParams() {
  return FEATURE_ITEMS.map((feature) => ({ slug: feature.slug }))
}

export default async function FeatureSlugRedirectPage({ params }) {
  const { slug } = await params
  const feature = slug ? getFeatureBySlug(slug) : null
  permanentRedirect(feature ? getFeaturePath(feature.slug) : '/features')
}
