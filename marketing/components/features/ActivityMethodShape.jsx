'use client'

import { useState } from 'react'
import { RefreshCw, Gamepad2, Search, Users, PersonStanding } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const METHODS = [
  {
    id: 'collaborative',
    label: 'Collaborative',
    badge: 'Food chains · Collaborative version',
    rows: [
      {
        icon: Users,
        text: 'Groups of four with assigned roles: reader, recorder, checker, reporter — printed on the sheet.',
      },
      {
        icon: RefreshCw,
        text: 'Each question ends with a “compare with the next pair” step before the class check.',
      },
    ],
  },
  {
    id: 'gamification',
    label: 'Gamification',
    badge: 'Food chains · Gamification version',
    rows: [
      {
        icon: Gamepad2,
        text: 'Points unlock on correct sorts — a visible score track sits at the top of the sheet.',
      },
      {
        icon: RefreshCw,
        text: 'A timed “boss round” question closes the activity before you reveal the key.',
      },
    ],
  },
  {
    id: 'inquiry',
    label: 'Inquiry-Based',
    badge: 'Food chains · Inquiry version',
    rows: [
      {
        icon: Search,
        text: 'Opens with a puzzling claim students must test using the organism cards.',
      },
      {
        icon: RefreshCw,
        text: 'Evidence table on the sheet — write findings before any formal explanation.',
      },
    ],
  },
  {
    id: 'kinesthetic',
    label: 'Kinesthetic',
    badge: 'Food chains · Kinesthetic version',
    rows: [
      {
        icon: PersonStanding,
        text: 'Students physically sort organism cards into producer / consumer zones on the floor.',
      },
      {
        icon: RefreshCw,
        text: 'Gallery walk: each group rotates and annotates another group’s chain before the check.',
      },
    ],
  },
]

export default function ActivityMethodShape() {
  const [activeId, setActiveId] = useState(METHODS[0].id)
  const active = METHODS.find((m) => m.id === activeId) ?? METHODS[0]

  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="method-shape-heading"
    >
      <div className="mx-auto max-w-[920px] px-4 text-center sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
          Shaped by your method
        </p>
        <h2
          id="method-shape-heading"
          className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
        >
          Same topic.{' '}
          <span className="pricing-hero-underline pricing-hero-underline--straight relative inline-block whitespace-nowrap">
            Different classroom.
          </span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-black sm:text-base">
          Your teaching method changes how the activity runs — not just what it asks.
        </p>

        <div className="mt-8 rounded-[28px] bg-[#1A1E3A] p-5 text-left sm:mt-10 sm:rounded-[32px] sm:p-7">
          <div className="flex flex-wrap gap-2">
            {METHODS.map((method) => {
              const on = method.id === activeId
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setActiveId(method.id)}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-[13px] font-semibold transition sm:px-4',
                    on
                      ? 'bg-[#35BEBC] text-[#1A1E3A]'
                      : 'bg-white text-black hover:bg-white/90',
                  )}
                >
                  {method.label}
                </button>
              )
            })}
          </div>

          <p className="mt-5 inline-flex rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1E9A98]">
            {active.badge}
          </p>

          <ul className="mt-4 space-y-3">
            {active.rows.map((row) => {
              const Icon = row.icon
              return (
                <li
                  key={row.text}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 sm:px-5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d8f0f4] text-[#1A1E3A]">
                    <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
                  </span>
                  <p className="text-[14px] leading-relaxed text-black sm:text-[15px]">
                    {row.text}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}


