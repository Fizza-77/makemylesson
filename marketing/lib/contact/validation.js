import { CONTACT_SUBJECTS } from '@marketing/lib/contact/constants'
import { sanitizeText } from '@marketing/lib/contact/sanitize'

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const SUBJECT_VALUES = new Set(CONTACT_SUBJECTS.map((s) => s.value))

export function isValidEmail(email) {
  if (!email || email.length > 254) return false
  return EMAIL_RE.test(email)
}

/**
 * @param {Record<string, unknown>} raw
 * @returns {{ ok: true, data: object } | { ok: false, error: string, fields?: Record<string, string> }}
 */
export function validateContactPayload(raw) {
  const fields = {}

  const name = sanitizeText(raw?.name, 120)
  const email = sanitizeText(raw?.email, 254).toLowerCase()
  const company = sanitizeText(raw?.company, 200)
  const subjectKey = sanitizeText(raw?.subject, 40)
  const message = sanitizeText(raw?.message, 5000)

  if (name.length < 2) fields.name = 'Please enter your full name (at least 2 characters).'
  if (!isValidEmail(email)) fields.email = 'Please enter a valid email address.'
  if (!SUBJECT_VALUES.has(subjectKey)) fields.subject = 'Please select a subject.'
  if (message.length < 10) fields.message = 'Please enter a message (at least 10 characters).'

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fields,
    }
  }

  const subjectLabel = CONTACT_SUBJECTS.find((s) => s.value === subjectKey)?.label ?? subjectKey

  return {
    ok: true,
    data: {
      name,
      email,
      company: company || null,
      subjectKey,
      subjectLabel,
      message,
    },
  }
}
