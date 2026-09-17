'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { FEATURE_STAGE_ITEMS, getFeaturePath } from '@marketing/data/features'
import { cn } from '@marketing/lib/cn'

export default function FeatureStageSelector({ activeSlug }) {
  const scrollerRef = useRef(null)
  const activeRef = useRef(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    const active = activeRef.current
    if (!scroller || !active) return

    const scrollerBox = scroller.getBoundingClientRect()
    const activeBox = active.getBoundingClientRect()
    const nextLeft =
      scroller.scrollLeft +
      (activeBox.left - scrollerBox.left) -
      (scrollerBox.width - activeBox.width) / 2

    scroller.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: 'smooth',
    })
  }, [activeSlug])

  return (
    <nav
      aria-label="Teaching pack stages"
      className="sticky top-16 z-40 w-full border-b border-white/10 bg-[#1A1E3A]"
    >
      <div
        ref={scrollerRef}
        className="fp-stage-bar w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mx-auto flex w-max min-w-full items-center justify-center gap-2 px-4 py-3.5 sm:gap-3 sm:px-6 md:px-8">
          {FEATURE_STAGE_ITEMS.map((stage, index) => {
            const active = stage.slug === activeSlug
            const step = index + 1
            const className = cn(
              'inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-[12px] font-semibold no-underline transition sm:gap-2.5 sm:px-4 sm:text-[14px]',
              active
                ? 'bg-[#35BEBC] text-[#1A1E3A]'
                : 'border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5',
            )

            return (
              <div
                key={stage.slug}
                className="flex shrink-0 items-center justify-center gap-2 sm:gap-3"
              >
                {index > 0 ? (
                  <span className="text-[13px] font-medium text-white" aria-hidden>
                    →
                  </span>
                ) : null}
                <Link
                  ref={active ? activeRef : undefined}
                  href={getFeaturePath(stage.slug)}
                  aria-current={active ? 'page' : undefined}
                  className={className}
                  scroll
                >
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                      active ? 'bg-[#1A1E3A] text-white' : 'bg-[#35BEBC] text-[#1A1E3A]',
                    )}
                  >
                    {step}
                  </span>
                  <span className="whitespace-nowrap">{stage.stageLabel}</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
