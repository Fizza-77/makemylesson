'use client'

import { useEffect, useState } from 'react'
import TeachingMethodJumpNav from '@marketing/components/teaching-methods/TeachingMethodJumpNav'
import TeachingMethodSectionImage from '@marketing/components/teaching-methods/TeachingMethodSectionImage'
import TeachingMethodTitle from '@marketing/components/teaching-methods/TeachingMethodTitle'
import { cn } from '@marketing/lib/cn'

export default function TeachingMethodHero({ method, title, intro, eyebrow, sections }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="tm-hero-band">
      <div className="tm-hero-band-grid" aria-hidden />
      <div className={cn('tm-hero-band-content', visible && 'tm-hero-band--visible')}>
        <div className="tm-hero">
          <div className="tm-hero-content">
            {eyebrow ? <p className="tm-hero-eyebrow">{eyebrow}</p> : null}
            <TeachingMethodTitle title={title} />
            {intro ? <p className="tm-hero-copy">{intro}</p> : null}
          </div>

          <TeachingMethodSectionImage
            method={method}
            className="tm-hero-visual"
            imageClassName="tm-hero-img"
          />
        </div>

        <TeachingMethodJumpNav sections={sections} />
      </div>
    </div>
  )
}
