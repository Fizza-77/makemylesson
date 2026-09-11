import { PageShell } from '@marketing/components/layout/Container'
import FeatureHero from '@marketing/components/features/FeatureHero'
import TeachingMethodCta from '@marketing/components/teaching-methods/TeachingMethodCta'
import TeachingMethodFaqServer from '@marketing/components/teaching-methods/TeachingMethodFaqServer'
import TeachingMethodSection from '@marketing/components/teaching-methods/TeachingMethodSection'

function FeatureArticle({ feature, content }) {
  const title = content.metaTitle ?? feature.title
  const intro = content.quickAnswer ?? content.metaDescription ?? feature.description

  return (
    <PageShell
      variant="wide"
      className="tm-page-shell border-slate-200 bg-white"
      contentClassName="pb-16 pt-6 md:pb-20 md:pt-8"
    >
      <FeatureHero feature={feature} title={title} intro={intro} sections={content.sections} />

      <article className="tm-article w-full">
        <div className="tm-body">
          {content.sections.map((section, index) => (
            <TeachingMethodSection
              key={section.heading}
              section={section}
              sectionIndex={index}
              method={feature}
              pageType="feature"
              sections={content.sections}
            />
          ))}

          {content.cta && (
            <TeachingMethodCta heading={content.cta.heading} body={content.cta.body} />
          )}

          {content.faq?.length > 0 && <TeachingMethodFaqServer items={content.faq} />}
        </div>
      </article>
    </PageShell>
  )
}

function FeaturePlaceholder({ feature }) {
  return (
    <PageShell
      variant="wide"
      className="tm-page-shell border-slate-200 bg-white"
      contentClassName="pb-16 pt-6 md:pb-20 md:pt-8"
    >
      <FeatureHero feature={feature} title={feature.title} intro={feature.description} sections={[]} />

      <article className="tm-article w-full">
        <div className="tm-body">
          <section className="tm-section">
            <p className="tm-paragraph">
              Full details for {feature.title.toLowerCase()} are coming soon. Make My Lesson already
              includes this capability when you build a teaching pack — start planning and generate
              curriculum-aligned resources in minutes.
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

export default function FeaturePage({ feature, content }) {
  if (content) {
    return <FeatureArticle feature={feature} content={content} />
  }

  return <FeaturePlaceholder feature={feature} />
}


