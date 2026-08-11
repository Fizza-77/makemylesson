'use client'

import { sectionAnchorId, jumpNavLabel } from '@marketing/lib/teachingMethodLayout'

export default function TeachingMethodJumpNav({ sections, pageType = 'teaching-method' }) {
  if (!sections?.length) return null

  return (
    <nav className="tm-mini-nav" aria-label="On this page">
      {sections.map((section, index) => (
        <a key={section.heading} href={`#${sectionAnchorId(section.heading)}`} className="tm-mini-nav-link">
          {jumpNavLabel(section.heading, index, pageType)}
        </a>
      ))}
      <a href="#tm-faq" className="tm-mini-nav-link">
        FAQs
      </a>
    </nav>
  )
}
