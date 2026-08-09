import {
  ArrowRight,
  Clock,
  FileText,
  Presentation,
  ClipboardList,
  FileCheck,
} from "lucide-react";

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

const STAGE_PILLS = ["Plan", "Present", "Practise", "Assess"] as const;

function UntilNowUnderline() {
  return (
    <svg
      className="mml-ba-underline"
      viewBox="0 0 200 14"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M4 10c30 3.5 68 4.5 105 1.5 34-2.8 66-5.5 90-1.5"
        stroke="#ffffff"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="1"
      />
    </svg>
  );
}

export default function BeforeAfterSection() {
  return (
    <section className="mml-ba" aria-labelledby="mml-ba-heading">
      <div className="mml-ba-inner">
        <div className="mml-ba-badge">
          <span className="mml-ba-badge-icon" aria-hidden>
            <Clock size={16} strokeWidth={2} />
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
            <header className="mml-ba-card-head mml-ba-card-head--after">
              <span className="mml-ba-card-label mml-ba-card-label--after">
                <span className="mml-ba-traffic" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                MAKE MY LESSON · TEACHING PACK
              </span>
              <span className="mml-ba-connected">CONNECTED</span>
            </header>

            <div className="mml-ba-after-body">
              <div className="mml-ba-after-hero">
                <div className="mml-ba-after-hero-main">
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
                    One topic in. A coherent six-document pack out — plan, slides,
                    activity, key, paper, mark scheme.
                  </p>
                </div>
              </div>

              <div className="mml-ba-doc-grid">
                {AFTER_DOCS.map(({ title, sub }) => (
                  <div key={title} className="mml-ba-doc">
                    <span className="mml-ba-doc-icon" aria-hidden>
                      <FileText size={15} strokeWidth={1.85} />
                    </span>
                    <strong>{title}</strong>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <footer className="mml-ba-card-foot mml-ba-card-foot--after">
              <div className="mml-ba-stage-pills">
                {STAGE_PILLS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <span className="mml-ba-aligned">
                <span className="mml-ba-dot mml-ba-dot--mint" aria-hidden />
                Everything stays aligned
              </span>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
