'use client'

import dynamic from 'next/dynamic'

const BuilderInteractiveLayout = dynamic(
  () => import('@marketing/components/teaching-methods/BuilderInteractiveLayout'),
  { ssr: false, loading: () => null },
)

export default function TeachingMethodBuilderSection({ section, sectionIndex }) {
  return <BuilderInteractiveLayout section={section} sectionIndex={sectionIndex} />
}
