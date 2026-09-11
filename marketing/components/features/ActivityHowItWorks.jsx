const STEPS = [
  {
    n: 1,
    title: 'Pick the activity type',
    body: 'Gap-fill, matching, labelling, sorting, or open response — or let the generator choose what fits the topic.',
    tone: 'teal',
    samplePrefix: 'Type:',
    sampleRest: ' Gap-fill + 1 open question',
  },
  {
    n: 2,
    title: 'Set difficulty and length',
    body: 'Question count and challenge level tune to your grade — with support, core, and stretch versions available.',
    tone: 'navy',
    samplePrefix: 'Year 7',
    sampleRest: ' · 8 questions · core',
  },
  {
    n: 3,
    title: 'Print both, keep one',
    body: 'The student sheet goes on desks; the key with marking guidance stays with you. Numbering always matches.',
    tone: 'teal',
    samplePrefix: 'Export →',
    sampleRest: ' PDF pair · DOCX',
  },
]

export default function ActivityHowItWorks() {
  return (
    <section
      id="activity-hiw"
      className="scroll-mt-28 bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="activity-hiw-heading"
    >
      <div className="fp-shell-md px-4 sm:px-6 md:px-8">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          How it works
        </p>
        <h2
          id="activity-hiw-heading"
          className="max-w-full text-center text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white md:whitespace-nowrap"
        >
          One generation.{' '}
          <span className="pricing-hero-underline pricing-hero-underline--straight relative inline-block">
            Two documents.
          </span>
        </h2>

        <div className="mt-8 fp-card-grid !gap-2 sm:mt-10 sm:!gap-2.5 lg:!gap-3">
          {STEPS.map((step) => {
            const teal = step.tone === 'teal'
            return (
              <article
                key={step.n}
                className={
                  teal
                    ? 'flex min-h-0 w-full min-w-0 flex-col rounded-[28px] bg-[#35BEBC] p-4 text-[#1A1E3A] sm:p-5'
                    : 'flex min-h-0 w-full min-w-0 flex-col rounded-[28px] border border-[#35BEBC]/50 bg-[#1A1E3A] p-4 text-white sm:p-5'
                }
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={
                      teal
                        ? 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A1E3A] text-[15px] font-bold text-white'
                        : 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#35BEBC] text-[15px] font-bold text-[#1A1E3A]'
                    }
                  >
                    {step.n}
                  </span>
                  <h3 className="min-w-0 text-[1.2rem] font-bold leading-tight tracking-tight sm:text-[1.3rem]">
                    {step.title}
                  </h3>
                </div>
                <p
                  className={
                    teal
                      ? 'mt-2.5 text-[14px] leading-relaxed text-black sm:text-[15px]'
                      : 'mt-2.5 text-[14px] leading-relaxed text-white sm:text-[15px]'
                  }
                >
                  {step.body}
                </p>
                <div className="mt-4 rounded-2xl bg-white px-3.5 py-2.5 text-[12px] leading-snug sm:text-[13px]">
                  <span className="font-normal text-black">{step.samplePrefix}</span>
                  <span className="font-medium text-[#35BEBC]">{step.sampleRest}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}


