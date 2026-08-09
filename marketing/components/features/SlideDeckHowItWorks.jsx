const STEPS = [
  {
    n: 1,
    title: 'Start from your plan',
    body: 'Generated a Stage 1 plan? The deck builds from its objectives automatically. No plan? Just type a topic.',
    tone: 'teal',
    sample: 'Source: The Water Cycle — lesson plan',
  },
  {
    n: 2,
    title: 'Set duration and method',
    body: 'The deck calibrates slide count and pacing to your lesson length, and structures itself around your teaching method.',
    tone: 'navy',
    sample: '45 min · Collaborative Learning → discussion slides added',
  },
  {
    n: 3,
    title: 'Present or edit',
    body: 'Export to PowerPoint or Google Slides and edit freely — reorder, restyle, drop in your own images.',
    tone: 'teal',
    sample: 'Export → PPTX · Google Slides · PDF',
  },
]

export default function SlideDeckHowItWorks() {
  return (
    <section
      className="bg-[#EAF5F6] py-14 sm:py-16 lg:py-20"
      aria-labelledby="slide-deck-hiw-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
          </span>
          How it works
        </p>
        <h2
          id="slide-deck-hiw-heading"
          className="whitespace-nowrap text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A]"
        >
          From plan to deck in{' '}
          <span className="pricing-hero-underline relative inline-block">one click.</span>
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
                    : 'flex min-h-[280px] flex-col rounded-[28px] bg-[#1A1E3A] p-6 text-white sm:min-h-[300px] sm:p-7'
                }
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[15px] font-bold text-[#1A1E3A]">
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
                <div className="mt-auto rounded-full bg-white px-3.5 py-2.5 text-[12px] font-medium leading-snug text-[#1A1E3A]/55 sm:text-[13px]">
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
