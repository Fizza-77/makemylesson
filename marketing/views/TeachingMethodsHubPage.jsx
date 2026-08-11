'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Folder, Library, Users } from 'lucide-react'
import { PageShell } from '@marketing/components/layout/Container'
import {
  ALL_TEACHING_METHODS,
  TEACHING_METHOD_COLUMNS,
  getTeachingMethodPath,
} from '@marketing/data/teachingMethods'
import { MML_APP } from '@marketing/lib/appUrls'
import { cn } from '@marketing/lib/cn'

const METHOD_PILLS = [
  { id: 'inquiry', label: 'Inquiry-Based' },
  { id: 'collaborative', label: 'Collaborative' },
  { id: 'gamification', label: 'Gamification' },
  { id: 'flipped', label: 'Flipped' },
  { id: 'teacher-led', label: 'General (Teacher-Led)' },
]

const STRUCTURES = {
  'teacher-led': {
    title: 'Lesson structure · General (Teacher-Led)',
    rows: [
      { tag: 'Starter', tone: 'teal', text: "Recap questions on yesterday's topic", time: "5'" },
      {
        tag: 'Teach',
        tone: 'navy',
        text: 'Direct instruction: the three stages, with board diagram',
        time: "20'",
      },
      {
        tag: 'Practice',
        tone: 'mint',
        text: 'Individual worksheet, teacher circulates',
        time: "15'",
      },
      { tag: 'Plenary', tone: 'soft', text: 'Whole-class Q&A and exit ticket', time: "5'" },
    ],
  },
  inquiry: {
    title: 'Lesson structure · Inquiry-Based',
    rows: [
      { tag: 'Hook', tone: 'teal', text: 'Pose a puzzling water-cycle question', time: "8'" },
      { tag: 'Explore', tone: 'navy', text: 'Groups investigate evaporation evidence', time: "18'" },
      { tag: 'Explain', tone: 'mint', text: 'Students present findings to class', time: "12'" },
      { tag: 'Apply', tone: 'soft', text: 'Design a mini water-cycle diagram', time: "7'" },
    ],
  },
  collaborative: {
    title: 'Lesson structure · Collaborative',
    rows: [
      { tag: 'Teams', tone: 'teal', text: 'Assign roles for water-cycle stations', time: "5'" },
      { tag: 'Build', tone: 'navy', text: 'Shared model of the three stages', time: "22'" },
      { tag: 'Share', tone: 'mint', text: 'Peer critique across groups', time: "12'" },
      { tag: 'Reflect', tone: 'soft', text: 'Exit ticket on team contributions', time: "6'" },
    ],
  },
  gamification: {
    title: 'Lesson structure · Gamification',
    rows: [
      { tag: 'Quest', tone: 'teal', text: 'Unlock the water-cycle map challenge', time: "6'" },
      { tag: 'Play', tone: 'navy', text: 'Stage races with retrieval checkpoints', time: "20'" },
      { tag: 'Boss', tone: 'mint', text: 'Team challenge: rebuild the cycle', time: "14'" },
      { tag: 'Reward', tone: 'soft', text: 'Badge + quick knowledge check', time: "5'" },
    ],
  },
  flipped: {
    title: 'Lesson structure · Flipped',
    rows: [
      { tag: 'Warm-up', tone: 'teal', text: 'Check pre-class video notes', time: "7'" },
      { tag: 'Apply', tone: 'navy', text: 'Practice diagrams with teacher coaching', time: "20'" },
      { tag: 'Deepen', tone: 'mint', text: 'Problem set on condensation cases', time: "13'" },
      { tag: 'Close', tone: 'soft', text: 'Peer teach one stage each', time: "5'" },
    ],
  },
}

const TAG_CLASS = {
  teal: 'bg-[#35BEBC] text-white',
  navy: 'bg-[#1A1E3A] text-white',
  mint: 'bg-[#9fd9d4] text-black',
  soft: 'bg-[#c5ebe8] text-black',
}

const SHORT_BLURB = {
  'general-teacher-led':
    'Classic direct instruction: the teacher explains, models and guides practice.',
  'flipped-classroom':
    'Students study new content before class; lesson time is used for application.',
  'blended-learning': 'A deliberate mix of face-to-face teaching and online activity.',
  'spaced-learning': 'Content is revisited in short spaced bursts with breaks between.',
  'inquiry-based-learning':
    'Students investigate questions and evidence before formal explanations.',
  'project-based-learning':
    'Learning is organised around an extended authentic project and final outcome.',
  'problem-based-learning':
    'Students begin with a realistic problem and identify what they need to learn.',
  'service-learning':
    'Curriculum goals are met through projects that serve a community need.',
  'collaborative-learning':
    'Structured pair and group work with shared accountability.',
  gamification: 'Points, levels and challenges are used to increase motivation.',
  'kinesthetic-learning':
    'Students learn through movement, manipulation and physical activity.',
  'crossover-learning':
    'Formal classroom learning is connected with informal experiences.',
  'personalised-learning':
    "Pace, path and materials adapt to each learner's level and needs.",
  'competency-based-learning':
    'Students progress when they demonstrate mastery of defined skills.',
  'experiential-learning':
    'Students learn through direct experience followed by reflection.',
  'mindfulness-sel': 'Social-emotional learning is woven into academic content.',
}

const PACK_BLURB = {
  'general-teacher-led':
    'In your pack: Tight I-do / we-do / you-do structure with frequent checking questions.',
  'flipped-classroom':
    'In your pack: Home-study material plus in-class application tasks are separated automatically.',
  'blended-learning':
    'In your pack: Digital and in-person segments are clearly identified inside the pack.',
  'spaced-learning':
    'In your pack: Input is organised into compressed bursts plus spaced review questions.',
  'inquiry-based-learning':
    'In your pack: A driving question opens the lesson; discovery comes before explanation.',
  'project-based-learning':
    'In your pack: Milestones, checkpoints and a deliverable are built into the sequence.',
  'problem-based-learning':
    'In your pack: The lesson opens with a scenario and content is released as required.',
  'service-learning':
    'In your pack: Community-linked tasks and reflection are tied to the objectives.',
  'collaborative-learning':
    'In your pack: Group roles, think-pair-share and peer review are embedded in each stage.',
  gamification:
    'In your pack: Activities become missions and the assessment can use a challenge ladder.',
  'kinesthetic-learning':
    'In your pack: Stations, cut-outs and movement tasks replace desk-bound exercises.',
  'crossover-learning':
    'In your pack: Bridge tasks connect the topic to out-of-school contexts.',
  'personalised-learning':
    'In your pack: Support, core and stretch pathways are generated for each task.',
  'competency-based-learning':
    'In your pack: Objectives become can-do competencies with mastery checks.',
  'experiential-learning':
    'In your pack: A hands-on experience comes first, followed by reflection and application.',
  'mindfulness-sel':
    'In your pack: Settling openers, emotional check-ins and reflection are built around the topic.',
}

const CATEGORY_BADGE = {
  'structured-delivery': 'Structured Delivery',
  'inquiry-problem-solving': 'Inquiry & Problem Solving',
  'engagement-interaction': 'Engagement & Interaction',
  'learner-centred': 'Learner-Centred',
}

const FILTERS = [
  { id: 'all', label: 'All methods', count: 16 },
  ...TEACHING_METHOD_COLUMNS.map((col) => ({
    id: col.id,
    label: col.heading.replace(' Approaches', '').replace(' and ', ' & '),
    count: col.methods.length,
  })),
]

function TeachingMethodsHero() {
  const [active, setActive] = useState('teacher-led')
  const structure = STRUCTURES[active] ?? STRUCTURES['teacher-led']

  return (
    <section className="tm-hub-hero relative overflow-hidden rounded-[32px] bg-[#ade5df] sm:rounded-[40px]">
      <div
        className="pointer-events-none absolute -right-20 -top-14 h-72 w-72 rounded-full bg-[#35BEBC]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#9ddad4]/70"
        aria-hidden
      />

      <div className="relative z-[1] grid items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12 lg:py-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
            </span>
            Teaching methods
          </p>
          <h1 className="max-w-[16ch] text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]">
            <span className="block">Change the method.</span>
            <span className="block">Watch the lesson</span>
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              rebuild itself.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#1A1E3A]/80 sm:text-base">
            Sixteen recognised pedagogies — and your choice restructures every document in the pack,
            not just a label at the top.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#all-methods"
              className="inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#242845]"
            >
              Browse All 16 Methods ↓
            </a>
            <a
              href="#method-chooser"
              className="inline-flex items-center justify-center rounded-full bg-[#35BEBC] px-5 py-3 text-[14px] font-bold text-white no-underline transition hover:bg-[#4ec9c7]"
            >
              Help Me Choose
            </a>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-[#1A1E3A]/55">
            ★★★★★ Rated by educators · 16 methods · 4 categories
            <br />
            Embedded across the teaching pack
          </p>
        </div>

        <div className="tm-hub-mock overflow-hidden rounded-[22px] bg-white shadow-[0_20px_50px_rgba(26,30,58,0.14)]">
          <div className="flex items-center justify-between gap-3 bg-[#1A1E3A] px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E9A98]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#74FFFD]" />
            </div>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75">
              Same topic · The Water Cycle · Year 7 · 45 min
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {METHOD_PILLS.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActive(pill.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition',
                    active === pill.id
                      ? 'border-[#1A1E3A] bg-[#1A1E3A] text-white'
                      : 'border-[#d5dde8] bg-white text-[#1A1E3A] hover:border-[#1A1E3A]/40',
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <h2 className="mt-5 text-[15px] font-bold text-[#1A1E3A] sm:text-base">
              {structure.title}
            </h2>

            <ul className="mt-4 space-y-2.5">
              {structure.rows.map((row) => (
                <li
                  key={`${structure.title}-${row.tag}`}
                  className="flex items-center gap-3 rounded-xl border border-[#e8eef5] bg-[#f8fafc] px-3 py-2.5"
                >
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide',
                      TAG_CLASS[row.tone],
                    )}
                  >
                    {row.tag}
                  </span>
                  <span className="min-w-0 flex-1 text-[12px] leading-snug text-[#1A1E3A]/80 sm:text-[13px]">
                    {row.text}
                  </span>
                  <span className="shrink-0 text-[12px] font-semibold text-[#1A1E3A]/45">
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] leading-relaxed text-[#1A1E3A]/50">
              Highlighted rows show how the selected pedagogy restructures the lesson.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FullDeckSection() {
  const [filter, setFilter] = useState('all')

  const methods = useMemo(() => {
    if (filter === 'all') return ALL_TEACHING_METHODS
    return ALL_TEACHING_METHODS.filter((m) => m.columnId === filter)
  }, [filter])

  return (
    <section
      id="all-methods"
      className="tm-full-deck-section scroll-mt-24 bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="full-deck-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              The full deck
            </p>
            <h2
              id="full-deck-heading"
              className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-white"
            >
              <span className="block">All 16 methods,</span>
              <span className="block">
                clearly{' '}
                <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
                  defined.
                </span>
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-[14px] leading-relaxed text-white/55 sm:text-[15px] lg:pb-1">
            Every method explains what it is and exactly what it changes inside your generated
            teaching pack.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10">
          {FILTERS.map((item) => {
            const active = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] font-semibold transition',
                  active
                    ? 'border-[#35BEBC] bg-[#35BEBC] text-[#1A1E3A]'
                    : 'border-white/20 bg-transparent text-white/80 hover:border-white/40 hover:text-white',
                )}
              >
                {item.label} — {item.count}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
          {methods.map((method, index) => {
            const col = index % 4
            const row = Math.floor(index / 4)
            const teal = (row + col) % 2 === 1
            const badge = CATEGORY_BADGE[method.columnId] ?? method.columnHeading
            return (
              <Link
                key={method.slug}
                href={getTeachingMethodPath(method.slug)}
                className={cn(
                  'relative flex min-h-[300px] flex-col overflow-hidden rounded-[24px] p-5 no-underline transition duration-200 sm:min-h-[320px] sm:p-6',
                  'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35BEBC]',
                  teal ? 'bg-[#35BEBC] text-[#1A1E3A]' : 'bg-[#eaf4f4] text-[#1A1E3A]',
                )}
              >
                <div
                  className={cn(
                    'pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full',
                    teal ? 'bg-[#1A1E3A]/20' : 'bg-[#35BEBC]/30',
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    'relative inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]',
                    teal ? 'bg-[#1A1E3A]/15 text-[#1A1E3A]' : 'bg-[#1A1E3A]/10 text-[#1A1E3A]/65',
                  )}
                >
                  {badge}
                </span>
                <h3 className="relative mt-4 text-[1.2rem] font-bold leading-tight tracking-tight">
                  {method.label}
                </h3>
                <p className="relative mt-3 text-[13px] leading-relaxed opacity-80">
                  {SHORT_BLURB[method.slug] ?? method.description}
                </p>
                <p className="relative mt-auto pt-5 text-[12px] font-medium leading-relaxed text-[#1A1E3A]">
                  {PACK_BLURB[method.slug] ??
                    'In your pack: Structure, tasks and checks are aligned to this pedagogy.'}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const PRIORITY_OPTIONS = [
  { id: 'content', label: 'Covering content' },
  { id: 'thinking', label: 'Deep thinking' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'independence', label: 'Independence' },
]

const CLASS_OPTIONS = [
  { id: 'groups', label: 'In groups' },
  { id: 'individual', label: 'Individually' },
  { id: 'moving', label: 'Moving & doing' },
  { id: 'mix', label: 'A mix' },
]

const CHOOSER_RESULTS = {
  'content|groups': {
    slug: 'collaborative-learning',
    label: 'Collaborative Learning',
    blurb:
      'Groups keep pace on content while holding each other accountable — coverage without lecture fatigue.',
    ideal: 'Ideal for: General (Teacher-Led) with pair checks',
  },
  'content|individual': {
    slug: 'general-teacher-led',
    label: 'General (Teacher-Led)',
    blurb:
      'Clear explanation, modelling and guided practice keep the whole class moving through the content together.',
    ideal: 'Ideal for: Fast coverage with frequent checks for understanding',
  },
  'content|moving': {
    slug: 'kinesthetic-learning',
    label: 'Kinesthetic Learning',
    blurb:
      'Stations and movement tasks keep content flowing while students stay active and attentive.',
    ideal: 'Ideal for: Content-heavy topics that need energy in the room',
  },
  'content|mix': {
    slug: 'blended-learning',
    label: 'Blended Learning',
    blurb:
      'A mix of direct teaching and online activity helps you cover content without a single-mode lesson.',
    ideal: 'Ideal for: Mixed classrooms that need both structure and flexibility',
  },
  'thinking|groups': {
    slug: 'inquiry-based-learning',
    label: 'Inquiry-Based Learning',
    blurb:
      'Shared investigation turns questions into evidence — deep thinking with social accountability.',
    ideal: 'Ideal for: Concept lessons where discovery comes before explanation',
  },
  'thinking|individual': {
    slug: 'problem-based-learning',
    label: 'Problem-Based Learning',
    blurb:
      'A realistic problem drives what students need to learn next — thinking first, content as needed.',
    ideal: 'Ideal for: Independent reasoning with teacher coaching',
  },
  'thinking|moving': {
    slug: 'experiential-learning',
    label: 'Experiential Learning',
    blurb:
      'Hands-on experience followed by reflection builds understanding students can explain, not just recall.',
    ideal: 'Ideal for: Topics that unlock through doing, then discussing',
  },
  'thinking|mix': {
    slug: 'project-based-learning',
    label: 'Project-Based Learning',
    blurb:
      'An authentic project creates space for deep thinking across milestones and a real deliverable.',
    ideal: 'Ideal for: Extended units with individual and team work',
  },
  'engagement|groups': {
    slug: 'collaborative-learning',
    label: 'Collaborative Learning',
    blurb:
      'Roles, pair talk and peer review keep energy high while every student stays accountable.',
    ideal: 'Ideal for: Talkative classes that thrive with shared goals',
  },
  'engagement|individual': {
    slug: 'gamification',
    label: 'Gamification',
    blurb:
      'Missions, levels and challenge ladders keep motivation up even when students work alone.',
    ideal: 'Ideal for: Reluctant engagers who respond to progress and stakes',
  },
  'engagement|moving': {
    slug: 'gamification',
    label: 'Gamification',
    blurb:
      'Active challenges and movement-based missions turn the lesson into something students want to win.',
    ideal: 'Ideal for: High-energy classes that need purposeful motion',
  },
  'engagement|mix': {
    slug: 'crossover-learning',
    label: 'Crossover Learning',
    blurb:
      'Bridge tasks connect classroom learning with informal experiences — engagement beyond the desk.',
    ideal: 'Ideal for: Topics that come alive outside school walls',
  },
  'independence|groups': {
    slug: 'personalised-learning',
    label: 'Personalised Learning',
    blurb:
      'Support, core and stretch pathways let groups and individuals progress without waiting on the whole class.',
    ideal: 'Ideal for: Mixed-ability rooms building autonomy together',
  },
  'independence|individual': {
    slug: 'competency-based-learning',
    label: 'Competency-Based Learning',
    blurb:
      'Students move on when they show mastery — independence with clear can-do checkpoints.',
    ideal: 'Ideal for: Self-paced learners who need transparent criteria',
  },
  'independence|moving': {
    slug: 'kinesthetic-learning',
    label: 'Kinesthetic Learning',
    blurb:
      'Hands-on stations give students agency over pace while still moving through the objectives.',
    ideal: 'Ideal for: Independent explorers who learn by doing',
  },
  'independence|mix': {
    slug: 'flipped-classroom',
    label: 'Flipped Classroom',
    blurb:
      'Pre-class learning frees lesson time for coaching — independence with teacher support where it matters.',
    ideal: 'Ideal for: Classes ready to prepare before they arrive',
  },
}

function MethodChooserCard() {
  const [priority, setPriority] = useState('content')
  const [classroom, setClassroom] = useState('groups')

  const result =
    CHOOSER_RESULTS[`${priority}|${classroom}`] ?? CHOOSER_RESULTS['content|groups']

  return (
    <section
      id="method-chooser"
      className="mt-10 overflow-hidden rounded-[32px] sm:mt-12 sm:rounded-[40px]"
      aria-labelledby="method-chooser-heading"
    >
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col bg-[#35BEBC] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" aria-hidden />
            Not sure which?
          </p>
          <h2
            id="method-chooser-heading"
            className="max-w-[12ch] text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            Two questions. One suggestion.
          </h2>

          <div className="mt-8">
            <p className="text-[15px] font-semibold text-[#1A1E3A]">
              What matters most in this lesson?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((option) => {
                const active = priority === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPriority(option.id)}
                    className={cn(
                      'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                      active
                        ? 'bg-[#1A1E3A] text-white'
                        : 'bg-[#c5ebe8] text-[#1A1E3A] hover:bg-[#b5e4e0]',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-7">
            <p className="text-[15px] font-semibold text-[#1A1E3A]">
              How does your class work best?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CLASS_OPTIONS.map((option) => {
                const active = classroom === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setClassroom(option.id)}
                    className={cn(
                      'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                      active
                        ? 'bg-[#1A1E3A] text-white'
                        : 'bg-[#c5ebe8] text-[#1A1E3A] hover:bg-[#b5e4e0]',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="mt-auto pt-10 text-[12px] leading-relaxed text-[#1A1E3A]/45 sm:text-[13px]">
            A starting point, not a rule — you know your class. Every method remains one click away
            inside the generator.
          </p>
        </div>

        <div className="flex flex-col justify-center bg-[#1A1E3A] px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Try this method
          </p>
          <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.35rem)] font-bold tracking-tight text-[#35BEBC]">
            <Link
              href={getTeachingMethodPath(result.slug)}
              className="text-inherit no-underline hover:underline"
            >
              {result.label}
            </Link>
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80 sm:text-base">
            {result.blurb}
          </p>
          <p className="mt-8 text-[13px] text-white">{result.ideal}</p>
          <Link
            href={getTeachingMethodPath(result.slug)}
            className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-[#35BEBC] px-5 py-2.5 text-[13px] font-bold text-[#1A1E3A] no-underline transition hover:bg-[#4ec9c7]"
          >
            Read about {result.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

function ReadyWhenYouAreCta() {
  return (
    <section
      id="ready-when-you-are"
      className="mt-10 overflow-hidden rounded-[32px] bg-[#ade5df] px-5 py-12 sm:mt-12 sm:rounded-[40px] sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      aria-labelledby="ready-heading"
    >
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
            </span>
            Ready when you are
          </p>
          <h2
            id="ready-heading"
            className="max-w-[14ch] text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.1] tracking-tight text-[#1A1E3A]"
          >
            Pick a method. The pack does the rest.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#1A1E3A]/80 sm:text-base">
            10 free credits · all 16 methods available · no credit card required
          </p>
          <Link
            href={MML_APP.signUp}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-6 py-3.5 text-[15px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(26,30,58,0.22)] transition hover:bg-[#242845]"
          >
            Build a Teaching Pack — Free
          </Link>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-[540px] sm:h-[400px]">
          <article className="absolute right-0 top-8 z-[1] w-[70%] max-w-[235px] rotate-[8deg] rounded-[26px] bg-white p-4 shadow-[0_18px_40px_rgba(26,30,58,0.14)] sm:right-1 sm:top-10 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1A1E3A]/40">
              School
            </p>
            <p className="mt-2 text-[1.65rem] font-bold leading-none text-[#1A1E3A]">Pooled</p>
            <p className="mt-2 text-[11px] leading-snug text-[#1A1E3A]/55">
              Shared credits for whole teaching teams.
            </p>
            <div className="mt-4 rounded-2xl bg-[#eef2f6] p-3">
              <p className="flex items-baseline gap-1.5 font-medium text-[#1A1E3A]/55">
                <span className="text-[1.75rem] font-bold leading-none text-[#1A1E3A]">∞</span>
                <span className="text-[11px]">flexible allocation</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#d7e0e8]">
                <div
                  className="h-full w-[95%] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #1e9a98 0%, #35bebc 50%, #74fffd 100%)',
                  }}
                />
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-[11px] font-medium text-[#1A1E3A]/70">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Users className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Shared team credits
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Library className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                School admin controls
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1E3A]/40">
                For schools
              </span>
              <Link
                href="/contact"
                className="rounded-full bg-[#1A1E3A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white no-underline"
              >
                Contact us
              </Link>
            </div>
          </article>

          <article className="absolute left-0 top-12 z-[2] w-[70%] max-w-[235px] -rotate-[9deg] rounded-[26px] bg-[#1A1E3A] p-4 text-white shadow-[0_18px_40px_rgba(26,30,58,0.3)] sm:left-0 sm:top-14 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Free</p>
            <p className="mt-2 text-[1.65rem] font-bold leading-none">10 Credits</p>
            <p className="mt-2 text-[11px] leading-snug text-white/55">
              Explore every stage before upgrading.
            </p>
            <div className="mt-4 rounded-2xl bg-white/[0.06] p-3">
              <p className="flex items-baseline gap-1.5 font-medium text-white/50">
                <span className="text-[1.35rem] font-bold leading-none text-white">10</span>
                <span className="text-[11px]">credits included</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[32%] rounded-full bg-[#35BEBC]" />
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-[11px] font-medium text-white/75">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Folder className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Complete teaching packs
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <BookOpen className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                All creation tools
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                No card required
              </span>
              <Link
                href={MML_APP.signUp}
                className="rounded-full bg-[#35BEBC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A] no-underline"
              >
                Start free
              </Link>
            </div>
          </article>

          <article className="absolute left-[16%] top-0 z-[3] w-[76%] max-w-[255px] rotate-[2deg] rounded-[28px] bg-[#0a0b12] p-5 text-white shadow-[0_24px_50px_rgba(10,11,18,0.45)] sm:left-[20%] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Individual
            </p>
            <p className="mt-2 text-[1.75rem] font-bold leading-none">
              60
              <span className="ml-1.5 text-[0.95rem] font-semibold text-white/55">/ month</span>
            </p>
            <p className="mt-2 text-[12px] leading-snug text-white/55">
              Built for teachers creating every week.
            </p>
            <div className="mt-4 rounded-2xl bg-white/[0.06] p-3.5">
              <p className="flex items-baseline gap-1.5 font-medium text-white/50">
                <span className="text-[1.35rem] font-bold leading-none text-white">60</span>
                <span className="text-[11px]">monthly credits</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[75%] rounded-full bg-[#35BEBC]" />
              </div>
            </div>
            <ul className="mt-3.5 space-y-2 text-[12px] font-medium text-white/75">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Folder className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Up to 15 complete packs
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                  <Library className="h-2.5 w-2.5 text-[#35BEBC]" />
                </span>
                Personal resource library
              </li>
            </ul>
            <div className="mt-5 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                For one teacher
              </span>
              <span className="rounded-full bg-[#35BEBC] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A]">
                Most popular
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default function TeachingMethodsHubPage() {
  return (
    <PageShell
      variant="wide"
      className="tm-page-shell border-slate-200 bg-white [font-family:var(--font-manrope),Manrope,system-ui,sans-serif]"
      contentClassName="pb-16 pt-6 md:pb-20 md:pt-8"
    >
      <TeachingMethodsHero />
      <FullDeckSection />
      <MethodChooserCard />
      <ReadyWhenYouAreCta />
    </PageShell>
  )
}
