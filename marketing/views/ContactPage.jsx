'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback } from 'react'
import {
  ArrowRight,
  AtSign,
  Building2,
  Camera,
  GraduationCap,
  LifeBuoy,
  Lightbulb,
  Mail,
  Megaphone,
  Play,
  QrCode,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react'
import ContactForm from '@marketing/components/contact/ContactForm'
import { SUPPORT_EMAIL } from '@marketing/lib/contact/constants'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'

const INTENTS = [
  {
    subject: 'billing',
    title: 'I need help',
    body: 'Support with my account or a generation',
    Icon: LifeBuoy,
    tone: 'navy',
  },
  {
    subject: 'school',
    title: 'School enquiry',
    body: 'Quotes, seats, and purchase orders',
    Icon: GraduationCap,
    tone: 'light',
  },
  {
    subject: 'feedback',
    title: 'Feedback & ideas',
    body: 'A bug, a wish, or a curriculum request',
    Icon: Lightbulb,
    tone: 'navy',
  },
  {
    subject: 'partnership',
    title: 'Press & partners',
    body: 'Media, partnerships, and integrations',
    Icon: Megaphone,
    tone: 'light',
  },
]

const FAST_LINKS = [
  { href: '/faq', label: 'Browse the FAQs — 50 answers' },
  { href: '/pricing', label: 'Pricing & school quotes' },
  { href: '/account-data-deletion', label: 'Account & data deletion' },
]

function ContactPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSubject = searchParams.get('subject') || ''

  const selectIntent = useCallback(
    (subject) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('subject', subject)
      router.replace(`/contact?${params.toString()}`, { scroll: false })
      requestAnimationFrame(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [router, searchParams],
  )

  return (
    <div className="contact-page min-h-[calc(100vh-4rem)] bg-white">
      <div className="contact-hero-shell pt-6 sm:pt-8">
        <section
          className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
          aria-labelledby="contact-hero-heading"
        >
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-72 w-72 rounded-full bg-[#35BEBC] sm:-right-6 sm:-top-12"
            aria-hidden
          />

          <div className="relative z-[1] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-14 xl:py-16">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1E9A98]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#35BEBC]">
                <Mail className="h-3.5 w-3.5 text-white" aria-hidden strokeWidth={2.25} />
              </span>
              Contact us
            </p>

            <h1
              id="contact-hero-heading"
              className="max-w-[16ch] text-[clamp(1.85rem,4vw,3.1rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] sm:max-w-[20ch] lg:max-w-[24ch] xl:max-w-none xl:whitespace-nowrap"
            >
              Marking to finish? We&apos;ll be quick.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#4B5068] sm:max-w-2xl sm:text-base xl:max-w-3xl xl:text-[17px] 2xl:max-w-4xl">
              Tell us who you are and we&apos;ll route your message to the right person — with an honest
              idea of when you&apos;ll hear back.
            </p>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-5 2xl:gap-6">
              {INTENTS.map((intent) => {
                const Icon = intent.Icon
                const active = selectedSubject === intent.subject
                const navy = intent.tone === 'navy'
                return (
                  <button
                    key={intent.subject}
                    type="button"
                    onClick={() => selectIntent(intent.subject)}
                    className={cn(
                      'min-w-0 rounded-[22px] p-4 text-left transition sm:rounded-[24px] sm:p-5 xl:rounded-[28px] xl:p-6 2xl:p-7',
                      navy
                        ? 'bg-[#1A1E3A] text-white hover:bg-[#242845]'
                        : 'bg-[#EAF5F6] text-[#1A1E3A] hover:bg-white',
                      active && 'ring-2 ring-[#1A1E3A] ring-offset-2 ring-offset-[#ade5df]',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-lg xl:h-9 xl:w-9',
                        navy ? 'bg-[#35BEBC] text-white' : 'bg-[#1A1E3A] text-white',
                      )}
                    >
                      <Icon className="h-4 w-4 xl:h-[18px] xl:w-[18px]" aria-hidden strokeWidth={2.25} />
                    </span>
                    <p className="mt-4 text-[15px] font-bold tracking-tight sm:text-[16px] xl:mt-5 xl:text-[17px] xl:whitespace-nowrap 2xl:text-[18px]">
                      {intent.title}
                    </p>
                    <p
                      className={cn(
                        'mt-1.5 text-[13px] leading-snug xl:text-[14px]',
                        navy ? 'text-white/65' : 'text-[#4B5068]',
                      )}
                    >
                      {intent.body}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* White gap below cyan hero */}
      <div className="h-10 bg-white sm:h-14" aria-hidden />

      <section className="bg-[#1A1E3A] py-12 sm:py-14 lg:py-16" aria-label="Contact form and channels">
        <div className="contact-support-shell grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-7 xl:gap-8">
          <ContactForm initialSubject={selectedSubject} />

          <aside className="flex flex-col gap-4 xl:gap-5">
            <div className="rounded-[28px] bg-[#242845] p-5 sm:rounded-[32px] sm:p-6 xl:p-7">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#35BEBC] text-white">
                  <Zap className="h-4 w-4" aria-hidden strokeWidth={2.25} />
                </span>
                <h3 className="text-[16px] font-bold text-white xl:text-[17px]">Faster than email</h3>
              </div>
              <ul className="space-y-2">
                {FAST_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-[13px] font-medium text-white no-underline transition hover:bg-white/10 sm:text-[14px]"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] bg-[#35BEBC] p-5 sm:rounded-[32px] sm:p-6 xl:p-7">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1E3A] text-white">
                  <AtSign className="h-4 w-4" aria-hidden strokeWidth={2.25} />
                </span>
                <h3 className="text-[16px] font-bold text-[#1A1E3A] xl:text-[17px]">Direct channels</h3>
              </div>
              <ul className="space-y-3 text-[13px] font-medium text-[#1A1E3A] sm:text-[14px]">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.25} />
                  <a href={`mailto:hello@makemylesson.ai`} className="no-underline hover:underline">
                    hello@makemylesson.ai
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden strokeWidth={2.25} />
                  <span>App Store &amp; Google Play — search &apos;Make My Lesson&apos;</span>
                </li>
              </ul>
              <div className="mt-5 flex gap-2">
                {[QrCode, Camera, Play, Users].map((Icon, i) => (
                  <span
                    key={i}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1E3A] text-white"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[28px] bg-[#EAF5F6] p-5 sm:mt-5 sm:rounded-[32px] sm:p-6 xl:p-7">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1E3A] text-white">
                  <Building2 className="h-4 w-4" aria-hidden strokeWidth={2.25} />
                </span>
                <h3 className="text-[16px] font-bold text-[#1A1E3A] xl:text-[17px]">The company</h3>
              </div>
              <p className="text-[15px] font-bold text-[#1A1E3A]">Skyen Solutions</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#4B5068] sm:text-[14px]">
                A trade name of Qismat Ventures W.L.L. (CR 190698-1), Bahrain.
                <br />
                Office support available Mon–Fri for school and partnership enquiries.
              </p>
              <p className="mt-4 text-[12px] font-medium text-[#1A1E3A]/55">
                Sister platforms: Studiely · Linguatude
              </p>
              <p className="mt-2 text-[12px] text-[#4B5068]">
                Support email:{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1E9A98] hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="bg-white py-10 sm:py-12 lg:py-14"
        aria-labelledby="contact-ayla-heading"
      >
        <div className="contact-support-shell">
          <div className="flex w-full flex-col items-start justify-between gap-6 rounded-[28px] bg-[#ade5df] px-6 py-7 shadow-[0_18px_50px_rgba(26,30,58,0.1)] sm:rounded-[36px] sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:gap-10 lg:px-12 lg:py-10 xl:gap-12 xl:px-14 xl:py-11 2xl:px-16 2xl:py-12">
            <div className="min-w-0 max-w-none flex-1">
              <h2
                id="contact-ayla-heading"
                className="max-w-[28ch] text-[clamp(1.2rem,2.4vw,1.55rem)] font-bold tracking-tight text-[#1A1E3A] xl:max-w-none xl:text-[clamp(1.35rem,2.2vw,1.85rem)] xl:whitespace-nowrap"
              >
                Question about a lesson you&apos;re building right now?
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#1A1E3A]/75 sm:text-[15px] xl:max-w-3xl xl:text-[16px]">
                Ayla is already inside the app — she knows your pack and answers instantly.
              </p>
            </div>
            <Link
              href={MML_APP.ayla}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#35BEBC] px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#1A1E3A] no-underline transition hover:bg-[#2eaaa8] sm:text-[14px] xl:px-8 xl:py-4 xl:text-[15px]"
            >
              Ask Ayla instead
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-white px-4 py-10 sm:px-6 md:px-8">
          <div className="mx-auto h-80 max-w-[1200px] animate-pulse rounded-[32px] bg-[#ade5df]/70" />
        </div>
      }
    >
      <ContactPageInner />
    </Suspense>
  )
}
