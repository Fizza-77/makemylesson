import Link from 'next/link'
import { MML_APP } from '@marketing/lib/appUrls'

export default function ActivityCta() {
  return (
    <section className="bg-white px-4 pt-2 sm:px-6 md:px-8" aria-labelledby="activity-cta-heading">
      <div className="cta-card-pad relative fp-shell overflow-hidden rounded-t-[32px] bg-[#ade5df] py-14 text-center sm:rounded-t-[40px] sm:py-16 lg:py-20">
        <div className="relative z-[1] w-full">
          <h2
            id="activity-cta-heading"
            className="cta-card-copy max-w-full text-[clamp(1.5rem,6.5vw,2.75rem)] font-normal leading-[1.15] tracking-tight text-[#1A1E3A] md:whitespace-nowrap md:text-[clamp(1.75rem,3.6vw,2.75rem)] md:leading-[1.12]"
          >
            Sheet on the desks. Key in your hand.
          </h2>
          <p className="cta-card-copy mt-4 text-[14px] leading-relaxed text-[#1A1E3A]/55 sm:text-[15px]">
            10 free credits · both documents per generation · no card required
          </p>
          <Link
            href={MML_APP.signUp || MML_APP.stage1}
            className="mt-8 inline-flex max-w-full items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3.5 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845] sm:px-6"
          >
            Generate an Activity — Free
          </Link>
        </div>
      </div>
    </section>
  )
}
