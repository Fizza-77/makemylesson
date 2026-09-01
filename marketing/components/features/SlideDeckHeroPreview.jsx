'use client'

import { useState } from 'react'
import { Leaf, MessageSquare } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const SLIDE_COUNT = 8

export default function SlideDeckHeroPreview() {
  const [activeSlide, setActiveSlide] = useState(1)

  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_20px_50px_rgba(26,30,58,0.14)]">
      <div className="flex items-center justify-between gap-3 bg-[#1A1E3A] px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#1E9A98]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#74FFFD]" />
        </div>
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
          Building deck · Exploring Ecosystems · Year 8
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-2xl border border-[#e8eef5] bg-[#f8fafc] px-5 py-8 sm:min-h-[200px] sm:px-6 sm:py-10">
          <p className="absolute right-4 top-3 text-[11px] font-semibold text-black">
            {activeSlide} / {SLIDE_COUNT}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black">Title</p>
          <h2 className="mt-2 max-w-[12ch] text-[1.45rem] font-bold leading-tight tracking-tight text-[#1A1E3A] sm:text-[1.65rem] xl:max-w-none">
            Exploring Ecosystems
          </h2>
          <div className="mt-4 space-y-1.5" aria-hidden>
            <div className="h-1.5 w-28 rounded-full bg-[#35BEBC]" />
            <div className="h-1 w-16 rounded-full bg-[#35BEBC]/50" />
          </div>
          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f6e8]">
            <Leaf className="h-5 w-5 text-[#3d8b4f]" aria-hidden strokeWidth={2} />
          </div>
        </div>

        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => {
            const n = i + 1
            const on = n === activeSlide
            return (
              <button
                key={n}
                type="button"
                onClick={() => setActiveSlide(n)}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[12px] font-bold transition',
                  on
                    ? 'border-[#35BEBC] bg-white text-[#1A1E3A]'
                    : 'border-[#e8eef5] bg-white text-black hover:border-[#35BEBC]/50',
                )}
              >
                {n}
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#1A1E3A] px-3.5 py-3 text-white">
          <MessageSquare
            className="mt-0.5 h-4 w-4 shrink-0 text-white"
            aria-hidden
            strokeWidth={2}
          />
          <p className="text-[12px] leading-relaxed text-white sm:text-[13px]">
            Speaker note: welcome the class and ask who has visited a forest, pond, or beach this
            year.
          </p>
        </div>
      </div>
    </div>
  )
}
