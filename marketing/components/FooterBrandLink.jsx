import Link from 'next/link'
import BrandMark from '@marketing/components/BrandMark'

export default function FooterBrandLink() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 no-underline"
      aria-label="Make My Lesson home"
    >
      <BrandMark className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8" />
      <span className="font-display text-sm font-normal text-white sm:text-[15px] lg:text-base">
        Make My <strong className="font-bold text-mml-teal">Lesson</strong>
      </span>
    </Link>
  )
}
