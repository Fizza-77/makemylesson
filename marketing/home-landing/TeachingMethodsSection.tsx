import Link from "next/link";

const METHODS = [
  {
    num: "01",
    title: "General (Teacher-Led)",
    definition:
      "Teacher-led instruction with direct, explicit teaching — structured, curriculum-aligned lessons where the teacher guides the full sequence.",
  },
  {
    num: "02",
    title: "Flipped Classroom",
    definition:
      "Move direct instruction outside class with pre-class content, then use lesson time for practice, discussion and deeper application.",
  },
  {
    num: "03",
    title: "Blended Learning",
    definition:
      "Combine face-to-face teaching with online learning in one connected sequence so digital and classroom work reinforce each other.",
  },
  {
    num: "04",
    title: "Gamification",
    definition:
      "Apply points, levels and challenges to boost engagement while keeping every activity aligned to curriculum outcomes.",
  },
] as const;

function MethodCard({ num, title, definition }: (typeof METHODS)[number]) {
  return (
    <div className="mml-tm-card">
      <div className="mml-tm-card-head">
        <span className="mml-tm-card-badge">{num}</span>
        <p className="mml-tm-card-title">{title}</p>
      </div>
      <p className="mml-tm-card-def">{definition}</p>
    </div>
  );
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

        <div className="mml-tm-grid" role="list">
          {METHODS.map((method) => (
            <div key={method.num} className="mml-tm-grid-item" role="listitem">
              <MethodCard {...method} />
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
  );
}
