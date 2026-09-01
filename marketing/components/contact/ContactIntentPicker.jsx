'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import {
  GraduationCap,
  LifeBuoy,
  Lightbulb,
  Megaphone,
} from 'lucide-react'
import { cn } from '@marketing/lib/cn'

const INTENTS = [
  {
    subject: 'billing',
    title: 'I need help',
    body: 'Support with my account or a generation',
    Icon: LifeBuoy,
    tone: 'navy',
  },
  {
    subject: 'school',
    title: 'School enquiry',
    body: 'Quotes, seats, and purchase orders',
    Icon: GraduationCap,
    tone: 'light',
  },
  {
    subject: 'feedback',
    title: 'Feedback & ideas',
    body: 'A bug, a wish, or a curriculum request',
    Icon: Lightbulb,
    tone: 'navy',
  },
  {
    subject: 'partnership',
    title: 'Press & partners',
    body: 'Media, partnerships, and integrations',
    Icon: Megaphone,
    tone: 'light',
  },
]

export default function ContactIntentPicker({ initialSubject = '' }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSubject = searchParams.get('subject') || initialSubject || ''

  const selectIntent = useCallback(
    (subject) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('subject', subject)
      router.replace(`/contact?${params.toString()}`, { scroll: false })
      requestAnimationFrame(() => {
        document.getElementById('contact-form')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    },
    [router, searchParams],
  )

  return (
    <div className="mt-2 grid gap-3 sm:mt-3 sm:grid-cols-2 lg:-mt-2 lg:grid-cols-4 lg:gap-4 xl:-mt-4 xl:gap-5 2xl:gap-6">
      {INTENTS.map((intent) => {
        const Icon = intent.Icon
        const active = selectedSubject === intent.subject
        const navy = intent.tone === 'navy'
        return (
          <button
            key={intent.subject}
            type="button"
            onClick={() => selectIntent(intent.subject)}
            className={cn(
              'min-w-0 rounded-[22px] p-4 text-left transition sm:rounded-[24px] sm:p-5 xl:rounded-[28px] xl:p-6 2xl:p-7',
              navy
                ? 'bg-[#1A1E3A] text-white hover:bg-[#242845]'
                : 'bg-[#f4f7f7] text-[#1A1E3A] hover:bg-white',
              active && 'ring-2 ring-[#1A1E3A] ring-offset-2 ring-offset-[#ade5df]',
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg xl:h-9 xl:w-9',
                  navy ? 'bg-[#35BEBC] text-white' : 'bg-[#1A1E3A] text-white',
                )}
              >
                <Icon className="h-4 w-4 xl:h-[18px] xl:w-[18px]" aria-hidden strokeWidth={2.25} />
              </span>
              <p className="min-w-0 text-[15px] font-bold leading-tight tracking-tight sm:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                {intent.title}
              </p>
            </div>
            <p
              className={cn(
                'mt-3 text-[13px] leading-snug xl:text-[14px]',
                navy ? 'text-white/90' : 'text-[#1A1E3A]/70',
              )}
            >
              {intent.body}
            </p>
          </button>
        )
      })}
    </div>
  )
}
