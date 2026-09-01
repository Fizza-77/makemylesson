function FaqChevron() {
  return (
    <svg
      className="pricing-faq-chevron h-4 w-4 shrink-0 text-[#35BEBC]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/** Server-rendered FAQ — no client JS; first item open for crawlers and readers. */
export default function TeachingMethodFaqServer({
  items,
  eyebrow = 'Common questions',
  headingLead = 'Before you get',
  headingAccent = 'started...',
  description = 'Clear answers to the practical questions teachers usually ask about this approach.',
}) {
  if (!items?.length) return null

  return (
    <section
      id="tm-faq"
      className="pricing-faq-section relative left-1/2 mt-10 mb-4 w-screen max-w-[100vw] -translate-x-1/2 bg-[#1A1E3A] py-14 sm:mt-14 sm:mb-6 sm:py-16 lg:py-20"
      aria-labelledby="tm-faq-heading"
    >
      <div className="pricing-faq-inner">
        <header className="min-w-0">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
            {eyebrow}
          </p>
          <h2 id="tm-faq-heading" className="pricing-faq-heading">
            {headingLead}{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              {headingAccent}
            </span>
          </h2>
          <p className="pricing-faq-copy">{description}</p>
        </header>

        <div className="pricing-faq-list">
          {items.map((item, index) => (
            <details key={item.q} className="pricing-faq-item" open={index === 0}>
              <summary className="pricing-faq-trigger">
                <span className="pricing-faq-question">{item.q}</span>
                <FaqChevron />
              </summary>
              <p className="pricing-faq-answer pb-5 sm:pb-6">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
