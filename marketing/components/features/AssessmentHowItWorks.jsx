const STEPS = [
  {
    n: '01',
    label: 'Paper style',
    title: 'Choose the kind of assessment.',
    body: 'Exit ticket, quick check, practice worksheet or a full summative paper — each starts with its own length and assessment rhythm.',
    tone: 'teal',
    badge: '40 min',
  },
  {
    n: '02',
    label: 'Question balance',
    title: 'Shape what students need to show.',
    body: 'Mix recall, understanding, application and analysis with question types that fit the lesson and the level of challenge you want.',
    tone: 'navy',
    badge: null,
  },
  {
    n: '03',
    label: 'Ready together',
    title: 'Export the paper and scheme as a pair.',
    body: 'The student-facing assessment and the teacher-facing marking guide stay connected from the moment they are generated.',
    tone: 'teal',
    badge: 'PDF · DOCX',
  },
]

export default function AssessmentHowItWorks() {
  return (
    <section
      id="assessment-paper"
      className="scroll-mt-28 bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="assessment-hiw-heading"
    >
      <div className="fp-shell-md px-4 sm:px-6 md:px-8">
        <p className="mb-3 flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[#74FFFD]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
          </span>
          How it works
        </p>
        <h2
          id="assessment-hiw-heading"
          className="max-w-full text-center text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A] md:whitespace-nowrap"
        >
          Three choices. One{' '}
          <span className="pricing-hero-underline relative inline-block">assessment system.</span>
        </h2>

        <div className="mt-10 grid min-w-0 items-stretch gap-5 lg:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="relative min-w-0 overflow-hidden rounded-[28px] bg-[#12162b] p-4 pb-12 sm:rounded-[36px] sm:p-8 sm:pb-16 lg:p-10 lg:pb-20">
            {/* Layered decorative shapes — behind content */}
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-[40%] bg-[#35BEBC] sm:-right-12 sm:-top-16 sm:h-72 sm:w-72"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 -left-24 h-48 w-48 rounded-[45%] bg-[#ade5df]/90 sm:-bottom-20 sm:-left-16 sm:h-64 sm:w-64"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-14 left-2 hidden h-40 w-28 -rotate-[18deg] rounded-[28px] bg-[#35BEBC]/85 sm:bottom-20 sm:left-8 sm:block sm:h-48 sm:w-32"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-0 top-20 hidden h-52 w-36 rotate-[12deg] rounded-[32px] bg-[#9fd9d4]/70 sm:right-6 sm:top-28 sm:block sm:h-60 sm:w-40"
              aria-hidden
            />

            <div className="relative z-[1] mx-auto w-full min-w-0 max-w-none md:max-w-[480px] lg:max-w-[520px]">
              {/* Cyan mark scheme — taller, tucked under paper; only top-left corner peeks */}
              <div
                className="absolute bottom-5 left-3 z-0 flex h-[12.5rem] w-[10.25rem] -translate-x-[6%] translate-y-[10%] flex-col justify-start rounded-[18px] bg-[#35BEBC] px-3 py-3 shadow-[0_12px_28px_rgba(53,190,188,0.35)] sm:bottom-10 sm:left-8 sm:h-[17.5rem] sm:w-[14.5rem] sm:-translate-x-[14%] sm:translate-y-[10%] sm:rounded-[22px] sm:px-4 sm:py-4"
                aria-hidden
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                  Generated with
                </p>
                <p className="mt-1 text-[14px] font-bold leading-none text-white sm:text-[17px]">
                  Mark Scheme
                </p>
                <p className="mt-1.5 text-[10px] leading-snug text-white">
                  model answers · levels · accept/reject
                </p>
              </div>

              <div className="relative z-[1] min-w-0 rounded-[22px] bg-white p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:rounded-[28px] sm:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2 px-0.5 pb-1 sm:gap-3 sm:px-1.5">
                  <p className="min-w-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1E3A] sm:text-[11px]">
                    Assessment paper
                  </p>
                  <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1E3A] sm:text-[11px]">
                    30 marks
                  </p>
                </div>

                <div className="mt-3.5 space-y-2.5 sm:mt-5 sm:space-y-3.5">
                  <div className="relative overflow-hidden rounded-[16px] bg-[#EAF5F6] p-3 sm:rounded-[20px] sm:p-4">
                    <div className="pr-14 sm:pr-28">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black">
                        01 — Multiple choice
                      </p>
                      <p className="mt-2 text-[12.5px] font-bold leading-snug text-[#1A1E3A] sm:text-[14px]">
                        What primarily drives evaporation?
                      </p>
                      <p className="mt-2 text-[11px] font-medium text-black">1 mark</p>
                    </div>
                    <div className="absolute bottom-2 right-2 w-12 sm:bottom-2.5 sm:right-2.5 sm:w-24">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/evaporation.svg"
                        alt=""
                        className="h-11 w-full object-contain object-right-bottom sm:h-[4.5rem]"
                      />
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[#9fd9d4] p-3 sm:rounded-[20px] sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black">
                      02 — Short answer
                    </p>
                    <p className="mt-2 text-[12.5px] font-bold leading-snug text-[#1A1E3A] sm:text-[14px]">
                      State two changes of state involved in cloud formation.
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-black">2 marks</p>
                  </div>

                  <div className="rounded-[16px] bg-[#1A1E3A] p-3 sm:rounded-[20px] sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                      03 — Extended response
                    </p>
                    <p className="mt-2 text-[12.5px] font-bold leading-snug text-white sm:text-[14px]">
                      Explain the effect of prolonged drought on the water cycle.
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-white">4 marks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            {STEPS.map((step) => {
              const teal = step.tone === 'teal'
              return (
                <article
                  key={step.n}
                  className={
                    teal
                      ? 'relative min-w-0 rounded-[24px] bg-[#ade5df] p-5 text-[#1A1E3A] sm:p-6'
                      : 'relative min-w-0 rounded-[24px] bg-[#1A1E3A] p-5 text-white sm:p-6'
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={
                        teal
                          ? 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A1E3A] text-[12px] font-bold text-white'
                          : 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#35BEBC] text-[12px] font-bold text-[#1A1E3A]'
                      }
                    >
                      {step.n}
                    </span>
                    {step.badge ? (
                      <span className="shrink-0 rounded-full border border-[#1A1E3A] bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A]">
                        {step.badge}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={
                      teal
                        ? 'mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-black'
                        : 'mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white'
                    }
                  >
                    {step.label}
                  </p>
                  <h3 className="mt-1.5 max-w-full text-[1.1rem] font-normal leading-snug tracking-tight sm:text-[1.25rem]">
                    {step.title}
                  </h3>
                  <p
                    className={
                      teal
                        ? 'mt-2 text-[13px] leading-relaxed text-black sm:text-[14px]'
                        : 'mt-2 text-[13px] leading-relaxed text-white sm:text-[14px]'
                    }
                  >
                    {step.body}
                  </p>
                </article>
              )
            })}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-relaxed text-black sm:mt-10 sm:text-[15px]">
          Start with the type of paper you need, shape the question balance, then export the student
          paper and teacher mark scheme as one connected pair.
        </p>
      </div>
    </section>
  )
}
