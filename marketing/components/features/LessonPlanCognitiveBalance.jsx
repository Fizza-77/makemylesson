const BLOOM_LEVELS = [
  { label: 'Remember', pct: 20 },
  { label: 'Understand', pct: 25 },
  { label: 'Apply', pct: 25 },
  { label: 'Analyse', pct: 15 },
  { label: 'Evaluate', pct: 10 },
  { label: 'Create', pct: 5 },
]

export default function LessonPlanCognitiveBalance() {
  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="cognitive-balance-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
          Cognitive balance
        </p>
        <h2
          id="cognitive-balance-heading"
          className="whitespace-nowrap text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
        >
          Bloom&apos;s Taxonomy,{' '}
          <span className="pricing-hero-underline relative inline-block">actually balanced.</span>
        </h2>

        <div className="mt-8 grid items-center gap-8 rounded-[28px] bg-[#1A1E3A] p-6 shadow-[0_20px_50px_rgba(26,30,58,0.16)] sm:mt-10 sm:gap-10 sm:rounded-[32px] sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <ul className="space-y-3.5 sm:space-y-4">
            {BLOOM_LEVELS.map((level) => (
              <li key={level.label} className="grid grid-cols-[7.5rem_1fr_2.75rem] items-center gap-3 sm:grid-cols-[8.5rem_1fr_3rem] sm:gap-4">
                <span className="text-[13px] font-medium text-white sm:text-[14px]">
                  {level.label}
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10 sm:h-3">
                  <div
                    className="h-full rounded-full bg-[#35BEBC]"
                    style={{ width: `${level.pct}%` }}
                  />
                </div>
                <span className="text-right text-[13px] font-semibold text-[#35BEBC] sm:text-[14px]">
                  {level.pct}%
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[15px] leading-relaxed text-white/80 sm:text-base lg:pl-2">
            Most AI plans cluster at &ldquo;remember and understand.&rdquo; Make My Lesson distributes
            objectives and questions across all six levels, weighted for your grade — so a Year 7
            introduction and a Year 12 revision lesson get different balances, on purpose. The same
            balancing carries into Stage 4, where the assessment enforces it.
          </p>
        </div>
      </div>
    </section>
  )
}
