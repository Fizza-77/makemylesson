'use client'

import { useState } from 'react'
import { cn } from '@marketing/lib/cn'

const STUDENT = {
  footer: 'Student sheet — questions only, ready to photocopy.',
  rows: [
    {
      id: 'q3',
      text: 'Q3. Sort these organisms into producers and consumers: grass, rabbit, oak tree, fox.',
    },
    {
      id: 'q4',
      text: 'Q4. Explain what would happen to the foxes if all the rabbits disappeared.',
    },
  ],
}

const TEACHER = {
  footer: 'Teacher key — answers plus marking guidance only you can see.',
  rows: [
    {
      id: 'q3',
      text: 'Q3. Producers: grass, oak tree. Consumers: rabbit, fox.',
      tip: '1 mark for each correct pair · accept plant / animal wording.',
    },
    {
      id: 'q4',
      text: 'Q4. Fox population would fall / starve / decline due to less food.',
      tip: 'Award for clear cause–effect · accept “move away” as stretch.',
    },
  ],
}

export default function ActivityTeacherCopy() {
  const [view, setView] = useState('student')
  const isStudent = view === 'student'
  const data = isStudent ? STUDENT : TEACHER

  return (
    <section
      className="bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="teacher-copy-heading"
    >
      <div className="mx-auto max-w-[820px] px-4 text-center sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
          The teacher&apos;s copy
        </p>
        <h2
          id="teacher-copy-heading"
          className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white"
        >
          Flip to see what{' '}
          <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
            only you get.
          </span>
        </h2>

        <div className="mt-8 rounded-[28px] bg-white p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:mt-10 sm:rounded-[32px] sm:p-7">
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-[#eef4f5] p-1">
              <button
                type="button"
                onClick={() => setView('student')}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                  isStudent ? 'bg-[#35BEBC] text-[#1A1E3A]' : 'text-black hover:text-[#1A1E3A]',
                )}
              >
                Student sheet
              </button>
              <button
                type="button"
                onClick={() => setView('teacher')}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                  !isStudent
                    ? 'bg-[#35BEBC] text-[#1A1E3A]'
                    : 'text-black hover:text-[#1A1E3A]',
                )}
              >
                Teacher key
              </button>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {data.rows.map((row) => (
              <li
                key={row.id}
                className="rounded-2xl bg-[#c5ebe8] px-4 py-3.5 text-[14px] leading-relaxed sm:px-5 sm:text-[15px]"
              >
                <p className="font-medium text-black">{row.text}</p>
                {row.tip ? (
                  <p className="mt-1.5 text-[12px] leading-snug text-black sm:text-[13px]">
                    {row.tip}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-center text-[12px] text-black sm:text-[13px]">
            {data.footer}
          </p>
        </div>
      </div>
    </section>
  )
}


