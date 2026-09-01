'use client'

import LazyClientSection from '@marketing/components/LazyClientSection'

export default function LazyTeachingMethodBuilderSection({ section, sectionIndex }) {
  return (
    <LazyClientSection
      minHeight={300}
      load={() => import('@marketing/components/teaching-methods/TeachingMethodBuilderSection')}
      componentProps={{ section, sectionIndex }}
    />
  )
}
