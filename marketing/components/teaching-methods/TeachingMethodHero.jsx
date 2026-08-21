import Link from 'next/link'
import TeachingMethodJumpNav from '@marketing/components/teaching-methods/TeachingMethodJumpNav'
import TeachingMethodSectionImage from '@marketing/components/teaching-methods/TeachingMethodSectionImage'
import TeachingMethodTitle from '@marketing/components/teaching-methods/TeachingMethodTitle'
import { TEACHING_METHODS_BASE } from '@marketing/data/teachingMethods'

export default function TeachingMethodHero({ method, title, intro, eyebrow, sections }) {
  return (
    <section className="tm-hero-band">
      <div className="tm-hero-band-orb tm-hero-band-orb--tr" aria-hidden />
      <div className="tm-hero-band-orb tm-hero-band-orb--bl" aria-hidden />

      <div className="tm-hero-band-content tm-hero-band--visible">
        <Link href={TEACHING_METHODS_BASE} className="tm-hero-back">
          ← All teaching methods
        </Link>

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
    </section>
  )
}
