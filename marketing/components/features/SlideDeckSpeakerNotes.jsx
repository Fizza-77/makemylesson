'use client'

import { useState } from 'react'
import { cn } from '@marketing/lib/cn'

const BULLETS = [
  'Producers make their own energy from sunlight',
  'Consumers get energy by eating other organisms',
  'Every chain begins with the sun',
]

const PRESENTER_NOTE =
  'Ask: who can name a producer in our local area? Write three answers on the board before revealing the next slide.'

export default function SlideDeckSpeakerNotes() {
  const [view, setView] = useState('class')
  const isClass = view === 'class'

  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="speaker-notes-heading"
    >
      <div className="fp-shell-md grid items-center gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
            </span>
            Speaker notes
          </p>
          <h2
            id="speaker-notes-heading"
            className="whitespace-nowrap text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            What the class sees.{' '}
            <span className="pricing-hero-underline relative inline-block">What you see.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#1A1E3A]/55 sm:text-base">
            Every slide ships with presenter notes already written — flip the switch to reveal them.
          </p>
        </div>

        <div className="rounded-[28px] bg-[#1A1E3A] p-5 sm:rounded-[32px] sm:p-6 lg:p-7">
          <div className="flex flex-col items-center">
            <div className="inline-flex rounded-full bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setView('class')}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                  isClass ? 'bg-[#35BEBC] text-white' : 'text-white/55 hover:text-white/80',
                )}
              >
                Class view
              </button>
              <button
                type="button"
                onClick={() => setView('presenter')}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                  !isClass ? 'bg-[#35BEBC] text-white' : 'text-white/55 hover:text-white/80',
                )}
              >
                Presenter view
              </button>
            </div>
            <p className="mt-3 text-center text-[12px] text-white/45">
              {isClass
                ? 'Class view — clean slide, no clutter.'
                : 'Presenter view — your notes stay off the board.'}
            </p>
          </div>

          <div
            className="mt-5 overflow-hidden rounded-[22px] p-6 sm:mt-6 sm:min-h-[260px] sm:p-8"
            style={{
              background: 'linear-gradient(to right, #F4FAFA 0%, #35BEBC 100%)',
            }}
          >
            <h3 className="text-[1.35rem] font-bold leading-tight tracking-tight text-[#1A1E3A] sm:text-[1.55rem]">
              Food Chains: Who Eats Whom?
            </h3>
            <ul className="mt-5 space-y-2.5">
              {BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#1A1E3A] sm:text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A1E3A]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            {!isClass ? (
              <div className="mt-6 rounded-2xl bg-[#1A1E3A]/90 px-4 py-3 text-[13px] leading-relaxed text-white/90">
                <span className="font-semibold text-[#35BEBC]">Speaker note · </span>
                {PRESENTER_NOTE}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
