import Link from 'next/link'
import { Globe } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'
import SlideDeckHeroPreview from '@marketing/components/features/SlideDeckHeroPreview'

export default function SlideDeckStageHero() {
  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
      aria-labelledby="slide-deck-hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#35BEBC] sm:-right-20 sm:-top-14"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#9ddad4]/70"
        aria-hidden
      />

      <div className="relative z-[1] grid items-center gap-10 px-6 py-[1cm] sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]/35" />
            </span>
            Stage 2 · Present
          </p>

          <h1
            id="slide-deck-hero-heading"
            className="max-w-[14ch] text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] xl:max-w-none"
          >
            Slides that{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              teach
            </span>{' '}
            not just decorate.
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black sm:text-base">
            Every deck follows a real pedagogical sequence — title, objectives, vocabulary, core
            content, practice, recap — with speaker notes already written under every slide.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Build a Slide Deck — Free
            </Link>
            <a
              href="#slide-sequence"
              className="inline-flex items-center justify-center rounded-full border border-[#1A1E3A]/25 bg-transparent px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:border-[#1A1E3A]/45 hover:bg-white/40"
            >
              See the Sequence ↓
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-black">
            <span className="text-[#EAB308]">★★★★★</span>
            <span>Rated by educators</span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#35BEBC]" aria-hidden strokeWidth={2} />
              71 curriculum routes
            </span>
            <span className="text-black" aria-hidden>
              ·
            </span>
            <span>PPTX + Google Slides export</span>
          </div>
        </div>

        <SlideDeckHeroPreview />
      </div>
    </section>
  )
}
