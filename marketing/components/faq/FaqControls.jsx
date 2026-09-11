'use client'

import { Search } from 'lucide-react'

import { cn } from '@marketing/lib/cn'

import { FAQ_TOPICS } from './faqConstants'
import { useFaqState } from './FaqStateProvider'

export default function FaqControls() {
  const { query, setQuery, topicId, setTopicId, filteredItems, topicCount } = useFaqState()

  return (
    <div className="min-w-0 rounded-[28px] bg-[#1A1E3A] p-5 shadow-[0_20px_50px_rgba(26,30,58,0.2)] sm:rounded-[32px] sm:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">
        Search the help centre
      </p>

      <label className="mt-4 block">
        <span className="sr-only">Search FAQs</span>
        <span className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#35BEBC]"
            aria-hidden
            strokeWidth={2.25}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search – try 'credits', 'IGCSE', or 'export'..."
            className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-4 text-[14px] text-[#1A1E3A] outline-none ring-0 placeholder:text-black/55 focus:ring-2 focus:ring-[#35BEBC]/40"
          />
        </span>
      </label>

      <p className="mt-3 text-[13px] leading-relaxed text-white sm:text-[14px]">
        <span className="font-semibold text-[#35BEBC]">{filteredItems.length} questions</span>{' '}
        across {topicCount} topics – start typing and the list filters itself.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FAQ_TOPICS.map((topic) => {
          const on = topic.id === topicId
          const Icon = topic.Icon
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setTopicId(topic.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] transition sm:text-[12px]',
                on ? 'bg-[#35BEBC] text-white' : 'bg-white text-[#1A1E3A] hover:bg-white/90',
              )}
            >
              {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} /> : null}
              {topic.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}


