/**
 * Strip control chars and HTML; cap length for safe email/display.
 */
export function sanitizeText(value, maxLength = 5000) {
  if (value == null) return ''
  let s = String(value)
    .replace(/\0/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
  if (s.length > maxLength) s = s.slice(0, maxLength)
  return s
}

export function escapeHtml(text) {
  return sanitizeText(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
