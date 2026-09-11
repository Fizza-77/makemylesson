'use client'

/**
 * Re-opens the cookie consent dialog (prefs) so users can change analytics choice.
 * Dispatches `mml-open-cookie-settings` — handled by CookieConsent.
 */
export default function CookieSettingsButton({ className, children = 'Cookie settings' }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof window === 'undefined') return
        window.dispatchEvent(new CustomEvent('mml-open-cookie-settings'))
      }}
    >
      {children}
    </button>
  )
}
