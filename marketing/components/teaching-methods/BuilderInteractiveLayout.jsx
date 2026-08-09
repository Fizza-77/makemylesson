'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { BookOpen, Compass, GraduationCap, Lightbulb, Sparkles, Target } from 'lucide-react'
import { cn } from '@marketing/lib/cn'
import { builderStepTitle } from '@marketing/lib/teachingMethodLayout'

const SPRING = { type: 'spring', stiffness: 300, damping: 30 }

const CARD_ICONS = [Lightbulb, BookOpen, Target, Compass, Sparkles, GraduationCap]

function BuilderStepHeader({ step, expanded = false }) {
  const { Icon, title } = step

  return (
    <div className={cn('tm-builder-step-header', expanded && 'tm-builder-step-header--expanded')}>
      <div className="tm-builder-step-icon" aria-hidden>
        <Icon size={expanded ? 24 : 22} strokeWidth={2} />
      </div>
      <div className="tm-builder-step-copy">
        <h3 className="tm-builder-step-title">{title}</h3>
      </div>
    </div>
  )
}

function BuilderCompactCard({ step, onSelect, layoutId }) {
  return (
    <motion.button
      type="button"
      layout
      layoutId={layoutId}
      onClick={() => onSelect(step.id)}
      transition={SPRING}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-expanded={false}
      className="tm-builder-compact-card group"
    >
      <BuilderStepHeader step={step} />
      <span className="tm-builder-compact-cta">Expand</span>
    </motion.button>
  )
}

function BuilderExpandedPanel({ step, onCollapse }) {
  return (
    <motion.article
      layout
      layoutId={`tm-builder-card-${step.id}`}
      transition={SPRING}
      initial={{ opacity: 0.92, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className="tm-builder-expanded"
    >
      <button
        type="button"
        onClick={onCollapse}
        className="tm-builder-expanded-trigger"
        aria-label={`Collapse ${step.title}`}
      >
        <BuilderStepHeader step={step} expanded />
        <div className="tm-builder-expanded-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ ...SPRING, delay: 0.04 }}
            >
              <p className="tm-builder-expanded-text">{step.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </button>
    </motion.article>
  )
}

export default function BuilderInteractiveLayout({ section, sectionIndex = 0 }) {
  const [activeId, setActiveId] = useState(null)

  const steps = section.paragraphs.map((paragraph, index) => ({
    id: `${sectionIndex}-${index}`,
    Icon: CARD_ICONS[(sectionIndex + index) % CARD_ICONS.length],
    title: builderStepTitle(index),
    body: paragraph,
  }))

  const activeStep = steps.find((step) => step.id === activeId) ?? null
  const compactSteps = activeId ? steps.filter((step) => step.id !== activeId) : steps

  const handleSelect = (id) => {
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <LayoutGroup id={`tm-builder-${sectionIndex}`}>
      <div className="tm-builder-interactive">
        <AnimatePresence mode="popLayout">
          {activeStep ? (
            <BuilderExpandedPanel
              key={`expanded-${activeStep.id}`}
              step={activeStep}
              onCollapse={() => setActiveId(null)}
            />
          ) : null}
        </AnimatePresence>

        <motion.div
          layout
          transition={SPRING}
          className={cn(
            'tm-builder-grid',
            activeStep && 'tm-builder-grid--with-expanded',
            steps.length === 2 && 'tm-builder-grid--two',
            steps.length >= 3 && 'tm-builder-grid--three',
          )}
        >
          {compactSteps.map((step) => (
            <motion.div key={step.id} layout transition={SPRING} className="tm-builder-cell">
              <BuilderCompactCard
                step={step}
                onSelect={handleSelect}
                layoutId={`tm-builder-card-${step.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </LayoutGroup>
  )
}
