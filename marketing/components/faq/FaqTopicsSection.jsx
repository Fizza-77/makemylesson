'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'

import { cn } from '@marketing/lib/cn'

import { FAQ_TOPIC_CARDS } from './faqConstants'
import { useFaqState } from './FaqStateProvider'

function FaqRow({ item, isOpen, onToggle }) {
  const paragraphs = item.a.split(/\n\n+/).filter(Boolean)

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <h3 className="m-0 text-[13px] font-medium leading-snug text-[#1A1E3A] sm:text-[14px]">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-3 px-4 py-3 text-left sm:px-5 sm:py-3.5"
          aria-expanded={isOpen}
        >
          <span className="min-w-0 flex-1">{item.q}</span>
          <span
            className={cn(
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#d8f3ef] text-[#1E9A98] transition-transform duration-200',
              isOpen && 'rotate-45',
            )}
            aria-hidden
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.75} />
          </span>
        </button>
      </h3>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'space-y-2.5 px-5 pb-4 pt-0 text-[13px] leading-relaxed text-black transition-opacity duration-200',
              isOpen ? 'opacity-100' : 'opacity-0',
            )}
          >
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {p.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TopicCard({ topic, items, openId, setOpenId }) {
  const teal = topic.tone === 'teal'
  const Icon = topic.Icon

  return (
    <article
      id={topic.id}
      className={cn(
        'flex h-full flex-col rounded-[28px] p-5 sm:rounded-[32px] sm:p-6 xl:p-7',
        teal ? 'bg-[#35BEBC]' : 'bg-[#2A3050]',
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#1A1E3A]">
          {Icon ? <Icon className="h-4 w-4" aria-hidden strokeWidth={2.25} /> : null}
        </span>
        <h2 className="text-[1.15rem] font-bold tracking-tight text-white sm:text-[1.25rem]">
          {topic.label}
        </h2>
      </div>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <FaqRow
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
            />
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function FaqTopicsSection() {
  const { filteredItems, topicId, openId, setOpenId } = useFaqState()

  const topicCards = useMemo(() => {
    return FAQ_TOPIC_CARDS.filter((topic) => topicId === 'all' || topic.id === topicId)
      .map((topic) => ({
        topic,
        items: filteredItems.filter((item) => topic.cats.includes(item.cat)),
      }))
      .filter((card) => card.items.length > 0)
  }, [filteredItems, topicId])

  return (
    <section className="mt-8 bg-[#1A1E3A] py-12 sm:mt-10 sm:py-14 lg:py-16" aria-label="FAQ topics">
      <div className="faq-topics-shell">
        {topicCards.length === 0 ? (
          <p className="rounded-[24px] bg-white/5 px-5 py-10 text-center text-[15px] text-white">
            No questions match that search. Try another keyword or reset the topic filter.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {topicCards.map(({ topic, items }) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                items={items}
                openId={openId}
                setOpenId={setOpenId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
