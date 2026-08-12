import Link from 'next/link'
import { getFeaturePath } from '@marketing/data/features'

const STAGES = [
  {
    slug: 'lesson-plan-generator',
    eyebrow: 'Stage 1 · Plan',
    title: 'AI Lesson Plan Generator',
    body: 'The plan this deck was built from — objectives, timings, and differentiation markers.',
  },
  {
    slug: 'classroom-activities',
    eyebrow: 'Stage 3 · Practise',
    title: 'Classroom Activities',
    body: 'Student activity sheet plus teacher answer key — matched character-for-character to these slides.',
  },
  {
    slug: 'test-generator',
    eyebrow: 'Stage 4 · Assess',
    title: 'AI Test Generator',
    body: 'Assessment and mark scheme, Bloom-balanced against what the deck taught in your classroom.',
  },
]

export default function SlideDeckNextStages() {
  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="slide-next-stages-heading"
    >
      <div className="fp-shell px-4 sm:px-6 md:px-8">
        <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
          </span>
          Keep the topic moving
        </p>
        <h2
          id="slide-next-stages-heading"
          className="max-w-full text-[clamp(1.35rem,2.6vw,1.85rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A] md:whitespace-nowrap"
        >
          Your deck connects to{' '}
          <span className="pricing-hero-underline relative inline-block">three more stages.</span>
        </h2>

        <div className="mt-8 fp-card-grid sm:mt-10">
          {STAGES.map((stage) => (
            <article
              key={stage.slug}
              className="flex min-h-[240px] w-full min-w-0 flex-col rounded-[28px] bg-[#1A1E3A] p-6 text-white sm:min-h-[260px] sm:p-7"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                {stage.eyebrow}
              </p>
              <h3 className="mt-4 text-[1.2rem] font-normal tracking-tight sm:text-[1.3rem]">
                {stage.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
                {stage.body}
              </p>
              <Link
                href={getFeaturePath(stage.slug)}
                className="mt-auto pt-6 text-[14px] font-bold text-[#35BEBC] no-underline transition hover:text-[#74FFFD]"
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
