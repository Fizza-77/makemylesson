import { cn } from '@marketing/lib/cn'

/** Responsive side gutters — aligned with navbar and landing `.W` */
export const containerGutter = 'px-4 sm:px-6 md:px-8 xl:px-8 2xl:px-10'

/** Max content width — keeps cards and copy off viewport edges on large screens */
export const containerMaxWidth = 'max-w-[1600px] 2xl:max-w-[1800px]'

/** Full-width shell with responsive gutters — matches landing `.W` */
export const containerClass = `mx-auto w-full min-w-0 ${containerMaxWidth} ${containerGutter}`

/** Narrow column for policy copy, contact */
export const containerNarrowClass = `mx-auto w-full min-w-0 max-w-3xl ${containerGutter}`

/** Blog article — narrow through lg; wider readable column on xl+ desktops */
export const containerBlogArticleClass =
  `mx-auto w-full min-w-0 max-w-3xl ${containerGutter} xl:max-w-[1400px] 2xl:max-w-[1600px]`

/** Policy / compliance — readable width on large screens */
export const containerPolicyClass =
  `mx-auto w-full min-w-0 max-w-3xl ${containerGutter} xl:max-w-6xl 2xl:max-w-6xl`

/** Prose / legal summaries */
export const containerProseClass =
  `mx-auto w-full min-w-0 max-w-2xl ${containerGutter} xl:max-w-5xl`

/** Blog listing and dashboards */
export const containerWideClass = `mx-auto w-full min-w-0 ${containerMaxWidth} ${containerGutter}`

/** Pricing, FAQ, and medium-width app pages */
export const containerContentClass = `mx-auto w-full min-w-0 ${containerMaxWidth} ${containerGutter}`

export const sectionYClass = 'py-12 md:py-16 lg:py-24'

export const pageShellClass =
  'min-h-[calc(100vh-4rem)] min-w-0 border-t border-white/10 bg-mml-navy-mid'

const variantClass = {
  default: containerClass,
  narrow: containerNarrowClass,
  blogArticle: containerBlogArticleClass,
  policy: containerPolicyClass,
  prose: containerProseClass,
  wide: containerWideClass,
  content: containerContentClass,
}

export default function Container({
  children,
  className,
  as: Tag = 'div',
  variant = 'default',
}) {
  return <Tag className={cn(variantClass[variant], className)}>{children}</Tag>
}

export function PageShell({ children, className, variant = 'default', contentClassName }) {
  return (
    <div className={cn(pageShellClass, className)}>
      <Container variant={variant} className={cn(sectionYClass, 'pb-24', contentClassName)}>
        {children}
      </Container>
    </div>
  )
}
