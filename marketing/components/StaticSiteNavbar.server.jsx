import Link from 'next/link'

import { MML_APP } from '@marketing/lib/appUrls'
import {
  StaticSiteNavDesktop,
  StaticSiteNavMobile,
} from '@marketing/components/StaticSiteNavMenus.client'

const NAV_GUTTER = 'px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10'
const NAV_CONTAINER = `site-nav-container mx-auto flex w-full min-w-0 max-w-[1600px] items-center gap-2 lg:gap-3 ${NAV_GUTTER}`
const NAV_BAR =
  'site-nav-bar flex h-16 min-h-16 w-full items-center max-[1279px]:h-14 max-[1279px]:min-h-14 max-[1100px]:h-[3.25rem] max-[1100px]:min-h-[3.25rem]'

const STATIC_LINKS_BEFORE_MEGA = [{ href: '/', label: 'Home' }]

const STATIC_LINKS_AFTER_MEGA = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
]

/** Server-rendered nav shell with client mega-menus for Features + Teaching Methods. */
export default function StaticSiteNavbarServer({ theme = 'site' }) {
  const isHome = theme === 'home'

  return (
    <nav
      id="site-nav"
      aria-label="Main navigation"
      className={`site-nav fixed left-0 right-0 top-0 z-[1100] ${
        isHome ? 'site-nav--home site-nav--scrolled' : 'site-nav--light site-nav--scrolled'
      }`}
    >
      <div className={`${NAV_CONTAINER} ${NAV_BAR}`}>
        <Link
          href="/"
          className={`site-nav-brand flex shrink-0 items-center no-underline${
            isHome ? ' site-nav-brand--active' : ''
          }`}
        >
          <span className="site-nav-brand-text font-sans">Make My Lesson</span>
        </Link>

        <StaticSiteNavDesktop
          beforeMegaLinks={STATIC_LINKS_BEFORE_MEGA}
          afterMegaLinks={STATIC_LINKS_AFTER_MEGA}
        />

        <div className="site-nav-actions">
          <Link href={MML_APP.signIn} className="site-nav-signin max-[900px]:hidden">
            Sign in
          </Link>
          <Link href={MML_APP.stage1} className="site-nav-cta">
            <span className="site-nav-cta-full">Start Your First Lesson — Free</span>
            <span className="site-nav-cta-short">Start Free Lesson</span>
          </Link>

          <StaticSiteNavMobile
            beforeMegaLinks={STATIC_LINKS_BEFORE_MEGA}
            afterMegaLinks={STATIC_LINKS_AFTER_MEGA}
            navContainerClass={NAV_CONTAINER}
            signInHref={MML_APP.signIn}
            ctaHref={MML_APP.stage1}
          />
        </div>
      </div>
    </nav>
  )
}


