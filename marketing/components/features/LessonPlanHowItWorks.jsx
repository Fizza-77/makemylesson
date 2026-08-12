import { Globe } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const STEPS = [
  {
    n: 1,
    title: 'Pick your route',
    body: 'Curriculum, grade, and subject — from 71 dedicated routes across five systems.',
    tone: 'teal',
    sample: (
      <>
        <Globe className="h-3.5 w-3.5 shrink-0 text-[#1A1E3A]/45" aria-hidden strokeWidth={2} />
        <span>NSW HSC · Biology · Year 12</span>
      </>
    ),
  },
  {
    n: 2,
    title: 'Type your topic',
    body: 'One line is enough. Add duration and a teaching method if you want the plan shaped around it.',
    tone: 'navy',
    sample: (
      <>
        <span>&quot;Photosynthesis&quot; · 45 min · </span>
        <span className="font-semibold text-[#35BEBC]">Inquiry-Based</span>
      </>
    ),
  },
  {
    n: 3,
    title: 'Review and teach',
    body: 'Read it, tweak anything with Ayla, export, and walk in ready. The plan is yours to own.',
    tone: 'teal',
    sample: (
      <>
        <span>Export → </span>
        <span className="font-semibold text-[#35BEBC]">PDF · DOCX · Google Docs</span>
      </>
    ),
  },
]

export default function LessonPlanHowItWorks() {
  return (
    <section
      className="py-12 sm:py-14 lg:py-16"
      aria-labelledby="lesson-plan-hiw-heading"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
        How it works
      </p>
      <h2
        id="lesson-plan-hiw-heading"
        className="max-w-full text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] md:whitespace-nowrap"
      >
        Three choices.{' '}
        <span className="pricing-hero-underline pricing-hero-underline--pale relative inline-block">
          Thirty seconds.
        </span>
      </h2>

      <div className="mt-8 fp-card-grid sm:mt-10">
        {STEPS.map((step) => {
          const teal = step.tone === 'teal'
          return (
            <article
              key={step.n}
              className={cn(
                'flex min-h-[280px] w-full min-w-0 flex-col rounded-[28px] p-6 sm:min-h-[300px] sm:p-7',
                teal ? 'bg-[#35BEBC] text-[#1A1E3A]' : 'bg-[#1A1E3A] text-white',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-bold',
                  teal ? 'bg-[#1A1E3A] text-white' : 'bg-[#35BEBC] text-[#1A1E3A]',
                )}
              >
                {step.n}
              </span>
              <h3 className="mt-5 text-[1.25rem] font-bold tracking-tight sm:text-[1.35rem]">
                {step.title}
              </h3>
              <p
                className={cn(
                  'mt-3 text-[14px] leading-relaxed sm:text-[15px]',
                  teal ? 'text-[#1A1E3A]/85' : 'text-white/75',
                )}
              >
                {step.body}
              </p>
              <div
                className={cn(
                  'mt-auto flex items-center gap-2 rounded-full bg-white px-3.5 py-2.5 text-[12px] font-medium leading-snug sm:text-[13px]',
                  teal ? 'text-[#1A1E3A]/55' : 'text-[#1A1E3A]/55',
                )}
              >
                {step.sample}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
