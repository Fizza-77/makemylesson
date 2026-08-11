import Link from 'next/link'
import PricingPlanFloatCards from '@marketing/components/PricingPlanFloatCards'
import { MML_APP } from '@marketing/lib/appUrls'

export default function AssessmentCta() {
  return (
    <section
      className="bg-white px-4 pt-2 sm:px-6 md:px-8"
      aria-labelledby="assessment-cta-heading"
    >
      <div className="cta-card-pad fp-shell overflow-hidden rounded-t-[32px] bg-[#ade5df] py-12 sm:rounded-t-[40px] sm:py-16 lg:py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="min-w-0 w-full">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A] xl:text-[12px]">
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#74FFFD]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
              </span>
              Ready to assess?
            </p>
            <h2
              id="assessment-cta-heading"
              className="cta-card-copy text-[clamp(1.85rem,3.8vw,3.35rem)] font-bold leading-[1.15] tracking-tight text-[#1A1E3A]"
            >
              <span className="block xl:inline">Paper on the desk.</span>{' '}
              <span className="block xl:inline">Scheme in your hand.</span>
            </h2>
            <p className="cta-card-copy mt-4 text-[15px] leading-relaxed text-[#1A1E3A]/70 sm:text-base xl:text-[1.05rem]">
              10 free credits · assessment and mark scheme generated together · no card required
            </p>
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-6 py-3.5 text-[15px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(26,30,58,0.22)] transition hover:bg-[#242845] xl:px-7 xl:py-4 xl:text-[16px]"
            >
              Generate a Test — Free
            </Link>
          </div>

          <PricingPlanFloatCards />
        </div>
      </div>
    </section>
  )
}
