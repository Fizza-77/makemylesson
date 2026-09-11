'use client'

import '@marketing/styles/cookie-consent.css'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from '@/components/analytics/cookieConsentStorage'

const STORAGE_KEY = COOKIE_CONSENT_STORAGE_KEY
const CONSENT_VERSION = COOKIE_CONSENT_VERSION

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

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!readStoredConsent()) setVisible(true)
  }, [])

  const dismiss = useCallback((choice) => {
    saveConsent(choice)
    setVisible(false)
    setShowPrefs(false)
  }, [])

  const handleAcceptAll = () => dismiss('all')
  const handleEssentialOnly = () => dismiss('essential')
  const handleSavePrefs = () => dismiss(analyticsOn ? 'all' : 'essential')

  if (!mounted || !visible) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      aria-live="polite"
      className="cookie-consent-root"
    >
      <div className="cookie-consent-card">
        <div className="cookie-consent-inner">
          <div className="cookie-consent-copy">
            <p className="cookie-consent-eyebrow">Cookies</p>
            <h2 id="cookie-consent-title" className="cookie-consent-title">
              We use cookies
            </h2>
            <p id="cookie-consent-desc" className="cookie-consent-text">
              Essential cookies keep Make My Lesson working. Optional analytics help us improve the
              product — never for ads.
            </p>

            {showPrefs ? (
              <div className="cookie-consent-prefs">
                <label className="cookie-consent-toggle cookie-consent-toggle--locked">
                  <span className="cookie-consent-toggle-info">
                    <span className="cookie-consent-toggle-name">Essential</span>
                    <span className="cookie-consent-toggle-hint">
                      Login, security &amp; preferences
                    </span>
                  </span>
                  <span className="cookie-consent-switch cookie-consent-switch--on" aria-hidden>
                    <span className="cookie-consent-switch-knob" />
                  </span>
                  <span className="sr-only">Always on</span>
                </label>

                <div className="cookie-consent-toggle">
                  <span className="cookie-consent-toggle-info">
                    <span className="cookie-consent-toggle-name">Analytics</span>
                    <span className="cookie-consent-toggle-hint">
                      Anonymous usage to improve the app
                    </span>
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
                </div>
              </div>
            ) : null}

            <div className="cookie-consent-actions">
              {!showPrefs ? (
                <>
                  <button
                    type="button"
                    className="cookie-consent-btn cookie-consent-btn--primary"
                    onClick={handleAcceptAll}
                  >
                    Accept all
                  </button>
                  <button
                    type="button"
                    className="cookie-consent-btn cookie-consent-btn--ghost"
                    onClick={handleEssentialOnly}
                  >
                    Essential only
                  </button>
                  <button
                    type="button"
                    className="cookie-consent-btn cookie-consent-btn--link"
                    onClick={() => setShowPrefs(true)}
                  >
                    Customize
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="cookie-consent-btn cookie-consent-btn--primary"
                    onClick={handleSavePrefs}
                  >
                    Save preferences
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
            </div>

            <p className="cookie-consent-legal">
              <Link href="/cookie-policy">Cookie Policy</Link>
              <span aria-hidden> · </span>
              <Link href="/privacy-policy-web">Privacy Policy</Link>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="cookie-consent-close"
          onClick={handleEssentialOnly}
          aria-label="Dismiss and accept essential cookies only"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
