/**
 * Merge blog body HTML from Supabase — main `content` plus optional table/block fields.
 */

const MAIN_HTML_KEYS = ['content', 'content_html', 'html_content', 'body_html', 'full_content']

function asNonEmptyString(value) {
  if (typeof value !== 'string') return ''
  const t = value.trim()
  return t || ''
}

function fragmentFromBlock(block) {
  if (block == null) return ''
  if (typeof block === 'string') return block.trim()
  if (typeof block !== 'object') return ''

  const type = String(block.type ?? block.kind ?? '').toLowerCase()
  if (type === 'table' || block.isTable) {
    return (
      asNonEmptyString(block.html) ||
      asNonEmptyString(block.content) ||
      asNonEmptyString(block.body) ||
      asNonEmptyString(block.data?.html) ||
      ''
    )
  }

  return (
    asNonEmptyString(block.html) ||
    asNonEmptyString(block.content) ||
    asNonEmptyString(block.body) ||
    ''
  )
}

function htmlFromBlocks(value) {
  if (value == null) return ''

  let blocks = value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('<')) return trimmed
    try {
      blocks = JSON.parse(trimmed)
    } catch {
      return ''
    }
  }

  if (!Array.isArray(blocks)) return ''

  return blocks.map(fragmentFromBlock).filter(Boolean).join('\n')
}

function htmlFromTables(value) {
  if (value == null) return ''

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('<')) return trimmed
    try {
      const parsed = JSON.parse(trimmed)
      return htmlFromTables(parsed)
    } catch {
      return ''
    }
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item.trim()
        if (item && typeof item === 'object') {
          return (
            asNonEmptyString(item.html) ||
            asNonEmptyString(item.content) ||
            asNonEmptyString(item.body) ||
            ''
          )
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }

  if (typeof value === 'object') {
    return (
      asNonEmptyString(value.html) ||
      asNonEmptyString(value.content) ||
      htmlFromBlocks(value.blocks ?? value.rows)
    )
  }

  return ''
}

function pickMainHtml(row) {
  if (!row || typeof row !== 'object') return ''
  for (const key of MAIN_HTML_KEYS) {
    const html = asNonEmptyString(row[key])
    if (html) return html
  }
  return ''
}

/**
 * Full article HTML for rendering — includes tables stored in separate columns or block JSON.
 */
export function resolveBlogContent(row) {
  if (!row || typeof row !== 'object') return null

  const fromBlocks = htmlFromBlocks(row.content_blocks ?? row.blocks)
  if (fromBlocks) return fromBlocks

  const main = pickMainHtml(row)
  const tables = htmlFromTables(row.tables)

  if (!main && !tables) return null
  if (!tables) return main
  if (!main) return tables
  if (/<table[\s>]/i.test(main)) return main

  return `${main}\n${tables}`
}

/** Columns to request when the blogs table supports them (unknown columns fall through to `*`). */
export const BLOG_CONTENT_EXTRA_FIELDS =
  'tables, content_blocks, blocks, content_html, html_content, body_html, full_content'
