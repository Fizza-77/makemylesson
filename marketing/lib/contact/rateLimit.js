/**
 * In-memory rate limit per IP (best-effort on serverless; still reduces abuse).
 */
const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5
const store = new Map()

function prune() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now - entry.start > WINDOW_MS) store.delete(key)
  }
}

/**
 * @param {string} key
 * @returns {{ ok: boolean, retryAfterSec?: number }}
 */
export function checkRateLimit(key) {
  prune()
  const now = Date.now()
  const id = key || 'unknown'
  let entry = store.get(id)

  if (!entry || now - entry.start > WINDOW_MS) {
    entry = { start: now, count: 0 }
    store.set(id, entry)
  }

  entry.count += 1

  if (entry.count > MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - entry.start)) / 1000)
    return { ok: false, retryAfterSec }
  }

  return { ok: true }
}
