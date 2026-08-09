import nodemailer from 'nodemailer'

import { SUPPORT_EMAIL } from '@marketing/lib/contact/constants'
import { escapeHtml } from '@marketing/lib/contact/sanitize'

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim()
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const from = process.env.SMTP_FROM?.trim() || `Make My Lesson <${SUPPORT_EMAIL}>`

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required).')
  }

  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465

  return { host, port, user, pass, from, secure }
}

function createTransporter() {
  const { host, port, user, pass, secure } = getSmtpConfig()
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

function buildHtmlEmail({ name, email, company, subjectLabel, message, submittedAt }) {
  const companyRow = company
    ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:140px;">Organization</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(company)}</td></tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Contact form</title></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <tr>
      <td style="padding:20px 24px;background:#1A1E3A;color:#f0f6ff;">
        <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7dd3e8;">Make My Lesson</p>
        <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;">New contact message</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:140px;">Name</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">Email</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#4ba8c4;">${escapeHtml(email)}</a></td>
          </tr>
          ${companyRow}
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">Subject</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(subjectLabel)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;vertical-align:top;">Submitted</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(submittedAt)}</td>
          </tr>
        </table>
        <p style="margin:20px 0 8px;font-size:13px;font-weight:600;color:#374151;">Message</p>
        <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;line-height:1.6;color:#111827;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildPlainText({ name, email, company, subjectLabel, message, submittedAt }) {
  return [
    'New contact message — Make My Lesson',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Organization: ${company}` : null,
    `Subject: ${subjectLabel}`,
    `Submitted: ${submittedAt}`,
    '',
    'Message:',
    message,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * @param {{ name: string, email: string, company: string | null, subjectLabel: string, message: string }} data
 */
export async function sendContactEmail(data) {
  const { from } = getSmtpConfig()
  const transporter = createTransporter()
  const submittedAt = new Date().toUTCString()

  const payload = { ...data, submittedAt }

  await transporter.sendMail({
    from,
    to: SUPPORT_EMAIL,
    replyTo: data.email,
    subject: `[Make My Lesson] ${data.subjectLabel} — ${data.name}`,
    text: buildPlainText(payload),
    html: buildHtmlEmail(payload),
  })
}
