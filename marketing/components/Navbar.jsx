'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@marketing/lib/cn'
import { MML_APP } from '@marketing/lib/appUrls'
import SectionLink from '@marketing/components/SectionLink'
import { scrollToTop } from '@marketing/lib/homeScroll'
import { Menu, X } from 'lucide-react'
import { InstallAppButton } from '@/components/common/InstallAppButton'

const NAV_GUTTER = 'px-4 sm:px-6 md:px-8 xl:px-8 2xl:px-10'

const NAV_CONTAINER =
  `site-nav-container mx-auto flex w-full min-w-0 max-w-[1600px] items-center gap-3 ${NAV_GUTTER}`
const NAV_BAR = 'site-nav-bar flex h-16 min-h-16 w-full items-center'
const NAV_LINK = 'site-nav-link shrink-0 no-underline'
const NAV_DESKTOP =
  'site-nav-desktop hidden min-w-0 flex-1 items-center justify-center min-[901px]:flex'
const NAV_MENU_LINK = 'site-nav-link block no-underline'

function useNavLinks() {
  return useMemo(
    () => [
      { href: '/', label: 'Home', homeLink: true },
      { href: '/features', label: 'Features', matchPrefix: '/features' },
      { href: '/teaching-methods', label: 'Teaching Methods' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/faq', label: 'FAQs' },
      { href: '/blog', label: 'Blog' },
      { href: MML_APP.ayla, label: 'Ayla AI' },
      { href: '/contact', label: 'Contact Us' },
    ],
    [],
  )
}

function isNavLinkActive(pathname, item) {
  if (item.homeLink) return pathname === '/'
  if (item.matchPrefix) {
    return pathname === item.matchPrefix || pathname.startsWith(`${item.matchPrefix}/`)
  }
  if (item.href === '/') return false
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function NavLink({ item, pathname, className, onClick }) {
  const active = isNavLinkActive(pathname, item)
  const linkClass = cn(className, active && 'site-nav-link--active')

  const handleClick = (e) => {
    if (item.homeLink && pathname === '/') {
      e.preventDefault()
      scrollToTop()
    }
    onClick?.()
  }

  if (item.sectionId) {
    return (
      <SectionLink
        sectionId={item.sectionId}
        href={item.href}
        className={linkClass}
        onClick={onClick}
      >
        {item.label}
      </SectionLink>
    )
  }

  return (
    <Link href={item.href} className={linkClass} onClick={handleClick}>
      {item.label}
    </Link>
  )
}

export default function Navbar() {
  const navLinks = useNavLinks()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <nav
      id="site-nav"
      aria-label="Main navigation"
      className={cn('site-nav fixed left-0 right-0 top-0 z-[1100]', scrolled && 'site-nav--scrolled')}
    >
      <div className={cn(NAV_CONTAINER, NAV_BAR)}>
        <Link
          href="/"
          className="site-nav-brand flex shrink-0 items-center no-underline"
          aria-label="Make My Lesson home"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault()
              scrollToTop()
            }
          }}
        >
          <span className="site-nav-brand-text font-sans">Make My Lesson</span>
        </Link>

        <div className={NAV_DESKTOP}>
          <div className="site-nav-links" role="list">
            {navLinks.map((item) => (
              <NavLink key={item.label} item={item} pathname={pathname} className={NAV_LINK} />
            ))}
          </div>
        </div>

        <div className="site-nav-actions">
          <InstallAppButton
            variant="marketing"
            className="max-[900px]:hidden"
          />
          <Link href={MML_APP.signIn || '/login'} className="site-nav-signin max-[900px]:hidden">
            Sign In
          </Link>
          <Link href={MML_APP.signUp || MML_APP.stage1} className="site-nav-cta">
            Get Started
          </Link>
          <button
            type="button"
            className="site-nav-toggle flex h-10 w-10 shrink-0 items-center justify-center border-none bg-transparent min-[901px]:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'site-nav-drawer flex max-h-0 flex-col overflow-hidden transition-[max-height] duration-300 ease-out min-[901px]:hidden',
          mobileOpen && 'max-h-[min(85vh,720px)] overflow-y-auto',
        )}
      >
        <div className={cn(NAV_CONTAINER, 'flex flex-col gap-0.5 py-3')}>
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              pathname={pathname}
              className={NAV_MENU_LINK}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          <div className="site-nav-drawer-cta">
            <InstallAppButton variant="marketing" className="w-full [&_button]:w-full" />
            <Link
              href={MML_APP.signIn || '/login'}
              className="site-nav-signin"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="site-nav-cta"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
