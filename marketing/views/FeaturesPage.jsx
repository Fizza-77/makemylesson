import FeatureStageSelector from '@marketing/components/features/FeatureStageSelector'
import {
  FEATURE_STAGE_ITEMS,
  getFeatureBySlug,
} from '@marketing/data/features'

const DEFAULT_STAGE = FEATURE_STAGE_ITEMS[0].slug

function resolveStage(stage) {
  return getFeatureBySlug(stage) ? stage : DEFAULT_STAGE
}

async function loadStage(slug) {
  switch (slug) {
    case 'presentation-maker':
      return (await import('@marketing/views/feature-stages/SlideDeckStage')).default
    case 'classroom-activities':
      return (await import('@marketing/views/feature-stages/ActivityStage')).default
    case 'test-generator':
      return (await import('@marketing/views/feature-stages/AssessmentStage')).default
    case 'lesson-plan-generator':
    default:
      return (await import('@marketing/views/feature-stages/LessonPlanStage')).default
  }
}

export default async function FeaturesPage({ stageSlug }) {
  const activeSlug = resolveStage(stageSlug)
  const Stage = await loadStage(activeSlug)

  return (
    <div className="tm-page-wrap min-h-[calc(100vh-4rem)] bg-white">
      <FeatureStageSelector activeSlug={activeSlug} />
      <div key={activeSlug}>
        <Stage />
      </div>
    </div>
  )
}
