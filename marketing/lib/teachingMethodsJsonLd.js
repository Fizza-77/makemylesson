import { TEACHING_METHODS_BASE } from '@marketing/data/teachingMethods'
import { SITE_URL } from '@marketing/lib/siteUrl'

export function buildTeachingMethodsHubBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Teaching Methods',
        item: `${SITE_URL}${TEACHING_METHODS_BASE}`,
      },
    ],
  }
}

export function buildTeachingMethodsHubItemListSchema(columns) {
  const items = columns.flatMap((col) =>
    col.methods.map((method) => ({
      '@type': 'ListItem',
      name: method.label,
    })),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Teaching Methods',
    description:
      'Pedagogical approaches supported by Make My Lesson — from structured delivery to learner-centred and inquiry-based methods.',
    url: `${SITE_URL}${TEACHING_METHODS_BASE}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      ...item,
      position: index + 1,
    })),
  }
}
