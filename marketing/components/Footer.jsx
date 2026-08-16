'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from '@marketing/components/layout/Container'
import { getFeaturePath } from '@marketing/data/features'
import { APP_STORE_URL, GOOGLE_PLAY_URL, MML_APP } from '@marketing/lib/appUrls'

const PRODUCT_LINKS = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: getFeaturePath('lesson-plan-generator'), label: 'Teaching Pack' },
  { href: MML_APP.ayla, label: 'Ayla' },
  { href: '/pricing', label: 'Pricing' },
]

const TEACHING_LINKS = [
  { href: '/teaching-methods', label: 'Teaching Methods' },
  { href: '/#curriculum', label: 'Curriculums' },
  { href: '/blog', label: 'Resources' },
]

const COMPANY_LINKS = [
  { href: '/contact', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
]

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms-of-service', label: 'Terms' },
  { href: '/acceptable-use-policy', label: 'Acceptable Use' },
  { href: '/cookie-policy', label: 'Cookies' },
]

const LEGAL_DOCS_ROW = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Use' },
  { href: '/acceptable-use-policy', label: 'Acceptable Use Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
]

const SOCIAL_LINKS = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/showcase/makemylesson/',
    label: 'LinkedIn',
    Icon: LinkedinIcon,
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@MakeMyLesson',
    label: 'YouTube',
    Icon: YoutubeIcon,
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/makemylesson',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    key: 'facebook',
    href: 'https://www.facebook.com/MakeMyLesson',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
]

function SocialIcon({ children }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function FacebookIcon() {
  return (
    <SocialIcon>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </SocialIcon>
  )
}

function InstagramIcon() {
  return (
    <SocialIcon>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </SocialIcon>
  )
}

function YoutubeIcon() {
  return (
    <SocialIcon>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </SocialIcon>
  )
}

function LinkedinIcon() {
  return (
    <SocialIcon>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </SocialIcon>
  )
}

function AppleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12 3.84 21.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.89-6.81c.34.27.54.68.54 1.13s-.2.86-.54 1.13L17.69 15 6.05 2.66 15.5 2.5l2.2 5.81z" />
    </svg>
  )
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="block text-[14px] font-medium text-white/90 no-underline transition-colors hover:text-white"
    >
      {label}
    </Link>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
        {title}
      </p>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={`${title}-${item.label}`}>
            <FooterLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SiteFooter() {
  return (
    <>
      <div className="h-[1cm] bg-white" aria-hidden />
      <footer className="mt-auto w-full min-w-0 bg-[#1A1E3A] text-white">
        <Container className="py-8 sm:py-10 lg:py-12">
          {/* Brand + social | App download + QR */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="flex min-w-0 flex-col items-center self-start">
              <Link
                href="/"
                className="inline-block text-center text-[1.15rem] font-bold tracking-tight text-white no-underline"
              >
                Make My Lesson
              </Link>
              <div className="mt-3 flex w-fit flex-col items-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                  Follow us
                </p>
                <div className="mt-2.5 flex items-center gap-2.5">
                  {SOCIAL_LINKS.map(({ key, href, label, Icon }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-[#35BEBC] hover:bg-[#35BEBC] hover:text-[#1A1E3A]"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 lg:justify-end">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold tracking-tight text-white sm:text-[16px]">
                  Teach Anywhere. Download the app
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-white no-underline transition hover:border-white/50 hover:bg-white/10"
                  >
                    <AppleIcon />
                    App Store
                  </a>
                  <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-white no-underline transition hover:border-white/50 hover:bg-white/10"
                  >
                    <GooglePlayIcon />
                    Google Play
                  </a>
                </div>
              </div>
              <a
                href="https://makemylesson.app/smartlink"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[112px] w-[112px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5"
                aria-label="Scan QR code to download Make My Lesson"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fmakemylesson.app%2Fsmartlink"
                  alt="QR code linking to Make My Lesson app"
                  width={100}
                  height={100}
                  className="h-full w-full object-contain"
                />
              </a>
            </div>
          </div>

          {/* Tagline + link columns */}
          <div className="mt-8 grid gap-8 border-t border-white/10 pt-7 sm:grid-cols-2 lg:mt-9 lg:grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_0.7fr] lg:gap-8 lg:pt-8">
            <div className="max-w-sm sm:col-span-2 lg:col-span-1">
              <p className="text-[14px] leading-relaxed text-white sm:text-[15px]">
                AI-powered lesson planning and classroom-ready teaching packs for educators across
                multiple curriculum systems.
              </p>
            </div>

            <FooterColumn title="Product" links={PRODUCT_LINKS} />
            <FooterColumn title="Teaching" links={TEACHING_LINKS} />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </div>

          {/* Legal docs row */}
          <nav
            aria-label="Legal documents"
            className="mt-7 border-t border-white/10 pt-5 sm:mt-8 sm:pt-5"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-8">
              {LEGAL_DOCS_ROW.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] font-semibold text-white no-underline transition-colors hover:text-[#35BEBC] sm:text-[14px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Opposite taglines */}
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:mt-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pt-5">
            <p className="max-w-md text-[12px] leading-relaxed text-white/85 sm:text-[13px]">
              AI-powered lesson planning for teachers across Australia, United Kingdom, Canada,
              International Baccalaureate and United States.
            </p>
            <p className="max-w-md text-[12px] leading-relaxed text-white/85 sm:text-right sm:text-[13px]">
              Make My Lesson is a product of{' '}
              <a
                href="https://skyensolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline-offset-2 transition-colors hover:underline"
              >
                Skyen Solutions
              </a>
              , a trade name of Qismat Ventures W.L.L. (CR 190698-1) — Office 501, Building 1025, Road
              3621, Block 436, Al Seef, Bahrain.
            </p>
          </div>

          {/* Copyright */}
          <p className="mt-6 text-center text-[12px] leading-relaxed text-white/80 sm:mt-7 sm:text-[13px]">
            © 2026 Qismat Ventures W.L.L. All rights reserved.
          </p>
        </Container>
      </footer>
    </>
  )
}

function FooterInner() {
  const pathname = usePathname()

  if (pathname?.startsWith('/app')) {
    return null
  }

  return <SiteFooter />
}

export default function Footer() {
  return (
    <Suspense fallback={<SiteFooter />}>
      <FooterInner />
    </Suspense>
  )
}
