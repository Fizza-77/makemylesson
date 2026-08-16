import Link from 'next/link'
import { getFeaturePath } from '@marketing/data/features'
import { cn } from '@marketing/lib/cn'

const STAGES = [
  {
    slug: 'presentation-maker',
    eyebrow: 'Stage 2 · Present',
    title: 'AI Presentation Maker',
    body: "A duration-calibrated slide deck with speaker notes, built from this plan's objectives.",
    tone: 'teal',
  },
  {
    slug: 'classroom-activities',
    eyebrow: 'Stage 3 · Practise',
    title: 'Classroom Activities',
    body: 'Student activity sheet plus teacher answer key — always generated as a pair.',
    tone: 'navy',
  },
  {
    slug: 'test-generator',
    eyebrow: 'Stage 4 · Assess',
    title: 'AI Test Generator',
    body: 'Assessment paper and mark scheme, Bloom-balanced against what this plan taught.',
    tone: 'teal',
  },
]

export default function LessonPlanNextStages() {
  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="next-stages-heading"
    >
      <div className="fp-shell px-4 sm:px-6 md:px-8">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
          Keep the topic moving
        </p>
        <h2
          id="next-stages-heading"
          className="max-w-full text-center text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] md:whitespace-nowrap"
        >
          Your plan feeds{' '}
          <span className="pricing-hero-underline pricing-hero-underline--straight relative inline-block">three more stages.</span>
        </h2>
        <p className="mx-auto mt-4 w-fit max-w-full text-center text-[15px] leading-relaxed text-black sm:text-base sm:whitespace-nowrap">
          Generate them together and every document stays coherent —{' '}
          <br className="sm:hidden" />
          same objectives, same language, same level.
        </p>

        <div className="mt-8 fp-card-grid sm:mt-10">
          {STAGES.map((stage) => {
            const teal = stage.tone === 'teal'
            return (
              <article
                key={stage.slug}
                className={cn(
                  'flex min-h-[240px] w-full min-w-0 flex-col rounded-[28px] p-6 sm:min-h-[260px] sm:p-7',
                  teal ? 'bg-[#35BEBC] text-[#1A1E3A]' : 'bg-[#1A1E3A] text-white',
                )}
              >
                <p
                  className={cn(
                    'text-[11px] font-semibold uppercase tracking-[0.12em]',
                    teal ? 'text-black' : 'text-white',
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
                    teal ? 'text-black' : 'text-white',
                  )}
                >
                  {stage.body}
                </p>
                <Link
                  href={getFeaturePath(stage.slug)}
                  className={cn(
                    'mt-auto pt-6 text-[14px] font-bold no-underline transition hover:opacity-80',
                    teal ? 'text-[#1A1E3A]' : 'text-white',
                  )}
                >
                  Explore →
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
