import classroomActivitiesContent from './classroom-activities'
import lessonPlanGeneratorContent from './lesson-plan-generator'
import presentationMakerContent from './presentation-maker'
import testGeneratorContent from './test-generator'

const CONTENT_BY_SLUG = {
  'classroom-activities': classroomActivitiesContent,
  'lesson-plan-generator': lessonPlanGeneratorContent,
  'presentation-maker': presentationMakerContent,
  'test-generator': testGeneratorContent,
}

export function getFeatureContent(slug) {
  return CONTENT_BY_SLUG[slug] ?? null
}
