'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { TEACHING_METHOD_COLUMNS } from '@marketing/data/teachingMethods'

/** Short homepage blurbs — match the reference card copy where provided. */
const SHORT_BLURBS: Record<string, string> = {
  'general-teacher-led': 'Direct instruction: explain, model, guide practice.',
  'flipped-classroom': 'Content before class, application during it.',
  'blended-learning': 'Face-to-face and online learning in one connected sequence.',
  'spaced-learning': 'Revisit content at intervals with retrieval practice.',
  'inquiry-based-learning': 'Investigate the evidence before the explanation.',
  'project-based-learning': 'An extended project with a real final outcome.',
  'problem-based-learning': 'Solve real, complex problems to drive learning.',
  'service-learning': 'Connect curriculum to community service with reflection.',
  'collaborative-learning': 'Pair and group work with shared accountability.',
  gamification: 'Points, levels and challenges to lift motivation.',
  'kinesthetic-learning': 'Movement and hands-on tasks to deepen learning.',
  'crossover-learning': 'Connect classroom work with real-world learning.',
  'personalised-learning': 'Pace, path and materials fit each learner.',
  'competency-based-learning': 'Move on once mastery is shown.',
  'experiential-learning': 'Learn by doing with structured reflection.',
  'mindfulness-sel': 'Build emotional skills with SEL and mindfulness.',
}

const COLUMN_HEADINGS: Record<string, string> = {
  'structured-delivery': 'Structured Delivery',
  'inquiry-problem-solving': 'Inquiry & Problem Solving',
  'engagement-interaction': 'Engagement & Interaction',
  'learner-centred': 'Learner-Centred',
}

const PREVIEW_COUNT = 2

function MethodCard({ title, blurb }: { title: string; blurb: string }) {
  return (
    <article className="mml-tm-method-card">
      <h4 className="mml-tm-method-card-title">{title}</h4>
      <p className="mml-tm-method-card-blurb">{blurb}</p>
    </article>
  )
}

function MethodColumn({
  columnId,
  heading,
  methods,
}: {
  columnId: string
  heading: string
  methods: { slug: string; label: string }[]
}) {
  const [expanded, setExpanded] = useState(false)
  const preview = methods.slice(0, PREVIEW_COUNT)
  const extra = methods.slice(PREVIEW_COUNT)
  const canExpand = extra.length > 0
  const extraId = `mml-tm-col-extra-${columnId}`

  return (
    <div className="mml-tm-col">
      <h3 className="mml-tm-col-heading">{heading}</h3>
      <div className="mml-tm-col-cards">
        {preview.map((method) => (
          <MethodCard
            key={method.slug}
            title={method.label}
            blurb={SHORT_BLURBS[method.slug] ?? method.label}
          />
        ))}
        {canExpand ? (
          <div
            id={extraId}
            className={
              expanded
                ? 'mml-tm-col-extra mml-tm-col-extra--open'
                : 'mml-tm-col-extra'
            }
            aria-hidden={!expanded}
          >
            <div className="mml-tm-col-extra-inner">
              {extra.map((method) => (
                <MethodCard
                  key={method.slug}
                  title={method.label}
                  blurb={SHORT_BLURBS[method.slug] ?? method.label}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {canExpand ? (
        <button
          type="button"
          className="mml-tm-col-expand"
          aria-expanded={expanded}
          aria-controls={extraId}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="sr-only">
            {expanded ? `Show fewer ${heading} methods` : `Show more ${heading} methods`}
          </span>
          <ChevronDown
            size={18}
            strokeWidth={2.4}
            className={expanded ? 'mml-tm-col-expand-icon is-open' : 'mml-tm-col-expand-icon'}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  )
}

export default function TeachingMethodsSection() {
  return (
    <section className="mml-tm" id="teaching-methods" aria-labelledby="mml-tm-heading">
      <div className="mml-tm-inner">
        <p className="mml-tm-eyebrow">
          <span className="mml-tm-eyebrow-dots" aria-hidden>
            <span className="mml-tm-eyebrow-dot mml-tm-eyebrow-dot--teal" />
            <span className="mml-tm-eyebrow-dot mml-tm-eyebrow-dot--muted" />
          </span>
          TEACHING METHODS
        </p>

        <h2 id="mml-tm-heading" className="mml-tm-title">
          <span>
            16 Teaching Methods.{" "}
            <span className="mml-tm-title-accent">Actually</span>
          </span>
          <span className="mml-tm-title-accent">Embedded.</span>
          <span>Not Just Labelled.</span>
        </h2>

        <p className="mml-tm-sub">
          Your chosen method shapes every section of every document, not just a
          label on the plan.
        </p>

        <div className="mml-tm-panel" role="list">
          {TEACHING_METHOD_COLUMNS.map((column) => (
            <div key={column.id} className="mml-tm-panel-item" role="listitem">
              <MethodColumn
                columnId={column.id}
                heading={COLUMN_HEADINGS[column.id] ?? column.heading}
                methods={column.methods}
              />
            </div>
          ))}
        </div>

        <div className="mml-tm-banner">
          <p>
            One method, used throughout the whole teaching pack. The selected
            approach shapes the plan, presentation, student activities and
            assessment.
          </p>
          <Link href="/teaching-methods" className="mml-tm-explore">
            Explore Teaching Methods
          </Link>
        </div>
      </div>
    </section>
  )
}
