import { CircleHelp } from 'lucide-react'

import FaqControls from '@marketing/components/faq/FaqControls'

export default function FaqHeroSection() {
  return (
    <div className="faq-hero-shell pt-6 sm:pt-8">
      <section
        className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
        aria-labelledby="faq-hero-heading"
      >
        <div
          className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/35"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/30"
          aria-hidden
        />

        <div className="relative z-[1] grid items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-12 lg:py-14">
          <div className="min-w-0">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <CircleHelp className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
              FAQs
            </p>
            <h1
              id="faq-hero-heading"
              className="max-w-[22ch] text-[clamp(1.85rem,4vw,3.1rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] sm:max-w-[26ch] md:max-w-[28ch] lg:max-w-[22ch] xl:max-w-[26ch]"
            >
              Ask us anything. We&apos;ve probably heard it in a{' '}
              <span className="pricing-hero-underline relative inline-block">staffroom.</span>
            </h1>
          </div>

          <FaqControls />
        </div>
      </section>
    </div>
  )
}
