'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Edit3, Plus } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import StageLayout from '../components/StageLayout'

const SLIDES = [
  { id: 1, title: 'Title Slide', type: 'title', active: true },
  { id: 2, title: 'Introduction', type: 'content' },
  { id: 3, title: 'What is an Ecosystem?', type: 'content' },
  { id: 4, title: 'Components of Ecosystem', type: 'content' },
  { id: 5, title: 'Producers', type: 'content' },
  { id: 6, title: 'Consumers', type: 'content' },
  { id: 7, title: 'Visualization', type: 'visual' },
  { id: 8, title: 'Wrap-Up', type: 'content' },
]

const SPEAKER_NOTES = `Today, we are going to explore the fascinating world of ecosystems. We will learn what ecosystems are, why they are so important. When you think of a place where plants grow, animals roam and insects move; write one phrase on a card. As a class, share these phrases. I have suggested that you can begin by pointing to the poster of a local ecosystem in the classroom. I'm so happy that you can be here as a part of this journey!`

export default function Stage2Page() {
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)
  const [notes, setNotes] = useState(SPEAKER_NOTES)

  return (
    <StageLayout currentStage={2}>
      <div className="w-full min-w-0 animate-fade-in-up">
        <div className="mb-7">
          <p className="section-label">Stage 2 of 4</p>
          <h2 className="my-1.5 font-display text-[clamp(22px,3vw,30px)] font-bold">
            Build <span className="text-mml-teal">Presentation</span> & Notes
          </h2>
          <p className="text-sm text-white">Review your AI-generated slides. Customize content and add speaker notes.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-mml border border-white/[0.06] bg-mml-navy-card max-md:max-h-[200px] lg:max-h-none">
            <div className="border-b border-white/[0.06] p-4">
              <h3 className="mb-2 text-sm font-semibold">Slide Thumbnails</h3>
              <span className="tag tag-teal">Exploring Ecosystems · Grade 9</span>
            </div>
            <div className="flex max-h-[500px] flex-col gap-1 overflow-y-auto p-2 max-md:max-h-none max-md:flex-row max-md:overflow-x-auto max-md:overflow-y-hidden">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className={cn(
                    'flex items-center gap-2 rounded-lg border border-transparent bg-transparent p-2 text-left text-xs text-white transition-all max-md:w-20 max-md:flex-col',
                    'hover:bg-white/[0.05] hover:text-white',
                    i === activeSlide && 'border-[var(--border)] bg-mml-teal/10 text-white',
                  )}
                  onClick={() => setActiveSlide(i)}
                >
                  <div className="w-3.5 shrink-0 text-[10px] text-white">{i + 1}</div>
                  <div className="h-8 w-12 shrink-0 overflow-hidden rounded bg-mml-navy-light">
                    {i === 0 ? (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mml-teal-dark to-mml-navy-mid text-[6px] font-semibold text-white">
                        <span>Title Slide</span>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-center gap-0.5 p-1">
                        <div className="h-0.5 w-full rounded-sm bg-mml-muted" />
                        <div className="h-0.5 w-[60%] rounded-sm bg-mml-muted" />
                        <div className="h-0.5 w-full rounded-sm bg-mml-muted" />
                      </div>
                    )}
                  </div>
                  <span className="flex-1 text-[11px] max-md:text-center">{slide.title}</span>
                </button>
              ))}
              <button
                type="button"
                className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-transparent py-2 text-xs text-mml-teal transition-colors hover:bg-mml-teal/5"
              >
                <Plus size={14} /> Add Slide
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white">
                Slide {activeSlide + 1} of {SLIDES.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-mml-navy-card text-white transition-colors hover:border-mml-teal hover:text-mml-teal"
                  onClick={() => setActiveSlide((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-mml-navy-card text-white transition-colors hover:border-mml-teal hover:text-mml-teal"
                  onClick={() => setActiveSlide((i) => Math.min(SLIDES.length - 1, i + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="card aspect-video overflow-hidden p-0">
              <div className="flex h-full w-full items-center justify-center bg-mml-navy-light">
                {activeSlide === 0 ? (
                  <div className="relative w-full px-8 py-8 text-center">
                    <div className="mb-2 inline-block rounded-full border border-[var(--border)] bg-mml-teal/20 px-3 py-1 text-[11px] text-mml-teal">
                      Exploring Ecosystems
                    </div>
                    <h2 className="my-3 font-display text-[clamp(18px,3vw,28px)] font-bold text-mml-teal-light">
                      Exploring Ecosystems
                    </h2>
                    <p className="text-sm text-white">Per Grade 9</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-mml-teal to-mml-purple" />
                  </div>
                ) : (
                  <div className="w-full px-7 py-7 text-left">
                    <h3 className="mb-4 font-display text-xl font-bold text-mml-teal-light">{SLIDES[activeSlide]?.title}</h3>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex gap-2.5 text-[13px] leading-relaxed text-white">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mml-teal" />
                        An ecosystem is a community of living organisms interacting with their environment.
                      </div>
                      <div className="flex gap-2.5 text-[13px] leading-relaxed text-white">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mml-teal" />
                        It includes both biotic (living) and abiotic (non-living) components.
                      </div>
                      <div className="flex gap-2.5 text-[13px] leading-relaxed text-white">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mml-teal" />
                        Examples: forests, oceans, deserts, and grasslands.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
                  <Edit3 size={13} /> Speaker Notes
                </span>
                <span className="tag tag-teal">AI Suggested</span>
              </div>
              <textarea
                className="w-full resize-none rounded-lg border border-white/[0.06] bg-mml-navy-mid p-3 font-sans text-[13px] leading-relaxed text-white outline-none transition-colors focus:border-mml-teal"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="btn-ghost" onClick={() => router.push('/lesson/stage1')}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex flex-wrap items-center gap-2.5">
            <button type="button" className="btn-outline">
              <Download size={14} /> Download
            </button>
            <button type="button" className="btn-ghost">
              Customize Slides
            </button>
            <button type="button" className="btn-primary" onClick={() => router.push('/lesson/stage3')}>
              Use & Continue <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </StageLayout>
  )
}


