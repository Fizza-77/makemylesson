import { ArrowUpRight } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const SCHEME_ROWS = [
  {
    n: '01',
    title: 'Model answer',
    body: 'Less surface water reduces evaporation, fewer clouds form, and precipitation falls further — reinforcing the drought.',
    tag: 'Top response',
    tone: 'mint',
  },
  {
    n: '02',
    title: 'Level descriptors',
    body: 'Level 2 · 3–4 marks: identifies the mechanism and links at least two effects. Level 1 · 1–2 marks: states an effect without a complete mechanism.',
    tag: 'L1 → L2',
    tone: 'lavender',
  },
  {
    n: '03',
    title: 'Accept / reject',
    body: "Accept: 'less rain because less evaporation.' Reject: 'the water cycle stops.'",
    tag: 'Consistency',
    tone: 'cyan',
  },
  {
    n: '04',
    title: 'Common errors',
    body: 'Reversing cause and effect, or treating clouds as a permanent water store rather than part of a cycle.',
    tag: 'Watch for',
    tone: 'peach',
  },
]

const ROW_BG = {
  mint: 'bg-[#E0F2F1]',
  lavender: 'bg-[#E8EAF6]',
  cyan: 'bg-[#E0F2F1]',
  peach: 'bg-[#FFF3E0]',
}

const FEATURES = [
  {
    n: '01',
    title: 'A complete model answer',
    body: 'Give teachers a top-level response they can use while marking — or show students afterwards as an exemplar.',
    tone: 'navy',
  },
  {
    n: '02',
    title: 'Levels that explain quality',
    body: "Extended responses are easier to judge when the difference between 'some credit' and 'full credit' is visible.",
    tone: 'teal',
  },
  {
    n: '03',
    title: 'Accept / reject guidance',
    body: 'Borderline wording is decided before you reach the middle of a class set, helping marking stay consistent.',
    tone: 'teal',
  },
  {
    n: '04',
    title: 'Misconceptions surfaced early',
    body: 'Common errors become visible before they repeat across twenty or thirty scripts.',
    tone: 'navy',
  },
]

export default function AssessmentMarkScheme() {
  return (
    <section
      className="bg-[#E8F5F5] py-14 sm:py-16 lg:py-20"
      aria-labelledby="mark-scheme-heading"
    >
      <div className="fp-shell-md px-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
              </span>
              Inside the mark scheme
            </p>
            <h2
              id="mark-scheme-heading"
              className="max-w-full text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A] md:whitespace-nowrap"
            >
              Not just the answer.{' '}
              <span className="pricing-hero-underline relative inline-block">The judgement behind it.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-[#1A1E3A]/50 sm:text-[15px] lg:pb-1 lg:text-right">
            Every important marking decision can sit beside the question: what a strong answer looks
            like, where levels change, what to accept, and which misconceptions to watch for.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[#1A1E3A] p-5 sm:rounded-[32px] sm:p-6">
            <div
              className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#35BEBC]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-[#ade5df]"
              aria-hidden
            />

            <div className="relative z-[1] rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:rounded-[32px] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B5068]">
                    Teacher mark scheme
                  </p>
                  <h3 className="mt-1.5 text-[1.2rem] font-bold tracking-tight text-[#1A1E3A] sm:text-[1.35rem]">
                    Water Cycle Assessment
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-[#35BEBC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Q3 · 4 marks
                </span>
              </div>

              <div className="mt-4 h-px bg-[#e8eef5]" />

              <div className="mt-4 rounded-2xl bg-[#f1f4f6] px-4 py-3.5 text-[13px] font-bold leading-snug text-[#1A1E3A] sm:text-[14px]">
                Explain how the water cycle would change during a prolonged drought.
              </div>

              <ul className="mt-3 space-y-2.5">
                {SCHEME_ROWS.map((row) => (
                  <li
                    key={row.n}
                    className={cn(
                      'flex items-start gap-3 rounded-2xl px-3.5 py-3',
                      ROW_BG[row.tone],
                    )}
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A1E3A] text-[10px] font-bold text-white">
                      {row.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1E3A]">
                          {row.title}
                        </p>
                        <span className="shrink-0 rounded-full border border-[#1A1E3A]/15 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#4B5068]">
                          {row.tag}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-snug text-[#4B5068] sm:text-[13px]">
                        {row.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fp-card-grid fp-card-grid--pair gap-3">
            {FEATURES.map((card) => {
              const navy = card.tone === 'navy'
              return (
                <article
                  key={card.n}
                  className={cn(
                    'relative flex min-h-[180px] w-full min-w-0 flex-col rounded-[24px] p-5 sm:min-h-[200px] sm:p-6',
                    navy ? 'bg-[#1A1E3A] text-white' : 'bg-[#35BEBC] text-[#1A1E3A]',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[11px] font-bold',
                      navy ? 'border-white/30 text-white' : 'border-[#1A1E3A]/30 text-[#1A1E3A]',
                    )}
                  >
                    {card.n}
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-normal tracking-tight sm:text-[1.1rem]">
                    {card.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-2 text-[13px] leading-relaxed',
                      navy ? 'text-white/65' : 'text-[#1A1E3A]/75',
                    )}
                  >
                    {card.body}
                  </p>
                  <ArrowUpRight
                    className={cn(
                      'absolute bottom-4 right-4 h-4 w-4',
                      navy ? 'text-white/40' : 'text-[#1A1E3A]/40',
                    )}
                    aria-hidden
                    strokeWidth={2}
                  />
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
