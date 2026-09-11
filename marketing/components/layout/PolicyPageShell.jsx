import '@marketing/styles/legal-prose.css'

import Container from '@marketing/components/layout/Container'
import { sectionYClass } from '@marketing/components/layout/Container'
import { cn } from '@marketing/lib/cn'

/** Shared wrapper for long-form legal / policy pages */
export default function PolicyPageShell({ children, className }) {
  return (
    <div className={cn('legal-page-shell min-h-[calc(100vh-4rem)] min-w-0 border-t border-white/10 bg-[#1a1e3a] text-white', className)}>
      <Container variant="policy" className={cn(sectionYClass, 'legal-page pb-16 md:pb-20 lg:pb-24 text-white')}>
        {children}
      </Container>
    </div>
  )
}


