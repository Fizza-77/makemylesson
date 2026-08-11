'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CircleHelp,
  Database,
  Folder,
  Globe,
  GraduationCap,
  Plus,
  Rocket,
  Search,
  Sparkles,
} from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import { faqItems } from '@marketing/data/faqItems'
import { MML_APP } from '@marketing/lib/appUrls'

const TOPICS = [
  {
    id: 'all',
    label: 'All topics',
    cats: null,
    Icon: null,
  },
  {
    id: 'getting-started',
    label: 'Getting started',
    cats: ['cat1', 'cat2'],
    Icon: Rocket,
    tone: 'teal',
  },
  {
    id: 'credits',
    label: 'Credits & billing',
    cats: ['cat5'],
    Icon: Database,
    tone: 'navy',
  },
  {
    id: 'curriculum',
    label: 'Curriculum & content',
    cats: ['cat3'],
    Icon: Globe,
    tone: 'navy',
  },
  {
    id: 'documents',
    label: 'Documents & exports',
    cats: ['cat6'],
    Icon: Folder,
    tone: 'teal',
  },
  {
    id: 'ayla',
    label: 'Ayla & AI',
    cats: ['cat4'],
    Icon: Sparkles,
    tone: 'teal',
  },
  {
    id: 'schools',
    label: 'Schools & privacy',
    cats: ['cat7'],
    Icon: GraduationCap,
    tone: 'navy',
  },
]

const TOPIC_CARDS = TOPICS.filter((t) => t.id !== 'all')

function FaqRow({ item, isOpen, onToggle }) {
  const paragraphs = item.a.split(/\n\n+/).filter(Boolean)

  return (
    <div className="overflow-hidden rounded-full bg-white">
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
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-2.5 rounded-b-[24px] bg-white px-5 pb-4 text-[13px] leading-relaxed text-[#4B5068]">
              {paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-wrap">
                  {p.trim()}
                </p>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [topicId, setTopicId] = useState('all')
  const [openId, setOpenId] = useState(null)

  const activeTopic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0]

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqItems.filter((item) => {
      if (activeTopic.cats && !activeTopic.cats.includes(item.cat)) return false
      if (!q) return true
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.catTitle.toLowerCase().includes(q)
      )
    })
  }, [query, activeTopic])

  const topicCards = useMemo(() => {
    const cards = TOPIC_CARDS.filter((topic) => {
      if (topicId !== 'all' && topic.id !== topicId) return false
      return true
    })
      .map((topic) => ({
        topic,
        items: filteredItems.filter((item) => topic.cats.includes(item.cat)),
      }))
      .filter((card) => card.items.length > 0)

    return cards
  }, [filteredItems, topicId])

  const topicCount = TOPIC_CARDS.length

  return (
    <div className="faq-page min-h-[calc(100vh-4rem)] bg-white">
      <div className="faq-hero-shell pt-6 sm:pt-8">
        <section
          className="relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]"
          aria-labelledby="faq-hero-heading"
        >
          <div
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/35"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/30"
            aria-hidden
          />

          <div className="relative z-[1] grid items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-12 lg:py-14">
            <div className="min-w-0">
              <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
                <CircleHelp className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
                FAQs
              </p>
              <h1
                id="faq-hero-heading"
                className="max-w-[12ch] text-[clamp(1.85rem,4vw,3.1rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A] sm:max-w-[16ch] md:max-w-[18ch] lg:max-w-[20ch] xl:max-w-[22ch] 2xl:max-w-[26ch]"
              >
                Ask us anything. We&apos;ve probably heard it in a{' '}
                <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
                  staffroom.
                </span>
              </h1>
            </div>

            <div className="min-w-0 rounded-[28px] bg-[#1A1E3A] p-5 shadow-[0_20px_50px_rgba(26,30,58,0.2)] sm:rounded-[32px] sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
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
                    className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-4 text-[14px] text-[#1A1E3A] outline-none ring-0 placeholder:text-[#4B5068]/55 focus:ring-2 focus:ring-[#35BEBC]/40"
                  />
                </span>
              </label>

              <p className="mt-3 text-[13px] leading-relaxed text-white/70 sm:text-[14px]">
                <span className="font-semibold text-[#35BEBC]">{filteredItems.length} questions</span>{' '}
                across {topicCount} topics – start typing and the list filters itself.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {TOPICS.map((topic) => {
                  const on = topic.id === topicId
                  const Icon = topic.Icon
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setTopicId(topic.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] transition sm:text-[12px]',
                        on
                          ? 'bg-[#35BEBC] text-white'
                          : 'bg-white text-[#1A1E3A] hover:bg-white/90',
                      )}
                    >
                      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} /> : null}
                      {topic.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 bg-[#1A1E3A] py-12 sm:mt-10 sm:py-14 lg:py-16" aria-label="FAQ topics">
        <div className="faq-topics-shell">
          {topicCards.length === 0 ? (
            <p className="rounded-[24px] bg-white/5 px-5 py-10 text-center text-[15px] text-white/60">
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

      <section className="bg-white py-10 sm:py-12 lg:py-14" aria-labelledby="faq-support-heading">
        <div className="faq-topics-shell">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-[#ade5df] px-6 py-7 sm:rounded-[36px] sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
            <div>
              <h2
                id="faq-support-heading"
                className="text-[clamp(1.25rem,2.4vw,1.65rem)] font-bold tracking-tight text-[#1A1E3A]"
              >
                Didn&apos;t find your answer?
              </h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#4B5068] sm:text-[15px]">
                Real humans reply — usually within one school day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
              >
                Email Us
              </Link>
              <Link
                href={MML_APP.ayla}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#1A1E3A] no-underline transition hover:bg-white/90"
              >
                Ask Ayla Instead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
