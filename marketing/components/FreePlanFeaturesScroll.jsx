'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import './FreePlanFeaturesScroll.css'

export default function FreePlanFeaturesScroll({ features }) {
  const scrollRef = useRef(null)
  const [showScrollHint, setShowScrollHint] = useState(false)

  const updateScrollHint = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const hasOverflow = el.scrollHeight > el.clientHeight + 2
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 6
    setShowScrollHint(hasOverflow && !atBottom)
  }, [])

  useEffect(() => {
    updateScrollHint()

    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', updateScrollHint, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollHint)
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollHint)
      resizeObserver.disconnect()
    }
  }, [features, updateScrollHint])

  return (
    <div className="mml-pr-free-scroll-wrap">
      <div ref={scrollRef} className="mml-pr-free-scroll">
        <ul className="mml-pr-features mml-pr-features--compact">
          {features.map((feature) => (
            <li key={feature}>
              <span className="mml-pr-feature-icon" aria-hidden>
                <Check size={9} strokeWidth={3.5} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {showScrollHint ? (
        <div className="mml-pr-free-scroll-hint" aria-hidden>
          <ChevronDown className="mml-pr-free-scroll-hint-icon" size={15} strokeWidth={2.75} />
        </div>
      ) : null}
    </div>
  )
}


