'use client'

import { useEffect, useRef, useState } from 'react'

import { useFaqState } from './FaqStateProvider'

export default function LazyFaqTopicsSection() {
  const { query } = useFaqState()
  const rootRef = useRef(null)
  const [TopicsSection, setTopicsSection] = useState(null)

  useEffect(() => {
    if (TopicsSection) return

    const load = () => {
      void import('./FaqTopicsSection').then((module) => {
        setTopicsSection(() => module.default)
      })
    }

    if (query.trim()) {
      load()
      return
    }

    const el = rootRef.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      load()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load()
          observer.disconnect()
        }
      },
      { rootMargin: '320px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [TopicsSection, query])

  return (
    <div ref={rootRef} style={TopicsSection ? undefined : { minHeight: '28rem' }}>
      {TopicsSection ? <TopicsSection /> : null}
    </div>
  )
}


