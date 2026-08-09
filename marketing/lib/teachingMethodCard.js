/** Split a section paragraph into a short card title + body for display. */

const MAX_TITLE_LENGTH = 130

export function parseParagraphForCard(text) {
  if (!text) return { title: null, body: '' }

  const sentenceMatch = text.match(/^(.+?[.!?])(?:\s+)([\s\S]+)$/)
  if (sentenceMatch && sentenceMatch[1].length <= MAX_TITLE_LENGTH) {
    return { title: sentenceMatch[1], body: sentenceMatch[2] }
  }

  const commaMatch = text.match(/^([^,]{24,90},)(?:\s+)([\s\S]+)$/)
  if (commaMatch) {
    return { title: commaMatch[1].trim(), body: commaMatch[2] }
  }

  return { title: null, body: text }
}

/** Avoid showing a card title plus the full paragraph when only one block of text exists. */
export function getCardDisplayParts(text) {
  const { title, body } = parseParagraphForCard(text)
  if (title && body?.trim()) {
    return { title, body }
  }
  return { title: null, body: text }
}
