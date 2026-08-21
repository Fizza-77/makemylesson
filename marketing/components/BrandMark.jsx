import Image from 'next/image'

/**
 * Site logo mark from /public/vector.svg.
 * Use next to visible “Make My Lesson” text; keep alt empty to avoid duplication.
 */
export default function BrandMark({ className = 'h-7 w-7 shrink-0 object-contain' }) {
  return (
    <Image
      src="/vector.svg"
      alt=""
      width={128}
      height={128}
      className={className}
      priority
      unoptimized
      sizes="(max-width: 768px) 28px, 32px"
    />
  )
}
