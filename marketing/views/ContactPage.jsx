import Link from 'next/link'
import { Suspense } from 'react'
import {
  ArrowRight,
  AtSign,
  Building2,
  Camera,
  Mail,
  Play,
  QrCode,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react'

import ContactIntentPicker from '@marketing/components/contact/ContactIntentPicker'
import LazyContactForm from '@marketing/components/contact/LazyContactForm'
import { SUPPORT_EMAIL } from '@marketing/lib/contact/constants'
import { MML_APP } from '@marketing/lib/appUrls'

const FAST_LINKS = [
  { href: '/faq', label: 'Browse the FAQs — 50 answers' },
  { href: '/pricing', label: 'Pricing & school quotes' },
  { href: '/account-data-deletion', label: 'Account & data deletion' },
]

function IntentPickerFallback() {
  return (
    <div
      className="mt-2 grid gap-3 sm:mt-3 sm:grid-cols-2 lg:-mt-2 lg:grid-cols-4 lg:gap-4"
      aria-hidden
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="min-h-[7.5rem] rounded-[22px] bg-[#1A1E3A]/15 sm:rounded-[24px]"
        />
      ))}
    </div>
  )
}

export default function ContactPage({ initialSubject = '' }) {
  return (
    <div className="contact-page min-h-[calc(100vh-4rem)] bg-white">
      <link
        rel="preload"
        as="image"
        href="/svgs/contact-hero-640.webp"
        fetchPriority="high"
        imageSrcSet="/svgs/contact-hero-416.webp 416w, /svgs/contact-hero-640.webp 640w, /svgs/contact-hero.webp 960w"
        imageSizes="(max-width: 640px) 352px, (max-width: 1024px) 416px, 580px"
      />

      <div className="contact-hero-shell pt-2 sm:pt-3">
        <section
          className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
          aria-labelledby="contact-hero-heading"
        >
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/40"
            aria-hidden
          />

          <div className="relative z-[1] px-6 py-[1cm] sm:px-8 lg:px-12 xl:px-14">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.88fr)] lg:gap-8 xl:gap-10">
              <div className="min-w-0 text-left lg:-translate-y-6 xl:-translate-y-8">
                <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#35BEBC]">
                    <Mail className="h-3.5 w-3.5 text-white" aria-hidden strokeWidth={2.25} />
                  </span>
                  Contact us
                </p>

                <h1
                  id="contact-hero-heading"
                  className="font-[family-name:var(--font-manrope)] text-[clamp(1.85rem,4.2vw,3.15rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
                >
                  Marking to finish?
                  <br />
                  We&apos;ll be quick.
                </h1>
                <p className="mt-4 max-w-[34rem] text-[15px] leading-relaxed text-[#1A1E3A]/75 sm:text-base xl:text-[17px]">
                  Tell us who you are and we&apos;ll route your message to the right person with an
                  honest idea of when you&apos;ll hear back.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:-translate-y-10 lg:mx-0 lg:max-w-none lg:justify-self-end xl:-translate-y-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/svgs/contact-hero-640.webp"
                  srcSet="/svgs/contact-hero-416.webp 416w, /svgs/contact-hero-640.webp 640w, /svgs/contact-hero.webp 960w"
                  sizes="(max-width: 640px) 352px, (max-width: 1024px) 416px, 580px"
                  alt=""
                  width={960}
                  height={640}
                  className="h-auto w-full object-contain object-right"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  aria-hidden
                />
              </div>
            </div>

            <Suspense fallback={<IntentPickerFallback />}>
              <ContactIntentPicker initialSubject={initialSubject} />
            </Suspense>
          </div>
        </section>
      </div>

      <div className="h-10 bg-white sm:h-14" aria-hidden />

      <section className="bg-[#1A1E3A] py-12 sm:py-14 lg:py-16" aria-label="Contact form and channels">
        <div className="contact-support-shell grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-7 xl:gap-8">
          <LazyContactForm initialSubject={initialSubject} />

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
                      <ArrowRight className="h-4 w-4 shrink-0 text-white" aria-hidden />
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
                  <a href="mailto:hello@makemylesson.ai" className="no-underline hover:underline">
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
              <p className="mt-2 text-[13px] leading-relaxed text-black sm:text-[14px]">
                A trade name of Skyen Systems Pty Ltd. (ACN 701 564 730), Bahrain.
                <br />
                Office support available Mon–Fri for school and partnership enquiries.
              </p>
              <p className="mt-4 text-[12px] font-medium text-black">
                Sister platforms: Studiely · Linguatude
              </p>
              <p className="mt-2 text-[12px] text-black">
                Support email:{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1E9A98] hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12 lg:py-14" aria-labelledby="contact-ayla-heading">
        <div className="contact-support-shell">
          <div className="flex w-full flex-col items-start justify-between gap-6 rounded-[28px] bg-[#ade5df] px-6 py-7 shadow-[0_18px_50px_rgba(26,30,58,0.1)] sm:rounded-[36px] sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:gap-10 lg:px-12 lg:py-10 xl:gap-12 xl:px-14 xl:py-11 2xl:px-16 2xl:py-12">
            <div className="min-w-0 max-w-none flex-1">
              <h2
                id="contact-ayla-heading"
                className="max-w-[28ch] text-[clamp(1.2rem,2.4vw,1.55rem)] font-bold tracking-tight text-[#1A1E3A] xl:max-w-none xl:whitespace-nowrap xl:text-[clamp(1.35rem,2.2vw,1.85rem)]"
              >
                Question about a lesson you&apos;re building right now?
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-black sm:text-[15px] xl:max-w-3xl xl:text-[16px]">
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


