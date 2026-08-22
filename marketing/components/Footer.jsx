'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  CircleHelp,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Mail,
  Pencil,
  Sparkles,
  Tag,
} from 'lucide-react'
import BrandMark from '@marketing/components/BrandMark'
import Container from '@marketing/components/layout/Container'
import { getFeaturePath } from '@marketing/data/features'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@marketing/lib/appUrls'

const TEAL = '#159F9B'

const SITEMAP_LINKS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/features/lesson-plan-generator', label: 'Features', Icon: Sparkles },
  { href: '/teaching-methods', label: 'Teaching Methods', Icon: GraduationCap },
  { href: '/#how-it-works', label: 'How It Works', Icon: FileText },
  { href: getFeaturePath('lesson-plan-generator'), label: 'Teaching Pack', Icon: Briefcase },
  { href: '/pricing', label: 'Pricing', Icon: Tag },
  { href: '/faq', label: 'FAQs', Icon: CircleHelp },
  { href: '/blog', label: 'Blog', Icon: Pencil },
  { href: '/contact', label: 'Contact Us', Icon: Mail },
]

const LEGAL_DOCS_ROW = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/acceptable-use-policy', label: 'Acceptable Use Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/refund-payments-policy', label: 'Refund & Payments Policy' },
  { href: '/account-data-deletion', label: 'Account & Data Deletion' },
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

const SISTER_LINKS = [
  { href: 'https://studiely.com', label: 'Studiely' },
  { href: 'https://linguatude.com', label: 'Linguatude' },
  { href: 'https://worksheeta.com', label: 'Worksheeta' },
]

function SocialIcon({ children }) {
  return (
    <svg
      width={16}
      height={16}
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

function AppleBadgeIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function GooglePlayBadgeIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="#EA4335" d="M3.6 2.2 13.7 12 3.6 21.8c-.4-.2-.6-.6-.6-1V3.2c0-.4.2-.8.6-1z" />
      <path fill="#FBBC04" d="m13.7 12 2.5 2.5-9.5 5.5L3.6 21.8 13.7 12z" />
      <path fill="#4285F4" d="M20.4 10.1c.5.3.8.8.8 1.4s-.3 1.1-.8 1.4l-3.4 2-2.8-2.7 2.8-2.8 3.4 1.7z" />
      <path fill="#34A853" d="M13.7 12 6.7 4.9l9.5 5.5L13.7 12z" />
    </svg>
  )
}

function ExternalTextLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[#159F9B] underline underline-offset-2 transition-opacity hover:opacity-90"
    >
      {children}
    </a>
  )
}

function SiteFooter() {
  return (
    <>
      <div className="h-[0.55cm] bg-white" aria-hidden />
      <footer className="mml-site-footer mt-auto w-full min-w-0 bg-[#273746] text-white">
        <Container className="py-5 sm:py-6 lg:py-7">
          {/* Top: Brand | Sitemap | Follow | Download */}
          <div className="mml-site-footer-grid grid gap-6 lg:grid-cols-[minmax(11.5rem,0.85fr)_minmax(0,2.55fr)_auto_minmax(0,1.2fr)] lg:items-start lg:gap-0">
            {/* Brand */}
            <div className="min-w-0 lg:pr-4 lg:border-r lg:border-white/15">
              <Link
                href="/"
                className="inline-flex max-w-full items-center gap-2 no-underline"
                aria-label="Make My Lesson home"
              >
                <BrandMark className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9" />
                <span className="whitespace-nowrap text-[1rem] font-bold tracking-tight text-white sm:text-[1.05rem]">
                  Make My Lesson
                </span>
              </Link>
              <p className="mt-2 text-[12px] leading-relaxed text-white/75 sm:text-[13px]">
                AI-powered lesson planning for teachers across Australia, United Kingdom, Canada,
                International Baccalaureate and United States.
              </p>
            </div>

            {/* Sitemap */}
            <div className="min-w-0 lg:border-r lg:border-white/15">
              <p
                className="mb-2 text-center text-[13px] font-semibold tracking-tight"
                style={{ color: TEAL }}
              >
                Sitemap
              </p>
              <nav aria-label="Sitemap">
                <ul className="mml-site-footer-sitemap flex w-full flex-nowrap items-stretch overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {SITEMAP_LINKS.map(({ href, label, Icon }, index) => {
                    const isLast = index === SITEMAP_LINKS.length - 1
                    return (
                      <li
                        key={label}
                        className={`min-w-0 flex-1 ${
                          !isLast ? 'border-r border-white/20' : ''
                        }`}
                      >
                        <Link
                          href={href}
                          className="group flex h-full flex-col items-center gap-1.5 px-1.5 py-0.5 text-center no-underline"
                        >
                          <span
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center transition-transform group-hover:scale-105"
                            style={{ color: TEAL }}
                          >
                            <Icon size={20} strokeWidth={1.75} aria-hidden />
                          </span>
                          <span className="max-w-[4.75rem] text-[10px] font-medium leading-tight text-white/90 transition-colors group-hover:text-white sm:text-[11px]">
                            {label}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            {/* Follow us */}
            <div className="min-w-0 lg:px-5 lg:border-r lg:border-white/15">
              <p
                className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: TEAL }}
              >
                Follow Us
              </p>
              <div className="mx-auto grid w-fit grid-cols-2 gap-2.5">
                {SOCIAL_LINKS.map(({ key, href, label, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-white transition hover:bg-[#159F9B] hover:text-[#273746]"
                    style={{ borderColor: TEAL }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Download the app */}
            <div className="min-w-0 lg:pl-10">
              <p
                className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] lg:text-left"
                style={{ color: TEAL }}
              >
                Download the App
              </p>
              <div className="flex flex-nowrap items-start gap-3">
                <div className="flex min-w-0 flex-col gap-2">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[42px] w-[138px] items-center gap-2 rounded-lg bg-black px-2.5 text-white no-underline ring-1 ring-white/25 transition hover:bg-black/90"
                  >
                    <AppleBadgeIcon />
                    <span className="flex min-w-0 flex-col leading-none">
                      <span className="text-[8px] font-medium tracking-wide text-white/85">
                        Download on the
                      </span>
                      <span className="mt-0.5 text-[13px] font-semibold tracking-tight">
                        App Store
                      </span>
                    </span>
                  </a>
                  <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[42px] w-[138px] items-center gap-2 rounded-lg bg-black px-2.5 text-white no-underline ring-1 ring-white/25 transition hover:bg-black/90"
                  >
                    <GooglePlayBadgeIcon />
                    <span className="flex min-w-0 flex-col leading-none">
                      <span className="text-[8px] font-medium tracking-wide text-white/85">
                        GET IT ON
                      </span>
                      <span className="mt-0.5 text-[13px] font-semibold tracking-tight">
                        Google Play
                      </span>
                    </span>
                  </a>
                </div>

                <div className="flex shrink-0 flex-col items-center gap-1">
                  <a
                    href="https://makemylesson.ai/smartlink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1.5"
                    aria-label="Scan QR code to download Make My Lesson"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/qr-smartlink.png"
                      alt="QR code linking to Make My Lesson app"
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <p className="max-w-[92px] text-center text-[9px] leading-snug text-white/80">
                    Scan to download Make My Lesson
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal docs */}
          <nav
            aria-label="Legal documents"
            className="mt-5 border-t border-white/15 pt-3.5 sm:mt-6 sm:pt-4"
          >
            <ul className="mml-site-footer-legal flex flex-wrap items-center justify-center gap-x-0 gap-y-2">
              {LEGAL_DOCS_ROW.map((item, index) => (
                <li key={item.href} className="inline-flex items-center">
                  {index > 0 ? (
                    <span className="mx-2.5 text-[11px] sm:mx-3" style={{ color: TEAL }} aria-hidden>
                      •
                    </span>
                  ) : null}
                  <Link
                    href={item.href}
                    className="text-[12px] font-medium text-white/85 no-underline transition-colors hover:text-[#159F9B] sm:text-[13px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company blurb */}
          <div className="mt-3.5 border-t border-white/15 pt-3.5 sm:mt-4 sm:pt-4">
            <p className="text-center text-[11px] leading-relaxed text-white/70 sm:text-[12px]">
              Make My Lesson is a product of Skyen Solutions, a trade name of Qismat Ventures W.L.L.
              (CR 190698-1) — located at Office 501, Building 1025, Road 3621, Block 436, Al Seef,
              Bahrain — and is a sister product of{' '}
              {SISTER_LINKS.map((item, index) => (
                <span key={item.href}>
                  {index > 0 ? (index === SISTER_LINKS.length - 1 ? ', and ' : ', ') : null}
                  <ExternalTextLink href={item.href}>{item.label}</ExternalTextLink>
                </span>
              ))}
              . For educational technology platforms, please contact{' '}
              <ExternalTextLink href="https://skyensolutions.com">Skyen Solutions</ExternalTextLink>
              .
            </p>
          </div>

          {/* Bottom bar */}
          <div className="mt-3.5 flex flex-col items-center gap-2 border-t border-white/15 pt-3.5 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-4">
            <p className="flex items-center gap-2 text-center text-[12px] leading-snug text-white/75 sm:text-left sm:text-[13px]">
              <Heart
                size={14}
                strokeWidth={2}
                className="shrink-0"
                style={{ color: TEAL }}
                fill="none"
                aria-hidden
              />
              <span>Built by educator. Designed for teachers. Made for every classroom.</span>
            </p>
            <p className="flex items-center gap-3 text-[12px] text-white/70 sm:text-[13px]">
              <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden />
              <span>© 2026 Qismat Ventures W.L.L. All rights reserved.</span>
            </p>
          </div>
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
