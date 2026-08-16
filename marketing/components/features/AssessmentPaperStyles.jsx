'use client'

import { useState } from 'react'
import { cn } from '@marketing/lib/cn'

const STYLES = [
  {
    id: 'exit',
    title: 'Exit ticket',
    blurb: '3 questions · end of lesson',
    duration: '5 min',
    questions: 3,
    marks: 5,
    bloom: [
      { label: 'Recall', pct: 40, tone: 'white' },
      { label: 'Understand', pct: 40, tone: 'teal' },
      { label: 'Apply', pct: 20, tone: 'teal' },
      { label: 'Analyse +', pct: 0, tone: 'mint' },
    ],
    note: 'Exit tickets stay light — quick evidence of what landed, without formal analyse marks.',
  },
  {
    id: 'quick',
    title: 'Quick check',
    blurb: '5–6 questions · mid-lesson pulse',
    duration: '10 min',
    questions: 6,
    marks: 10,
    bloom: [
      { label: 'Recall', pct: 30, tone: 'white' },
      { label: 'Understand', pct: 35, tone: 'teal' },
      { label: 'Apply', pct: 25, tone: 'teal' },
      { label: 'Analyse +', pct: 10, tone: 'mint' },
    ],
    note: 'Quick checks lean on recall and understanding — enough apply to see if students can use the idea.',
  },
  {
    id: 'practice',
    title: 'Practice worksheet',
    blurb: '8–10 questions · homework / cover',
    duration: '25 min',
    questions: 9,
    marks: 20,
    bloom: [
      { label: 'Recall', pct: 25, tone: 'white' },
      { label: 'Understand', pct: 30, tone: 'teal' },
      { label: 'Apply', pct: 30, tone: 'teal' },
      { label: 'Analyse +', pct: 15, tone: 'mint' },
    ],
    note: 'Practice papers widen the spread — more apply marks, with a light analyse stretch at the end.',
  },
  {
    id: 'summative',
    title: 'Full summative test',
    blurb: 'Mixed types · formal assessment',
    duration: '40 min',
    questions: 12,
    marks: 30,
    bloom: [
      { label: 'Recall', pct: 20, tone: 'white' },
      { label: 'Understand', pct: 25, tone: 'teal' },
      { label: 'Apply', pct: 30, tone: 'teal' },
      { label: 'Analyse +', pct: 25, tone: 'mint' },
    ],
    note: 'Summative tests enforce the full Bloom spread — including analyse-and-evaluate marks for higher-order evidence.',
  },
]

const BAR_CLASS = {
  white: 'bg-white',
  teal: 'bg-[#35BEBC]',
  mint: 'bg-[#9fd9d4]',
}

export default function AssessmentPaperStyles() {
  const [activeId, setActiveId] = useState('summative')
  const active = STYLES.find((s) => s.id === activeId) ?? STYLES[3]

  return (
    <section
      className="bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="paper-styles-heading"
    >
      <div className="fp-shell-md px-4 sm:px-6 md:px-8">
        <p className="mb-3 flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Paper styles
        </p>
        <h2
          id="paper-styles-heading"
          className="max-w-full text-center text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-white md:whitespace-nowrap"
        >
          Pick a style. Watch the paper{' '}
          <span className="pricing-hero-underline relative inline-block">re-balance itself.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[14px] leading-relaxed text-white sm:text-[15px]">
          Each paper style carries its own question count and Bloom weighting. Adjust only when you
          need to.
        </p>

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
          <ul className="flex flex-col gap-3">
            {STYLES.map((style) => {
              const on = style.id === activeId
              return (
                <li key={style.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(style.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left transition sm:px-5',
                      on
                        ? 'bg-[#35BEBC] text-white'
                        : 'bg-white/5 text-white hover:bg-white/10',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold sm:text-[16px]">{style.title}</span>
                      <span
                        className={cn(
                          'mt-1 block text-[12px] sm:text-[13px]',
                          on ? 'text-white' : 'text-white',
                        )}
                      >
                        {style.blurb}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'shrink-0 text-[13px] font-semibold',
                        on ? 'text-white' : 'text-white',
                      )}
                    >
                      {style.duration}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="relative overflow-hidden rounded-[28px] bg-white/5 p-5 sm:rounded-[32px] sm:p-7">
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#35BEBC]/40"
              aria-hidden
            />

            <div className="relative z-[1] flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[1.15rem] font-bold text-white sm:text-[1.25rem]">{active.title}</h3>
              <p className="text-[13px] font-semibold text-white sm:text-[14px]">
                {active.questions} questions · {active.marks} marks
              </p>
            </div>

            <ul className="relative z-[1] mt-6 space-y-3.5">
              {active.bloom.map((row) => (
                <li key={row.label} className="grid grid-cols-[6.5rem_1fr_2.75rem] items-center gap-3 sm:grid-cols-[7.5rem_1fr_3rem]">
                  <span className="text-[13px] font-medium text-white">{row.label}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn('h-full rounded-full', BAR_CLASS[row.tone])}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="text-right text-[13px] font-semibold text-white">{row.pct}%</span>
                </li>
              ))}
            </ul>

            <p className="relative z-[1] mt-7 rounded-2xl bg-white/10 px-4 py-3 text-[13px] leading-relaxed text-white backdrop-blur-sm sm:text-[14px]">
              {active.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
