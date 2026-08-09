import Container from '@marketing/components/layout/Container'
import FeatureHero from '@marketing/components/features/FeatureHero'
import TeachingMethodCta from '@marketing/components/teaching-methods/TeachingMethodCta'
import TeachingMethodFaq from '@marketing/components/teaching-methods/TeachingMethodFaq'
import TeachingMethodSection from '@marketing/components/teaching-methods/TeachingMethodSection'

function FeatureArticle({ feature, content }) {
  const title = content.metaTitle ?? feature.title
  const intro = content.quickAnswer ?? content.metaDescription ?? feature.description

  return (
    <div className="tm-page-wrap min-h-[calc(100vh-4rem)] border-t border-slate-200 bg-white">
      <FeatureHero feature={feature} title={title} intro={intro} sections={content.sections} />

      <Container variant="policy" className="pb-24 pt-0">
        <article className="tm-article w-full">
          <div className="tm-body">
            {content.sections.map((section, index) => (
              <TeachingMethodSection
                key={section.heading}
                section={section}
                sectionIndex={index}
                method={feature}
                pageType="feature"
              />
            ))}

            {content.cta && (
              <TeachingMethodCta heading={content.cta.heading} body={content.cta.body} />
            )}

            {content.faq?.length > 0 && <TeachingMethodFaq items={content.faq} />}
          </div>
        </article>
      </Container>
    </div>
  )
}

function FeaturePlaceholder({ feature }) {
  return (
    <div className="tm-page-wrap min-h-[calc(100vh-4rem)] border-t border-slate-200 bg-white">
      <FeatureHero feature={feature} title={feature.title} intro={feature.description} sections={[]} />

      <Container variant="policy" className="pb-24 pt-0">
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
      </Container>
    </div>
  )
}

export default function FeaturePage({ feature, content }) {
  if (content) {
    return <FeatureArticle feature={feature} content={content} />
  }

  return <FeaturePlaceholder feature={feature} />
}
