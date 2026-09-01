import { cn } from '@marketing/lib/cn'
import { TEACHING_METHOD_CARD_ICONS } from '@marketing/components/teaching-methods/TeachingMethodCardIcons'
import { getCardDisplayParts } from '@marketing/lib/teachingMethodCard'
import TeachingMethodSectionImage from '@marketing/components/teaching-methods/TeachingMethodSectionImage'
import TeachingMethodBuilderSectionServer from '@marketing/components/teaching-methods/TeachingMethodBuilderSectionServer'
import {
  getCompareBand,
  getSectionLayout,
  sectionAnchorId,
} from '@marketing/lib/teachingMethodLayout'

const CARD_ICONS = TEACHING_METHOD_CARD_ICONS

function SectionHeader({ heading }) {
  return <h2 className="tm-section-heading tm-section-heading--visible">{heading}</h2>
}

function ContentCard({ paragraph, index, sectionIndex }) {
  const { title, body } = getCardDisplayParts(paragraph)
  const Icon = CARD_ICONS[(sectionIndex + index) % CARD_ICONS.length]

  return (
    <article
      className="tm-content-card tm-content-card--visible"
      style={{ transitionDelay: `${120 + index * 90}ms` }}
    >
      <div className="tm-content-card-icon" aria-hidden>
        <Icon size={18} strokeWidth={2} />
      </div>
      {title ? <h3 className="tm-content-card-title">{title}</h3> : null}
      <p className="tm-content-card-body">{body}</p>
    </article>
  )
}

function IntroLayout({ section }) {
  return (
    <div className="tm-section-plain">
      {section.paragraphs.map((paragraph, index) => (
        <p
          key={`${section.heading}-plain-${index}`}
          className="tm-paragraph tm-paragraph--visible"
          style={{ transitionDelay: `${80 + index * 60}ms` }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function CompareLayout({ section }) {
  const tags = ['Key idea', 'In practice']

  return (
    <div className="tm-compare-grid">
      {section.paragraphs.map((paragraph, index) => {
        const { title, body } = getCardDisplayParts(paragraph)
        return (
          <article
            key={`${section.heading}-compare-${index}`}
            className={cn(
              'tm-compare-card tm-compare-card--visible',
              index === 1 && 'tm-compare-card--accent',
            )}
            style={{ transitionDelay: `${100 + index * 100}ms` }}
          >
            <span className="tm-compare-tag">{tags[index] ?? 'Insight'}</span>
            {title ? <h3 className="tm-compare-title">{title}</h3> : null}
            <p className="tm-compare-body">{body}</p>
          </article>
        )
      })}
    </div>
  )
}

function WhenUseLayout({ section, sectionIndex }) {
  return (
    <div className={cn('tm-use-grid', section.paragraphs.length === 1 && 'tm-use-grid--single')}>
      {section.paragraphs.map((paragraph, index) => {
        const { title, body } = getCardDisplayParts(paragraph)
        const Icon = CARD_ICONS[(sectionIndex + index) % CARD_ICONS.length]
        return (
          <article
            key={`${section.heading}-use-${index}`}
            className="tm-use-card tm-use-card--visible"
            style={{ transitionDelay: `${100 + index * 90}ms` }}
          >
            <div className="tm-use-icon" aria-hidden>
              <Icon size={22} strokeWidth={2} />
            </div>
            <h3 className="tm-use-title">{title ?? `Guideline ${index + 1}`}</h3>
            <p className="tm-use-body">{body}</p>
          </article>
        )
      })}
    </div>
  )
}

function ProofLayout({ section, entity, pageType = 'teaching-method' }) {
  const category =
    pageType === 'feature' ? 'Features' : entity?.columnHeading ?? 'Teaching Methods'
  const pills = [entity?.label, category, 'Australian Curriculum', 'Make My Lesson'].filter(Boolean)

  return (
    <div className={cn('tm-proof-layout', !entity?.sectionImage && 'tm-proof-layout--content-only')}>
      {entity?.sectionImage ? (
        <TeachingMethodSectionImage
          method={entity}
          imageKey="section"
          className="tm-proof-visual"
          imageClassName="tm-proof-img"
        />
      ) : null}
      <div className="tm-proof-content">
        {section.paragraphs.map((paragraph, index) => (
          <p
            key={`${section.heading}-proof-${index}`}
            className="tm-paragraph tm-paragraph--visible"
            style={{ transitionDelay: `${80 + index * 60}ms` }}
          >
            {paragraph}
          </p>
        ))}
        <div className="tm-proof-pills">
          {pills.map((pill) => (
            <span key={pill} className="tm-proof-pill">
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TeachingMethodSection({
  section,
  sectionIndex = 0,
  method,
  pageType = 'teaching-method',
  sections = [],
}) {
  const layout = getSectionLayout(section.heading, section.paragraphs.length, {
    pageType,
    sectionIndex,
  })
  const hasMultiple = section.paragraphs.length > 1
  const isSoft = layout === 'when-use'
  const compareBand = getCompareBand(sections, sectionIndex, pageType)
  const isCyan = compareBand === 'upper'
  const isCyanSoft = compareBand === 'lower'
  const entity = method

  return (
    <section
      id={sectionAnchorId(section.heading)}
      className={cn(
        'tm-section tm-section--visible',
        isSoft && 'tm-section--soft',
        isCyan && 'tm-section--cyan',
        isCyanSoft && 'tm-section--cyan-soft',
      )}
    >
      <SectionHeader heading={section.heading} />

      {layout === 'intro' && <IntroLayout section={section} />}
      {layout === 'compare' && <CompareLayout section={section} />}
      {layout === 'builder' && (
        <TeachingMethodBuilderSectionServer section={section} sectionIndex={sectionIndex} />
      )}
      {layout === 'when-use' && (
        <WhenUseLayout section={section} sectionIndex={sectionIndex} />
      )}
      {layout === 'proof' && (
        <ProofLayout section={section} entity={entity} pageType={pageType} />
      )}
      {layout === 'cards' && (
        <div className={cn('tm-content-cards', hasMultiple && 'tm-content-cards--multi')}>
          {section.paragraphs.map((paragraph, index) => (
            <ContentCard
              key={`${section.heading}-${index}`}
              paragraph={paragraph}
              index={index}
              sectionIndex={sectionIndex}
            />
          ))}
        </div>
      )}
    </section>
  )
}
