function RoutesUnderline() {
  return (
    <svg
      className="mml-cc-underline"
      viewBox="0 0 200 10"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M4 5h192"
        stroke="#35bebc"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CurriculumCoverageSection() {
  return (
    <section className="mml-cc" id="curriculum" aria-labelledby="mml-cc-heading">
      <div className="mml-cc-inner">
        <p className="mml-cc-eyebrow">CURRICULUM COVERAGE</p>

        <h2 id="mml-cc-heading" className="mml-cc-title">
          Five systems.{" "}
          <span className="mml-cc-title-accent">
            71 routes.
            <RoutesUnderline />
          </span>{" "}
          Yours is here.
        </h2>

        <p className="mml-cc-sub">
          Dedicated routes reflect curriculum language, exam systems and
          progression instead of generic labels on basic templates.
        </p>

        <div className="mml-cc-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bento-grid-curricula.svg"
            alt="Curriculum coverage across United Kingdom, United States, International Baccalaureate, Australia and Canada"
            width={1200}
            height={932}
            className="mml-cc-img"
          />
        </div>
      </div>
    </section>
  );
}
