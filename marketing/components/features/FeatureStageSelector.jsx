import Link from 'next/link'
import { FEATURE_STAGE_ITEMS, getFeaturePath } from '@marketing/data/features'
import { cn } from '@marketing/lib/cn'

export default function FeatureStageSelector({ activeSlug }) {
  return (
    <nav
      aria-label="Teaching pack stages"
      className="sticky top-16 z-40 w-full border-b border-white/10 bg-[#1A1E3A]"
    >
      <div className="fp-shell flex w-full items-center justify-center gap-2 overflow-x-auto px-4 py-3.5 sm:gap-3 sm:px-6 md:px-8">
        {FEATURE_STAGE_ITEMS.map((stage, index) => {
          const active = stage.slug === activeSlug
          const step = index + 1
          const className = cn(
            'inline-flex items-center justify-center gap-2.5 rounded-full px-3.5 py-2 text-center text-[13px] font-semibold no-underline transition sm:px-4 sm:text-[14px]',
            active
              ? 'bg-[#35BEBC] text-[#1A1E3A]'
              : 'border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5',
          )

          return (
            <div
              key={stage.slug}
              className="flex shrink-0 items-center justify-center gap-2 sm:gap-3"
            >
              {index > 0 ? (
                <span className="text-[13px] font-medium text-white" aria-hidden>
                  →
                </span>
              ) : null}
              <Link
                href={getFeaturePath(stage.slug)}
                aria-current={active ? 'page' : undefined}
                className={className}
                scroll
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold',
                    active ? 'bg-[#1A1E3A] text-white' : 'bg-[#35BEBC] text-[#1A1E3A]',
                  )}
                >
                  {step}
                </span>
                {stage.stageLabel}
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}


