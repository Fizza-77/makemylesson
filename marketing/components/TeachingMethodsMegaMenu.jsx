'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import {
  TEACHING_METHOD_COLUMNS,
  TEACHING_METHODS_BASE,
  getTeachingMethodPath,
} from '@marketing/data/teachingMethods'

const NAV_LINK = 'site-nav-link shrink-0 no-underline'
const NAV_MENU_LINK = 'site-nav-link block no-underline'
const HOVER_CLOSE_DELAY_MS = 120

function getDropdownPanelLeft(trigger) {
  if (!trigger) return 0
  const rect = trigger.getBoundingClientRect()
  return rect.left + rect.width / 2
}

function isTeachingMethodsActive(pathname) {
  return pathname.startsWith(`${TEACHING_METHODS_BASE}/`)
}

export function TeachingMethodsDesktopMenu({ pathname, linkClassName = NAV_LINK }) {
  const [open, setOpen] = useState(false)
  const [portalTarget, setPortalTarget] = useState(null)
  const [panelLeft, setPanelLeft] = useState(0)
  const menuId = useId()
  const rootRef = useRef(null)
  const closeTimerRef = useRef(null)
  const active = isTeachingMethodsActive(pathname)

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
      const inPanel = e.target instanceof Element && e.target.closest('.site-nav-mega-panel')
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
      className={cn('site-nav-mega-panel', open && 'site-nav-mega-panel--open')}
      style={{ left: panelLeft }}
      role="region"
      aria-label="Teaching methods"
      aria-hidden={!open}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div className="site-nav-mega-inner">
        <div className="site-nav-mega-grid">
          {TEACHING_METHOD_COLUMNS.map((column) => (
            <div key={column.id} className="site-nav-mega-col">
              <p className="site-nav-mega-col-heading">{column.heading}</p>
              <ul className="site-nav-mega-list">
                {column.methods.map((method) => (
                  <li key={method.slug}>
                    <Link
                      href={getTeachingMethodPath(method.slug)}
                      className="site-nav-mega-link"
                      onClick={close}
                    >
                      {method.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        ref={rootRef}
        className="site-nav-dropdown site-nav-mega"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className={cn(
            linkClassName,
            'site-nav-dropdown-trigger site-nav-mega-trigger inline-flex items-center gap-1 border-none bg-transparent font-[inherit]',
            (active || open) && 'site-nav-link--active',
          )}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          Teaching Methods
          <ChevronDown
            size={14}
            strokeWidth={2.25}
            className={cn(
              'site-nav-dropdown-chevron site-nav-mega-chevron transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </button>
      </div>

      {portalTarget ? createPortal(panel, portalTarget) : null}
    </>
  )
}

export function TeachingMethodsMobileMenu({ pathname, linkClassName = NAV_MENU_LINK, onNavigate }) {
  const [expanded, setExpanded] = useState(false)
  const active = isTeachingMethodsActive(pathname)

  return (
    <div className="site-nav-mobile-dropdown site-nav-mobile-mega">
      <button
        type="button"
        className={cn(
          linkClassName,
          'site-nav-mobile-dropdown-trigger site-nav-mobile-mega-trigger flex w-full items-center border-none bg-transparent font-[inherit]',
          (active || expanded) && 'site-nav-link--active',
        )}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        Teaching Methods
        <ChevronDown
          size={16}
          strokeWidth={2.25}
          className={cn(
            'site-nav-mobile-dropdown-chevron site-nav-mobile-mega-chevron shrink-0 transition-transform',
            expanded && 'site-nav-mobile-mega-chevron--open',
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'site-nav-mobile-mega-panel overflow-hidden transition-[max-height] duration-300 ease-out',
          expanded ? 'max-h-[1200px]' : 'max-h-0',
        )}
        aria-hidden={!expanded}
      >
        {TEACHING_METHOD_COLUMNS.map((column) => (
          <div key={column.id} className="site-nav-mobile-mega-col">
            <p className="site-nav-mobile-mega-col-heading">{column.heading}</p>
            <ul className="site-nav-mobile-mega-list">
              {column.methods.map((method) => (
                <li key={method.slug}>
                  <Link
                    href={getTeachingMethodPath(method.slug)}
                    className="site-nav-mobile-mega-link"
                    onClick={onNavigate}
                  >
                    {method.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
