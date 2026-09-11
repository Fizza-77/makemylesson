'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import { CONTACT_SUBJECTS } from '@marketing/lib/contact/constants'
import ContactToast from '@marketing/components/contact/ContactToast'

const ROLES = ['Teacher', 'School leader', 'Department head', 'Press / partner', 'Other']

const INITIAL = {
  name: '',
  email: '',
  role: 'Teacher',
  subject: '',
  message: '',
  website: '',
}

const inputClass =
  'w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-[15px] text-[#1A1E3A] outline-none ring-0 placeholder:text-black/45 focus:ring-2 focus:ring-[#35BEBC]/35 disabled:cursor-not-allowed disabled:opacity-60'

const labelClass =
  'mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-black'

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-[13px] text-red-500" role="alert">
      {message}
    </p>
  )
}

export default function ContactForm({ initialSubject = '' }) {
  const [form, setForm] = useState({ ...INITIAL, subject: initialSubject || '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [toast, setToast] = useState(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    if (!initialSubject) return
    setForm((prev) => ({ ...prev, subject: initialSubject }))
  }, [initialSubject])

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const validateClient = useCallback(() => {
    const errors = {}
    if (form.name.trim().length < 2) errors.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email.'
    }
    if (!form.subject) errors.subject = 'Please select a topic.'
    if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [form])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submittingRef.current || status === 'success') return
    if (!validateClient()) {
      setToast({ message: 'Please fix the highlighted fields.', variant: 'error' })
      return
    }

    submittingRef.current = true
    setStatus('loading')
    setToast(null)

    const messageWithRole = `Role: ${form.role}\n\n${form.message.trim()}`

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject,
          message: messageWithRole,
          website: form.website,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields)
        setStatus('idle')
        setToast({
          message: data.error || 'Something went wrong. Please try again.',
          variant: 'error',
        })
        return
      }

      setStatus('success')
      setForm({ ...INITIAL, subject: initialSubject || '' })
      setFieldErrors({})
      setToast({
        message: 'Message sent — we’ll get back to you soon.',
        variant: 'success',
      })
    } catch {
      setStatus('idle')
      setToast({
        message: 'Network error. Check your connection and try again.',
        variant: 'error',
      })
    } finally {
      submittingRef.current = false
    }
  }

  if (status === 'success') {
    return (
      <>
        <ContactToast
          message={toast?.message}
          variant={toast?.variant}
          onDismiss={() => setToast(null)}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] bg-[#EAF5F6] p-10 text-center sm:rounded-[32px] sm:p-12"
        >
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#35BEBC]" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold text-[#1A1E3A]">Thank you</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-black">
            Your message is on its way. We typically reply within one school day.
          </p>
          <button
            type="button"
            className="mt-8 inline-flex rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white"
            onClick={() => setStatus('idle')}
          >
            Send another message
          </button>
        </motion.div>
      </>
    )
  }

  const isLoading = status === 'loading'

  return (
    <>
      <ContactToast
        message={toast?.message}
        variant={toast?.variant}
        onDismiss={() => setToast(null)}
      />
      <form
        id="contact-form"
        onSubmit={handleSubmit}
        noValidate
        className="relative scroll-mt-28 rounded-[28px] bg-[#EAF5F6] p-5 sm:rounded-[32px] sm:p-7 lg:p-8 xl:p-9 2xl:p-10"
        aria-busy={isLoading}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-tight text-[#1A1E3A]">
            Get support
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1E9A98]">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" aria-hidden />
            Replies within 1 school day
          </span>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={isLoading}
              placeholder="Ms. Rivera"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              className={cn(inputClass, fieldErrors.name && 'ring-2 ring-red-400/50')}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            />
            <FieldError id="contact-name-error" message={fieldErrors.name} />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              placeholder="you@school.edu"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              className={cn(inputClass, fieldErrors.email && 'ring-2 ring-red-400/50')}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
            />
            <FieldError id="contact-email-error" message={fieldErrors.email} />
          </div>

          <div>
            <label htmlFor="contact-role" className={labelClass}>
              I am a…
            </label>
            <select
              id="contact-role"
              name="role"
              disabled={isLoading}
              value={form.role}
              onChange={(e) => setField('role', e.target.value)}
              className={inputClass}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              Topic
            </label>
            <select
              id="contact-subject"
              name="subject"
              required
              disabled={isLoading}
              value={form.subject}
              onChange={(e) => setField('subject', e.target.value)}
              className={cn(
                inputClass,
                !form.subject && 'text-black/55',
                fieldErrors.subject && 'ring-2 ring-red-400/50',
              )}
              aria-invalid={!!fieldErrors.subject}
              aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
            >
              <option value="" disabled>
                Select a topic
              </option>
              {CONTACT_SUBJECTS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FieldError id="contact-subject-error" message={fieldErrors.subject} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="contact-message" className={labelClass}>
              Your message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              required
              disabled={isLoading}
              placeholder="What happened, what you expected, and anything that helps us reproduce it…"
              value={form.message}
              onChange={(e) => setField('message', e.target.value)}
              className={cn(
                inputClass,
                'min-h-[140px] resize-y',
                fieldErrors.message && 'ring-2 ring-red-400/50',
              )}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
            />
            <FieldError id="contact-message-error" message={fieldErrors.message} />
          </div>
        </div>

        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setField('website', e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#35BEBC] px-6 py-3.5 text-[14px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#2eaaa8] disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>
      </form>
    </>
  )
}


