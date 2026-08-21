import Link from 'next/link'
import FeatureSectionImage from '@marketing/components/features/FeatureSectionImage'
import TeachingMethodJumpNav from '@marketing/components/teaching-methods/TeachingMethodJumpNav'
import TeachingMethodTitle from '@marketing/components/teaching-methods/TeachingMethodTitle'

export default function FeatureHero({ feature, title, intro, sections }) {
  return (
    <section className="tm-hero-band">
      <div className="tm-hero-band-orb tm-hero-band-orb--tr" aria-hidden />
      <div className="tm-hero-band-orb tm-hero-band-orb--bl" aria-hidden />

      <div className="tm-hero-band-content tm-hero-band--visible">
        <Link href="/features" className="tm-hero-back">
          ← All features
        </Link>

        <div className="tm-hero">
          <div className="tm-hero-content">
            <p className="tm-hero-eyebrow">Features</p>
            <TeachingMethodTitle title={title} />
            {intro ? <p className="tm-hero-copy">{intro}</p> : null}
          </div>

          <FeatureSectionImage feature={feature} className="tm-hero-visual" imageClassName="tm-hero-img" />
        </div>

        <TeachingMethodJumpNav sections={sections} pageType="feature" />
      </div>
    </section>
  )
}
