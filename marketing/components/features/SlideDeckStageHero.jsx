'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, Leaf, MessageSquare } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'

const SLIDE_COUNT = 8

export default function SlideDeckStageHero() {
  const [activeSlide, setActiveSlide] = useState(1)

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
      aria-labelledby="slide-deck-hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#35BEBC] sm:-right-20 sm:-top-14"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#9ddad4]/70"
        aria-hidden
      />

      <div className="relative z-[1] grid items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12 lg:py-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]/35" />
            </span>
            Stage 2 · Present
          </p>

          <h1
            id="slide-deck-hero-heading"
            className="max-w-[14ch] xl:max-w-none text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            Slides that{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              teach
            </span>{' '}
            not just decorate.
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#1A1E3A]/80 sm:text-base">
            Every deck follows a real pedagogical sequence — title, objectives, vocabulary, core
            content, practice, recap — with speaker notes already written under every slide.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Build a Slide Deck — Free
            </Link>
            <a
              href="#slide-sequence"
              className="inline-flex items-center justify-center rounded-full border border-[#1A1E3A]/25 bg-transparent px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:border-[#1A1E3A]/45 hover:bg-white/40"
            >
              See the Sequence ↓
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-[#1A1E3A]/55">
            <span className="text-[#1E9A98]">★★★★★</span>
            <span>Rated by educators</span>
            <span className="text-[#1A1E3A]/25" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#35BEBC]" aria-hidden strokeWidth={2} />
              71 curriculum routes
            </span>
            <span className="text-[#1A1E3A]/25" aria-hidden>
              ·
            </span>
            <span>PPTX + Google Slides export</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_20px_50px_rgba(26,30,58,0.14)]">
          <div className="flex items-center justify-between gap-3 bg-[#1A1E3A] px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E9A98]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#74FFFD]" />
            </div>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75">
              Building deck · Exploring Ecosystems · Year 8
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-2xl border border-[#e8eef5] bg-[#f8fafc] px-5 py-8 sm:min-h-[200px] sm:px-6 sm:py-10">
              <p className="absolute right-4 top-3 text-[11px] font-semibold text-[#1A1E3A]/35">
                {activeSlide} / {SLIDE_COUNT}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1E3A]/40">
                Title
              </p>
              <h2 className="mt-2 max-w-[12ch] xl:max-w-none text-[1.45rem] font-bold leading-tight tracking-tight text-[#1A1E3A] sm:text-[1.65rem]">
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
                        : 'border-[#e8eef5] bg-white text-[#1A1E3A]/45 hover:border-[#35BEBC]/50',
                    )}
                  >
                    {n}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#1A1E3A] px-3.5 py-3 text-white">
              <MessageSquare
                className="mt-0.5 h-4 w-4 shrink-0 text-white/70"
                aria-hidden
                strokeWidth={2}
              />
              <p className="text-[12px] leading-relaxed text-white/85 sm:text-[13px]">
                Speaker note: welcome the class and ask who has visited a forest, pond, or beach this
                year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
