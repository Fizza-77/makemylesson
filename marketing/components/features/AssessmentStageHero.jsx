import Link from 'next/link'
import { Check, FileText, Globe } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'

export default function AssessmentStageHero() {
  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
      aria-labelledby="assessment-hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#35BEBC] sm:-right-20 sm:-top-14"
        aria-hidden
      />

      <div className="relative z-[1] grid items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-10 lg:px-12 lg:py-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <FileText className="h-3.5 w-3.5 text-[#1A1E3A]" aria-hidden strokeWidth={2.25} />
            Stage 4 · Assess
          </p>

          <h1
            id="assessment-hero-heading"
            className="max-w-[14ch] xl:max-w-none text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            Every question born with its{' '}
            <span className="pricing-hero-underline pricing-hero-underline--straight relative inline-block whitespace-nowrap">
              mark scheme.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black sm:text-base">
            Generate the assessment paper and mark scheme together — balanced across Bloom&apos;s
            levels, written in curriculum-aware command language, and matched to what the lesson
            actually taught.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Generate a Test — Free
            </Link>
            <a
              href="#assessment-paper"
              className="inline-flex items-center justify-center rounded-full bg-[#35BEBC] px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:bg-[#4ec9c7]"
            >
              Build a Paper ↓
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-black">
            <span className="text-[#EAB308]">★★★★★</span>
            <span>Rated by educators</span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
              71 curriculum routes
            </span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span>Paper + scheme generated together</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_20px_50px_rgba(26,30,58,0.14)]">
          <div className="flex items-center justify-between gap-3 bg-[#1A1E3A] px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#74FFFD]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#35BEBC]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9ddad4]" />
            </div>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
              Generating assessment · The Water Cycle · Year 7
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 p-4 md:grid-cols-2 md:gap-5 md:p-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#35BEBC]">
                Assessment paper
              </p>

              <div className="mt-3 space-y-2.5">
                <div className="rounded-2xl bg-[#EAF5F6] px-3.5 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[12px] font-bold text-[#35BEBC]">Multiple choice</p>
                    <p className="shrink-0 text-[11px] font-medium text-black">1 mark</p>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-snug text-[#1A1E3A]">
                    What primarily drives the water cycle?
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-[11px] text-black">
                    {['Gravity alone', 'Solar energy', 'Wind pressure'].map((opt) => (
                      <li key={opt} className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full border border-[#4B5068]/40"
                          aria-hidden
                        />
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#EAF5F6] px-3.5 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[12px] font-bold text-[#35BEBC]">Short answer</p>
                    <p className="shrink-0 text-[11px] font-medium text-black">2 marks</p>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-snug text-[#1A1E3A]">
                    State the two changes of state involved in cloud formation.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#EAF5F6] px-3.5 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[12px] font-bold text-[#35BEBC]">Extended response</p>
                    <p className="shrink-0 text-[11px] font-medium text-black">4 marks</p>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-snug text-[#1A1E3A]">
                    Explain how the water cycle would change during a prolonged drought.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1E3A]">
                Mark scheme
              </p>

              <div className="mt-3 space-y-2.5">
                <div className="rounded-2xl border border-[#35BEBC]/45 bg-[#EAF5F6] px-3.5 py-3">
                  <p className="text-[12px] font-bold text-[#1A1E3A]">B — Solar energy · 1 mark</p>
                  <p className="mt-1.5 text-[11px] leading-snug text-black">
                    Distractor note: &apos;gravity&apos; tests a common misconception.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#35BEBC]/45 bg-[#EAF5F6] px-3.5 py-3">
                  <p className="text-[12px] font-bold text-[#1A1E3A]">2 × 1 mark</p>
                  <p className="mt-1.5 text-[11px] leading-snug text-black">
                    Evaporation (1) and condensation (1), either order.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#35BEBC]/45 bg-[#EAF5F6] px-3.5 py-3">
                  <p className="text-[12px] font-bold text-[#1A1E3A]">Level-marked · 4 marks</p>
                  <p className="mt-1.5 text-[11px] leading-snug text-black">
                    L2 (3–4): mechanism + two linked effects. L1 (1–2): one effect without mechanism.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1A1E3A] px-4 py-2.5 text-[11px] text-white">
            <span>Paper assembled · 3 question types</span>
            <span className="inline-flex items-center gap-1.5">
              Total:{' '}
              <span className="font-semibold text-[#35BEBC]">7 marks</span>
              <span>· Bloom-balanced</span>
              <Check className="h-3.5 w-3.5 text-white" aria-hidden strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}


