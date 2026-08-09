import Image from 'next/image'

/**
 * Site logo from /public/logo.png. Use next to visible “Make My Lesson” text; keep alt empty to avoid duplication.
 */
export default function BrandMark({ className = 'h-7 w-7 shrink-0 object-contain' }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={128}
      height={128}
      className={className}
      priority
      sizes="(max-width: 768px) 28px, 32px"
    />
  )
}
