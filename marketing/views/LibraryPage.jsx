'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AylaIcon from '@marketing/components/AylaIcon'
import { Search, Download, Sparkles, ChevronDown, Check, Grid, List, Clock, BookOpen, Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import StageLayout from '../components/StageLayout'

const LESSONS = [
  { id: 1, title: 'Exploring Ecosystems', subject: 'Science', grade: 'Grade 9', stages: [true, true, true, false], edited: '2 days ago', emoji: '🌿', hue: '#7dd3e8' },
  { id: 2, title: 'The Water Cycle', subject: 'Science', grade: 'Grade 9', stages: [true, true, false, false], edited: '1 week ago', emoji: '💧', hue: '#3b82f6' },
  { id: 3, title: 'Parts of the Plant', subject: 'Biology', grade: 'Grade 6', stages: [true, false, false, false], edited: '2 weeks ago', emoji: '🌱', hue: '#22c55e' },
  { id: 4, title: "Earth's Changing Surface", subject: 'Geology', grade: 'Grade 7', stages: [true, true, true, true], edited: '3 weeks ago', emoji: '🌍', hue: '#38bdf8' },
]

const STAGE_NAMES = ['Plan', 'Present', 'Assess', 'Quiz']

const STAGE_DETAILS = [
  { icon: '📋', title: 'Lesson Plan', desc: 'Full structured plan · 45 min' },
  { icon: '🖥', title: 'Slide Deck', desc: '8 slides generated' },
  { icon: '📝', title: 'Formative Assessment', desc: 'Quick Check · 5 questions' },
  { icon: '✅', title: 'Quiz', desc: '10 questions · answer key' },
]

const EXPORT_TYPES = [
  { id: 'mc', label: 'Multiple Choice' },
  { id: 'tf', label: 'True / False' },
  { id: 'casebased', label: 'Case Based' },
  { id: 'short', label: 'Short Answer' },
]

const TABS = ['All', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4']

export default function LibraryPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('All')
  const [active, setActive] = useState(LESSONS[0])
  const [exports, setExports] = useState(['mc', 'tf'])
  const [view, setView] = useState('list')

  const toggleExport = (id) => setExports((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const filtered = LESSONS.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))

  const doneCount = (l) => l.stages.filter(Boolean).length
  const pct = (l) => `${(doneCount(l) / 4) * 100}%`

  return (
    <StageLayout currentStage={null}>
      <div className="grid w-full min-w-0 animate-lib-rise grid-cols-1 gap-4 pb-12 md:gap-6 lg:grid-cols-[minmax(0,390px)_1fr] lg:gap-8">
        <aside className="flex min-w-0 flex-col gap-3.5">
          <div className="flex items-start justify-between gap-2.5">
            <div>
              <div className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[1.5px] text-mml-teal">My Library</div>
              <h1 className="font-display text-[clamp(22px,2.5vw,30px)] font-normal leading-tight tracking-tight text-white">
                Your <em className="text-mml-teal">Lessons.</em>
              </h1>
            </div>
            <div className="mt-1.5 flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border-none bg-mml-teal px-3 py-1.5 font-sans text-[12.5px] font-semibold text-mml-navy transition-colors hover:brightness-110"
                onClick={() => router.push('/lesson/stage1')}
              >
                <Plus size={12} /> New
              </button>
              <div className="flex overflow-hidden rounded-lg border border-white/10 bg-mml-navy-mid">
                <button
                  type="button"
                  className={cn(
                    'flex h-[31px] w-[33px] items-center justify-center border-none bg-transparent text-white transition-colors',
                    view === 'list' && 'bg-mml-teal/10 text-mml-teal',
                  )}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <List size={13} />
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex h-[31px] w-[33px] items-center justify-center border-none bg-transparent text-white transition-colors',
                    view === 'grid' && 'bg-mml-teal/10 text-mml-teal',
                  )}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            <input
              className="w-full rounded-lg border border-white/10 bg-mml-navy-mid py-2.5 pl-8 pr-3 font-sans text-[13px] text-white outline-none transition-colors placeholder:text-white focus:border-mml-teal focus:bg-mml-teal/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your lessons…"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition-colors',
                  tab === t
                    ? 'border-mml-teal bg-mml-teal/10 font-semibold text-mml-teal'
                    : 'border-white/10 bg-transparent text-white hover:border-white hover:text-white',
                )}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11.5px] font-light text-white">
              <BookOpen size={11} /> {filtered.length} lesson{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className={cn('flex flex-col gap-1.5', view === 'grid' && 'grid grid-cols-2 gap-2 max-md:grid-cols-1')}>
            {filtered.map((l) => (
              <button
                key={l.id}
                type="button"
                className={cn(
                  'relative flex w-full cursor-pointer items-start gap-2.5 rounded-[13px] border border-white/10 bg-mml-navy-card p-3 pl-4 text-left transition-all',
                  'hover:-translate-y-px hover:border-white/30 hover:shadow-md',
                  active?.id === l.id && 'border-mml-teal bg-mml-teal/10 shadow-[0_0_0_2px_rgba(125,211,232,0.14)]',
                )}
                onClick={() => setActive(l)}
              >
                <div className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[13px]" style={{ background: l.hue }} />

                <div
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border text-lg"
                  style={{ background: `${l.hue}1a`, borderColor: `${l.hue}33` }}
                >
                  {l.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 truncate text-[13.5px] font-semibold text-white">{l.title}</div>
                  <div className="mb-2 flex items-center gap-1 text-[11.5px] font-light text-white">
                    <span>{l.grade}</span>
                    <span className="opacity-35">·</span>
                    <span>{l.subject}</span>
                  </div>

                  <div className="mb-2 flex items-center gap-1.5">
                    <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full transition-[width]" style={{ width: pct(l), background: l.hue }} />
                    </div>
                    <span className="whitespace-nowrap font-mono text-[10px] text-white">{doneCount(l)}/4 stages</span>
                  </div>

                  <div className="flex flex-wrap gap-1 max-md:hidden">
                    {STAGE_NAMES.map((s, i) => (
                      <span
                        key={s}
                        className={cn(
                          'inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-mml-navy-mid px-1.5 py-0.5 text-[9.5px] font-semibold text-white',
                          l.stages[i] && 'border-mml-teal/30 bg-mml-teal/10 text-mml-teal',
                        )}
                      >
                        {l.stages[i] ? <Check size={7} /> : null}
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
                  <span className="flex items-center gap-0.5 whitespace-nowrap text-[10.5px] text-white">
                    <Clock size={9} /> {l.edited}
                  </span>
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-transparent bg-transparent text-white transition-colors hover:border-white/10 hover:bg-mml-navy-mid"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="sticky top-20 flex max-h-[calc(100vh-100px)] flex-col gap-3.5 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] max-lg:static max-lg:max-h-none [&::-webkit-scrollbar]:hidden">
          {active && (
            <>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-mml-navy-card shadow-sm">
                <div className="flex items-start gap-3 border-b border-white/10 bg-mml-navy-mid px-4 py-4">
                  <div
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[13px] border text-2xl"
                    style={{ background: `${active.hue}18`, borderColor: `${active.hue}30` }}
                  >
                    {active.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-0.5 truncate font-display text-[19px] font-normal tracking-tight text-white">{active.title}</h2>
                    <p className="mb-2.5 text-[12.5px] font-light text-white">
                      {active.grade} · {active.subject}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full transition-[width]" style={{ width: pct(active), background: active.hue }} />
                      </div>
                      <span className="whitespace-nowrap font-mono text-[10.5px] text-white">{doneCount(active)} of 4 stages complete</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  {STAGE_DETAILS.map((s, i) => {
                    const ok = active.stages[i]
                    return (
                      <div
                        key={s.title}
                        className={cn(
                          'flex items-center justify-between gap-2.5 border-b border-white/10 px-4 py-2.5 transition-colors last:border-b-0 hover:bg-mml-navy-mid/50',
                          !ok && 'opacity-50',
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <div
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[10px] font-bold text-white',
                              ok ? 'border-mml-teal bg-mml-teal text-white' : 'border-white/15 bg-mml-navy-mid',
                            )}
                          >
                            {ok ? <Check size={9} /> : <span>{i + 1}</span>}
                          </div>
                          <span className="text-[15px]">{s.icon}</span>
                          <div className="min-w-0">
                            <div className="mb-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-white">
                              {s.title}
                              {ok && <span className="rounded-full border border-mml-teal/30 bg-mml-teal/10 px-1.5 py-0.5 text-[9.5px] font-bold text-mml-teal">Done</span>}
                            </div>
                            <div className="text-[11px] font-light text-white">{ok ? s.desc : 'Not Yet Generated'}</div>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {ok ? (
                            <>
                              <button type="button" className="rounded-md border border-white/10 bg-mml-navy-mid px-2.5 py-1 text-[11.5px] font-semibold text-white transition-colors hover:border-mml-teal hover:bg-mml-teal/10 hover:text-mml-teal">
                                View
                              </button>
                              <button type="button" className="rounded-md border border-white/10 bg-mml-navy-mid px-1.5 py-1 text-white hover:border-mml-teal hover:text-mml-teal">
                                <ChevronDown size={11} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="rounded-md border border-mml-teal bg-mml-teal px-2.5 py-1 text-[11.5px] font-semibold text-mml-navy transition-colors hover:bg-mml-teal-dark"
                              onClick={() => router.push(`/lesson/stage${i + 1}`)}
                            >
                              Generate
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 border-t border-white/10 bg-transparent py-2.5 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-mml-teal/10 hover:text-mml-teal"
                >
                  <Download size={13} /> Download All Stages
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-mml-navy-card shadow-sm">
                <div className="flex items-center justify-between border-b border-white/10 bg-mml-navy-mid px-4 py-3">
                  <span className="text-[13px] font-semibold text-white">Export Question Types</span>
                  <span className="rounded-full border border-mml-teal/30 bg-mml-teal/10 px-2 py-0.5 text-[10.5px] font-bold text-mml-teal">{exports.length} selected</span>
                </div>
                <div className="flex flex-col">
                  {EXPORT_TYPES.map((qt) => (
                    <div
                      key={qt.id}
                      className={cn(
                        'flex items-center gap-2.5 border-b border-white/10 px-4 py-2.5 transition-colors last:border-b-0',
                        exports.includes(qt.id) && 'bg-mml-teal/10',
                      )}
                    >
                      <button
                        type="button"
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] border-white/10 bg-mml-navy-card text-white transition-colors',
                          exports.includes(qt.id) && 'border-mml-teal bg-mml-teal',
                        )}
                        onClick={() => toggleExport(qt.id)}
                      >
                        {exports.includes(qt.id) && <Check size={9} />}
                      </button>
                      <span className="flex-1 text-[13px] font-light text-white">{qt.label}</span>
                      <div className="flex gap-1">
                        <button type="button" className="rounded-md border border-white/10 bg-mml-navy-mid px-2.5 py-1 text-[11.5px] font-semibold text-white hover:border-mml-teal hover:text-mml-teal">
                          View & Export
                        </button>
                        <button type="button" className="rounded-md border border-white/10 bg-mml-navy-mid px-1.5 py-1 text-white hover:border-mml-teal">
                          <ChevronDown size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-white/10 bg-mml-navy-mid px-4 py-2.5">
                  <button type="button" className="flex-1 rounded-lg border border-white/10 bg-transparent py-2 text-[13px] font-semibold text-white transition-colors hover:border-mml-teal hover:text-mml-teal">
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="flex-[2] flex items-center justify-center gap-1.5 rounded-lg border-none bg-mml-teal py-2 font-sans text-[13px] font-semibold text-mml-navy transition-colors hover:bg-mml-teal-dark"
                    onClick={() => router.push('/lesson/stage1')}
                  >
                    <Sparkles size={12} /> Generate with AI
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-mml-navy-card shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-white/10 bg-mml-navy-mid px-4 py-3">
                  <div className="relative flex h-[30px] w-[30px] shrink-0 overflow-hidden rounded-full border border-mml-teal/25 bg-mml-navy-mid">
                    <AylaIcon width={30} height={30} alt="" className="h-full w-full" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-mml-navy-mid bg-green-500" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">Ask Ayla</div>
                    <div className="text-[10.5px] text-white">● Always context-aware</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 p-2.5">
                  {['Adjust Question Difficulty', 'Add Higher-Order Thinking', 'Include Images or Diagrams'].map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded-lg border border-white/10 bg-mml-navy-mid px-3 py-2 text-left font-sans text-[12.5px] font-normal text-white transition-colors hover:border-mml-teal hover:bg-mml-teal/10 hover:text-mml-teal"
                    >
                      + {h}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </StageLayout>
  )
}
