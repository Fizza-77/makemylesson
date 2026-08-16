'use client'

import Link from 'next/link'
import { FileText, Globe } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'

const MOCK_ROWS = [
  {
    tag: 'Objectives',
    tone: 'teal',
    text: '3 standards-aligned goals, Bloom-balanced',
    time: null,
  },
  {
    tag: 'Hook',
    tone: 'yellow',
    text: "Think-pair-share: 'Where did today's rain come from?'",
    time: "10'",
  },
  {
    tag: 'Core',
    tone: 'blue',
    text: 'Evaporation → condensation → precipitation cycle',
    time: "20'",
  },
  {
    tag: 'Practice',
    tone: 'purple',
    text: 'Group diagram labelling, mixed-ability pairs',
    time: "10'",
  },
]

const TAG_CLASS = {
  teal: 'bg-[#35BEBC]/20 text-[#1A9A98]',
  yellow: 'bg-[#f5d56a]/20 text-[#9a7b1a]',
  blue: 'bg-[#9ec5f0]/20 text-[#3d6fa8]',
  purple: 'bg-[#c4b5f5]/20 text-[#6b5aad]',
}

export default function LessonPlanStageHero() {
  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
      aria-labelledby="lesson-plan-hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#1E9A98] sm:-right-20 sm:-top-14"
        aria-hidden
      />

      <div className="relative z-[1] grid items-center gap-10 px-6 py-[1cm] sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <FileText className="h-3.5 w-3.5 text-[#1A1E3A]" aria-hidden strokeWidth={2.25} />
            Stage 1 · Plan
          </p>

          <h1
            id="lesson-plan-hero-heading"
            className="max-w-[16ch] xl:max-w-none text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            A full lesson plan, written before your{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              kettle boils.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black sm:text-base">
            Choose your curriculum route, grade, subject, and topic. Get a standards-aligned plan with
            objectives, timings, differentiation, and Bloom&apos;s balance — in under 30 seconds.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Generate a Lesson Plan — Free
            </Link>
            <a
              href="#whats-inside"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:bg-white/90"
            >
              See What&apos;s Inside ↓
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-black">
            <span>
              <span className="text-[#EAB308]">★★★★★</span> Rated by educators
            </span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
              71 curriculum routes
            </span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span>1 credit per plan</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_20px_50px_rgba(26,30,58,0.14)]">
          <div className="flex items-center justify-between gap-3 bg-[#1A1E3A] px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E9A98]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#74FFFD]" />
            </div>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
              Generating lesson plan...
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <h2 className="text-[17px] font-bold tracking-tight text-[#1A1E3A] sm:text-[18px]">
              The Water Cycle — 45 min
            </h2>
            <p className="mt-1.5 text-[12px] leading-snug text-black sm:text-[13px]">
              Cambridge IGCSE · Science · Year 7 · Collaborative Learning
            </p>

            <ul className="mt-5 space-y-2.5">
              {MOCK_ROWS.map((row) => (
                <li
                  key={row.tag}
                  className="flex items-center gap-3 rounded-xl border border-[#e8eef5] bg-[#f8fafc] px-3 py-2.5"
                >
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide',
                      TAG_CLASS[row.tone],
                    )}
                  >
                    {row.tag}
                  </span>
                  <span className="min-w-0 flex-1 text-[12px] leading-snug text-black sm:text-[13px]">
                    {row.text}
                  </span>
                  {row.time ? (
                    <span className="shrink-0 text-[12px] font-semibold text-black">
                      {row.time}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
