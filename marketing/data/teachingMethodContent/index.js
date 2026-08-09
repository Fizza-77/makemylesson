import blendedLearningContent from './blended-learning'
import collaborativeLearningContent from './collaborative-learning'
import competencyBasedLearningContent from './competency-based-learning'
import crossoverLearningContent from './crossover-learning'
import experientialLearningContent from './experiential-learning'
import flippedClassroomContent from './flipped-classroom'
import gamificationContent from './gamification'
import generalTeacherLedContent from './general-teacher-led'
import inquiryBasedLearningContent from './inquiry-based-learning'
import kinestheticLearningContent from './kinesthetic-learning'
import mindfulnessSelContent from './mindfulness-sel'
import personalisedLearningContent from './personalised-learning'
import problemBasedLearningContent from './problem-based-learning'
import projectBasedLearningContent from './project-based-learning'
import serviceLearningContent from './service-learning'
import spacedLearningContent from './spaced-learning'

const CONTENT_BY_SLUG = {
  'general-teacher-led': generalTeacherLedContent,
  'flipped-classroom': flippedClassroomContent,
  'blended-learning': blendedLearningContent,
  'gamification': gamificationContent,
  'kinesthetic-learning': kinestheticLearningContent,
  'crossover-learning': crossoverLearningContent,
  'project-based-learning': projectBasedLearningContent,
  'inquiry-based-learning': inquiryBasedLearningContent,
  'problem-based-learning': problemBasedLearningContent,
  'service-learning': serviceLearningContent,
  'collaborative-learning': collaborativeLearningContent,
  'personalised-learning': personalisedLearningContent,
  'competency-based-learning': competencyBasedLearningContent,
  'experiential-learning': experientialLearningContent,
  'mindfulness-sel': mindfulnessSelContent,
  'spaced-learning': spacedLearningContent,
}

export function getTeachingMethodContent(slug) {
  return CONTENT_BY_SLUG[slug] ?? null
}
