'use client'

import LazyFeatureSection from '@marketing/components/LazyFeatureSection'

export function LazyActivityTypes() {
  return (
    <LazyFeatureSection
      minHeight={480}
      load={() => import('@marketing/components/features/ActivityTypes')}
    />
  )
}

export function LazyActivityTeacherCopy() {
  return (
    <LazyFeatureSection
      minHeight={420}
      load={() => import('@marketing/components/features/ActivityTeacherCopy')}
    />
  )
}

export function LazyActivityMethodShape() {
  return (
    <LazyFeatureSection
      minHeight={400}
      load={() => import('@marketing/components/features/ActivityMethodShape')}
    />
  )
}


