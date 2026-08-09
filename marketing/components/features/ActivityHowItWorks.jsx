const STEPS = [
  {
    n: 1,
    title: 'Pick the activity type',
    body: 'Gap-fill, matching, labelling, sorting, or open response — or let the generator choose what fits the topic.',
    tone: 'teal',
    sample: 'Type: Gap-fill + 1 open question',
  },
  {
    n: 2,
    title: 'Set difficulty and length',
    body: 'Question count and challenge level tune to your grade — with support, core, and stretch versions available.',
    tone: 'navy',
    sample: 'Year 7 · 8 questions · core',
  },
  {
    n: 3,
    title: 'Print both, keep one',
    body: 'The student sheet goes on desks; the key with marking guidance stays with you. Numbering always matches.',
    tone: 'teal',
    sample: 'Export → PDF pair · DOCX',
  },
]

export default function ActivityHowItWorks() {
  return (
    <section
      id="activity-hiw"
      className="scroll-mt-28 bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="activity-hiw-heading"
    >
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
          How it works
        </p>
        <h2
          id="activity-hiw-heading"
          className="whitespace-nowrap text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white"
        >
          One generation.{' '}
          <span className="pricing-hero-underline relative inline-block">Two documents.</span>
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
          {STEPS.map((step) => {
            const teal = step.tone === 'teal'
            return (
              <article
                key={step.n}
                className={
                  teal
                    ? 'flex min-h-[280px] flex-col rounded-[28px] bg-[#35BEBC] p-6 text-[#1A1E3A] sm:min-h-[300px] sm:p-7'
                    : 'flex min-h-[280px] flex-col rounded-[28px] border border-[#35BEBC]/50 bg-[#1A1E3A] p-6 text-white sm:min-h-[300px] sm:p-7'
                }
              >
                <span
                  className={
                    teal
                      ? 'inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1E3A] text-[15px] font-bold text-white'
                      : 'inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#35BEBC] text-[15px] font-bold text-[#1A1E3A]'
                  }
                >
                  {step.n}
                </span>
                <h3 className="mt-5 text-[1.25rem] font-bold tracking-tight sm:text-[1.35rem]">
                  {step.title}
                </h3>
                <p
                  className={
                    teal
                      ? 'mt-3 text-[14px] leading-relaxed text-[#1A1E3A]/85 sm:text-[15px]'
                      : 'mt-3 text-[14px] leading-relaxed text-white/75 sm:text-[15px]'
                  }
                >
                  {step.body}
                </p>
                <div className="mt-auto rounded-2xl bg-white px-3.5 py-2.5 text-[12px] font-semibold leading-snug text-[#4B5068] sm:text-[13px]">
                  {step.sample}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
