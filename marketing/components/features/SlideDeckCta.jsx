import Link from 'next/link'
import { MML_APP } from '@marketing/lib/appUrls'

export default function SlideDeckCta() {
  return (
    <section className="bg-white px-4 pt-6 sm:px-6 md:px-8" aria-labelledby="slide-deck-cta-heading">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-t-[32px] border-b-[3px] border-[#1A1E3A] bg-[#ade5df] px-5 py-14 text-center sm:rounded-t-[40px] sm:px-8 sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/55 sm:-right-14 sm:-top-20 sm:h-72 sm:w-72"
          aria-hidden
        />
        <div className="relative z-[1]">
          <h2
            id="slide-deck-cta-heading"
            className="whitespace-nowrap text-[clamp(1.75rem,3.6vw,2.75rem)] font-normal leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            Your next deck is one topic away.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-[#1A1E3A]/55 sm:text-[15px]">
            10 free credits · no card required · PPTX and Google Slides export
          </p>
          <Link
            href={MML_APP.signUp || MML_APP.stage1}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-6 py-3.5 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
          >
            Build a Slide Deck — Free
          </Link>
        </div>
      </div>
    </section>
  )
}
