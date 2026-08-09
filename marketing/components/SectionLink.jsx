'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { setPendingScroll, scrollToSection, stripHashFromUrl } from '@marketing/lib/homeScroll'

/**
 * Link that scrolls to a landing section on "/" without exposing #fragment URLs.
 */
export default function SectionLink({
  sectionId,
  href = '/',
  className,
  children,
  onClick,
  ...props
}) {
  const pathname = usePathname()
  const router = useRouter()

  function handleClick(e) {
    onClick?.(e)
    if (e.defaultPrevented || !sectionId) return

    e.preventDefault()

    if (pathname === '/') {
      scrollToSection(sectionId)
      stripHashFromUrl()
      return
    }

    setPendingScroll(sectionId)
    router.push('/')
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
