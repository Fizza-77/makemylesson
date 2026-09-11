import { ArrowRight, Globe } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const STEPS = [
  {
    n: 1,
    title: 'Pick your route',
    body: 'Curriculum, grade, and subject — from 71 dedicated routes across five systems.',
    tone: 'teal',
    sample: (
      <>
        <Globe className="h-3.5 w-3.5 shrink-0 text-black" aria-hidden strokeWidth={2} />
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

function StepCard({ step }) {
  const teal = step.tone === 'teal'
  return (
    <article
      className={cn(
        'flex min-h-0 w-full min-w-0 flex-1 flex-col rounded-[24px] p-4 sm:p-5',
        teal ? 'bg-[#35BEBC] text-[#1A1E3A]' : 'bg-[#1A1E3A] text-white',
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold',
            teal ? 'bg-[#1A1E3A] text-white' : 'bg-[#35BEBC] text-[#1A1E3A]',
          )}
        >
          {step.n}
        </span>
        <h3 className="min-w-0 text-[1.1rem] font-bold leading-tight tracking-tight sm:text-[1.2rem]">
          {step.title}
        </h3>
      </div>
      <p
        className={cn(
          'mt-2.5 text-[13px] leading-snug sm:text-[14px]',
          teal ? 'text-black' : 'text-white',
        )}
      >
        {step.body}
      </p>
      <div
        className={cn(
          'mt-4 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] font-medium leading-snug sm:mt-5 sm:text-[12px]',
          'text-black',
        )}
      >
        {step.sample}
      </div>
    </article>
  )
}

function StepArrow() {
  return (
    <span
      className="hidden shrink-0 items-center justify-center text-[#35BEBC] md:inline-flex"
      aria-hidden
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#35BEBC]/40 bg-[#EAF5F6]">
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
    </span>
  )
}

export default function LessonPlanHowItWorks() {
  return (
    <section
      className="py-12 sm:py-14 lg:py-16"
      aria-labelledby="lesson-plan-hiw-heading"
    >
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
        How it works
      </p>
      <h2
        id="lesson-plan-hiw-heading"
        className="max-w-full text-center text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] md:whitespace-nowrap"
      >
        Three choices.{' '}
        <span className="pricing-hero-underline pricing-hero-underline--pale relative inline-block">
          Thirty seconds.
        </span>
      </h2>

      <div className="mt-8 flex flex-col gap-4 sm:mt-10 md:flex-row md:items-stretch md:gap-3 lg:gap-3.5">
        <StepCard step={STEPS[0]} />
        <StepArrow />
        <StepCard step={STEPS[1]} />
        <StepArrow />
        <StepCard step={STEPS[2]} />
      </div>
    </section>
  )
}


