import TeachingMethodsHubPage from '@marketing/views/TeachingMethodsHubPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import '../../../marketing/marketing-content.css'
import { TEACHING_METHOD_COLUMNS } from '@marketing/data/teachingMethods'
import {
  buildTeachingMethodsHubBreadcrumbSchema,
  buildTeachingMethodsHubCollectionPageSchema,
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
  return (
    <>
      <MarketingPageJsonLd
        data={[
          buildTeachingMethodsHubBreadcrumbSchema(),
          buildTeachingMethodsHubCollectionPageSchema(),
          buildTeachingMethodsHubItemListSchema(TEACHING_METHOD_COLUMNS),
        ]}
      />
      <TeachingMethodsHubPage />
    </>
  )
}


