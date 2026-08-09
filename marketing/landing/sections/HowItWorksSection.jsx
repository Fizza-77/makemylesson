'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ClipboardList, FileCheck, PencilLine, Presentation } from 'lucide-react'
import { Reveal } from '../shared'

const SPRING = { type: 'spring', stiffness: 300, damping: 30 }

const STAGES = [
  {
    id: 's1',
    num: '01',
    label: 'Plan',
    Icon: ClipboardList,
    title: 'Lesson Plan',
    preview: 'Curriculum-aligned plan with objectives, differentiation, and Bloom\'s Taxonomy built in.',
    cost: '1 credit · Standalone or foundation for all stages',
    twoDocs: null,
    paragraphs: [
      {
        kind: 'plain',
        text: "Enter your curriculum, year level, subject, topic, teaching method and lesson duration. Make My Lesson generates a fully structured lesson plan including learning objectives written in your curriculum's exact outcome language, a sequenced teaching structure, Bloom's Taxonomy alignment across all objectives, differentiation strategies for varied learner needs, a formative assessment check, and a homework task.",
      },
      {
        kind: 'strongThenRest',
        strong: 'This is not a template with blanks to fill in.',
        rest: ' It is a complete, curriculum-aligned, classroom-ready lesson plan written specifically for your route, your grade, and your topic.',
      },
    ],
    tags: [
      'Learning objectives',
      'Starter / Hook activity',
      'Main teaching sequence',
      "Bloom's Taxonomy alignment",
      'Differentiation strategies',
      'Assessment for learning',
      'Homework / Next step',
    ],
  },
  {
    id: 's2',
    num: '02',
    label: 'Present',
    Icon: Presentation,
    title: 'Classroom Presentation',
    preview: 'Duration-calibrated slide deck with speaker notes and curriculum-accurate content.',
    cost: '1 credit · Inherits context from Stage 1',
    twoDocs: null,
    paragraphs: [
      {
        kind: 'plain',
        text: 'Your lesson plan becomes a classroom-ready slide deck. Every slide performs a specific teaching job, not a generic summary. Slides include curriculum-accurate content, per-slide speaker notes, and AI-generated educational images where they have the highest learning value. Lesson duration drives slide count: a 45-minute lesson produces 9 slides, a 60-minute lesson produces 12.',
      },
      {
        kind: 'plain',
        text: 'Export directly to PPTX, PDF, Google Classroom, or Microsoft Teams. Present directly from the app.',
      },
    ],
    tags: [
      '6–12 slides (duration-calibrated)',
      'Per-slide speaker notes',
      'AI-generated educational images',
      '3 presentation styles',
      'PPTX export',
      'Google Classroom',
      'Microsoft Teams',
    ],
  },
  {
    id: 's3',
    num: '03',
    label: 'Practise',
    Icon: PencilLine,
    title: 'Classroom Activity',
    preview: 'Student activity sheet and teacher answer key, always generated together.',
    cost: '1 credit · Always two documents',
    twoDocs: 'Always two separate documents: student sheet + teacher answer key',
    paragraphs: [
      {
        kind: 'plain',
        text: 'Every Stage 3 generation always produces two separate documents: a student-facing activity sheet and a teacher answer key, always, without exception. Choose your activity format, question types from 17 options, and difficulty track. The activity is formative, differentiated, and fully aligned to the lesson objectives from Stage 1.',
      },
      {
        kind: 'plainStrong',
        text: 'No more building a worksheet and then separately writing the answer key. Both arrive together.',
      },
    ],
    tags: [
      'Student activity sheet',
      'Teacher answer key',
      '17 question types',
      'Quick Check / Practice Worksheet',
      'Exit Ticket / Guided Activity',
      'Support · Core · Stretch difficulty tracks',
    ],
  },
  {
    id: 's4',
    num: '04',
    label: 'Assess',
    Icon: FileCheck,
    title: 'Summative Assessment',
    preview: 'Assessment paper and mark scheme with mandatory Bloom\'s Taxonomy balancing.',
    cost: '1 credit · Always two documents',
    twoDocs: 'Always two separate documents: assessment paper + mark scheme',
    paragraphs: [
      {
        kind: 'plain',
        text: "A complete, curriculum-aligned assessment paper with a detailed teacher mark scheme, always two separate documents. Duration and mark range are your choice. Bloom's Taxonomy balancing is applied automatically to every assessment, so you avoid papers that only test recall or skip application.",
      },
      {
        kind: 'strongThenRest',
        strong: 'This is the stage that replaces the most time.',
        rest: ' Designing a proper assessment paper with a mark scheme from scratch typically takes a teacher 60–90 minutes. Make My Lesson generates both in minutes.',
      },
    ],
    tags: [
      'Student assessment paper',
      'Teacher mark scheme',
      "Mandatory Bloom's balance",
      '15 / 20 / 30 / 40 / 45 / 60 min options',
      '5–50 mark range',
      '5 question type families',
    ],
  },
]

function StageParagraph({ block, dark = false }) {
  const bodyClass = dark ? 'text-white/88' : 'text-[var(--body)]'
  const strongClass = dark ? 'text-white' : 'text-[var(--ink)]'

  if (block.kind === 'plain') {
    return <p className={`hiw-stage-text font-light ${bodyClass}`}>{block.text}</p>
  }
  if (block.kind === 'strongThenRest') {
    return (
      <p className={`hiw-stage-text font-light ${bodyClass}`}>
        <strong className={`font-semibold ${strongClass}`}>{block.strong}</strong>
        {block.rest}
      </p>
    )
  }
  if (block.kind === 'plainStrong') {
    return (
      <p className={`hiw-stage-text font-light ${bodyClass}`}>
        <strong className={`font-semibold ${strongClass}`}>{block.text}</strong>
      </p>
    )
  }
  return null
}

function StageFeatureBox({ stage, expanded = false }) {
  const { Icon, num, label, title, cost } = stage

  return (
    <div
      className={
        expanded
          ? 'hiw-stage-feature hiw-stage-feature--expanded flex h-full flex-col gap-3 border-gray-100 bg-[var(--bg2)] lg:shrink-0 lg:border-r'
          : 'hiw-stage-feature flex flex-col items-center gap-3 text-center'
      }
    >
      <div
        className={
          expanded
            ? 'flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(125,211,232,0.28)] bg-[rgba(125,211,232,0.1)] text-[var(--teal)] xl:h-14 xl:w-14'
            : 'flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(125,211,232,0.28)] bg-[rgba(125,211,232,0.1)] text-[var(--teal)] lg:h-12 lg:w-12 xl:h-[3.25rem] xl:w-[3.25rem]'
        }
      >
        <Icon size={expanded ? 24 : 22} strokeWidth={1.75} aria-hidden />
      </div>
      <div className={expanded ? 'space-y-1' : 'space-y-1.5'}>
        <span className="hiw-stage-label font-mono font-semibold uppercase text-[var(--teal)]">
          {num} · {label}
        </span>
        <h3
          className={
            expanded
              ? 'hiw-stage-title hiw-stage-title--expanded text-left font-semibold leading-snug tracking-tight text-[var(--ink)]'
              : 'hiw-stage-title font-semibold leading-snug text-[var(--ink)]'
          }
        >
          {title}
        </h3>
        {expanded ? (
          <p className="hiw-stage-cost text-left font-medium leading-snug text-[var(--muted)]">{cost}</p>
        ) : null}
      </div>
    </div>
  )
}

function StageCompactCard({ stage, isActive, onSelect, layoutId }) {
  const { preview } = stage

  return (
    <motion.button
      type="button"
      layout
      layoutId={layoutId}
      onClick={() => onSelect(stage.id)}
      transition={SPRING}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-expanded={isActive}
      className={[
        'hiw-compact-card group flex w-full flex-col rounded-2xl border bg-white text-left shadow-[var(--sh1)]',
        'transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]',
        isActive
          ? 'border-[rgba(125,211,232,0.55)] ring-2 ring-[rgba(125,211,232,0.2)]'
          : 'border-[var(--border)] hover:border-[rgba(125,211,232,0.45)] hover:shadow-[var(--sh2)]',
      ].join(' ')}
    >
      <StageFeatureBox stage={stage} />
      <p className="hiw-compact-preview mt-4 line-clamp-3 flex-1 text-[var(--muted)]">{preview}</p>
      <span className="hiw-compact-cta mt-4 font-semibold uppercase text-[var(--teal)] opacity-0 transition-opacity group-hover:opacity-100">
        {isActive ? 'Collapse' : 'Expand'}
      </span>
    </motion.button>
  )
}

function StageExpandedPanel({ stage, onCollapse, liftY }) {
  return (
    <motion.article
      layout
      layoutId={`hiw-card-${stage.id}`}
      transition={SPRING}
      initial={{ opacity: 0.92, y: liftY + 12 }}
      animate={{ opacity: 1, y: liftY }}
      exit={{ opacity: 0, y: liftY + 8, scale: 0.98 }}
      className="w-full overflow-hidden rounded-2xl border border-[rgba(125,211,232,0.42)] bg-white shadow-[var(--sh3)]"
    >
      <button
        type="button"
        onClick={onCollapse}
        className="flex w-full flex-col lg:flex-row lg:items-stretch"
        aria-label={`Collapse ${stage.title}`}
      >
        <StageFeatureBox stage={stage} expanded />
        <div className="hiw-expanded-panel flex flex-1 flex-col gap-4 border-t border-white/10 bg-[var(--navy)] text-left text-white lg:border-l lg:border-t-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ ...SPRING, delay: 0.04 }}
              className="space-y-4"
            >
              {stage.twoDocs ? (
                <div className="hiw-two-docs-badge inline-flex w-fit items-center rounded-full border border-[rgba(125,211,232,0.4)] bg-[rgba(125,211,232,0.12)] px-3 py-1.5 font-semibold leading-snug text-[var(--hero-sky,#7dd3e8)]">
                  {stage.twoDocs}
                </div>
              ) : null}
              <div className="space-y-3">
                {stage.paragraphs.map((block, j) => (
                  <StageParagraph key={j} block={block} dark />
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {stage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="hiw-stage-tag rounded-full border border-white/18 bg-white/10 px-2.5 py-1 font-medium text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </button>
    </motion.article>
  )
}

export default function HowItWorksSection() {
  const [activeId, setActiveId] = useState(null)
  const [liftY, setLiftY] = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const update = () => setLiftY(media.matches ? -24 : 0)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const activeStage = STAGES.find((stage) => stage.id === activeId) ?? null
  const compactStages = activeId ? STAGES.filter((stage) => stage.id !== activeId) : STAGES

  const handleSelect = (id) => {
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <section className="hiw" id="how-it-works">
      <div className="W">
        <Reveal className="hiw-intro">
          <span className="section-eyebrow">How it works</span>
          <h2 className="hiw-title-main">
            Four Stages. One Topic.
            <br />
            <em>Everything You Need.</em>
          </h2>
        </Reveal>

        <LayoutGroup id="hiw-stages">
          <div className="hiw-stage-interactive relative mx-auto w-full">
            <AnimatePresence mode="popLayout">
              {activeStage ? (
                <StageExpandedPanel
                  key={`expanded-${activeStage.id}`}
                  stage={activeStage}
                  onCollapse={() => setActiveId(null)}
                  liftY={liftY}
                />
              ) : null}
            </AnimatePresence>

            <motion.div
              layout
              transition={SPRING}
              className={[
                'hiw-stage-grid grid gap-4 sm:gap-5',
                activeStage
                  ? 'mt-8 justify-items-stretch sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6 xl:gap-8'
                  : 'mt-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8',
              ].join(' ')}
            >
              {compactStages.map((stage) => (
                <motion.div
                  key={stage.id}
                  layout
                  transition={SPRING}
                  className="hiw-stage-cell w-full min-w-0"
                >
                  <StageCompactCard
                    stage={stage}
                    isActive={activeId === stage.id}
                    onSelect={handleSelect}
                    layoutId={`hiw-card-${stage.id}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  )
}
