'use client'

import LazyFeatureSection from '@marketing/components/LazyFeatureSection'

export function LazyLessonPlanWhatsInside() {
  return (
    <LazyFeatureSection
      minHeight={480}
      load={() => import('@marketing/components/features/LessonPlanWhatsInside')}
    />
  )
}

export function LazyLessonPlanDifferentiation() {
  return (
    <LazyFeatureSection
      minHeight={400}
      load={() => import('@marketing/components/features/LessonPlanDifferentiation')}
    />
  )
}


