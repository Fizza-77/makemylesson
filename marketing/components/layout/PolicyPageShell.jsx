import '@marketing/styles/legal-prose.css'

import Container from '@marketing/components/layout/Container'
import { pageShellClass, sectionYClass } from '@marketing/components/layout/Container'
import { cn } from '@marketing/lib/cn'

/** Shared wrapper for long-form legal / policy pages */
export default function PolicyPageShell({ children, className }) {
  return (
    <div className={cn(pageShellClass, className)}>
      <Container variant="policy" className={cn(sectionYClass, 'legal-page pb-16 md:pb-20 lg:pb-24')}>
        {children}
      </Container>
    </div>
  )
}
