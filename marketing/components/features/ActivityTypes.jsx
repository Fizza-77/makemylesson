'use client'

import { useState } from 'react'
import { ArrowLeftRight, ArrowUpDown, MessageSquare, Minus, Tag } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const TYPES = [
  {
    id: 'gap-fill',
    label: 'Gap-fill',
    icon: Minus,
    title: 'Gap-fill',
    body: 'Sentences with missing key terms, quick to run, quick to mark, and the fastest check that core vocabulary landed.',
    bestFor: 'vocabulary-heavy topics',
    bestRest: 'and starters',
    previewTone: 'teal',
    preview: [
      { q: 'Q1', text: 'Water turns to vapour by ________' },
      { q: 'Q2', text: 'Clouds form through ________' },
      { q: 'Q3', text: 'Rain and snow are types of ________' },
    ],
  },
  {
    id: 'matching',
    label: 'Matching',
    icon: ArrowLeftRight,
    title: 'Matching',
    body: 'Pair terms with definitions or stages with descriptions — strong for retrieval without writing full sentences.',
    bestFor: 'definitions and processes',
    bestRest: 'before a written task',
    previewTone: 'navy',
    preview: [
      { q: 'A', text: 'Evaporation  →  ______' },
      { q: 'B', text: 'Condensation  →  ______' },
      { q: 'C', text: 'Precipitation  →  ______' },
    ],
  },
  {
    id: 'labelling',
    label: 'Labelling',
    icon: Tag,
    title: 'Labelling',
    body: 'Students name parts of a diagram or sequence — ideal when the topic is visual and spatial.',
    bestFor: 'diagrams and cycles',
    bestRest: 'with clear parts',
    previewTone: 'teal',
    preview: [
      { q: '1', text: 'Label: sun → ocean → ______' },
      { q: '2', text: 'Label: cloud formation stage' },
      { q: '3', text: 'Label: return to ground' },
    ],
  },
  {
    id: 'sorting',
    label: 'Sorting',
    icon: ArrowUpDown,
    title: 'Sorting',
    body: 'Cards or statements sorted into categories — builds classification skill without long writing.',
    bestFor: 'categories and contrasts',
    bestRest: 'mid-lesson checks',
    previewTone: 'navy',
    preview: [
      { q: 'A', text: 'Sort: liquid / gas / solid' },
      { q: 'B', text: 'Sort: cause / effect' },
      { q: 'C', text: 'Sort: true / false claims' },
    ],
  },
  {
    id: 'open',
    label: 'Open response',
    icon: MessageSquare,
    title: 'Open response',
    body: 'Short written answers with a mark scheme on the key — deeper thinking without a full exam paper.',
    bestFor: 'explain and apply',
    bestRest: 'plenaries and exits',
    previewTone: 'teal',
    preview: [
      { q: 'Q1', text: 'Explain why puddles shrink on a hot day.' },
      { q: 'Q2', text: 'Give one reason clouds form.' },
      { q: 'Q3', text: 'Describe precipitation in your own words.' },
    ],
  },
]

export default function ActivityTypes() {
  const [activeId, setActiveId] = useState(TYPES[0].id)
  const active = TYPES.find((t) => t.id === activeId) ?? TYPES[0]
  const Icon = active.icon

  return (
    <section
      id="activity-types"
      className="scroll-mt-28 bg-[#ade5df] py-14 sm:py-16 lg:py-20"
      aria-labelledby="activity-types-heading"
    >
      <div className="fp-shell-md px-4 text-center sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
          Activity types
        </p>
        <h2
          id="activity-types-heading"
          className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
        >
          The right format for{' '}
          <span className="pricing-hero-underline pricing-hero-underline--straight relative inline-block whitespace-nowrap">
            the right topic.
          </span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-black sm:text-base">
          Tap a type to preview how it looks on the student sheet.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10">
          {TYPES.map((type) => {
            const TabIcon = type.icon
            const on = type.id === activeId
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setActiveId(type.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition sm:px-4',
                  on
                    ? 'border-[#1A1E3A] bg-[#1A1E3A] text-white'
                    : 'border-white/70 bg-white text-black hover:border-[#1A1E3A]/25',
                )}
              >
                <TabIcon className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
                {type.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid gap-8 rounded-[28px] bg-[#1A1E3A] p-6 text-left sm:mt-8 sm:rounded-[32px] sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 text-white">
              <Icon className="h-4 w-4 text-[#35BEBC]" aria-hidden strokeWidth={2.25} />
              <h3 className="text-[1.25rem] font-bold tracking-tight sm:text-[1.35rem]">
                {active.title}
              </h3>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-white sm:text-base">
              {active.body}
            </p>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-[13px] leading-relaxed text-white sm:text-[14px]">
              Best for:{' '}
              <span className="font-semibold text-[#35BEBC]">{active.bestFor}</span> {active.bestRest}
            </div>
          </div>

          <div
            className={cn(
              'rounded-[22px] p-4 sm:p-5',
              active.previewTone === 'teal' ? 'bg-[#35BEBC]' : 'bg-[#242845]',
            )}
          >
            <ul className="space-y-2.5">
              {active.preview.map((row) => (
                <li
                  key={row.q + row.text}
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-[13px] leading-snug text-[#1A1E3A] sm:text-[14px]"
                >
                  <span className="inline-flex shrink-0 rounded-md bg-[#d8f0f4] px-2 py-1 text-[11px] font-bold text-[#1E9A98]">
                    {row.q}
                  </span>
                  <span className="min-w-0">{row.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}


