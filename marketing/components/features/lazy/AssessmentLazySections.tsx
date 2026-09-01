'use client'

import LazyFeatureSection from '@marketing/components/LazyFeatureSection'

export function LazyAssessmentPaperStyles() {
  return (
    <LazyFeatureSection
      minHeight={420}
      load={() => import('@marketing/components/features/AssessmentPaperStyles')}
    />
  )
}

export function LazyAssessmentCurriculumWording() {
  return (
    <LazyFeatureSection
      minHeight={400}
      load={() => import('@marketing/components/features/AssessmentCurriculumWording')}
    />
  )
}

export function LazyAssessmentMarkScheme() {
  return (
    <LazyFeatureSection
      minHeight={520}
      load={() => import('@marketing/components/features/AssessmentMarkScheme')}
    />
  )
}

export function LazyAssessmentExportCircle() {
  return (
    <LazyFeatureSection
      minHeight={360}
      load={() => import('@marketing/components/features/AssessmentExportCircle')}
    />
  )
}

export function LazyAssessmentCta() {
  return (
    <LazyFeatureSection
      minHeight={480}
      load={() => import('@marketing/components/features/AssessmentCta')}
    />
  )
}
