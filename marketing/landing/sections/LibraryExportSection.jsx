'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  Check,
  ChevronDown,
  ClipboardList,
  FileCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  Presentation,
  Printer,
  Search,
  Star,
  Users,
} from 'lucide-react'

import { Reveal } from '../shared'
import { containerGutter } from '@marketing/components/layout/Container'

const SPRING = { type: 'spring', stiffness: 300, damping: 25 }

const EXPORT_OPTIONS = [
  { id: 'pdf', label: 'PDF', icon: FileText, tone: 'default' },
  { id: 'docx', label: 'DOCX', icon: FileText, tone: 'default' },
  { id: 'pptx', label: 'PPTX', icon: Presentation, tone: 'default' },
  { id: 'classroom', label: 'Google Classroom', icon: GraduationCap, tone: 'classroom' },
  { id: 'teams', label: 'Microsoft Teams', icon: Users, tone: 'teams' },
  { id: 'print', label: 'Print', icon: Printer, tone: 'default' },
  { id: 'zip', label: 'ZIP Download', icon: Archive, tone: 'zip' },
]

const FILTER_TAGS = ['All', 'Favourites', 'Science', 'History', 'Maths']

const FOLDERS = [
  { label: 'All Lessons', count: 24, active: true },
  { label: 'Favourites', count: 6, icon: Star },
  { label: 'Science', count: 9 },
  { label: 'History', count: 5 },
  { label: 'Maths', count: 7 },
]

const LIBRARY_PACKS = [
  {
    id: 'ecosystems',
    title: 'Ecosystems & Food Chains',
    meta: 'Science · Year 8 · Stage 1–4',
    fav: true,
    icon: ClipboardList,
    tone: 'science',
  },
  {
    id: 'ww2',
    title: 'World War II Causes',
    meta: 'History · Year 9 · Complete pack',
    fav: false,
    icon: FileText,
    tone: 'history',
  },
  {
    id: 'quadratics',
    title: 'Quadratic Equations',
    meta: 'Maths · Year 10 · Stage 2–3',
    fav: true,
    icon: Presentation,
    tone: 'maths',
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis Deep Dive',
    meta: 'Biology · Year 8 · Stage 1–2',
    fav: false,
    icon: FileCheck,
    tone: 'science',
  },
]

function ExportButton({ option, active, onEnter, onLeave, index }) {
  const Icon = option.icon

  return (
    <motion.li
      className="library-export-item"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING, delay: index * 0.05 }}
    >
      <motion.button
        type="button"
        className={[
          'library-export-btn',
          option.tone !== 'default' ? `library-export-btn--${option.tone}` : '',
          active ? 'library-export-btn--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        aria-pressed={active}
        animate={{
          y: active ? -4 : 0,
          scale: active ? 1.03 : 1,
        }}
        transition={SPRING}
      >
        <span className="library-export-btn-icon" aria-hidden>
          <Icon size={16} strokeWidth={2} />
        </span>
        {option.label}
      </motion.button>
    </motion.li>
  )
}

function LibraryMockup({ activeExport }) {
  const ExportIcon = activeExport?.icon ?? FileText

  return (
    <div className="library-mockup-shell">
      <div className="library-mockup-glow" aria-hidden />
      <motion.div
        className="library-mockup"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ ...SPRING, delay: 0.08 }}
      >
        <div className="library-mockup-top">
          <div>
            <p className="library-mockup-eyebrow">My Library</p>
            <h3 className="library-mockup-title">Saved Teaching Packs</h3>
          </div>
          <button type="button" className="library-mockup-export-menu" tabIndex={-1} aria-hidden>
            Export
            <ChevronDown size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="library-mockup-search">
          <Search size={15} strokeWidth={2} aria-hidden />
          <span>Search lessons, topics, curriculum…</span>
        </div>

        <div className="library-mockup-tags" aria-hidden>
          {FILTER_TAGS.map((tag, i) => (
            <span key={tag} className={`library-mockup-tag${i === 0 ? ' library-mockup-tag--on' : ''}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="library-mockup-body">
          <aside className="library-mockup-folders" aria-hidden>
            {FOLDERS.map((folder) => (
              <div
                key={folder.label}
                className={`library-mockup-folder${folder.active ? ' library-mockup-folder--active' : ''}`}
              >
                {folder.icon ? (
                  <folder.icon size={13} strokeWidth={2} className="library-mockup-folder-star" />
                ) : (
                  <FolderOpen size={13} strokeWidth={2} />
                )}
                <span>{folder.label}</span>
                <span className="library-mockup-folder-count">{folder.count}</span>
              </div>
            ))}
          </aside>

          <ul className="library-mockup-packs" aria-label="Recent teaching packs">
            {LIBRARY_PACKS.map((pack, i) => {
              const PackIcon = pack.icon
              const highlighted = activeExport && i === 0

              return (
                <motion.li
                  key={pack.id}
                  className={[
                    'library-mockup-pack',
                    `library-mockup-pack--${pack.tone}`,
                    highlighted ? 'library-mockup-pack--highlight' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 4.5 + i * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.35,
                  }}
                >
                  <div className={`library-mockup-thumb library-mockup-thumb--${pack.tone}`}>
                    <PackIcon size={16} strokeWidth={2} aria-hidden />
                  </div>
                  <div className="library-mockup-pack-copy">
                    <span className="library-mockup-pack-title">{pack.title}</span>
                    <span className="library-mockup-pack-meta">{pack.meta}</span>
                  </div>
                  {pack.fav ? (
                    <Star size={14} strokeWidth={2} className="library-mockup-pack-star" aria-hidden />
                  ) : null}
                </motion.li>
              )
            })}
          </ul>
        </div>

        <AnimatePresence mode="wait">
          {activeExport ? (
            <motion.div
              key={activeExport.id}
              className="library-export-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden
            >
              <motion.div
                className="library-export-flow-doc"
                initial={{ x: 0, opacity: 1, scale: 1 }}
                animate={{ x: '118%', opacity: 0.85, scale: 0.9 }}
                transition={{ ...SPRING, duration: 0.55 }}
              >
                <FileText size={14} strokeWidth={2} />
                <span>Lesson Plan</span>
              </motion.div>
              <motion.div
                className="library-export-flow-arrow"
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ ...SPRING, delay: 0.12 }}
              >
                →
              </motion.div>
              <motion.div
                className={[
                  'library-export-flow-target',
                  activeExport.tone !== 'default' ? `library-export-flow-target--${activeExport.tone}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                initial={{ scale: 0.92, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...SPRING, delay: 0.18 }}
              >
                <ExportIcon size={15} strokeWidth={2} />
                <span>{activeExport.label}</span>
              </motion.div>
              <motion.div
                className="library-export-flow-check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...SPRING, delay: 0.38 }}
              >
                <Check size={14} strokeWidth={3} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function LibraryExportSection() {
  const [activeExport, setActiveExport] = useState(null)

  return (
    <section id="library-export" className="library-section library-section--showcase">
      <div className={`mx-auto w-full max-w-[1800px] ${containerGutter}`}>
        <div className="library-layout grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <Reveal className="library-mockup-col order-1 min-w-0 lg:order-2 lg:col-span-6">
            <LibraryMockup activeExport={activeExport} />
          </Reveal>

          <Reveal delay={80} className="library-copy-col order-2 min-w-0 lg:order-1 lg:col-span-6">
            <span className="section-eyebrow library-eyebrow">Library & export</span>
            <h2 className="library-headline">
              Every Teaching Pack Saved. Every Document Exportable. Everywhere You Teach.
            </h2>
            <p className="library-intro-body">
              Every pack saves to My Library with favourites, search, and filters built in. Export as PDF, DOCX, PPTX,
              or ZIP, or send straight to Google Classroom or Teams.
            </p>

            <ul className="library-export-grid" aria-label="Export destinations">
              {EXPORT_OPTIONS.map((option, i) => (
                <ExportButton
                  key={option.id}
                  option={option}
                  index={i}
                  active={activeExport?.id === option.id}
                  onEnter={() => setActiveExport(option)}
                  onLeave={() => setActiveExport((current) => (current?.id === option.id ? null : current))}
                />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
