'use client'

import { createContext, useContext, useMemo, useState } from 'react'

import { faqItems } from '@marketing/data/faqItems'

import { FAQ_TOPIC_CARDS, FAQ_TOPICS } from './faqConstants'

const FaqStateContext = createContext(null)

export function useFaqState() {
  const value = useContext(FaqStateContext)
  if (!value) {
    throw new Error('useFaqState must be used within FaqStateProvider')
  }
  return value
}

export default function FaqStateProvider({ children }) {
  const [query, setQuery] = useState('')
  const [topicId, setTopicId] = useState('all')
  const [openId, setOpenId] = useState(null)

  const activeTopic = FAQ_TOPICS.find((topic) => topic.id === topicId) ?? FAQ_TOPICS[0]

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

  const value = useMemo(
    () => ({
      query,
      setQuery,
      topicId,
      setTopicId,
      openId,
      setOpenId,
      filteredItems,
      topicCount: FAQ_TOPIC_CARDS.length,
    }),
    [query, topicId, openId, filteredItems],
  )

  return <FaqStateContext.Provider value={value}>{children}</FaqStateContext.Provider>
}


