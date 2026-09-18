'use client'

import '@marketing/styles/marketing-ayla.css'

import Image from 'next/image'
import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import { MessageCircle, Minus, Send, X } from 'lucide-react'

import { findBestFaqMatch } from '@/data/ayla-faq'
import { useAylaCreditGate } from '@/features/ayla/useAylaCreditGate'
import {
  isAylaResourceExhaustedError,
  isAylaUnauthenticatedError,
  sendAylaMessage,
  type AylaChatMessage,
} from '@/services/ayla-chat.service'
import { applyAylaQuotaFromReply } from '@/store/account-store'
import { cn } from '@marketing/lib/cn'

const WELCOME =
  "Hi! I'm Ayla, your teaching assistant. Ask me about Make My Lesson, credits, curricula, or how the four stages work."

const SUGGESTIONS = [
  'What is Make My Lesson?',
  'How do credits work?',
  'Which curricula are supported?',
] as const

type UiMessage = AylaChatMessage & { id: string }

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function AylaMarketingChat() {
  const panelId = useId()
  const { ensureCanSend, dialogs: aylaGateDialogs } = useAylaCreditGate('/')
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: 'welcome', role: 'model', text: WELCOME },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const openChat = () => setOpen(true)
    window.addEventListener('ayla-open', openChat)
    return () => window.removeEventListener('ayla-open', openChat)
  }, [])

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(t)
  }, [open, messages, sending])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  async function replyTo(prompt: string) {
    const trimmed = prompt.trim()
    if (!trimmed || sending) return

    if (!(await ensureCanSend())) return

    const userMsg: UiMessage = { id: makeId(), role: 'user', text: trimmed }
    const history = [...messages, userMsg].map(({ role, text }) => ({ role, text }))
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      let answer = ''
      try {
        const reply = await sendAylaMessage({
          history: history.slice(0, -1),
          userMessage: trimmed,
          context: { surface: 'marketing' },
        })
        applyAylaQuotaFromReply({
          aylaCredits: reply.aylaCredits,
          aylaPaidCredits: reply.aylaPaidCredits,
          aylaFairUsageResumeAtMs: reply.aylaFairUsageResumeAtMs,
          aylaPeriodMonth: reply.aylaPeriodMonth,
          clearFairUsageResume:
            reply.aylaFairUsageResumeAtMs == null &&
            reply.aylaPaidCredits != null,
        })
        answer = reply.text
      } catch (e) {
        if (
          isAylaResourceExhaustedError(e) ||
          isAylaUnauthenticatedError(e)
        ) {
          setMessages((prev) => prev.slice(0, -1))
          await ensureCanSend()
          return
        }
        const faq = findBestFaqMatch(trimmed)
        answer =
          faq?.answer ??
          "I can help with Make My Lesson questions. Try asking about credits, curricula, or what each stage generates — or start free in the app for full Ayla chat."
      }
      setMessages((prev) => [...prev, { id: makeId(), role: 'model', text: answer }])
    } finally {
      setSending(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void replyTo(input)
  }

  return (
    <div className="mml-ayla-widget" data-open={open ? 'true' : 'false'}>
      {open ? (
        <section
          id={panelId}
          className="mml-ayla-widget-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Ayla teaching assistant chat"
        >
          <header className="mml-ayla-widget-head">
            <div className="mml-ayla-widget-identity">
              <Image
                src="/Group 7.svg"
                alt="Ayla"
                width={40}
                height={40}
                className="mml-ayla-widget-avatar"
              />
              <div>
                <p className="mml-ayla-widget-name">Ayla</p>
                <p className="mml-ayla-widget-role">
                  <span className="mml-ayla-widget-online" aria-hidden />
                  Online
                </p>
              </div>
            </div>
            <div className="mml-ayla-widget-head-actions">
              <button
                type="button"
                className="mml-ayla-widget-icon-btn"
                aria-label="Minimize chat"
                onClick={() => setOpen(false)}
              >
                <Minus size={18} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                className="mml-ayla-widget-icon-btn"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                <X size={18} strokeWidth={2.25} />
              </button>
            </div>
          </header>

          <div ref={listRef} className="mml-ayla-widget-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'mml-ayla-widget-bubble',
                  message.role === 'user'
                    ? 'mml-ayla-widget-bubble--user'
                    : 'mml-ayla-widget-bubble--bot',
                )}
              >
                {message.text}
              </div>
            ))}
            {sending ? (
              <div className="mml-ayla-widget-bubble mml-ayla-widget-bubble--bot mml-ayla-widget-typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          {messages.length <= 1 ? (
            <div className="mml-ayla-widget-suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="mml-ayla-widget-chip"
                  onClick={() => void replyTo(suggestion)}
                  disabled={sending}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          <form className="mml-ayla-widget-composer" onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void replyTo(input)
                }
              }}
              placeholder="Ask Ayla anything…"
              className="mml-ayla-widget-input"
              disabled={sending}
              aria-label="Message Ayla"
            />
            <button
              type="submit"
              className="mml-ayla-widget-send"
              disabled={sending || !input.trim()}
              aria-label="Send message"
            >
              <Send size={18} strokeWidth={2.25} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className={cn('mml-ayla-fab', open && 'mml-ayla-fab--open')}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close Ayla chat' : 'Chat with Ayla'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X size={26} strokeWidth={2.4} aria-hidden />
        ) : (
          <>
            <Image
              src="/ayla.svg"
              alt="Ayla"
              width={96}
              height={96}
              className="mml-ayla-fab-avatar"
              priority={false}
            />
            <span className="mml-ayla-fab-badge" aria-hidden>
              <MessageCircle size={14} strokeWidth={2.5} />
            </span>
          </>
        )}
      </button>
      {aylaGateDialogs}
    </div>
  )
}


