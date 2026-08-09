'use client'

import { useState } from 'react'
import { FileText, Globe } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const ITEMS = [
  {
    id: 'objectives',
    label: 'Learning Objectives',
    primary: 'Describe the three stages of the water cycle using key terms.',
    secondary: '+2 more · each mapped to a syllabus statement',
    noteTitle: 'Objectives that cite your syllabus',
    noteBody:
      'Every objective maps to a real statement in your chosen route — not a paraphrase of the topic.',
  },
  {
    id: 'starter',
    label: 'Starter · 10 min',
    primary: "Think-pair-share: 'Where did today's rain come from?'",
    secondary: 'Activates prior knowledge · pairs assigned by the method',
    noteTitle: 'Timed, not vague',
    noteBody:
      'Sections carry minute allocations that add up to your chosen lesson length.',
  },
  {
    id: 'core',
    label: 'Core Teaching · 20 min',
    primary: 'Evaporation → condensation → precipitation, with checking questions.',
    secondary: 'Uses IGCSE command words: describe, explain, state',
    noteTitle: "Your board's command words",
    noteBody:
      'IGCSE plans use IGCSE verbs; HSC plans use HSC verbs. The language matches the exam.',
  },
  {
    id: 'diff',
    label: 'Differentiation',
    primary: 'Support, core, and stretch pathways for the practice task.',
    secondary: 'ELL glossary · SEN scaffold · gifted extension',
    noteTitle: 'Differentiation by default',
    noteBody:
      'Three pathways generate automatically — you never bolt them on afterwards.',
  },
  {
    id: 'exit',
    label: 'Exit Ticket · 5 min',
    primary: 'One-sentence summary + traffic-light self-rating.',
    secondary: 'Feeds Stage 4 — the assessment mirrors what was taught',
    noteTitle: 'Connected to the next stage',
    noteBody:
      'The exit ticket and objectives feed the slides, activity, and assessment that follow.',
  },
]

export default function LessonPlanWhatsInside() {
  const [active, setActive] = useState(null)

  return (
    <section
      id="whats-inside"
      className="scroll-mt-28 bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="whats-inside-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#35BEBC]">
            <FileText className="h-3.5 w-3.5 text-white" aria-hidden strokeWidth={2.25} />
          </span>
          What&apos;s inside
        </p>

        <h2
          id="whats-inside-heading"
          className="whitespace-nowrap text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white"
        >
          Anatomy of a{' '}
          <span className="pricing-hero-underline pricing-hero-underline--light relative inline-block">
            generated plan.
          </span>
        </h2>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 sm:text-base">
          Hover any section of the document — or any note on the right — to see what the generator
          builds into it and why.
        </p>

        <div className="mt-10 grid items-start gap-5 lg:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <article className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:p-8">
            <div className="mb-1 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#35BEBC]">
              <Globe className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
              Cambridge IGCSE · Science · Year 7
            </div>
            <h3 className="mt-2 text-[1.65rem] font-bold tracking-tight text-[#1A1E3A] sm:text-[1.85rem]">
              The Water Cycle
            </h3>
            <p className="mt-1.5 text-[13px] text-[#4B5068]">
              45 minutes · Collaborative Learning · Generated in 26s
            </p>
            <div className="my-5 h-px bg-[#e8eef5]" />

            <ul className="space-y-1">
              {ITEMS.map((item) => {
                const on = active === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(item.id)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(item.id)}
                      onBlur={() => setActive(null)}
                      className={cn(
                        'w-full rounded-2xl border border-transparent px-3 py-3 text-left transition sm:px-3.5 sm:py-3.5',
                        on && 'border-[#35BEBC]/35 bg-[#eaf7f6]',
                      )}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B5068]">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-[14px] font-bold leading-snug text-[#1A1E3A] sm:text-[15px]">
                        {item.primary}
                      </p>
                      <p className="mt-1 text-[12px] leading-snug text-[#4B5068] sm:text-[13px]">
                        {item.secondary}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </article>

          <ul className="flex flex-col gap-3">
            {ITEMS.map((item) => {
              const on = active === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(item.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(item.id)}
                    onBlur={() => setActive(null)}
                    className={cn(
                      'flex w-full gap-3 rounded-2xl border px-4 py-4 text-left transition sm:px-5',
                      on
                        ? 'border-[#35BEBC]/50 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]',
                    )}
                  >
                    <span
                      className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-[#35BEBC]"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold leading-snug text-white sm:text-[15px]">
                        {item.noteTitle}
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
                        {item.noteBody}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
