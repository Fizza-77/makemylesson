import { TEACHING_METHODS_BASE, getTeachingMethodPath } from '@marketing/data/teachingMethods'
import {
  organizationRef,
  websiteRef,
} from '@marketing/lib/organizationSchema'
import { SITE_URL } from '@marketing/lib/siteUrl'

const HUB_URL = `${SITE_URL.replace(/\/$/, '')}${TEACHING_METHODS_BASE}`

export function buildTeachingMethodsHubBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL.replace(/\/$/, '')}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Teaching Methods',
        item: HUB_URL,
      },
    ],
  }
}

export function buildTeachingMethodsHubItemListSchema(columns) {
  const methods = columns.flatMap((col) => col.methods)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${HUB_URL}#itemlist`,
    name: 'Teaching Methods',
    description:
      'Pedagogical approaches supported by Make My Lesson — from structured delivery to learner-centred and inquiry-based methods.',
    url: HUB_URL,
    numberOfItems: methods.length,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    itemListElement: methods.map((method, index) => {
      const path = getTeachingMethodPath(method.slug)
      const itemUrl = `${SITE_URL.replace(/\/$/, '')}${path}`
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: method.label,
        url: itemUrl,
        item: itemUrl,
      }
    }),
  }
}

export function buildTeachingMethodsHubCollectionPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${HUB_URL}#webpage`,
    name: 'Teaching Methods for Lesson Planning',
    description:
      'Explore 16 teaching methods that reshape lesson plans, slides, activities and assessments. Compare approaches and choose the best fit for your class.',
    url: HUB_URL,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    mainEntity: { '@id': `${HUB_URL}#itemlist` },
  }
}

export function buildTeachingMethodBreadcrumbSchema(pageTitle, slug) {
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
      {
        '@type': 'ListItem',
        position: 3,
        name: pageTitle,
        item: `${SITE_URL}${TEACHING_METHODS_BASE}/${slug}`,
      },
    ],
  }
}

export function buildTeachingMethodWebPageSchema(method) {
  const url = `${SITE_URL}${TEACHING_METHODS_BASE}/${method.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: method.label,
    description: method.description,
    url,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    about: {
      '@type': 'Thing',
      name: method.label,
    },
  }
}

/**
 * @param {{ q?: string; question?: string; a?: string; answer?: string }[]} faq
 * @param {string} pageUrl
 */
export function buildTeachingMethodFaqJsonLd(faq, pageUrl) {
  if (!Array.isArray(faq) || faq.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    url: pageUrl,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q ?? item.question ?? '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: String(item.a ?? item.answer ?? '')
          .replace(/\s+/g, ' ')
          .replace(/\n/g, ' ')
          .trim(),
      },
    })),
  }
}
