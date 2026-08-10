'use client'

import { useMemo, useState } from 'react'
import { cn } from '@marketing/lib/cn'

const MIN_MINUTES = 20
const MAX_MINUTES = 90

function slidesForDuration(minutes) {
  if (minutes <= 25) return 5
  if (minutes <= 35) return 6
  if (minutes <= 45) return 8
  if (minutes <= 55) return 9
  if (minutes <= 70) return 10
  return 12
}

const EXPORTS = [
  'PowerPoint (PPTX)',
  'Google Slides',
  'PDF',
  'Google Classroom',
  'Microsoft Teams',
]

export default function SlideDeckDuration() {
  const [minutes, setMinutes] = useState(45)
  const slideCount = useMemo(() => slidesForDuration(minutes), [minutes])
  const fillPct = ((minutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES)) * 100

  return (
    <section
      className="bg-[#ade5df] py-14 sm:py-16 lg:py-20"
      aria-labelledby="duration-calibrated-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" aria-hidden />
              Duration-calibrated
            </p>
            <h2
              id="duration-calibrated-heading"
              className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
            >
              Your lesson length
              <br />
              <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
                sets the deck.
              </span>
            </h2>
          </div>

          <div className="rounded-[28px] bg-[#1A1E3A] p-5 shadow-[0_20px_50px_rgba(26,30,58,0.18)] sm:rounded-[32px] sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[14px] font-medium text-white/70">Lesson duration</p>
              <p className="text-[18px] font-bold text-[#35BEBC]">{minutes} min</p>
            </div>

            <label className="mt-5 block w-full">
              <span className="sr-only">Lesson duration in minutes</span>
              <input
                type="range"
                min={MIN_MINUTES}
                max={MAX_MINUTES}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="slide-deck-range"
                style={{ '--slide-range-pct': `${fillPct}%` }}
              />
            </label>

            <div className="mt-5 grid w-full grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2">
              {Array.from({ length: slideCount }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'inline-flex h-11 w-full items-center justify-center rounded-xl bg-white/10 text-[14px] font-semibold text-white/80 sm:h-12 sm:text-[15px]',
                  )}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
              A{' '}
              <span className="font-semibold text-[#35BEBC]">{minutes}-minute</span> lesson generates{' '}
              <span className="font-semibold text-[#35BEBC]">{slideCount} slides</span> — enough to
              teach, never enough to drown in.
            </p>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-6 border-t border-[#1A1E3A]/10 pt-10 sm:mt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" aria-hidden />
              Take it anywhere
            </p>
            <p className="text-[1.15rem] font-normal tracking-tight text-[#1A1E3A] sm:text-[1.35rem]">
              Opens where you{' '}
              <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
                already present.
              </span>
            </p>
          </div>

          <div className="flex w-full flex-nowrap gap-2.5 overflow-x-auto lg:justify-end">
            {EXPORTS.map((label) => (
              <span
                key={label}
                className="inline-flex shrink-0 rounded-full bg-[#1A1E3A] px-4 py-2.5 text-[12px] font-semibold text-white sm:text-[13px]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
