import TeachingMethodsHubPage from '@marketing/views/TeachingMethodsHubPage'
import { TEACHING_METHOD_COLUMNS } from '@marketing/data/teachingMethods'
import {
  buildTeachingMethodsHubBreadcrumbSchema,
  buildTeachingMethodsHubItemListSchema,
} from '@marketing/lib/teachingMethodsJsonLd'

export const metadata = {
  title: 'Teaching Methods — Pedagogical Approaches for Lesson Planning | Make My Lesson',
  description:
    'Explore sixteen teaching methods supported by Make My Lesson — structured delivery, inquiry-based learning, engagement strategies, and learner-centred approaches for teachers.',
  keywords: [
    'teaching methods',
    'pedagogical approaches',
    'lesson planning strategies',
    'inquiry-based learning',
    'project-based learning',
    'flipped classroom',
  ],
  alternates: { canonical: '/teaching-methods' },
  robots: { index: true, follow: true },
}

export default function TeachingMethodsHubRoutePage() {
  const breadcrumbSchema = buildTeachingMethodsHubBreadcrumbSchema()
  const itemListSchema = buildTeachingMethodsHubItemListSchema(TEACHING_METHOD_COLUMNS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <TeachingMethodsHubPage />
    </>
  )
}
