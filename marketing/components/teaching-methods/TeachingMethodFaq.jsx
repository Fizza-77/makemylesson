'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useInView } from '@marketing/landing/hooks'
import { cn } from '@marketing/lib/cn'

function FaqCard({ item, index, isOpen, onToggle }) {
  const [ref, visible] = useInView({ threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  return (
    <article
      ref={ref}
      className={cn('tm-faq-card', visible && 'tm-faq-card--visible', isOpen && 'tm-faq-card--open')}
      style={{ transitionDelay: visible ? `${Math.min(index, 4) * 90}ms` : undefined }}
    >
      <button
        type="button"
        className="tm-faq-card-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="tm-faq-card-q">{item.q}</span>
        <ChevronDown
          size={18}
          strokeWidth={2.25}
          className="tm-faq-card-chevron shrink-0"
          aria-hidden
        />
      </button>
      <div className="tm-faq-card-answer-wrap" hidden={!isOpen}>
        <p className="tm-faq-card-a">{item.a}</p>
      </div>
    </article>
  )
}

export default function TeachingMethodFaq({ items }) {
  const [headingRef, headingVisible] = useInView({ threshold: 0.2 })
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="tm-faq" aria-labelledby="tm-faq-heading">
      <h2
        id="tm-faq-heading"
        ref={headingRef}
        className={cn('tm-section-heading', headingVisible && 'tm-section-heading--visible')}
      >
        Frequently Asked Questions
      </h2>
      <div className="tm-faq-list" role="list">
        {items.map((item, index) => (
          <FaqCard
            key={item.q}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
          />
        ))}
      </div>
    </section>
  )
}
