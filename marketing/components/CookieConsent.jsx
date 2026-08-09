'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'mml-cookie-consent'
const CONSENT_VERSION = '1'

function readStoredConsent() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

function saveConsent(choice) {
  const payload = {
    version: CONSENT_VERSION,
    choice,
    analytics: choice === 'all',
    essential: true,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  window.dispatchEvent(new CustomEvent('mml-cookie-consent', { detail: payload }))
  return payload
}

function CookieMascot({ className = '', wiggle = false }) {
  const uid = useId().replace(/:/g, '')
  const faceId = `cookie-face-${uid}`
  const shadowId = `cookie-shadow-${uid}`

  return (
    <motion.div
      className={`cookie-mascot ${className}`}
      aria-hidden
      animate={wiggle ? { rotate: [0, -6, 6, -4, 4, 0] } : { rotate: 0 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={faceId} x1="12" y1="8" x2="76" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5D9A8" />
            <stop offset="1" stopColor="#E8B86A" />
          </linearGradient>
          <filter id={shadowId} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#5C3D1E" floodOpacity="0.25" />
          </filter>
        </defs>
        <g filter={`url(#${shadowId})`}>
          <circle cx="44" cy="44" r="36" fill={`url(#${faceId})`} stroke="#C4924A" strokeWidth="2" />
          <circle cx="28" cy="30" r="5" fill="#6B4423" opacity="0.85" />
          <circle cx="58" cy="26" r="4.5" fill="#6B4423" opacity="0.85" />
          <circle cx="52" cy="52" r="5.5" fill="#6B4423" opacity="0.85" />
          <circle cx="30" cy="54" r="4" fill="#6B4423" opacity="0.75" />
          <circle cx="62" cy="42" r="3.5" fill="#6B4423" opacity="0.7" />
          <ellipse cx="34" cy="40" rx="4" ry="5" fill="#3D2914" />
          <ellipse cx="54" cy="40" rx="4" ry="5" fill="#3D2914" />
          <path
            d="M36 52 Q44 60 52 52"
            stroke="#3D2914"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="30" cy="46" rx="5" ry="3" fill="#F4A5A5" opacity="0.45" />
          <ellipse cx="58" cy="46" rx="5" ry="3" fill="#F4A5A5" opacity="0.45" />
        </g>
      </svg>
      <span className="cookie-mascot-crumb cookie-mascot-crumb--1" />
      <span className="cookie-mascot-crumb cookie-mascot-crumb--2" />
      <span className="cookie-mascot-crumb cookie-mascot-crumb--3" />
    </motion.div>
  )
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(false)
  const [wiggle, setWiggle] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!readStoredConsent()) setVisible(true)
  }, [])

  const dismiss = useCallback((choice) => {
    saveConsent(choice)
    setVisible(false)
    setShowPrefs(false)
  }, [])

  const handleAcceptAll = () => {
    setWiggle(true)
    setTimeout(() => dismiss('all'), 280)
  }

  const handleEssentialOnly = () => dismiss('essential')

  const handleSavePrefs = () => {
    dismiss(analyticsOn ? 'all' : 'essential')
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          aria-live="polite"
          className="cookie-consent-root"
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <motion.div
            className="cookie-consent-card"
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          >
            <motion.div
              className="cookie-consent-steam"
              aria-hidden
              animate={{ opacity: [0.35, 0.7, 0.35], y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span />
              <span />
              <span />
            </motion.div>

            <div className="cookie-consent-inner">
              <motion.div
                className="cookie-consent-mascot-wrap"
                initial={{ scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.08, stiffness: 420, damping: 18 }}
              >
                <CookieMascot wiggle={wiggle} />
                <span className="cookie-consent-badge">Fresh Batch</span>
              </motion.div>

              <motion.div
                className="cookie-consent-copy"
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
              >
                <p className="cookie-consent-eyebrow">Cookie Jar</p>
                <h2 id="cookie-consent-title" className="cookie-consent-title">
                  We Baked a Few Tiny Cookies
                </h2>
                <p id="cookie-consent-desc" className="cookie-consent-text">
                  Essential crumbs keep Make My Lesson working. Optional sprinkles help us understand what teachers love —
                  never for ads.
                </p>

                <AnimatePresence mode="wait">
                  {showPrefs ? (
                    <motion.div
                      key="prefs"
                      className="cookie-consent-prefs"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="cookie-consent-toggle cookie-consent-toggle--locked">
                        <span className="cookie-consent-toggle-info">
                          <span className="cookie-consent-toggle-name">Essential</span>
                          <span className="cookie-consent-toggle-hint">Login, security &amp; preferences</span>
                        </span>
                        <span className="cookie-consent-switch cookie-consent-switch--on" aria-hidden>
                          <span className="cookie-consent-switch-knob" />
                        </span>
                        <span className="sr-only">Always on</span>
                      </label>

                      <motion.div className="cookie-consent-toggle" layout>
                        <span className="cookie-consent-toggle-info">
                          <span className="cookie-consent-toggle-name">Analytics Sprinkles</span>
                          <span className="cookie-consent-toggle-hint">Anonymous usage to improve the app</span>
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={analyticsOn}
                          aria-label="Enable analytics cookies"
                          className={`cookie-consent-switch ${analyticsOn ? 'cookie-consent-switch--on' : ''}`}
                          onClick={() => setAnalyticsOn((v) => !v)}
                        >
                          <span className="cookie-consent-switch-knob" />
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.div className="cookie-consent-actions" layout>
                  {!showPrefs ? (
                    <>
                      <button type="button" className="cookie-consent-btn cookie-consent-btn--primary" onClick={handleAcceptAll}>
                        <span className="cookie-consent-btn-emoji" aria-hidden>
                          🍪
                        </span>
                        Yes, Sprinkle Me In
                      </button>
                      <button
                        type="button"
                        className="cookie-consent-btn cookie-consent-btn--ghost"
                        onClick={handleEssentialOnly}
                      >
                        Just the Crumbs
                      </button>
                      <button
                        type="button"
                        className="cookie-consent-btn cookie-consent-btn--link"
                        onClick={() => setShowPrefs(true)}
                      >
                        Customize Jar
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="cookie-consent-btn cookie-consent-btn--primary" onClick={handleSavePrefs}>
                        Save My Jar
                      </button>
                      <button
                        type="button"
                        className="cookie-consent-btn cookie-consent-btn--ghost"
                        onClick={() => setShowPrefs(false)}
                      >
                        Back
                      </button>
                    </>
                  )}
                </motion.div>

                <p className="cookie-consent-legal">
                  <Link href="/cookie-policy">Cookie Policy</Link>
                  <span aria-hidden> · </span>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </p>
              </motion.div>
            </div>

            <button
              type="button"
              className="cookie-consent-close"
              onClick={handleEssentialOnly}
              aria-label="Dismiss and accept essential cookies only"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
