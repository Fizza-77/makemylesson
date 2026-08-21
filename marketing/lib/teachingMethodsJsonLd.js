import { TEACHING_METHODS_BASE } from '@marketing/data/teachingMethods'
import {
  organizationRef,
  websiteRef,
} from '@marketing/lib/organizationSchema'
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
    '@id': `${SITE_URL}${TEACHING_METHODS_BASE}#itemlist`,
    name: 'Teaching Methods',
    description:
      'Pedagogical approaches supported by Make My Lesson — from structured delivery to learner-centred and inquiry-based methods.',
    url: `${SITE_URL}${TEACHING_METHODS_BASE}`,
    numberOfItems: items.length,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    itemListElement: items.map((item, index) => ({
      ...item,
      position: index + 1,
    })),
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
