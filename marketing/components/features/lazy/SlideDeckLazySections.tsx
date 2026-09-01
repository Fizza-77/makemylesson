'use client'

import LazyFeatureSection from '@marketing/components/LazyFeatureSection'

export function LazySlideDeckSequence() {
  return (
    <LazyFeatureSection
      minHeight={520}
      load={() => import('@marketing/components/features/SlideDeckSequence')}
    />
  )
}

export function LazySlideDeckSpeakerNotes() {
  return (
    <LazyFeatureSection
      minHeight={420}
      load={() => import('@marketing/components/features/SlideDeckSpeakerNotes')}
    />
  )
}

export function LazySlideDeckDuration() {
  return (
    <LazyFeatureSection
      minHeight={380}
      load={() => import('@marketing/components/features/SlideDeckDuration')}
    />
  )
}
