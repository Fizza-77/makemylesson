'use client'

import Link from 'next/link'
import { useInView } from '@marketing/landing/hooks'
import { cn } from '@marketing/lib/cn'
import { getTeachingMethodPath } from '@marketing/data/teachingMethods'

export default function TeachingMethodHubGrid({ columns }) {
  const [ref, visible] = useInView({ threshold: 0.08 })

  return (
    <div className="tm-hub-grid" ref={ref}>
      {columns.map((column, columnIndex) => (
        <section
          key={column.id}
          className={cn('tm-hub-card', visible && 'tm-hub-card--visible')}
          style={{ transitionDelay: visible ? `${columnIndex * 100}ms` : undefined }}
          aria-labelledby={`hub-col-${column.id}`}
        >
          <h2 id={`hub-col-${column.id}`} className="tm-section-heading">
            {column.heading}
          </h2>
          <ul className="tm-hub-list">
            {column.methods.map((method) => (
              <li key={method.slug}>
                <Link href={getTeachingMethodPath(method.slug)} className="tm-hub-link">
                  {method.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}


