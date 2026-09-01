import { PageShell } from '@marketing/components/layout/Container'
import TeachingMethodCta from '@marketing/components/teaching-methods/TeachingMethodCta'
import TeachingMethodFaqServer from '@marketing/components/teaching-methods/TeachingMethodFaqServer'
import TeachingMethodHero from '@marketing/components/teaching-methods/TeachingMethodHero'
import TeachingMethodSection from '@marketing/components/teaching-methods/TeachingMethodSection'

function TeachingMethodArticle({ method, content }) {
  const title = content.metaTitle ?? method.label
  const intro = content.quickAnswer ?? content.metaDescription ?? method.description

  return (
    <PageShell
      variant="wide"
      className="tm-page-shell tm-method-page border-slate-200 bg-white"
      contentClassName="pt-2 pb-[20px] md:pb-[20px] lg:pb-[20px]"
    >
      <TeachingMethodHero
        method={method}
        title={title}
        intro={intro}
        eyebrow={method.columnHeading}
        sections={content.sections}
      />

      <article className="tm-article w-full">
        <div className="tm-body">
          {content.sections.map((section, index) => (
            <TeachingMethodSection
              key={section.heading}
              section={section}
              sectionIndex={index}
              method={method}
              sections={content.sections}
            />
          ))}

          {content.faq?.length > 0 && <TeachingMethodFaqServer items={content.faq} />}

          {content.cta && (
            <TeachingMethodCta heading={content.cta.heading} body={content.cta.body} />
          )}
        </div>
      </article>
    </PageShell>
  )
}

function TeachingMethodPlaceholder({ method }) {
  return (
    <PageShell
      variant="wide"
      className="tm-page-shell tm-method-page border-slate-200 bg-white"
      contentClassName="pt-2 pb-[20px] md:pb-[20px] lg:pb-[20px]"
    >
      <TeachingMethodHero
        method={method}
        title={method.label}
        intro={method.description}
        eyebrow={method.columnHeading}
        sections={[]}
      />

      <article className="tm-article w-full">
        <div className="tm-body">
          <section className="tm-section">
            <p className="tm-paragraph">
              Detailed guidance for {method.label.toLowerCase()} is coming soon. Make My Lesson already
              supports this approach when you generate lesson plans — choose your method in the app and
              receive structured resources aligned to your curriculum.
            </p>
          </section>

          <TeachingMethodCta
            heading="Start planning today"
            body="Try Make My Lesson and generate your first curriculum-aligned lesson plan in minutes."
          />
        </div>
      </article>
    </PageShell>
  )
}

export default function TeachingMethodPage({ method, content }) {
  if (content) {
    return <TeachingMethodArticle method={method} content={content} />
  }

  return <TeachingMethodPlaceholder method={method} />
}
