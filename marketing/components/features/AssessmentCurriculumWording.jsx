'use client'

import { useState } from 'react'
import { cn } from '@marketing/lib/cn'

const ROUTES = [
  {
    id: 'igcse',
    label: 'Cambridge IGCSE',
    command: 'Describe',
    rest: 'the processes by which water moves from the ocean to the atmosphere. [3]',
    caption: 'IGCSE-style command words and mark notation are used in the question wording.',
  },
  {
    id: 'edexcel',
    label: 'Edexcel A Level',
    command: 'Explain',
    rest: 'how energy transfer drives the movement of water through the hydrological cycle. [6]',
    caption: 'Edexcel A Level stems use explain / assess language and higher mark tariffs.',
  },
  {
    id: 'hsc',
    label: 'NSW HSC',
    command: 'Account for',
    rest: 'the processes that move water from oceans into the atmosphere. [3]',
    caption: 'HSC verbs like account for and evaluate shape how students are expected to respond.',
  },
  {
    id: 'ap',
    label: 'AP',
    command: 'Describe',
    rest: 'ONE process that transfers water from the ocean to the atmosphere. [1]',
    caption: 'AP free-response wording stays concise, with clear point-value notation.',
  },
  {
    id: 'ib',
    label: 'IB MYP',
    command: 'Outline',
    rest: 'how water moves from the ocean into the atmosphere. [3]',
    caption: 'IB MYP command terms (outline, explain, discuss) sit visibly in the stem.',
  },
]

export default function AssessmentCurriculumWording() {
  const [activeId, setActiveId] = useState(ROUTES[0].id)
  const active = ROUTES.find((r) => r.id === activeId) ?? ROUTES[0]

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20" aria-labelledby="curriculum-wording-heading">
      <div className="fp-shell-md px-4 sm:px-6 md:px-8">
        <div className="overflow-hidden rounded-[28px] sm:rounded-[36px] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#ade5df] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              </span>
              Curriculum-aware wording
            </p>
            <h2
              id="curriculum-wording-heading"
              className="max-w-[14ch] xl:max-w-none text-[clamp(1.35rem,2.6vw,1.85rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
            >
              <span className="block">Same topic.</span>
              <span className="pricing-hero-underline pricing-hero-underline--soft relative inline-block whitespace-nowrap">
                Different exam language.
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-black sm:text-base">
              Switch the curriculum route and see the command style change with it.
            </p>
          </div>

          <div className="flex flex-col justify-center bg-[#1A1E3A] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <div className="flex flex-wrap justify-center gap-2">
              {ROUTES.map((route) => {
                const on = route.id === activeId
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setActiveId(route.id)}
                    className={cn(
                      'rounded-full border px-3.5 py-2 text-[12px] font-semibold transition sm:text-[13px]',
                      on
                        ? 'border-[#35BEBC] bg-[#35BEBC] text-white'
                        : 'border-white/20 bg-transparent text-white hover:border-white/40',
                    )}
                  >
                    {route.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-center sm:mt-8 sm:px-6 sm:py-6">
              <p className="text-[15px] leading-relaxed text-white sm:text-[16px]">
                <span className="mr-1.5 inline-flex rounded-md bg-[#35BEBC] px-2 py-0.5 font-bold text-white">
                  {active.command}
                </span>
                {active.rest}
              </p>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white sm:text-[12px]">
              {active.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
