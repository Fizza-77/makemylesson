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

function SoftArrow({ active }) {
  return (
    <svg
      className={cn(
        'h-5 w-11 shrink-0 overflow-visible transition-opacity duration-200',
        active ? 'opacity-100' : 'opacity-40',
      )}
      viewBox="0 0 44 14"
      fill="none"
      aria-hidden
    >
      <path d="M1 7 H32" stroke="#35BEBC" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M1 7 C 11 6.4, 21 7.6, 31 7"
        stroke="#35BEBC"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M28.5 3.6 L36.5 7 L28.5 10.4"
        stroke="#35BEBC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DocHeader() {
  return (
    <>
      <div className="mb-1 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#35BEBC]">
        <Globe className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
        Cambridge IGCSE · Science · Year 7
      </div>
      <h3 className="mt-2 text-[1.65rem] font-bold tracking-tight text-[#1A1E3A] sm:text-[1.85rem]">
        The Water Cycle
      </h3>
      <p className="mt-1.5 text-[13px] text-black">
        45 minutes · Collaborative Learning · Generated in 26s
      </p>
    </>
  )
}

export default function LessonPlanWhatsInside() {
  const [active, setActive] = useState(null)

  return (
    <section
      id="whats-inside"
      className="scroll-mt-28 bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="whats-inside-heading"
    >
      <div className="fp-shell px-4 sm:px-6 md:px-8">
        <p className="mb-4 flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#35BEBC]">
            <FileText className="h-3.5 w-3.5 text-white" aria-hidden strokeWidth={2.25} />
          </span>
          What&apos;s inside
        </p>

        <h2
          id="whats-inside-heading"
          className="max-w-full text-center text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white md:whitespace-nowrap"
        >
          Anatomy of a{' '}
          <span className="pricing-hero-underline pricing-hero-underline--soft relative inline-block">
            generated plan.
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-white sm:text-base md:max-w-none md:whitespace-nowrap">
          Hover any section of the document — or any note on the right —{' '}
          <br className="md:hidden" />
          to see what the generator builds into it and why.
        </p>

        {/* Mobile */}
        <div className="mt-10 overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] lg:hidden">
          <div className="px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
            <DocHeader />
            <div className="my-5 h-px bg-[#e8eef5]" />
          </div>
          <ul className="space-y-2 px-3 pb-5 sm:px-4 sm:pb-6">
            {ITEMS.map((item) => {
              const on = active === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActive(on ? null : item.id)}
                    className={cn(
                      'w-full rounded-2xl border border-transparent px-3 py-3.5 text-left transition sm:px-3.5',
                      on && 'border-[#35BEBC]/45 bg-[#eaf7f6]',
                    )}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[14px] font-bold leading-snug text-[#1A1E3A]">
                      {item.primary}
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-black">{item.secondary}</p>
                  </button>
                  <div
                    className={cn(
                      'mt-2 flex gap-3 rounded-2xl border bg-[#f4f8fb] px-4 py-3.5 text-[#1A1E3A]',
                      on ? 'border-[#35BEBC]' : 'border-transparent',
                    )}
                  >
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#35BEBC]" aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold leading-snug">{item.noteTitle}</span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed">{item.noteBody}</span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Desktop: left section → soft arrow → matching note */}
        <div className="mt-12 hidden lg:grid lg:grid-cols-[minmax(0,1.15fr)_2.75rem_minmax(0,0.85fr)]">
          {/* Header row */}
          <div className="rounded-t-[28px] bg-white px-8 pb-0 pt-8 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <DocHeader />
            <div className="mt-6 h-px bg-[#e8eef5]" />
          </div>
          <div aria-hidden />
          <div aria-hidden />

          {ITEMS.map((item, i) => {
            const on = active === item.id
            const isLast = i === ITEMS.length - 1
            const bind = {
              onMouseEnter: () => setActive(item.id),
              onMouseLeave: () => setActive(null),
              onFocus: () => setActive(item.id),
              onBlur: () => setActive(null),
            }

            return (
              <div key={item.id} className="contents">
                <div
                  className={cn(
                    'bg-white px-8 shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
                    i === 0 ? 'pt-2' : 'pt-0',
                    isLast ? 'rounded-b-[28px] pb-7' : 'pb-0',
                  )}
                  onMouseEnter={bind.onMouseEnter}
                  onMouseLeave={bind.onMouseLeave}
                >
                  <button
                    type="button"
                    {...bind}
                    className={cn(
                      'w-full rounded-xl border border-transparent px-3.5 py-3.5 text-left transition',
                      on && 'border-[#35BEBC]/45 bg-[#eaf7f6]',
                    )}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[15px] font-bold leading-snug text-[#1A1E3A]">
                      {item.primary}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-black">{item.secondary}</p>
                  </button>
                </div>

                <div
                  className="flex items-center justify-center"
                  onMouseEnter={bind.onMouseEnter}
                  onMouseLeave={bind.onMouseLeave}
                  aria-hidden
                >
                  <SoftArrow active={on} />
                </div>

                <div
                  className={cn('flex items-center', !isLast && 'pb-3')}
                  onMouseEnter={bind.onMouseEnter}
                  onMouseLeave={bind.onMouseLeave}
                >
                  <button
                    type="button"
                    {...bind}
                    className={cn(
                      'flex w-full gap-3 rounded-2xl border bg-white px-5 py-4 text-left text-[#1A1E3A] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition',
                      on
                        ? 'border-[#35BEBC] ring-2 ring-[#35BEBC]/35'
                        : 'border-transparent hover:border-[#35BEBC]/35',
                    )}
                  >
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#35BEBC]"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold leading-snug text-[#1A1E3A]">
                        {item.noteTitle}
                      </span>
                      <span className="mt-1.5 block text-[14px] leading-relaxed text-[#1A1E3A]">
                        {item.noteBody}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
