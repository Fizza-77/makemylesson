'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'

import { DesktopNavMegaMenus, MobileNavMegaMenus } from '@marketing/components/NavMegaMenus'

const NAV_LINK = 'site-nav-link shrink-0 no-underline'
const NAV_MENU_LINK = 'site-nav-link block no-underline'
const NAV_DESKTOP =
  'site-nav-desktop hidden min-w-0 flex-1 items-center justify-center min-[901px]:flex'

export function StaticSiteNavDesktop({ beforeMegaLinks, afterMegaLinks }) {
  const pathname = usePathname()
  const [megaMenusReady, setMegaMenusReady] = useState(false)
  const enableMegaMenus = useCallback(() => setMegaMenusReady(true), [])

  return (
    <div
      className={NAV_DESKTOP}
      onMouseEnter={enableMegaMenus}
      onFocusCapture={enableMegaMenus}
    >
      <ul className="site-nav-links">
        {beforeMegaLinks.map((item) => (
          <li key={item.label} className="site-nav-links__item">
            <Link href={item.href} className={NAV_LINK}>
              {item.label}
            </Link>
          </li>
        ))}
        <li className="site-nav-links__item">
          <DesktopNavMegaMenus
            pathname={pathname}
            linkClassName={NAV_LINK}
            enabled={megaMenusReady}
          />
        </li>
        {afterMegaLinks.map((item) => (
          <li key={item.label} className="site-nav-links__item">
            <Link href={item.href} className={NAV_LINK}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StaticSiteNavMobile({
  beforeMegaLinks,
  afterMegaLinks,
  navContainerClass,
  signInHref,
  ctaHref,
}) {
  const pathname = usePathname()
  const [megaMenusReady, setMegaMenusReady] = useState(false)

  return (
    <details
      className="site-nav-lean-menu min-[901px]:hidden"
      onToggle={(event) => {
        if (event.currentTarget.open) setMegaMenusReady(true)
      }}
    >
      <summary className="site-nav-toggle flex h-10 w-10 shrink-0 cursor-pointer list-none items-center justify-center border-none bg-transparent [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Open menu</span>
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </summary>
      <div className="site-nav-lean-drawer">
        <div className={`${navContainerClass} flex flex-col gap-0.5 py-3`}>
          {beforeMegaLinks.map((item) => (
            <Link key={item.label} href={item.href} className={NAV_MENU_LINK}>
              {item.label}
            </Link>
          ))}
          <MobileNavMegaMenus
            pathname={pathname}
            linkClassName={NAV_MENU_LINK}
            enabled={megaMenusReady}
          />
          {afterMegaLinks.map((item) => (
            <Link key={item.label} href={item.href} className={NAV_MENU_LINK}>
              {item.label}
            </Link>
          ))}
          <div className="site-nav-drawer-cta">
            <Link href={signInHref} className="site-nav-signin">
              Sign in
            </Link>
            <Link href={ctaHref} className="site-nav-cta">
              Start Your First Lesson — Free
            </Link>
          </div>
        </div>
      </div>
    </details>
  )
}
