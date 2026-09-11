'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronDown, Info, ArrowRight, Check } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import StageLayout from '../components/StageLayout'

const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']
const SUBJECTS = ['Science','Math','English','History','Geography','Art','PE','Music']
const METHODS = ['Direct Instruction','Inquiry-Based','Project-Based','Flipped Classroom','Collaborative']
const DURATIONS = ['15 minutes','30 minutes','45 minutes','60 minutes','90 minutes']

const labelCls = 'text-[11px] font-semibold uppercase tracking-wide text-white'
const inputBase =
  'w-full rounded-lg border-[1.5px] border-white/[0.06] bg-mml-navy-mid py-2.5 pl-3 text-sm text-white outline-none transition-colors focus:border-mml-teal font-sans'

function SelectField({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <select
          className={`${inputBase} cursor-pointer appearance-none pr-9`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} className="bg-mml-navy-mid">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white" />
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      <input
        className={inputBase}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default function Stage1Page() {
  const router = useRouter()
  const [form, setForm] = useState({
    curriculum: 'US Common Core',
    grade: 'Grade 9',
    subject: 'Science',
    topic: 'The water cycle',
    method: 'Direct Instruction',
    duration: '45 minutes',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2200))
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <StageLayout currentStage={1}>
      <div className="grid animate-fade-in-up grid-cols-1 gap-7 max-[900px]:grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div>
          <div className="mb-5">
            <h2 className="mb-1.5 font-display text-[clamp(20px,2.5vw,26px)] font-extrabold text-white">
              Plan & <span className="text-mml-teal">Generate</span> Lesson
            </h2>
            <p className="text-sm text-white">
              Fill in your grade, subject and topic to generate a standards-aligned plan instantly.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-5 flex items-center justify-between rounded-[10px] border border-mml-teal/20 bg-mml-teal/[0.07] px-3.5 py-2.5">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-mml-teal">
                <Check size={12} />
                <span>US Common Core</span>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 border-none bg-transparent font-sans text-xs font-semibold text-white transition-colors hover:text-mml-teal"
              >
                Change <ChevronDown size={12} />
              </button>
            </div>

            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-white">Lesson Details</h3>
            <div className="mb-6 flex flex-col gap-3.5">
              <SelectField label="Grade" options={GRADES} value={form.grade} onChange={set('grade')} />
              <SelectField label="Subject" options={SUBJECTS} value={form.subject} onChange={set('subject')} />
              <InputField label="Topic" value={form.topic} onChange={set('topic')} placeholder="e.g. The water cycle" />
              <SelectField label="Method" options={METHODS} value={form.method} onChange={set('method')} />
              <SelectField label="Duration" options={DURATIONS} value={form.duration} onChange={set('duration')} />
            </div>

            <button
              type="button"
              className={cn(
                'mb-4 flex w-full items-center justify-center gap-2 rounded-full border-none py-3.5 font-sans text-[15px] font-bold text-white transition-all',
                'bg-gradient-to-br from-mml-teal to-mml-teal-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(125,211,232,0.35)]',
                generating && 'cursor-not-allowed opacity-80',
              )}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-mml-navy/30 border-t-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </button>

            {!generated && (
              <div className="flex gap-2.5 rounded-lg border border-mml-teal/15 bg-mml-teal/5 p-3 text-white">
                <Info size={14} className="mt-0.5 shrink-0 text-mml-teal" />
                <p className="text-[13px] leading-relaxed">
                  <strong>Tip:</strong> Fill in your grade, subject and topic to generate a standards-aligned lesson plan instantly using your curriculum.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          {!generated ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-mml border-2 border-dashed border-white/[0.06] bg-mml-navy-card p-12 text-center">
              <div className="text-[40px] opacity-50">✨</div>
              <h3 className="text-[17px] text-white">Your Lesson Plan</h3>
              <p className="max-w-[280px] text-sm text-white">
                Fill in the details and click &quot;Generate&quot; to create your complete lesson plan.
              </p>
            </div>
          ) : (
            <div className="card animate-scale-in p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-mml-teal/12 px-2.5 py-0.5 text-[11px] font-bold text-mml-teal">AI Generated</div>
                <h3 className="text-[17px] font-bold text-white">Lesson Summary</h3>
              </div>

              <div className="mb-5 flex gap-1 border-b border-white/[0.06]">
                {['Overview', 'Activities', 'Materials', 'Assess'].map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    className={cn(
                      'cursor-pointer rounded-t-md border-b-2 border-transparent bg-transparent px-3.5 py-2 font-sans text-[13px] font-semibold text-white transition-colors hover:text-white',
                      i === 0 && 'border-mml-teal bg-mml-teal/5 text-mml-teal',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <h4 className="mb-2.5 text-[15px] font-bold text-white">The Water Cycle – Grade 9 Science</h4>
                <p className="mb-5 text-sm leading-relaxed text-white">
                  In this lesson, students will explore the fascinating world of water movement on Earth. They&apos;ll understand evaporation, condensation, precipitation, and collection through collaborative activities and visual demonstrations. The lesson is structured to build conceptual understanding and then moves toward application and critical thinking.
                </p>

                <div className="mb-4">
                  <h5 className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-white">Learning Objectives</h5>
                  <ul className="flex list-none flex-col gap-2">
                    {[
                      'Explain the stages of the water cycle',
                      'Identify where water goes during evaporation',
                      'Connect weather patterns to the water cycle',
                      'Create a labeled diagram of the water cycle',
                    ].map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white">
                        <Check size={13} className="mt-0.5 shrink-0 text-mml-teal" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="badge badge-teal">NGSS MS-ESS2-4</span>
                  <span className="badge badge-teal">Common Core Lit</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3 border-t border-white/[0.06] pt-5">
                <button type="button" className="btn-secondary flex-1 justify-center">
                  ✏️ Customize
                </button>
                <button type="button" className="btn-primary flex-[2] justify-center" onClick={() => router.push('/lesson/stage2')}>
                  Use & Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StageLayout>
  )
}


