const PENDING_KEY = 'mml-pending-scroll'

export function setPendingScroll(sectionId) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(PENDING_KEY, sectionId)
}

export function consumePendingScroll() {
  if (typeof sessionStorage === 'undefined') return null
  const id = sessionStorage.getItem(PENDING_KEY)
  if (id) sessionStorage.removeItem(PENDING_KEY)
  return id
}

/** Scroll to a landing section without adding #fragment to the URL. */
export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/** Remove hash from the address bar (keeps pathname + query). */
export function stripHashFromUrl() {
  if (typeof window === 'undefined' || !window.location.hash) return
  const clean = window.location.pathname + window.location.search
  window.history.replaceState(null, '', clean || '/')
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  stripHashFromUrl()
}
