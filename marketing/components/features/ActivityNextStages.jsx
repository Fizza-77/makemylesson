import Link from 'next/link'
import { getFeaturePath } from '@marketing/data/features'
import { cn } from '@marketing/lib/cn'

const STAGES = [
  {
    slug: 'lesson-plan-generator',
    eyebrow: 'Stage 1 · Plan',
    title: 'AI Lesson Plan Generator',
    body: "The plan that sets this activity's objectives, timing, and differentiation.",
    tone: 'teal',
  },
  {
    slug: 'presentation-maker',
    eyebrow: 'Stage 2 · Present',
    title: 'AI Presentation Maker',
    body: 'The slide deck whose practice slide matches this sheet exactly.',
    tone: 'navy',
  },
  {
    slug: 'test-generator',
    eyebrow: 'Stage 4 · Assess',
    title: 'AI Test Generator',
    body: 'The assessment that tests what this activity practised — with a mark scheme.',
    tone: 'pale',
  },
]

export default function ActivityNextStages() {
  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="activity-next-stages-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
          Keep the topic moving
        </p>
        <h2
          id="activity-next-stages-heading"
          className="whitespace-nowrap text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
        >
          Your activity connects to{' '}
          <span className="pricing-hero-underline relative inline-block">three more stages.</span>
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
          {STAGES.map((stage) => (
            <article
              key={stage.slug}
              className={cn(
                'flex min-h-[240px] flex-col rounded-[28px] p-6 sm:min-h-[260px] sm:p-7',
                stage.tone === 'teal' && 'bg-[#35BEBC] text-[#1A1E3A]',
                stage.tone === 'navy' && 'bg-[#1A1E3A] text-white',
                stage.tone === 'pale' && 'bg-[#EAF5F6] text-[#1A1E3A]',
              )}
            >
              <p
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-[0.12em]',
                  stage.tone === 'navy' ? 'text-white/50' : 'text-[#1A1E3A]/55',
                )}
              >
                {stage.eyebrow}
              </p>
              <h3 className="mt-4 text-[1.2rem] font-bold tracking-tight sm:text-[1.3rem]">
                {stage.title}
              </h3>
              <p
                className={cn(
                  'mt-3 text-[14px] leading-relaxed sm:text-[15px]',
                  stage.tone === 'navy' ? 'text-white/70' : 'text-[#1A1E3A]/75',
                )}
              >
                {stage.body}
              </p>
              <Link
                href={getFeaturePath(stage.slug)}
                className={cn(
                  'mt-auto pt-6 text-[14px] font-bold no-underline transition hover:opacity-80',
                  stage.tone === 'navy' ? 'text-white' : 'text-[#1A1E3A]',
                )}
              >
                Explore →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
