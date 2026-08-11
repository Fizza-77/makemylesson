'use client'

import { useState } from 'react'
import { cn } from '@marketing/lib/cn'

const SLIDES = [
  {
    id: 'title',
    num: '01',
    label: 'Title',
    phase: 'Opening the lesson',
    title: 'Title',
    body: 'Topic, route, and grade on one clean slide — so the board is set before the bell.',
    previewTitle: 'Exploring Ecosystems',
  },
  {
    id: 'objectives',
    num: '02',
    label: 'Objectives',
    phase: 'Opening the lesson',
    title: 'Objectives',
    body: 'Syllabus-mapped goals students can see — so everyone knows what “done” looks like today.',
    previewTitle: 'By the end of this lesson…',
  },
  {
    id: 'vocabulary',
    num: '03',
    label: 'Vocabulary',
    phase: 'Building language',
    title: 'Vocabulary',
    body: 'Key terms with student-friendly definitions — front-loaded before the content gets dense.',
    previewTitle: 'Key terms',
  },
  {
    id: 'hook',
    num: '04',
    label: 'Hook',
    phase: 'Sparking curiosity',
    title: 'Hook',
    body: 'A short prompt or question that activates prior knowledge and pulls the room in.',
    previewTitle: 'What makes a place an ecosystem?',
  },
  {
    id: 'core',
    num: '05',
    label: 'Core ×2–4',
    phase: 'Teaching the content',
    title: 'Core content',
    body: 'Two to four teaching slides paced to your duration — explanations, diagrams, and checking questions.',
    previewTitle: 'Producers → consumers → decomposers',
  },
  {
    id: 'discussion',
    num: '06',
    label: 'Discussion',
    phase: 'Making thinking visible',
    title: 'Discussion',
    body: 'Structured talk prompts shaped by your teaching method — not a free-for-all Q&A.',
    previewTitle: 'Talk in pairs',
  },
  {
    id: 'practice',
    num: '07',
    label: 'Practice',
    phase: 'Applying the learning',
    title: 'Practice',
    body: 'A short task students can do on the slide or on paper — with clear success criteria.',
    previewTitle: 'Label the food chain',
  },
  {
    id: 'recap',
    num: '08',
    label: 'Recap',
    phase: 'Closing the lesson',
    title: 'Recap',
    body: 'A crisp exit check that mirrors the objectives — ready to feed Stage 4 assessment.',
    previewTitle: 'Exit ticket',
  },
]

export default function SlideDeckSequence() {
  const [activeId, setActiveId] = useState(SLIDES[0].id)
  const active = SLIDES.find((s) => s.id === activeId) ?? SLIDES[0]

  return (
    <section
      id="slide-sequence"
      className="relative scroll-mt-28 overflow-hidden bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="slide-sequence-heading"
    >
      <div
        className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#35BEBC]/80"
        aria-hidden
      />

      <div className="relative z-[1] fp-shell-md px-4 sm:px-6 md:px-8">
        <p className="mb-4 flex items-center gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#74FFFD]" />
        </p>
        <h2
          id="slide-sequence-heading"
          className="whitespace-nowrap text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-white"
        >
          Eight slides,{' '}
          <span className="pricing-hero-underline relative inline-block">in teaching order.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 sm:text-base">
          Click any slide in the strip to see what the generator builds into it — this is a
          pedagogical sequence, not a stack of bullet points.
        </p>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 sm:mt-10 sm:gap-2.5">
          {SLIDES.map((slide) => {
            const on = slide.id === activeId
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveId(slide.id)}
                className={cn(
                  'flex min-w-[5.75rem] flex-1 flex-col rounded-xl px-3 py-3 text-left transition sm:min-w-0',
                  on
                    ? 'bg-[#35BEBC] text-white shadow-[0_8px_20px_rgba(53,190,188,0.25)]'
                    : 'border border-white/10 border-b-[3px] border-b-[#35BEBC] bg-white/[0.06] text-white hover:bg-white/10',
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-semibold tabular-nums',
                    on ? 'text-white/80' : 'text-white/55',
                  )}
                >
                  {slide.num}
                </span>
                <span className="mt-1 text-[12px] font-bold leading-tight text-white sm:text-[13px]">
                  {slide.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 grid items-center gap-8 rounded-[28px] bg-[#EAF5F6] p-6 sm:mt-6 sm:gap-10 sm:rounded-[32px] sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:p-10">
          <div>
            <span className="inline-flex rounded-full bg-[#35BEBC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
              {active.phase}
            </span>
            <h3 className="mt-4 text-[1.65rem] font-bold tracking-tight text-[#1A1E3A] sm:text-[1.85rem]">
              {active.title}
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#1A1E3A]/65 sm:text-base">
              {active.body}
            </p>
          </div>

          <div className="relative min-h-[180px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#e8f8f6] via-[#c5ebe8] to-[#35BEBC] p-6 sm:min-h-[220px] sm:p-8">
            <h4 className="whitespace-nowrap text-[1.25rem] font-bold leading-tight tracking-tight text-[#1A1E3A] sm:text-[1.45rem]">
              {active.previewTitle}
            </h4>
            <div className="mt-5 space-y-2" aria-hidden>
              <div className="h-2 w-40 rounded-full bg-[#1A1E3A]/15" />
              <div className="h-2 w-28 rounded-full bg-[#1A1E3A]/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
