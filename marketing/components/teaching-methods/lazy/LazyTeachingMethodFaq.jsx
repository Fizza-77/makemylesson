'use client'

import LazyClientSection from '@marketing/components/LazyClientSection'

export default function LazyTeachingMethodFaq(props) {
  return (
    <LazyClientSection
      minHeight={420}
      load={() => import('@marketing/components/teaching-methods/TeachingMethodFaq')}
      componentProps={props}
    />
  )
}


