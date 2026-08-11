'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

export default function TeachingMethodFaq({
  items,
  eyebrow = 'Common questions',
  headingLead = 'Before you get',
  headingAccent = 'started...',
  description = 'Clear answers to the practical questions teachers usually ask about this approach.',
}) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!items?.length) return null

  return (
    <section
      id="tm-faq"
      className="pricing-faq-section relative left-1/2 mt-10 mb-4 w-screen max-w-[100vw] -translate-x-1/2 bg-[#1A1E3A] py-14 sm:mt-14 sm:mb-6 sm:py-16 lg:py-20"
      aria-labelledby="tm-faq-heading"
    >
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">
        <header>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
            {eyebrow}
          </p>
          <h2
            id="tm-faq-heading"
            className="max-w-[12ch] text-[clamp(1.85rem,3.8vw,2.85rem)] font-bold leading-[1.12] tracking-tight text-white"
          >
            {headingLead}{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              {headingAccent}
            </span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50 sm:text-base">
            {description}
          </p>
        </header>

        <div className="border-t border-white/10">
          {items.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={item.q} className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="text-[15px] font-semibold text-white sm:text-base">{item.q}</span>
                  <span
                    className={cn(
                      'relative h-4 w-4 shrink-0 text-[#35BEBC] transition-transform duration-300 ease-out',
                      open && 'rotate-180',
                    )}
                    aria-hidden
                  >
                    <Plus
                      className={cn(
                        'absolute inset-0 h-4 w-4 transition-opacity duration-300 ease-out',
                        open ? 'opacity-0' : 'opacity-100',
                      )}
                      strokeWidth={2.5}
                    />
                    <Minus
                      className={cn(
                        'absolute inset-0 h-4 w-4 transition-opacity duration-300 ease-out',
                        open ? 'opacity-100' : 'opacity-0',
                      )}
                      strokeWidth={2.5}
                    />
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className={cn(
                        'pr-8 text-[14px] leading-relaxed text-white/50 transition-opacity duration-300 ease-out sm:text-[15px]',
                        open ? 'pb-5 opacity-100 sm:pb-6' : 'pb-0 opacity-0',
                      )}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
