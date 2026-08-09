/**
 * Build FAQPage JSON-LD for Google rich results.
 * @param {{ id: number; q: string; a: string }[]} items
 * @param {number[]} schemaIds
 * @param {string} pageUrl
 */
export function buildFaqJsonLd(items, schemaIds, pageUrl) {
  const byId = new Map(items.map((i) => [i.id, i]))
  const mainEntity = schemaIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim(),
      },
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: pageUrl,
    mainEntity,
  }
}
