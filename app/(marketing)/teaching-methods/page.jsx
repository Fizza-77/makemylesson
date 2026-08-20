import TeachingMethodsHubPage from '@marketing/views/TeachingMethodsHubPage'
import { TEACHING_METHOD_COLUMNS } from '@marketing/data/teachingMethods'
import {
  buildTeachingMethodsHubBreadcrumbSchema,
  buildTeachingMethodsHubItemListSchema,
} from '@marketing/lib/teachingMethodsJsonLd'

export const metadata = {
  title: { absolute: 'Teaching Methods for Lesson Planning | Make My Lesson' },
  description:
    'Explore 16 teaching methods that reshape lesson plans, slides, activities and assessments. Compare approaches and choose the best fit for your class.',
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
