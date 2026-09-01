import Link from 'next/link'
import { FileText, Globe, KeyRound, Link2 } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'

const STUDENT_ITEMS = [
  { n: '1', text: 'Water turns to vapour by ________' },
  { n: '2', text: 'Clouds form through ________' },
  { n: '3', text: 'Rain is a type of ________' },
]

const KEY_ITEMS = [
  { answer: 'evaporation', tip: "Accept 'evaporating'." },
  { answer: 'condensation', tip: 'Common slip: precipitation.' },
  { answer: 'precipitation', tip: 'Check spelling.' },
]

export default function ActivityStageHero() {
  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
      aria-labelledby="activity-hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-28 top-2 h-72 w-72 rounded-full bg-[#1E9A98] sm:-right-32 sm:top-6"
        aria-hidden
      />

      <div className="relative z-[1] grid items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:px-12 lg:py-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <FileText className="h-3.5 w-3.5 text-[#1A1E3A]" aria-hidden strokeWidth={2.25} />
            Stage 3 · Practise
          </p>

          <h1
            id="activity-hero-heading"
            className="max-w-[14ch] xl:max-w-none text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            Every worksheet arrives with its{' '}
            <span className="pricing-hero-underline pricing-hero-underline--straight relative inline-block whitespace-nowrap">
              answer key.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black sm:text-base">
            The student activity sheet and the teacher answer key are generated together, always —
            same questions, same numbering, plus marking guidance only you can see.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Generate an Activity — Free
            </Link>
            <a
              href="#activity-types"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:bg-white/90"
            >
              See Activity Types ↓
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-black">
            <span className="text-[#EAB308]">★★★★★</span>
            <span>Rated by educators</span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#35BEBC]" aria-hidden strokeWidth={2} />
              71 curriculum routes
            </span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span>2 documents per generation</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-none lg:mx-0">
          <div className="relative grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
            <article className="relative z-[2] overflow-hidden rounded-[20px] bg-white shadow-[0_18px_40px_rgba(26,30,58,0.16)]">
              <div className="flex items-center gap-2 rounded-t-[20px] bg-[#1A1E3A] px-3.5 py-2.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden strokeWidth={2} />
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  Student activity sheet
                </p>
              </div>
              <div className="p-3.5 sm:p-4">
                <h2 className="text-[13px] font-bold text-[#1A1E3A] sm:text-[14px]">
                  The Water Cycle – Practice
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {STUDENT_ITEMS.map((item) => (
                    <li
                      key={item.n}
                      className="flex items-start gap-2 rounded-xl border border-[#e8eef5] bg-[#f8fafc] px-2.5 py-2.5"
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#1A1E3A] text-[10px] font-bold text-white">
                        {item.n}
                      </span>
                      <span className="pt-0.5 text-[11px] leading-snug text-[#1A1E3A] sm:text-[12px]">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="relative z-[2] overflow-hidden rounded-[20px] bg-white shadow-[0_18px_40px_rgba(26,30,58,0.16)]">
              <div className="flex items-center gap-2 rounded-t-[20px] bg-[#35BEBC] px-3.5 py-2.5">
                <KeyRound className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden strokeWidth={2} />
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  Teacher answer key
                </p>
              </div>
              <div className="p-3.5 sm:p-4">
                <h2 className="text-[13px] font-bold text-[#1A1E3A] sm:text-[14px]">
                  The Water Cycle – Key
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {KEY_ITEMS.map((item) => (
                    <li
                      key={item.answer}
                      className="rounded-xl border border-[#e8eef5] bg-[#f8fafc] px-2.5 py-2.5"
                    >
                      <span className="inline-flex rounded-full bg-[#d8f3ef] px-2.5 py-1 text-[11px] font-semibold text-[#1E9A98] sm:text-[12px]">
                        {item.answer}
                      </span>
                      <p className="mt-1.5 text-[10px] leading-snug text-black sm:text-[11px]">
                        {item.tip}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <div
              className="absolute left-1/2 top-1/2 z-[3] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#35BEBC] shadow-[0_8px_20px_rgba(53,190,188,0.45)] sm:flex"
              aria-hidden
            >
              <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
