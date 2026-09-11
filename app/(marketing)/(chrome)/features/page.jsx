import { permanentRedirect } from 'next/navigation'
import {
  FEATURE_STAGE_ITEMS,
  getFeatureBySlug,
  getFeaturePath,
} from '@marketing/data/features'
import { SITE_URL } from '@marketing/lib/siteUrl'

const DEFAULT_STAGE = FEATURE_STAGE_ITEMS[0].slug

export async function generateMetadata() {
  const canonical = `${SITE_URL}${getFeaturePath(DEFAULT_STAGE)}`
  return {
    title: 'Features | Make My Lesson',
    description:
      'One teaching pack across four stages: lesson plan, slide deck, classroom activity, and assessment — curriculum-aligned for Australian classrooms.',
    alternates: { canonical },
    robots: { index: true, follow: true },
  }
}

/** `/features` and legacy `?stage=` → `/features/{slug}` for SEO. */
export default async function FeaturesRoutePage({ searchParams }) {
  const params = await searchParams
  const stageParam = typeof params?.stage === 'string' ? params.stage : null
  const target = getFeatureBySlug(stageParam) ? stageParam : DEFAULT_STAGE
  permanentRedirect(getFeaturePath(target))
}


