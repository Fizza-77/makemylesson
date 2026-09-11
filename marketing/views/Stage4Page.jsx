'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Sparkles, FileText, Zap } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import StageLayout from '../components/StageLayout'

const QUIZ_TYPES = [
  { id: 'quiz', label: 'Quiz', tag: 'FREE', desc: '10 multiple questions Test basic knowledge', icon: <Zap size={16} /> },
  { id: 'fulltest', label: 'Full Test', tag: 'PREMIUM', desc: 'Comprehensive can test all knowledge', icon: <FileText size={16} /> },
  { id: 'exit', label: 'Exit Ticket', tag: 'FREE', desc: 'Test student understanding at close of lesson', icon: <Check size={16} /> },
]

const QUESTION_TYPES = [
  { id: 'mc', label: 'Multiple Choice', tag: null },
  { id: 'tf', label: 'True/False', tag: 'PREMIUM' },
  { id: 'fill', label: 'Fill in the Blanks', tag: 'PREMIUM' },
  { id: 'short', label: 'Short Answer', tag: 'PREMIUM' },
]

export default function Stage4Page() {
  const router = useRouter()
  const [quizType, setQuizType] = useState('quiz')
  const [selectedQTypes, setSelectedQTypes] = useState(['mc'])
  const [previewVisible, setPreviewVisible] = useState(false)

  const toggleQType = (id) => {
    setSelectedQTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <StageLayout currentStage={4}>
      <div className="w-full min-w-0 animate-fade-in-up">
        <div className="mb-7">
          <p className="section-label">Stage 4 of 4</p>
          <h2 className="my-1.5 font-display text-[clamp(22px,3vw,30px)] font-bold">
            Choose <span className="text-mml-teal">Quiz</span> or Test
          </h2>
          <p className="text-sm text-white">Generate a comprehensive quiz or test to assess student understanding.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mml-teal to-mml-teal-dark text-[13px] font-bold text-mml-navy">
                  1
                </div>
                <h3 className="text-[15px] font-semibold text-white">Choose Assessment Type</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {QUIZ_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={cn(
                      'relative flex cursor-pointer items-center gap-3 rounded-[10px] border-[1.5px] border-white/[0.06] bg-mml-navy-mid p-3.5 text-left text-white transition-all',
                      'hover:border-[var(--border)]',
                      quizType === t.id && 'border-mml-teal bg-mml-teal/10',
                    )}
                    onClick={() => setQuizType(t.id)}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mml-teal/10 text-mml-teal">{t.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 text-sm font-semibold">{t.label}</div>
                      <div className="text-xs text-white">{t.desc}</div>
                    </div>
                    <span className={cn('tag shrink-0', t.tag === 'PREMIUM' ? 'tag-premium' : 'tag-teal')}>{t.tag}</span>
                    {quizType === t.id && (
                      <div className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-mml-teal text-mml-navy">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mml-teal to-mml-teal-dark text-[13px] font-bold text-mml-navy">
                  2
                </div>
                <h3 className="text-[15px] font-semibold text-white">Select Question Types</h3>
              </div>
              <div className="flex flex-col gap-2">
                {QUESTION_TYPES.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/[0.06] bg-mml-navy-mid px-3.5 py-3 text-left text-[13px] text-white transition-all',
                      'hover:border-[var(--border)] hover:text-white',
                      selectedQTypes.includes(q.id) && 'border-mml-teal text-white',
                    )}
                    onClick={() => toggleQType(q.id)}
                  >
                    <div
                      className={cn(
                        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-[1.5px] border-white/[0.06] transition-colors',
                        selectedQTypes.includes(q.id) && 'border-mml-teal bg-mml-teal text-mml-navy',
                      )}
                    >
                      {selectedQTypes.includes(q.id) && <Check size={10} />}
                    </div>
                    <span>{q.label}</span>
                    {q.tag && <span className="tag tag-premium ml-auto">{q.tag}</span>}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="btn-primary w-full justify-center py-3.5" onClick={() => setPreviewVisible(true)}>
              <Sparkles size={15} /> Generate Quiz
            </button>
          </div>

          <div className="lg:sticky lg:top-5">
            {!previewVisible ? (
              <div className="card flex min-h-[300px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <div className="text-[40px]">🎯</div>
                <h3 className="text-base font-semibold text-white">Quiz Preview</h3>
                <p className="text-[13px] text-white">Configure your quiz and click Generate to see a preview here.</p>
              </div>
            ) : (
              <div className="card animate-fade-in-up p-5">
                <div className="mb-4">
                  <span className="tag tag-teal">Preview of Generated Quiz</span>
                </div>
                <div>
                  <h4 className="mb-3.5 text-[15px] font-semibold text-white">Ecosystems Quiz</h4>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="mb-2.5 text-[13px] font-semibold text-white">Q1. Multiple Choice Questions;</p>
                      <div className="flex flex-col gap-1.5">
                        {[
                          'Option A – Producers create their own food',
                          'Option B – Consumers eat producers',
                          'Option C – Decomposers break down matter',
                          'Option D – All of the above',
                        ].map((opt, i) => (
                          <div
                            key={i}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border border-white/[0.06] bg-mml-navy-mid px-3 py-2 text-xs',
                              i === 3 && 'border-mml-teal/30 bg-mml-teal/10',
                            )}
                          >
                            <div
                              className={cn(
                                'h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-white/[0.06]',
                                i === 3 && 'border-mml-teal bg-mml-teal',
                              )}
                            />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button type="button" className="btn-primary mt-4 w-full justify-center">
                    Generate Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" className="btn-ghost" onClick={() => router.push('/lesson/stage3')}>
            <ArrowLeft size={15} /> Back
          </button>
          <button type="button" className="btn-primary" onClick={() => router.push('/library')}>
            Save to Library <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </StageLayout>
  )
}


