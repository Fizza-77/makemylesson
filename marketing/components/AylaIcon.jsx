'use client'

import { cn } from '@marketing/lib/cn'

const AYLA_SRC = '/ayla.svg'

/**
 * Ayla mark from `/public/ayla.svg` (circular artwork — shown as-is).
 * Default `alt` is “Ayla”. Pass a custom string when needed.
 */
export default function AylaIcon({ className = '', width = 28, height = 28, alt = 'Ayla', priority = false }) {
  const fillsParent =
    typeof className === 'string' && /\bh-full\b/.test(className) && /\bw-full\b/.test(className)

  return (
    <span
      className={cn(
        'relative shrink-0 align-middle',
        fillsParent ? 'block h-full w-full min-h-0 min-w-0' : 'inline-block',
        className,
      )}
      style={
        fillsParent
          ? undefined
          : {
              width,
              height,
            }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={AYLA_SRC}
        alt={alt}
        fetchPriority={priority ? 'high' : undefined}
        className="h-full w-full object-contain"
      />
    </span>
  )
}


