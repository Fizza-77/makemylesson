import Link from 'next/link'

import { MML_APP } from '@marketing/lib/appUrls'

export default function FaqSupportSection() {
  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14" aria-labelledby="faq-support-heading">
      <div className="faq-topics-shell">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-[#ade5df] px-6 py-7 sm:rounded-[36px] sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
          <div>
            <h2
              id="faq-support-heading"
              className="text-[clamp(1.25rem,2.4vw,1.65rem)] font-bold tracking-tight text-[#1A1E3A]"
            >
              Didn&apos;t find your answer?
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-black sm:text-[15px]">
              Real humans reply — usually within one school day.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Email Us
            </Link>
            <Link
              href={MML_APP.ayla}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:bg-white/90"
            >
              Ask Ayla Instead
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


