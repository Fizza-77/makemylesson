'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '../shared'

const SPRING = { type: 'spring', stiffness: 300, damping: 25 }

/** Teaching methods (order matches product). */
const METHOD_LABELS = [
  'General (Teacher-Led)',
  'Flipped Classroom',
  'Blended Learning',
  'Gamification',
  'Project-Based Learning',
  'Inquiry-Based Learning',
  'Collaborative Learning',
  'Personalised Learning',
  'Competency-Based Learning',
  'Experiential Learning',
  'Mindfulness & SEL',
  'Spaced Learning',
  'Service Learning',
  'Problem-Based Learning',
  'Crossover Learning',
  'Kinesthetic Learning',
]

const MAGNETIC_RADIUS = 190
const MAGNETIC_STRENGTH = 4.5

function magneticOffset(rect, pointer) {
  if (!pointer.active) return { x: 0, y: 0, pull: 0 }

  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = pointer.x - cx
  const dy = pointer.y - cy
  const distance = Math.hypot(dx, dy)

  if (distance > MAGNETIC_RADIUS || distance === 0) {
    return { x: 0, y: 0, pull: 0 }
  }

  const pull = 1 - distance / MAGNETIC_RADIUS
  const move = pull * MAGNETIC_STRENGTH

  return {
    x: (dx / distance) * move,
    y: (dy / distance) * move,
    pull,
  }
}

function MethodCard({ label, active, hovered, offset, onHover, onLeave, onSelect, setRef }) {
  const lift = hovered && !active ? -6 : 0
  const scale = active ? 1.04 : hovered ? 1.02 : 1
  const brightness = active ? 1.12 : 1 + offset.pull * 0.1

  return (
    <motion.li
      ref={setRef}
      layout
      className="methods-card-wrap"
      animate={{
        x: offset.x,
        y: offset.y + lift,
        scale,
        filter: `brightness(${brightness})`,
      }}
      transition={SPRING}
    >
      <button
        type="button"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onSelect}
        aria-pressed={active}
        className={['methods-card', active ? 'methods-card--active' : '', hovered ? 'methods-card--hover' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <span className="methods-card-label">{label}</span>
      </button>
    </motion.li>
  )
}

function MethodsInteractiveGrid({ labels }) {
  const gridRef = useRef(null)
  const cardRefs = useRef(new Map())
  const rafRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  const [spot, setSpot] = useState({ x: '50%', y: '50%', active: false })
  const [offsets, setOffsets] = useState(() =>
    Object.fromEntries(labels.map((label) => [label, { x: 0, y: 0, pull: 0 }]))
  )
  const [hovered, setHovered] = useState(null)
  const [active, setActive] = useState(null)

  const updateOffsets = useCallback(
    (nextPointer) => {
      const next = {}
      labels.forEach((label) => {
        const node = cardRefs.current.get(label)
        if (!node) {
          next[label] = { x: 0, y: 0, pull: 0 }
          return
        }
        next[label] = magneticOffset(node.getBoundingClientRect(), nextPointer)
      })
      setOffsets(next)
    },
    [labels]
  )

  const schedulePointerUpdate = useCallback(
    (nextPointer, spotX, spotY) => {
      pointerRef.current = nextPointer

      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const grid = gridRef.current
        if (grid) {
          grid.style.setProperty('--spot-x', `${spotX}px`)
          grid.style.setProperty('--spot-y', `${spotY}px`)
        }
        setSpot({ x: `${spotX}px`, y: `${spotY}px`, active: nextPointer.active })
        updateOffsets(nextPointer)
        rafRef.current = null
      })
    },
    [updateOffsets]
  )

  const handleMouseMove = (event) => {
    const grid = gridRef.current
    if (!grid) return

    const rect = grid.getBoundingClientRect()
    schedulePointerUpdate(
      { x: event.clientX, y: event.clientY, active: true },
      event.clientX - rect.left,
      event.clientY - rect.top
    )
  }

  const handleMouseLeave = () => {
    const grid = gridRef.current
    const centerX = grid ? grid.offsetWidth / 2 : 0
    const centerY = grid ? grid.offsetHeight / 2 : 0
    schedulePointerUpdate({ x: 0, y: 0, active: false }, centerX, centerY)
    setSpot({ x: '50%', y: '50%', active: false })
    setHovered(null)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={gridRef}
      className="methods-grid-interactive"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="methods-grid-spotlight" aria-hidden />
      {spot.active ? (
        <div
          className="methods-grid-glow"
          aria-hidden
          style={{ left: spot.x, top: spot.y }}
        />
      ) : null}

      <ul className="methods-grid methods-grid--interactive" aria-label="Teaching methods available in Make My Lesson">
        {labels.map((label) => (
          <MethodCard
            key={label}
            label={label}
            active={active === label}
            hovered={hovered === label}
            offset={offsets[label] ?? { x: 0, y: 0, pull: 0 }}
            onHover={() => setHovered(label)}
            onLeave={() => setHovered((current) => (current === label ? null : current))}
            onSelect={() => setActive((current) => (current === label ? null : label))}
            setRef={(node) => {
              if (node) cardRefs.current.set(label, node)
              else cardRefs.current.delete(label)
            }}
          />
        ))}
      </ul>
    </div>
  )
}

export default function MethodsSection() {
  return (
    <section id="teaching-methods" className="methods-section">
      <div className="W">
        <Reveal className="methods-intro-block">
          <span className="section-eyebrow methods-eyebrow">Teaching methods</span>
          <h2 className="methods-headline">16 Teaching Methods. Actually Embedded. Not Just Labelled.</h2>
          <p className="section-intro methods-intro">
            Your chosen method shapes every section of every document, not just a label on the plan. Inquiry-Based
            Learning builds around questions and discovery; Collaborative Learning adds structured pair and group work
            throughout.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <MethodsInteractiveGrid labels={METHOD_LABELS} />
        </Reveal>
      </div>
    </section>
  )
}
