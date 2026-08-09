/**
 * Parse `blogs.faq_schema` from Supabase into per-post FAQPage JSON-LD.
 */

function normalizeAnswerText(value) {
  if (value == null) return ''
  if (typeof value === 'string') {
    return value.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim()
  }
  if (typeof value === 'object' && value.text != null) {
    return normalizeAnswerText(value.text)
  }
  return String(value).replace(/\s+/g, ' ').trim()
}

function parseFaqSchemaRaw(raw) {
  if (raw == null) return null
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return null
    try {
      return JSON.parse(trimmed)
    } catch {
      return null
    }
  }
  return raw
}

function isFaqPageJsonLd(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    (value['@type'] === 'FAQPage' || value.type === 'FAQPage')
  )
}

function questionFromItem(item) {
  if (!item || typeof item !== 'object') return ''
  return (
    (typeof item.name === 'string' && item.name.trim()) ||
    (typeof item.question === 'string' && item.question.trim()) ||
    (typeof item.q === 'string' && item.q.trim()) ||
    ''
  )
}

function answerFromItem(item) {
  if (!item || typeof item !== 'object') return ''
  if (item.acceptedAnswer != null) return normalizeAnswerText(item.acceptedAnswer)
  return (
    normalizeAnswerText(item.answer) ||
    normalizeAnswerText(item.a) ||
    normalizeAnswerText(item.text) ||
    ''
  )
}

function extractFaqItems(parsed) {
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => ({
        question: questionFromItem(item),
        answer: answerFromItem(item),
      }))
      .filter((item) => item.question && item.answer)
  }

  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.mainEntity)) {
    return extractFaqItems(parsed.mainEntity)
  }

  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
    return extractFaqItems(parsed.items)
  }

  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.faqs)) {
    return extractFaqItems(parsed.faqs)
  }

  return []
}

function normalizeFaqPageJsonLd(schema, pageUrl) {
  const next = { ...schema }
  if (!next['@context']) next['@context'] = 'https://schema.org'
  if (!next.url) next.url = pageUrl

  if (Array.isArray(next.mainEntity)) {
    next.mainEntity = next.mainEntity
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        if (item['@type'] === 'Question' || item.type === 'Question') {
          const name = questionFromItem(item)
          const text = answerFromItem(item)
          if (!name || !text) return null
          return {
            '@type': 'Question',
            name,
            acceptedAnswer: {
              '@type': 'Answer',
              text,
            },
          }
        }
        const question = questionFromItem(item)
        const answer = answerFromItem(item)
        if (!question || !answer) return null
        return {
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        }
      })
      .filter(Boolean)
  }

  if (!next.mainEntity?.length) return null
  return next
}

/**
 * @param {unknown} raw — `blogs.faq_schema` column
 * @param {string} pageUrl — canonical blog post URL
 * @returns {Record<string, unknown> | null}
 */
export function buildBlogFaqJsonLd(raw, pageUrl) {
  const parsed = parseFaqSchemaRaw(raw)
  if (!parsed) return null

  if (isFaqPageJsonLd(parsed)) {
    return normalizeFaqPageJsonLd(parsed, pageUrl)
  }

  const items = extractFaqItems(parsed)
  if (!items.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: pageUrl,
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}
