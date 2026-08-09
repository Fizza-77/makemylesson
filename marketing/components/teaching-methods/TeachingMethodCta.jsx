'use client'

import Link from 'next/link'
import { useInView } from '@marketing/landing/hooks'
import { cn } from '@marketing/lib/cn'
import { MML_APP } from '@marketing/lib/appUrls'

export default function TeachingMethodCta({ heading, body }) {
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <section
      className={cn('tm-cta-band', visible && 'tm-cta-band--visible')}
      aria-labelledby="tm-cta-heading"
      ref={ref}
    >
      <div className="tm-cta-band-glow" aria-hidden />
      <div className="tm-cta-band-inner">
        <h2 id="tm-cta-heading" className="tm-cta-band-title">
          {heading}
        </h2>
        <p className="tm-cta-band-lead">{body}</p>
        <div className="tm-cta-band-actions">
          <Link href={MML_APP.stage1} className="tm-cta-band-btn tm-cta-band-btn--primary">
            Sign up free
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
