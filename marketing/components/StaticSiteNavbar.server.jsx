import Link from 'next/link'

import { MML_APP } from '@marketing/lib/appUrls'
import { TEACHING_METHODS_BASE } from '@marketing/data/teachingMethods'
import { getFeaturePath } from '@marketing/data/features'

const NAV_GUTTER = 'px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10'
const NAV_CONTAINER = `site-nav-container mx-auto flex w-full min-w-0 max-w-[1600px] items-center gap-2 lg:gap-3 ${NAV_GUTTER}`
const NAV_BAR =
  'site-nav-bar flex h-16 min-h-16 w-full items-center max-[1279px]:h-14 max-[1279px]:min-h-14 max-[1100px]:h-[3.25rem] max-[1100px]:min-h-[3.25rem]'
const NAV_LINK = 'site-nav-link shrink-0 no-underline'
const NAV_MENU_LINK = 'site-nav-link block no-underline'
const NAV_DESKTOP =
  'site-nav-desktop hidden min-w-0 flex-1 items-center justify-center min-[901px]:flex'

const STATIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: getFeaturePath('lesson-plan-generator'), label: 'Features' },
  { href: TEACHING_METHODS_BASE, label: 'Teaching Methods' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
]

/** Server-rendered nav — zero client JS for teaching-method / feature detail pages. */
export default function StaticSiteNavbarServer() {
  return (
    <nav
      id="site-nav"
      aria-label="Main navigation"
      className="site-nav site-nav--light site-nav--scrolled fixed left-0 right-0 top-0 z-[1100]"
    >
      <div className={`${NAV_CONTAINER} ${NAV_BAR}`}>
        <Link href="/" className="site-nav-brand site-nav-brand--active flex shrink-0 items-center no-underline">
          <span className="site-nav-brand-text font-sans">Make My Lesson</span>
        </Link>

        <div className={NAV_DESKTOP}>
          <ul className="site-nav-links">
            {STATIC_LINKS.map((item) => (
              <li key={item.label} className="site-nav-links__item">
                <Link href={item.href} className={NAV_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-nav-actions">
          <Link href={MML_APP.signIn} className="site-nav-signin max-[900px]:hidden">
            Sign in
          </Link>
          <Link href={MML_APP.stage1} className="site-nav-cta">
            <span className="site-nav-cta-full">Start Your First Lesson — Free</span>
            <span className="site-nav-cta-short">Start Free Lesson</span>
          </Link>

          <details className="site-nav-lean-menu min-[901px]:hidden">
            <summary className="site-nav-toggle flex h-10 w-10 shrink-0 cursor-pointer list-none items-center justify-center border-none bg-transparent [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open menu</span>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="site-nav-lean-drawer">
              <div className={`${NAV_CONTAINER} flex flex-col gap-0.5 py-3`}>
                {STATIC_LINKS.map((item) => (
                  <Link key={item.label} href={item.href} className={NAV_MENU_LINK}>
                    {item.label}
                  </Link>
                ))}
                <div className="site-nav-drawer-cta">
                  <Link href={MML_APP.signIn} className="site-nav-signin">
                    Sign in
                  </Link>
                  <Link href={MML_APP.stage1} className="site-nav-cta">
                    Start Your First Lesson — Free
                  </Link>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </nav>
  )
}
