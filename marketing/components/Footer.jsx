'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import Container from '@marketing/components/layout/Container'
import { getFeaturePath, isFeaturesPath } from '@marketing/data/features'
import { MML_APP } from '@marketing/lib/appUrls'

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

const FEATURES_LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms-of-service', label: 'Terms' },
  { href: '/acceptable-use-policy', label: 'Acceptable Use' },
  { href: '/cookie-policy', label: 'Cookies' },
  { href: '/refund-payments-policy', label: 'Refunds' },
  { href: '/contact', label: 'Contact' },
]

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="block text-[14px] font-medium text-white/70 no-underline transition-colors hover:text-white"
    >
      {label}
    </Link>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
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

function FeaturesFooter() {
  return (
    <>
      <div className="h-10 bg-white sm:h-14" aria-hidden />
      <footer className="mt-auto w-full min-w-0 border-t border-white/10 bg-[#1A1E3A] text-white">
        <Container className="py-8 sm:py-10">
          <nav aria-label="Legal and contact">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8">
              {FEATURES_LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] font-semibold text-white no-underline transition-colors hover:text-white/80"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-4 max-w-4xl text-[12px] leading-relaxed text-white/45 sm:text-[13px]">
            Make My Lesson is a product of{' '}
            <a
              href="https://skyensolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 transition-colors hover:text-white/80"
            >
              Skyen Solutions
            </a>
            , a trade name of Qismat Ventures W.L.L. (CR 190698-1), Bahrain. © 2026{' '}
            Qismat Ventures W.L.L.
          </p>
        </Container>
      </footer>
    </>
  )
}

function SiteFooter() {
  return (
    <>
      <div className="h-10 bg-white sm:h-14" aria-hidden />
      <footer className="mt-auto w-full min-w-0 bg-[#1A1E3A] text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_0.7fr] lg:gap-10">
            <div className="max-w-sm sm:col-span-2 lg:col-span-1">
              <Link
                href="/"
                className="inline-block text-[1.15rem] font-bold tracking-tight text-white no-underline"
              >
                Make My Lesson
              </Link>
              <p className="mt-4 text-[14px] leading-relaxed text-white/50 sm:text-[15px]">
                AI-powered lesson planning and classroom-ready teaching packs for educators across
                multiple curriculum systems.
              </p>
            </div>

            <FooterColumn title="Product" links={PRODUCT_LINKS} />
            <FooterColumn title="Teaching" links={TEACHING_LINKS} />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 sm:mt-14 sm:pt-7">
            <p className="text-[12px] leading-relaxed text-white/40 sm:text-[13px]">
              Make My Lesson is a product of{' '}
              <a
                href="https://skyensolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 transition-colors hover:text-white/80"
              >
                Skyen Solutions
              </a>
              , a trade name of Qismat Ventures W.L.L. (CR 190698-1), Bahrain.
            </p>
          </div>
        </Container>
      </footer>
    </>
  )
}

function FooterInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (pathname?.startsWith('/app')) {
    return null
  }

  if (isFeaturesPath(pathname)) {
    const stage = searchParams.get('stage')
    // Stage 4 uses the full multi-column footer (text brand, no icon).
    if (stage === 'test-generator') {
      return <SiteFooter />
    }
    return <FeaturesFooter />
  }

  if (
    pathname === '/faq' ||
    pathname?.startsWith('/faq/') ||
    pathname === '/contact' ||
    pathname?.startsWith('/contact/')
  ) {
    return <FeaturesFooter />
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
