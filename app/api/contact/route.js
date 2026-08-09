import { NextResponse } from 'next/server'

import { getClientIp } from '@marketing/lib/contact/ip'
import { checkRateLimit } from '@marketing/lib/contact/rateLimit'
import { sanitizeText } from '@marketing/lib/contact/sanitize'
import { validateContactPayload } from '@marketing/lib/contact/validation'
import { sendContactEmail } from '@marketing/lib/mail/contactEmail'

export const runtime = 'nodejs'

/** Honeypot field name — must stay empty */
const HONEYPOT_FIELD = 'website'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (sanitizeText(body?.[HONEYPOT_FIELD], 200)) {
    return NextResponse.json({ ok: true })
  }

  const ip = getClientIp(request)
  const limit = checkRateLimit(ip)
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Too many messages sent. Please try again in ${limit.retryAfterSec} seconds or email us directly.`,
      },
      { status: 429 },
    )
  }

  const validated = validateContactPayload(body)
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error, fields: validated.fields },
      { status: 400 },
    )
  }

  try {
    await sendContactEmail(validated.data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/contact]', err instanceof Error ? err.message : err)
    return NextResponse.json(
      {
        error:
          'We could not send your message right now. Please try again shortly or email support@makemylesson.ai directly.',
      },
      { status: 500 },
    )
  }
}
