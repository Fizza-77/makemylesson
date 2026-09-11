'use client'

import { useState } from 'react'
import { Pencil, Users } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const PROFILES = [
  {
    id: 'core',
    label: 'Core class',
    badge: 'Practice task · Core',
    task: 'Label the water-cycle diagram using the six key terms, then explain one stage in your own words to your partner.',
    meta: 'Mixed-ability pairs · 10 minutes · whole-class check at the end.',
  },
  {
    id: 'ell',
    label: 'ELL learners',
    badge: 'Practice task · ELL',
    task: 'Match the six key terms to labelled diagram parts using the bilingual glossary, then say one stage aloud with your partner.',
    meta: 'Same-language pairs where possible · 12 minutes · teacher models first.',
  },
  {
    id: 'sen',
    label: 'SEN support',
    badge: 'Practice task · SEN',
    task: 'Complete the partially labelled diagram with word-bank support, then choose the correct sentence for one stage.',
    meta: '1:1 or small group · 10 minutes · visual checklist on the desk.',
  },
  {
    id: 'gifted',
    label: 'Gifted stretch',
    badge: 'Practice task · Stretch',
    task: 'Label the diagram, then design a real-world analogy for one stage and challenge a peer to critique it.',
    meta: 'Independent or pairs · 10 minutes · share analogies with the class.',
  },
]

export default function LessonPlanDifferentiation() {
  const [activeId, setActiveId] = useState('core')
  const active = PROFILES.find((p) => p.id === activeId) ?? PROFILES[0]

  return (
    <section
      className="bg-[#ade5df] py-14 sm:py-16 lg:py-20"
      aria-labelledby="differentiation-heading"
    >
      <div className="mx-auto max-w-[920px] px-4 text-center sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
          Differentiation
        </p>
        <h2
          id="differentiation-heading"
          className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
        >
          One plan.{' '}
          <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
            Every learner.
          </span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-black sm:text-base">
          Tap a learner profile to see how the same practice task adapts.
        </p>

        <div className="mt-8 rounded-[28px] bg-white p-5 text-left shadow-[0_12px_40px_rgba(26,30,58,0.18),0_2px_10px_rgba(26,30,58,0.08)] sm:mt-10 sm:rounded-[32px] sm:p-7">
          <div className="flex flex-wrap gap-2">
            {PROFILES.map((profile) => {
              const on = profile.id === activeId
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setActiveId(profile.id)}
                  className={cn(
                    'rounded-full border px-3.5 py-2 text-[13px] font-semibold transition sm:px-4',
                    on
                      ? 'border-[#1A1E3A] bg-[#1A1E3A] text-white'
                      : 'border-[#d5dde8] bg-white text-black hover:border-[#1A1E3A]/35',
                  )}
                >
                  {profile.label}
                </button>
              )
            })}
          </div>

          <p className="mt-5 inline-flex rounded-full bg-[#d8f3ef] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1E9A98]">
            {active.badge}
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-[#f4f7fa] px-4 py-3.5 sm:px-5">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#35BEBC]/20 text-[#1E9A98]">
                <Pencil className="h-4 w-4" aria-hidden strokeWidth={2.25} />
              </span>
              <p className="pt-1 text-[13px] leading-relaxed text-[#1A1E3A] sm:text-[14px]">
                {active.task}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-[#f4f7fa] px-4 py-3.5 sm:px-5">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#35BEBC]/20 text-[#1E9A98]">
                <Users className="h-4 w-4" aria-hidden strokeWidth={2.25} />
              </span>
              <p className="pt-1 text-[13px] leading-relaxed text-[#1A1E3A] sm:text-[14px]">
                {active.meta}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


