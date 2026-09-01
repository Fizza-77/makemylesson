'use client'

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react'

type LazyModule = { default: ComponentType }

type LazyFeatureSectionProps = {
  load: () => Promise<LazyModule>
  minHeight?: number
  className?: string
}

/** Loads a feature section only when it nears the viewport — keeps initial JS off the critical path. */
export default function LazyFeatureSection({
  load,
  minHeight = 320,
  className,
}: LazyFeatureSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el || Component) return

    const startLoad = () => {
      void load().then((module) => setComponent(() => module.default))
    }

    if (!('IntersectionObserver' in window)) {
      startLoad()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startLoad()
          observer.disconnect()
        }
      },
      { rootMargin: '240px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [Component, load])

  return (
    <div
      ref={rootRef}
      className={className}
      style={Component ? undefined : { minHeight }}
    >
      {Component ? <Component /> : null}
    </div>
  )
}
