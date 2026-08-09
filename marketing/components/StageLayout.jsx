import React from 'react'
import Link from 'next/link'
import AylaIcon from '@marketing/components/AylaIcon'
import { Check } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import { containerClass } from '@marketing/components/layout/Container'

const STAGES = [
  { num: 1, label: 'Plan', path: '/lesson/stage1' },
  { num: 2, label: 'Present', path: '/lesson/stage2' },
  { num: 3, label: 'Assess', path: '/lesson/stage3' },
  { num: 4, label: 'Quiz', path: '/lesson/stage4' },
]

export default function StageLayout({ children, currentStage }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-mml-navy">
      <div className="border-b border-white/[0.06] bg-mml-navy-mid text-white">
        <div className={cn(containerClass, 'flex flex-wrap items-center gap-4 py-3 md:gap-5 max-md:gap-2.5 max-md:py-2.5')}>
          <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3.5 py-2">
            <div className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full border border-mml-teal/30 bg-mml-navy-mid ring-1 ring-white/5">
              <AylaIcon width={28} height={28} alt="" className="h-full w-full" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Ayla</p>
              <p className="text-[10px] text-white">AI Teaching Assistant</p>
            </div>
            <button type="button" className="btn-primary shrink-0 !px-3.5 !py-1.5 !text-xs">
              Ask Ayla
            </button>
          </div>
          <div className="flex flex-1 flex-wrap gap-2 max-md:hidden">
            {['Suggest Material', 'Suggest Activity', 'Simplify'].map((t) => (
              <button
                key={t}
                type="button"
                className="whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.05] px-3.5 py-1.5 font-sans text-xs font-medium text-white transition-colors hover:border-[var(--border)] hover:bg-mml-teal/10 hover:text-mml-teal"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-white/[0.06] bg-mml-navy-card">
        <div className={cn(containerClass, 'flex items-center overflow-x-auto py-3.5')}>
          {STAGES.map((s, i) => {
            const isDone = s.num < currentStage
            const isActive = s.num === currentStage
            return (
              <React.Fragment key={s.num}>
                <Link
                  href={s.path}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2.5 py-1.5 no-underline transition-colors hover:bg-mml-teal/[0.05]',
                    isActive && 'bg-mml-teal/[0.05]',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-bold transition-all',
                      isActive &&
                        'scale-110 border-mml-teal bg-mml-teal text-mml-navy shadow-[0_0_0_3px_rgba(125,211,232,0.25)]',
                      isDone && !isActive && 'border-mml-teal-dark bg-mml-teal-dark text-white',
                      !isActive && !isDone && 'border-white/[0.06] bg-mml-navy-mid text-white',
                    )}
                  >
                    {isDone ? <Check size={12} /> : s.num}
                  </div>
                  <span
                    className={cn(
                      'text-[13px] font-semibold transition-colors max-md:hidden',
                      isActive && 'font-bold text-mml-teal',
                      isDone && !isActive && 'text-mml-teal',
                      !isActive && !isDone && 'text-white',
                    )}
                  >
                    {s.label}
                  </span>
                </Link>
                {i < STAGES.length - 1 && (
                  <div
                    className={cn(
                      'mx-1 h-0.5 max-w-[80px] flex-1 rounded-sm bg-white/[0.06] max-md:max-w-8',
                      isDone && 'bg-mml-teal-dark',
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className={cn(containerClass, 'flex-1 py-8 max-md:py-5')}>{children}</div>
    </div>
  )
}
