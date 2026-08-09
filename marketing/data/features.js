/** Feature pages for teaching-pack stages. */

export const FEATURES_BASE = '/features'

/** Selector bar order under the navbar on feature pages. */
export const FEATURE_STAGE_ITEMS = [
  {
    slug: 'lesson-plan-generator',
    stageLabel: 'Lesson Plan',
  },
  {
    slug: 'presentation-maker',
    stageLabel: 'Slide Deck',
  },
  {
    slug: 'classroom-activities',
    stageLabel: 'Activity',
  },
  {
    slug: 'test-generator',
    stageLabel: 'Assessment',
  },
]

export const FEATURE_ITEMS = [
  {
    slug: 'lesson-plan-generator',
    label: 'AI Lesson Plan Generator',
    title: 'AI Lesson Plan Generator for Teachers',
    heroImage: 'AI Planner.png',
    sectionImage: 'Built by People Who Understand Teaching.png',
    description:
      "Make My Lesson is an AI lesson plan generator that helps teachers create curriculum-aligned lesson plans in minutes instead of hours. It's built for Australian classrooms and aligns automatically with the Australian Curriculum.",
  },
  {
    slug: 'presentation-maker',
    label: 'AI Presentation Maker',
    title: 'AI Presentation Maker for Teachers',
    heroImage: 'Ai presentation.png',
    sectionImage: 'Built by People Who Understand the Classroom.png',
    description:
      'Make My Lesson is an AI presentation maker for teachers that turns lesson topics into classroom-ready slides in minutes, fully aligned with Australian curriculum content.',
  },
  {
    slug: 'classroom-activities',
    label: 'AI Classroom Activities',
    title: 'AI Classroom Activity Generator for Teachers',
    heroImage: 'AI Classroom Activity.png',
    sectionImage: 'Built by People Who Understand Classroom Engagement.png',
    description:
      'Make My Lesson is an AI classroom activity generator that helps teachers create engaging, curriculum-aligned activities in minutes, designed specifically for Australian classrooms.',
  },
  {
    slug: 'test-generator',
    label: 'AI Test Generator',
    title: 'AI Test Generator for Teachers',
    heroImage: 'Ai test.png',
    sectionImage: 'Built by People Who Understand Assessment Design.png',
    description:
      'Make My Lesson is an AI test generator that helps teachers create formative and summative assessments, quizzes, and question papers in minutes, fully aligned with Australian curriculum standards.',
  },
]

export function getFeatureBySlug(slug) {
  return FEATURE_ITEMS.find((item) => item.slug === slug) ?? null
}

/** Deep-link into a stage on the single Features page. */
export function getFeaturePath(slug) {
  if (!slug || slug === FEATURE_STAGE_ITEMS[0]?.slug) {
    return FEATURES_BASE
  }
  return `${FEATURES_BASE}?stage=${encodeURIComponent(slug)}`
}

export function isFeaturesPath(pathname) {
  return pathname === FEATURES_BASE || pathname.startsWith(`${FEATURES_BASE}/`)
}

export function getFeatureHeroImagePath(feature) {
  if (!feature?.heroImage) return null
  return `/features-images/${encodeURIComponent(feature.heroImage).replace(/%2F/g, '/')}`
}

export function getFeatureSectionImagePath(feature) {
  if (!feature?.sectionImage) return null
  return `/section-images/${encodeURIComponent(feature.sectionImage).replace(/%2F/g, '/')}`
}
