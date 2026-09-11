import {
  ArrowRight,
  Clock,
  FileText,
  Presentation,
  ClipboardList,
  FileCheck,
} from "lucide-react";

import BeforeAfterBackdrop from "@marketing/home-landing/BeforeAfterBackdrop";

const BEFORE_ROWS = [
  {
    title: "Lesson plan · Word",
    sub: "Planning, sequencing, formatting",
    time: "45 min",
    tone: "blue",
    Icon: FileText,
  },
  {
    title: "Slides · PowerPoint",
    sub: "Designing and formatting slides",
    time: "60 min",
    tone: "purple",
    Icon: Presentation,
  },
  {
    title: "Worksheet · TPT + editing",
    sub: "Finding, adapting, reformatting",
    time: "45 min",
    tone: "yellow",
    Icon: ClipboardList,
  },
  {
    title: "Test + mark scheme · from scratch",
    sub: "Questions, answers, marking guidance",
    time: "75 min",
    tone: "teal",
    Icon: FileCheck,
  },
] as const;

const AFTER_DOCS = [
  { title: "Lesson Plan", sub: "Objectives + timing" },
  { title: "Slides", sub: "Teaching sequence" },
  { title: "Activity", sub: "Student practice" },
  { title: "Answer Key", sub: "Teacher guidance" },
  { title: "Test Paper", sub: "Balanced questions" },
  { title: "Mark Scheme", sub: "Answers + marks" },
] as const;

const STAGE_PILLS = ["Plan", "Present", "Practice", "Assess"] as const;

function DocIcon() {
  return (
    <svg
      className="mml-ba-doc-icon-svg"
      width="18"
      height="18"
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.375 2.625H14L16.625 5.25V18.375H4.375V2.625"
        stroke="currentColor"
        strokeWidth="1.575"
        strokeLinejoin="round"
      />
      <path
        d="M14 2.625V6.125H17.5"
        stroke="currentColor"
        strokeWidth="1.575"
        strokeLinejoin="round"
      />
      <path
        d="M7 9.625H14M7 13.125H14M7 16.625H11.375"
        stroke="currentColor"
        strokeWidth="1.575"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UntilNowUnderline() {
  return (
    <svg
      className="mml-ba-underline"
      viewBox="0 0 200 14"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <line
        x1="4"
        y1="9"
        x2="196"
        y2="9"
        stroke="var(--mml-cyan)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BeforeAfterSection() {
  return (
    <section
      className="mml-ba"
      id="sample-lesson"
      aria-labelledby="mml-ba-heading"
    >
      <BeforeAfterBackdrop />
      <div className="mml-ba-inner">
        <div className="mml-ba-badge">
          <span className="mml-ba-badge-icon" aria-hidden>
            <Clock size={14} strokeWidth={2.2} />
          </span>
          <span className="mml-ba-badge-text">SUNDAY EVENING, EVERY WEEK</span>
        </div>

        <h2 id="mml-ba-heading" className="mml-ba-title">
          <span className="mml-ba-title-line">Four documents. Five apps.</span>
          <span className="mml-ba-title-line">
            One tired teacher{" "}
            <span className="mml-ba-title-accent">
              until now.
              <UntilNowUnderline />
            </span>
          </span>
        </h2>

        <div className="mml-ba-compare">
          <article className="mml-ba-card mml-ba-card--before">
            <header className="mml-ba-card-head">
              <span className="mml-ba-card-label">
                <span className="mml-ba-dot mml-ba-dot--orange" aria-hidden />
                BEFORE MAKE MY LESSON
              </span>
              <span className="mml-ba-card-meta">Manual workflow</span>
            </header>

            <ul className="mml-ba-before-list">
              {BEFORE_ROWS.map(({ title, sub, time, tone, Icon }) => (
                <li key={title} className="mml-ba-before-row">
                  <span className={`mml-ba-icon mml-ba-icon--${tone}`} aria-hidden>
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div className="mml-ba-before-copy">
                    <strong>{title}</strong>
                    <span>{sub}</span>
                  </div>
                  <span className="mml-ba-time">{time}</span>
                </li>
              ))}
            </ul>

            <footer className="mml-ba-card-foot">
              <p>
                Total prep time: <strong>up to 5 hours per lesson</strong>
              </p>
              <span className="mml-ba-foot-pill">
                <span className="mml-ba-dot mml-ba-dot--orange" aria-hidden />
                4 separate workflows
              </span>
            </footer>
          </article>

          <div className="mml-ba-arrow" aria-hidden>
            <ArrowRight size={18} strokeWidth={2.6} />
          </div>

          <article className="mml-ba-card mml-ba-card--after">
            <div className="mml-ba-after-inner">
              <div className="mml-ba-after-top">
                <span className="mml-ba-card-label mml-ba-card-label--after">
                  MAKE MY LESSON · TEACHING PACK
                </span>
                <span className="mml-ba-connected">CONNECTED</span>
              </div>

              <div className="mml-ba-after-hero">
                <span className="mml-ba-after-kicker">ONE CONNECTED WORKFLOW</span>
                <div className="mml-ba-after-time-row">
                  <p className="mml-ba-after-time">
                    <span className="mml-ba-after-chevron" aria-hidden>
                      &lt;
                    </span>
                    10 min
                  </p>
                  <div className="mml-ba-output">
                    <span>OUTPUT</span>
                    <strong>6 docs</strong>
                  </div>
                </div>
                <p className="mml-ba-after-desc">
                  One topic in. A coherent six-document pack out – plan, slides,
                  activity, key, paper, mark scheme.
                </p>
              </div>

              <div className="mml-ba-doc-grid">
                {AFTER_DOCS.map(({ title, sub }) => (
                  <div key={title} className="mml-ba-doc">
                    <div className="mml-ba-doc-head">
                      <span className="mml-ba-doc-icon" aria-hidden>
                        <DocIcon />
                      </span>
                      <strong>{title}</strong>
                    </div>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>

              <div className="mml-ba-after-foot">
                <div className="mml-ba-stage-pills">
                  {STAGE_PILLS.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <span className="mml-ba-aligned">
                  <span className="mml-ba-dot mml-ba-dot--mint" aria-hidden />
                  Everything stays aligned
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}


