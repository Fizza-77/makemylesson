'use client'

import { useEffect } from 'react'
import { consumePendingScroll, scrollToSection, stripHashFromUrl } from '@marketing/lib/homeScroll'

/** Runs on the homepage: strips legacy #hash URLs and applies cross-page scroll intents. */
export default function LandingScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (hash) {
      stripHashFromUrl()
      requestAnimationFrame(() => scrollToSection(hash))
      return
    }

    const pending = consumePendingScroll()
    if (pending) {
      requestAnimationFrame(() => scrollToSection(pending))
    }
  }, [])

  return null
}


