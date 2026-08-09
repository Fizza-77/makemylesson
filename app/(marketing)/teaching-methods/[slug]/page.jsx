import { notFound } from 'next/navigation'
import TeachingMethodPage from '@marketing/views/TeachingMethodPage'
import {
  ALL_TEACHING_METHODS,
  TEACHING_METHODS_BASE,
  getTeachingMethodBySlug,
} from '@marketing/data/teachingMethods'
import { getTeachingMethodContent } from '@marketing/data/teachingMethodContent'
import {
  buildTeachingMethodBreadcrumbSchema,
  buildTeachingMethodFaqJsonLd,
  buildTeachingMethodWebPageSchema,
} from '@marketing/lib/teachingMethodsJsonLd'
import { SITE_URL } from '@marketing/lib/siteUrl'

export function generateStaticParams() {
  return ALL_TEACHING_METHODS.map((method) => ({ slug: method.slug }))
}

export async function generateMetadata({ params }) {
  const slug = params?.slug
  if (!slug) return { title: 'Teaching Method' }

  const method = getTeachingMethodBySlug(slug)
  if (!method) return { title: 'Teaching Method' }

  const content = getTeachingMethodContent(slug)
  const title = content?.metaTitle
    ? `${content.metaTitle} | Make My Lesson`
    : `${method.label} — Teaching Method Guide | Make My Lesson`
  const description = content?.metaDescription ?? method.description
  const canonical = `${SITE_URL}${TEACHING_METHODS_BASE}/${method.slug}`

  return {
    title,
    description,
    keywords: [
      method.label,
      method.columnHeading,
      'teaching method',
      'lesson planning',
      'Make My Lesson',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName: 'Make My Lesson',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: { index: true, follow: true },
  }
}

export default function TeachingMethodRoutePage({ params }) {
  const slug = params?.slug
  if (!slug) notFound()

  const method = getTeachingMethodBySlug(slug)
  if (!method) notFound()

  const content = getTeachingMethodContent(slug)
  const canonical = `${SITE_URL}${TEACHING_METHODS_BASE}/${method.slug}`
  const pageTitle = content?.metaTitle ?? method.label
  const pageDescription = content?.metaDescription ?? method.description

  const breadcrumbSchema = buildTeachingMethodBreadcrumbSchema(pageTitle, method.slug)
  const webPageSchema = buildTeachingMethodWebPageSchema({
    ...method,
    label: pageTitle,
    description: pageDescription,
  })
  const faqJsonLd = content?.faq ? buildTeachingMethodFaqJsonLd(content.faq, canonical) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <TeachingMethodPage method={method} content={content} />
    </>
  )
}
