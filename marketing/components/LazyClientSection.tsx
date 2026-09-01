'use client'

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react'

type LazyClientSectionProps<P extends object> = {
  load: () => Promise<{ default: ComponentType<P> }>
  componentProps: P
  minHeight?: number
  className?: string
}

/** Loads a client section when it nears the viewport — keeps heavy JS off the critical path. */
export default function LazyClientSection<P extends object>({
  load,
  componentProps,
  minHeight = 320,
  className,
}: LazyClientSectionProps<P>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [Component, setComponent] = useState<ComponentType<P> | null>(null)

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
      {Component ? <Component {...componentProps} /> : null}
    </div>
  )
}
