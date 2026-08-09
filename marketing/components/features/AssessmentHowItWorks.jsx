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
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#74FFFD]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              </span>
              How it works
            </p>
            <h2
              id="assessment-hiw-heading"
              className="whitespace-nowrap text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A]"
            >
              Three choices. One{' '}
              <span className="pricing-hero-underline relative inline-block">assessment system.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-[#1A1E3A]/50 sm:text-[15px] lg:pb-1 lg:text-right">
            Start with the type of paper you need, shape the question balance, then export the student
            paper and teacher mark scheme as one connected pair.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[#12162b] p-6 pb-14 sm:rounded-[36px] sm:p-8 sm:pb-16 lg:p-10 lg:pb-20">
            {/* Layered decorative shapes — behind content */}
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-[40%] bg-[#35BEBC] sm:-right-12 sm:-top-16 sm:h-72 sm:w-72"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-[45%] bg-[#ade5df]/90 sm:-bottom-20 sm:-left-16 sm:h-64 sm:w-64"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-16 left-4 h-40 w-28 -rotate-[18deg] rounded-[28px] bg-[#35BEBC]/85 sm:bottom-20 sm:left-8 sm:h-48 sm:w-32"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-2 top-24 h-52 w-36 rotate-[12deg] rounded-[32px] bg-[#9fd9d4]/70 sm:right-6 sm:top-28 sm:h-60 sm:w-40"
              aria-hidden
            />

            <div className="relative z-[1] mx-auto w-full max-w-[400px] sm:max-w-[440px]">
              <div className="relative rounded-[24px] bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:rounded-[28px] sm:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-3 px-1 pb-1 sm:px-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1E3A] sm:text-[11px]">
                    Assessment paper
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1E3A] sm:text-[11px]">
                    30 marks
                  </p>
                </div>

                <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
                  <div className="relative overflow-hidden rounded-[18px] bg-[#EAF5F6] p-3.5 sm:rounded-[20px] sm:p-4">
                    <div className="pr-[5.5rem] sm:pr-28">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5068]">
                        01 — Multiple choice
                      </p>
                      <p className="mt-2 text-[13px] font-bold leading-snug text-[#1A1E3A] sm:text-[14px]">
                        What primarily drives evaporation?
                      </p>
                      <p className="mt-2 text-[11px] font-medium text-[#4B5068]">1 mark</p>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 w-[4.5rem] sm:w-24">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/evaporation.svg"
                        alt=""
                        className="h-14 w-full object-contain object-right-bottom sm:h-[4.5rem]"
                      />
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-[#9fd9d4] p-3.5 sm:rounded-[20px] sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A1E3A]/55">
                      02 — Short answer
                    </p>
                    <p className="mt-2 text-[13px] font-bold leading-snug text-[#1A1E3A] sm:text-[14px]">
                      State two changes of state involved in cloud formation.
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-[#1A1E3A]/55">2 marks</p>
                  </div>

                  <div className="rounded-[18px] bg-[#1A1E3A] p-3.5 sm:rounded-[20px] sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">
                      03 — Extended response
                    </p>
                    <p className="mt-2 text-[13px] font-bold leading-snug text-white sm:text-[14px]">
                      Explain the effect of prolonged drought on the water cycle.
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-white/70">4 marks</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 right-0 z-[2] w-[min(100%,210px)] rounded-[18px] bg-[#35BEBC] px-3.5 py-3 text-left shadow-[0_12px_28px_rgba(53,190,188,0.4)] sm:-bottom-9 sm:right-1 sm:rounded-[20px] sm:px-4 sm:py-3.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/90">
                  Generated with
                </p>
                <p className="mt-1 text-[15px] font-bold leading-none text-white sm:text-[17px]">
                  Mark Scheme
                </p>
                <p className="mt-1.5 text-[10px] leading-snug text-white/85">
                  model answers · levels · accept/reject
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {STEPS.map((step) => {
              const teal = step.tone === 'teal'
              return (
                <article
                  key={step.n}
                  className={
                    teal
                      ? 'relative rounded-[24px] bg-[#ade5df] p-5 text-[#1A1E3A] sm:p-6'
                      : 'relative rounded-[24px] bg-[#1A1E3A] p-5 text-white sm:p-6'
                  }
                >
                  {step.badge ? (
                    <span
                      className={
                        teal
                          ? 'absolute right-4 top-4 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A]'
                          : 'absolute right-4 top-4 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white'
                      }
                    >
                      {step.badge}
                    </span>
                  ) : null}
                  <span
                    className={
                      teal
                        ? 'inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1E3A] text-[12px] font-bold text-white'
                        : 'inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#35BEBC] text-[12px] font-bold text-[#1A1E3A]'
                    }
                  >
                    {step.n}
                  </span>
                  <p
                    className={
                      teal
                        ? 'mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1E3A]/55'
                        : 'mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45'
                    }
                  >
                    {step.label}
                  </p>
                  <h3 className="mt-1.5 whitespace-nowrap text-[1.15rem] font-normal tracking-tight sm:text-[1.25rem]">
                    {step.title}
                  </h3>
                  <p
                    className={
                      teal
                        ? 'mt-2 text-[13px] leading-relaxed text-[#1A1E3A]/75 sm:text-[14px]'
                        : 'mt-2 text-[13px] leading-relaxed text-white/65 sm:text-[14px]'
                    }
                  >
                    {step.body}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
