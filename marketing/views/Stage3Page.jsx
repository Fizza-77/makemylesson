'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Zap, FileText, Ticket } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import StageLayout from '../components/StageLayout'

const ASSESSMENT_TYPES = [
  { id: 'quick', icon: <Zap size={16} />, label: 'Quick Check', tag: 'FREE', desc: 'Short quiz designed to build understanding quickly', color: 'teal' },
  { id: 'worksheet', icon: <FileText size={16} />, label: 'Practice Worksheet', tag: 'PRO', desc: 'Deep practice & focus on skills', color: 'purple' },
  { id: 'exit', icon: <Ticket size={16} />, label: 'Exit Ticket', tag: 'FREE', desc: '1-3 closing questions that check understanding', color: 'teal' },
]

const QUESTION_TYPES = [
  { id: 'mc', label: 'Multiple Choice', tag: null },
  { id: 'tf', label: 'True/False', tag: 'PRO' },
  { id: 'fill', label: 'Fill in the Blanks', tag: 'PRO' },
  { id: 'short', label: 'Short Answer', tag: 'PRO' },
]

export default function Stage3Page() {
  const router = useRouter()
  const [assessType, setAssessType] = useState('quick')
  const [selectedQTypes, setSelectedQTypes] = useState(['mc'])
  const [numQ, setNumQ] = useState(5)
  const [time, setTime] = useState(20)
  const [previewVisible, setPreviewVisible] = useState(false)

  const toggleQType = (id) => {
    setSelectedQTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleGenerate = () => setPreviewVisible(true)

  return (
    <StageLayout currentStage={3}>
      <div className="w-full min-w-0 animate-fade-in-up">
        <div className="mb-7">
          <p className="section-label">Stage 3 of 4</p>
          <h2 className="my-1.5 font-display text-[clamp(22px,3vw,30px)] font-bold">
            Create <span className="text-mml-teal">Formative</span> Assessment
          </h2>
          <p className="text-sm text-white">Generate AI-powered assessments that align to your lesson objectives.</p>
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
                {ASSESSMENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-[10px] border-[1.5px] border-white/[0.06] bg-mml-navy-mid p-3.5 text-left text-white transition-all',
                      'hover:border-[var(--border)]',
                      assessType === t.id && 'border-mml-teal bg-mml-teal/10',
                    )}
                    onClick={() => setAssessType(t.id)}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mml-teal/10 text-mml-teal">{t.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 text-sm font-semibold">{t.label}</div>
                      <div className="text-xs text-white">{t.desc}</div>
                    </div>
                    <span className={cn('tag shrink-0', t.tag === 'PRO' ? 'tag-purple' : 'tag-teal')}>{t.tag}</span>
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
                    {q.tag && (
                      <span className="tag tag-purple ml-auto">{q.tag}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mml-teal to-mml-teal-dark text-[13px] font-bold text-mml-navy">
                  3
                </div>
                <h3 className="text-[15px] font-semibold text-white">Configure</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="text-[13px] text-white">Number of Questions</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 5, 10].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={cn(
                          'h-9 w-9 rounded-lg border border-white/[0.06] bg-mml-navy-mid text-[13px] font-semibold text-white transition-colors',
                          'hover:border-[var(--border)] hover:text-white',
                          numQ === n && 'border-mml-teal bg-gradient-to-br from-mml-teal to-mml-teal-dark text-mml-navy',
                        )}
                        onClick={() => setNumQ(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="text-[13px] text-white">Time (minutes)</label>
                  <div className="flex gap-1.5">
                    {[15, 20, 30, 45].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={cn(
                          'h-9 w-9 rounded-lg border border-white/[0.06] bg-mml-navy-mid text-[13px] font-semibold text-white transition-colors',
                          'hover:border-[var(--border)] hover:text-white',
                          time === t && 'border-mml-teal bg-gradient-to-br from-mml-teal to-mml-teal-dark text-mml-navy',
                        )}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="btn-primary w-full justify-center py-3.5" onClick={handleGenerate}>
              <Zap size={15} /> Generate Worksheet
            </button>
          </div>

          <div className="lg:sticky lg:top-5">
            {!previewVisible ? (
              <div className="card flex min-h-[300px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <div className="text-[40px]">📋</div>
                <h3 className="text-base font-semibold text-white">Worksheet Preview</h3>
                <p className="text-[13px] text-white">Configure your assessment and click Generate to see a preview.</p>
              </div>
            ) : (
              <div className="card animate-fade-in-up p-5">
                <div className="mb-4">
                  <span className="tag tag-green">Preview of Generated Worksheet</span>
                </div>
                <div>
                  <h4 className="mb-1.5 text-[15px] font-semibold text-white">Ecosystems Quick Check</h4>
                  <p className="mb-3.5 text-[13px] text-white">Why is water essential for ecosystems?</p>
                  <div className="flex flex-col gap-2">
                    {['It provides energy for plants', 'It acts as a transport medium', 'It attracts animals to the area', 'It is needed for decomposition'].map((opt, i) => (
                      <div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-mml-navy-mid px-3 py-2.5 text-[13px]">
                        <div
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/[0.06] text-[11px] font-bold',
                            i === 1 && 'border-mml-teal bg-mml-teal/15 text-mml-teal',
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn-primary mt-4 w-full justify-center">
                    Generate Worksheet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" className="btn-ghost" onClick={() => router.push('/lesson/stage2')}>
            <ArrowLeft size={15} /> Back
          </button>
          <button type="button" className="btn-primary" onClick={() => router.push('/lesson/stage4')}>
            Use & Continue <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </StageLayout>
  )
}


