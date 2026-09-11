import { cn } from '@marketing/lib/cn'
import { TEACHING_METHOD_CARD_ICONS } from '@marketing/components/teaching-methods/TeachingMethodCardIcons'
import { builderStepTitle } from '@marketing/lib/teachingMethodLayout'

/** Static builder steps — all content in HTML, no framer-motion / client JS. */
export default function TeachingMethodBuilderSectionServer({ section, sectionIndex = 0 }) {
  const stepCount = section.paragraphs.length

  return (
    <div className="tm-builder-interactive">
      <div
        className={cn(
          'tm-builder-grid',
          stepCount === 2 && 'tm-builder-grid--two',
          stepCount >= 3 && 'tm-builder-grid--three',
        )}
      >
        {section.paragraphs.map((paragraph, index) => {
          const Icon = TEACHING_METHOD_CARD_ICONS[(sectionIndex + index) % TEACHING_METHOD_CARD_ICONS.length]
          const title = builderStepTitle(index)

          return (
            <article key={`${section.heading}-builder-${index}`} className="tm-builder-cell">
              <div className="tm-builder-compact-card tm-builder-compact-card--static">
                <div className="tm-builder-step-header">
                  <div className="tm-builder-step-icon" aria-hidden>
                    <Icon size={22} />
                  </div>
                  <div className="tm-builder-step-copy">
                    <h3 className="tm-builder-step-title">{title}</h3>
                  </div>
                </div>
                <p className="tm-builder-expanded-text">{paragraph}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}


