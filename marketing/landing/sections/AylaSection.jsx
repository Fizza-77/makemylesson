import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { AylaHeaderAvatar, AylaMsgAvatar, TypingDots } from '../AylaChatUi'
import { CheckItem, Label, Reveal } from '../shared'
import { MML_APP } from '@marketing/lib/appUrls'
import { containerGutter } from '@marketing/components/layout/Container'

export default function AylaSection() {
  const [typed, setTyped] = useState(false)
  const [activeChip, setActiveChip] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [sectionVisible, setSectionVisible] = useState(true)
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)
  /** True while we should keep the thread pinned to the latest message (user has not scrolled up). */
  const pinToBottomRef = useRef(true)
  const chips = ['Suggest Material', 'Suggest Activity', 'Simplify', 'Differentiate']

  const BOTTOM_EPS = 48

  const measureScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const atBottom = scrollHeight - scrollTop - clientHeight <= BOTTOM_EPS
    setIsAtBottom(atBottom)
    pinToBottomRef.current = atBottom
  }, [])

  const scrollChatToBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    const { scrollTop, scrollHeight, clientHeight } = el
    const atBottom = scrollHeight - scrollTop - clientHeight <= BOTTOM_EPS
    setIsAtBottom(atBottom)
    pinToBottomRef.current = atBottom
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setTyped(true), 3500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => measureScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => {
      if (pinToBottomRef.current) {
        scrollChatToBottom()
      } else {
        measureScroll()
      }
    })
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [measureScroll, scrollChatToBottom])

  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setSectionVisible(entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px' },
    )
    io.observe(sec)
    return () => io.disconnect()
  }, [])

  /** Pin to bottom when the user is following the thread; after layout / Reveal / fonts settle. */
  useLayoutEffect(() => {
    const run = () => {
      if (pinToBottomRef.current) {
        scrollChatToBottom()
      }
    }
    run()
    let innerRaf = 0
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(run)
    })
    const t1 = setTimeout(run, 0)
    const t2 = setTimeout(run, 80)
    const t3 = setTimeout(run, 240)
    return () => {
      cancelAnimationFrame(outerRaf)
      if (innerRaf) cancelAnimationFrame(innerRaf)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [typed, scrollChatToBottom])

  const showStickyTyping = typed && isAtBottom && sectionVisible

  return (
    <section ref={sectionRef} id="ayla-ai" className="ayla-section">
      <div className={`mx-auto w-full max-w-[1800px] ${containerGutter}`}>
        <Reveal className="section-head ayla-section-head">
          <Label center>Meet Ayla</Label>
          <h2 className="ayla-head-title">
            Your Teaching <em>Co-Pilot.</em>
          </h2>
        </Reveal>

        <div className="ayla-grid grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <Reveal className="ayla-chat-col order-1 min-w-0 lg:col-span-8">
            <div className="ayla-chat-shell">
              <div className="ayla-chat">
                <div className="ayla-chat-head">
                  <AylaHeaderAvatar />
                  <div>
                    <div className="ayla-chat-name">Ayla — Teaching Assistant</div>
                    <div className="ayla-chat-status">● Online · Always context-aware</div>
                  </div>
                  <span className="ayla-pro-badge">PRO</span>
                </div>
                <div className="ayla-chip-strip">
                  {chips.map((chip, i) => (
                    <button
                      key={chip}
                      className={`ac-chip ${activeChip === i ? 'on' : ''}`}
                      onClick={() => setActiveChip(i)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="ayla-msgs">
                  <div
                    ref={scrollRef}
                    className="ayla-msgs-scroll"
                    tabIndex={0}
                    aria-label="Conversation messages"
                  >
                    <div className="msg">
                      <AylaMsgAvatar />
                      <div className="msg-bub ayla">
                        Hi! I am Ayla. I can refine your lesson, suggest activities, or adjust difficulty. What are you
                        working on?
                      </div>
                    </div>
                    <div className="msg me">
                      <div className="msg-bub user">Can you add a group activity to the Ecosystems lesson?</div>
                    </div>
                    <div className="msg">
                      <AylaMsgAvatar />
                      <div className="msg-bub ayla">
                        Done! I added a 15-min <strong>Ecosystem Mapping</strong> group activity after core teaching.
                        Students map food chains in groups of 4. Want me to generate the instructions?
                      </div>
                    </div>
                    <div className="msg me">
                      <div className="msg-bub user">Yes and make it suitable for ELL students.</div>
                    </div>
                    <div className="msg">
                      <AylaMsgAvatar />
                      <div className="msg-bub ayla" aria-live="polite">
                        {typed ? (
                          <>
                            Done! ✅ Added a differentiated <strong>Ecosystem Mapping</strong> activity with visual cards
                            and sentence starters for ELL students. It is in your Stage 1 plan now.
                          </>
                        ) : (
                          <TypingDots />
                        )}
                      </div>
                    </div>
                    {showStickyTyping && (
                      <div className="ayla-typing-sticky" aria-hidden>
                        <div className="msg ayla-typing-msg">
                          <AylaMsgAvatar />
                          <div className="msg-bub ayla ayla-typing-bub">
                            <TypingDots />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ayla-input-row">
                  <input type="text" placeholder="Ask Ayla anything about your lesson..." />
                  <button>→</button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="ayla-copy order-2 min-w-0 lg:col-span-4">
            <p className="sub ayla-head-sub">
              Ayla is embedded in every stage. She knows your curriculum, grade, and preferences so every suggestion is
              actually relevant.
            </p>
            <ul className="feat-checks ayla-feat-checks">
              <CheckItem>Context-aware and knows your lesson at every stage</CheckItem>
              <CheckItem>Suggests activities, materials, and differentiation</CheckItem>
              <CheckItem>Adapts content for ELL, SEN, gifted learners</CheckItem>
              <CheckItem>Available on every page plan, present, assess, quiz</CheckItem>
            </ul>
            <div className="ayla-ctas">
              <a href={MML_APP.ayla} className="btn btn-teal btn-lg">
                Chat With Ayla →
              </a>
              <Link href="/faq" className="btn btn-ghost btn-lg">
                Learn More
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
