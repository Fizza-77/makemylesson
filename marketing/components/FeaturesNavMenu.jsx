'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import { FEATURE_ITEMS, getFeaturePath, isFeaturesPath } from '@marketing/data/features'

const NAV_LINK = 'site-nav-link shrink-0 no-underline'
const NAV_MENU_LINK = 'site-nav-link block no-underline'
const HOVER_CLOSE_DELAY_MS = 120

function getDropdownPanelLeft(trigger) {
  if (!trigger) return 0
  const rect = trigger.getBoundingClientRect()
  return rect.left + rect.width / 2
}

export function FeaturesDesktopMenu({ pathname, linkClassName = NAV_LINK }) {
  const [open, setOpen] = useState(false)
  const [portalTarget, setPortalTarget] = useState(null)
  const [panelLeft, setPanelLeft] = useState(0)
  const menuId = useId()
  const rootRef = useRef(null)
  const closeTimerRef = useRef(null)
  const active = isFeaturesPath(pathname)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const close = useCallback(() => {
    clearCloseTimer()
    setOpen(false)
  }, [clearCloseTimer])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS)
  }, [clearCloseTimer])

  const openMenu = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  const updatePanelPosition = useCallback(() => {
    setPanelLeft(getDropdownPanelLeft(rootRef.current))
  }, [])

  useEffect(() => {
    setPortalTarget(document.getElementById('site-nav'))
    return () => clearCloseTimer()
  }, [clearCloseTimer])

  useLayoutEffect(() => {
    if (!open) return undefined

    updatePanelPosition()

    window.addEventListener('resize', updatePanelPosition)
    window.addEventListener('scroll', updatePanelPosition, true)
    return () => {
      window.removeEventListener('resize', updatePanelPosition)
      window.removeEventListener('scroll', updatePanelPosition, true)
    }
  }, [open, updatePanelPosition])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }

    const onPointerDown = (e) => {
      const inTrigger = rootRef.current?.contains(e.target)
      const inPanel = e.target instanceof Element && e.target.closest('.site-nav-dropdown-panel')
      if (!inTrigger && !inPanel) close()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, close])

  const panel = (
    <div
      id={menuId}
      className={cn('site-nav-dropdown-panel', open && 'site-nav-dropdown-panel--open')}
      style={{ left: panelLeft }}
      role="menu"
      aria-label="Features"
      aria-hidden={!open}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <ul className="site-nav-dropdown-list">
        {FEATURE_ITEMS.map((item) => (
          <li key={item.slug} role="none">
            <Link
              href={getFeaturePath(item.slug)}
              className="site-nav-dropdown-link"
              role="menuitem"
              onClick={close}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      <div
        ref={rootRef}
        className="site-nav-dropdown"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className={cn(
            linkClassName,
            'site-nav-dropdown-trigger inline-flex items-center gap-1 border-none bg-transparent font-[inherit]',
            (active || open) && 'site-nav-link--active',
          )}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          Features
          <ChevronDown
            size={14}
            strokeWidth={2.25}
            className={cn('site-nav-dropdown-chevron transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>
      </div>

      {portalTarget ? createPortal(panel, portalTarget) : null}
    </>
  )
}

export function FeaturesMobileMenu({ pathname, linkClassName = NAV_MENU_LINK, onNavigate }) {
  const [expanded, setExpanded] = useState(false)
  const active = isFeaturesPath(pathname)

  return (
    <div className="site-nav-mobile-dropdown">
      <button
        type="button"
        className={cn(
          linkClassName,
          'site-nav-mobile-dropdown-trigger flex w-full items-center border-none bg-transparent font-[inherit]',
          (active || expanded) && 'site-nav-link--active',
        )}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        Features
        <ChevronDown
          size={16}
          strokeWidth={2.25}
          className={cn(
            'site-nav-mobile-dropdown-chevron shrink-0 transition-transform',
            expanded && 'site-nav-mobile-dropdown-chevron--open',
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'site-nav-mobile-dropdown-panel overflow-hidden transition-[max-height] duration-300 ease-out',
          expanded ? 'max-h-80' : 'max-h-0',
        )}
        aria-hidden={!expanded}
      >
        <ul className="site-nav-mobile-dropdown-list">
          {FEATURE_ITEMS.map((item) => (
            <li key={item.slug}>
              <Link
                href={getFeaturePath(item.slug)}
                className="site-nav-mobile-dropdown-link"
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


