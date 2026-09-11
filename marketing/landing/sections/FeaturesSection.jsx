import {
  BookOpen,
  ClipboardList,
  ImageIcon,
  ListChecks,
  Presentation,
  Target,
  Users,
} from 'lucide-react'

import SectionLink from '@marketing/components/SectionLink'
import { CARD_ICON_PROPS, FV_ROW_ICON_PROPS, LABEL_ICON_PROPS } from '../featureIcons'
import { CheckItem, Label, Reveal } from '../shared'

const LESSON_PLAN_ROWS = [
  { Icon: Target, text: 'Objectives · 3 standards-aligned goals' },
  { Icon: BookOpen, text: 'Hook · 10 min - Think-pair-share activity', highlight: true },
  { Icon: Presentation, text: 'Core Teaching · 20 min' },
  { Icon: Users, text: 'Group Practice · 10 min' },
  { Icon: ClipboardList, text: 'Exit Ticket · 5 min' },
]

const aiToolCards = [
  {
    id: 'feature-lesson-planning',
    Icon: ClipboardList,
    title: 'Lesson Planning',
    desc: "Curriculum-aligned lesson plan with learning objectives, differentiation, and Bloom's Taxonomy balance, built for your route, not a one-size-fits-all template.",
  },
  {
    id: 'feature-slide-decks',
    Icon: Presentation,
    title: 'Slide Decks',
    desc: 'AI presentation for teachers: clear flow, discussion prompts, speaker notes; PPTX download plus Google Classroom and Microsoft Teams export.',
  },
  {
    id: 'feature-assessments',
    Icon: ListChecks,
    title: 'Assessments',
    desc: 'Summative and formative assessment papers with mark scheme generator output: answer keys and instructional materials matched to what you taught.',
  },
]

const COMPLETE_PACK_DOCS = [
  { dot: 'teal', name: 'Lesson Plan', label: 'TEACHER' },
  { dot: 'sky', name: 'Classroom Presentation (PPTX)', label: 'TEACHER + STUDENTS' },
  { dot: 'sky', name: 'Speaker Notes PDF', label: 'TEACHER ONLY' },
  { dot: 'gold', name: 'Student Activity Sheet', label: 'STUDENTS' },
  { dot: 'gold', name: 'Teacher Answer Key / Guide', label: 'TEACHER ONLY' },
  { dot: 'slate', name: 'Student Assessment Paper', label: 'STUDENTS' },
  { dot: 'slate', name: 'Teacher Mark Scheme', label: 'TEACHER ONLY' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="features">
      <div className="W">
        <Reveal className="feat-ai-tools">
          <div className="section-head feat-ai-tools-intro">
            <Label center>AI tools for teachers</Label>
            <h2 className="feat-ai-h2">Complete Teaching Pack: Lesson Plan and Assessment Together</h2>
          </div>
          <div className="feat-ai-grid">
            {aiToolCards.map(({ id, Icon, title, desc }) => (
              <SectionLink key={id} sectionId={id} href="/" className="feat-ai-card">
                <div className="feat-ai-card-head">
                  <span className="feat-ai-card-ico" aria-hidden>
                    <Icon {...CARD_ICON_PROPS} />
                  </span>
                  <span className="feat-ai-card-title">{title}</span>
                </div>
                <p className="feat-ai-card-desc">{desc}</p>
                <span className="feat-ai-card-more">View Details →</span>
              </SectionLink>
            ))}
          </div>
        </Reveal>

        <div id="feature-lesson-planning">
          <Reveal className="feat-block">
          <div>
            <div className="feat-step-num" aria-hidden>
              1
            </div>
            <div className="feat-label">
              <ClipboardList {...LABEL_ICON_PROPS} aria-hidden />
              <span>Lesson Planning</span>
            </div>
            <h2 className="feat-h">
              A Full Lesson Plan
              <br />
              <em>in Under 30 Seconds.</em>
            </h2>
            <p className="feat-p">
              Choose your curriculum, grade, subject, and topic. Make My Lesson builds a complete, standards-aligned
              plan so you walk in and just teach.
            </p>
            <ul className="feat-checks">
              <CheckItem>Learning objectives, timing, and differentiation built in</CheckItem>
              <CheckItem>Supports direct instruction, Socratic, and blended methods</CheckItem>
              <CheckItem>One-click export to PDF, Word, or Google Docs</CheckItem>
              <CheckItem>Saves 80%+ of weekly lesson prep time</CheckItem>
            </ul>
          </div>
          <div className="feat-visual">
            <div className="fv-head">
              <div className="fv-dot" />
              <span className="fv-label">Lesson Plan · Grade 5 Science</span>
            </div>
            <div className="fv-body">
              <div className="fv-tag">The Water Cycle - 45 min</div>
              <div className="fv-rows">
                {LESSON_PLAN_ROWS.map(({ Icon, text, highlight }) => (
                  <div key={text} className={`fv-row${highlight ? ' fv-hi' : ''}`}>
                    <span className="fv-row-icon" aria-hidden>
                      <Icon {...FV_ROW_ICON_PROPS} />
                    </span>
                    <span className="fv-row-text">{text}</span>
                  </div>
                ))}
              </div>
              <div className="fv-btns">
                <div className="fv-btn-primary">Export PDF</div>
                <div className="fv-btn">Word</div>
                <div className="fv-btn">Google</div>
              </div>
            </div>
          </div>
        </Reveal>
        </div>

        <div id="feature-slide-decks">
          <Reveal className="feat-block feat-flip">
          <div>
            <div className="feat-step-num" aria-hidden>
              2
            </div>
            <div className="feat-label">
              <Presentation {...LABEL_ICON_PROPS} aria-hidden />
              <span>Slide Decks</span>
            </div>
            <h2 className="feat-h">
              Beautiful Slides,
              <br />
              <em>Built to Teach.</em>
            </h2>
            <p className="feat-p">
              Every lesson comes with a complete, pedagogically sequenced slide deck vocabulary, visuals, discussion
              prompts, and speaker notes all ready to present.
            </p>
            <ul className="feat-checks">
              <CheckItem>Title, intro, vocab, core content, practice all structured</CheckItem>
              <CheckItem>Export to Google Slides, PowerPoint, or PDF</CheckItem>
              <CheckItem>Fully customisable edit, reorder, add your own images</CheckItem>
              <CheckItem>Speaker notes pre-written so you focus on teaching</CheckItem>
            </ul>
          </div>
          <div className="feat-visual">
            <div className="fv-head">
              <div className="fv-dot" />
              <span className="fv-label">Slide Deck · 8 slides generated</span>
            </div>
            <div className="fv-body">
              <div className="fv-slide-hero">
                <div className="fv-slide-meta">Slide 1 of 8 - Title</div>
                <div className="fv-slide-title">Exploring Ecosystems</div>
                <div className="fv-slide-sub">Grade 5 · US Common Core Science</div>
                <div className="fv-slide-img">
                  <ImageIcon {...FV_ROW_ICON_PROPS} />
                  <span>Cover illustration</span>
                </div>
              </div>
              <div className="fv-slide-thumbs">
                <div className="fv-thumb" />
                <div className="fv-thumb fv-thumb-hi" />
                <div className="fv-thumb" />
              </div>
            </div>
          </div>
        </Reveal>
        </div>

        <div id="feature-assessments">
          <Reveal className="feat-block">
          <div>
            <div className="feat-step-num" aria-hidden>
              3
            </div>
            <div className="feat-label">
              <ListChecks {...LABEL_ICON_PROPS} aria-hidden />
              <span>Assessments</span>
            </div>
            <h2 className="feat-h">
              Worksheets, Quizzes,
              <br />
              <em>Tests in Minutes.</em>
            </h2>
            <p className="feat-p">
              Generate differentiated assessments at a click. Choose question types, difficulty, and format and get a
              printable or digital-ready resource with answer keys.
            </p>
            <ul className="feat-checks">
              <CheckItem>Multiple choice, true/false, short answer, open response</CheckItem>
              <CheckItem>Quick checks, practice worksheets, exit tickets, full tests</CheckItem>
              <CheckItem>Answer keys generated automatically</CheckItem>
              <CheckItem>Printable PDF and Google Forms export</CheckItem>
            </ul>
          </div>
          <div className="feat-visual">
            <div className="fv-head">
              <div className="fv-dot" />
              <span className="fv-label">Formative Assessment · Quick Check</span>
            </div>
            <div className="fv-body">
              <div className="fv-q-title">1. What primarily drives the water cycle?</div>
              <div className="fv-options">
                <div className="fv-option">○ Gravity alone</div>
                <div className="fv-option fv-option-correct">● Solar energy ✓</div>
                <div className="fv-option">○ Wind pressure</div>
              </div>
              <div className="fv-q-title" style={{ marginTop: 12 }}>
                2. In your own words, define evaporation.
              </div>
              <div className="fv-textarea" />
              <div className="fv-btns" style={{ marginTop: 12 }}>
                <div className="fv-btn-primary">Print PDF</div>
                <div className="fv-btn">Answer Key</div>
              </div>
            </div>
          </div>
        </Reveal>
        </div>

        <Reveal delay={120}>
          <div id="complete-pack" className="complete-pack">
            <div>
              <span className="section-eyebrow">The complete teaching pack</span>
              <h3>
                One Topic. Six Documents.
                <br />
                Every Phase of Your Teaching Cycle.
              </h3>
              <p>
                When you generate all four stages for one topic, you get six classroom-ready documents covering every
                phase of the teaching and assessment cycle. Download as a single ZIP or export each document
                individually.
              </p>
              <div className="pack-total">
                <span className="pack-total-label">Total Cost</span>
                <span className="pack-total-val">4 credits</span>
              </div>
            </div>
            <ul className="doc-list">
              {COMPLETE_PACK_DOCS.map((row) => (
                <li key={row.name}>
                  <span className={`doc-dot doc-dot--${row.dot}`} aria-hidden />
                  <span className="doc-name">{row.name}</span>
                  <span className="doc-label">{row.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}


