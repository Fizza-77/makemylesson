import { useEffect, useRef, useState } from 'react'

const DEFAULT_IN_VIEW_OPTIONS = {
  threshold: 0.05,
  rootMargin: '0px 0px -8px 0px',
}

function elementIsInView(el) {
  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight || document.documentElement.clientHeight
  return rect.top < viewH * 0.98 && rect.bottom > 0
}

export function useInView(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => setVisible(true)

    const attachObserver = () => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal()
            obs.unobserve(el)
          }
        },
        { ...DEFAULT_IN_VIEW_OPTIONS, ...optionsRef.current },
      )
      obs.observe(el)
      return () => obs.disconnect()
    }

    if (elementIsInView(el)) {
      reveal()
      return undefined
    }

    let cleanup = attachObserver()

    const retryId = requestAnimationFrame(() => {
      if (elementIsInView(el)) {
        cleanup?.()
        reveal()
      }
    })

    return () => {
      cancelAnimationFrame(retryId)
      cleanup?.()
    }
  }, [])

  return [ref, visible]
}

export function useCounter(end, options = {}) {
  const { suffix = '', decimals = 0, start = 0, range = false } = options
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const dur = 1600
          const t0 = Date.now()

          const tick = () => {
            const p = Math.min((Date.now() - t0) / dur, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            const v = start + eased * (end - start)
            if (range) {
              el.textContent = `${start}–${Math.round(v)}${suffix}`
            } else {
              el.textContent = (decimals ? v.toFixed(decimals) : Math.round(v)) + suffix
            }
            if (p < 1) requestAnimationFrame(tick)
          }

          tick()
          obs.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [end, suffix, decimals, start, range])

  return ref
}
