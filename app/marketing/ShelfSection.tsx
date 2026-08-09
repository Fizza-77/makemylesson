import Image from "next/image";

const TAGS = [
  { label: "THE FULL SHELF COSTS 4 CREDITS", accent: true },
  { label: "ZIP", accent: false },
  { label: "PDF", accent: false },
  { label: "DOCX", accent: false },
  { label: "PPTX", accent: false },
  { label: "GOOGLE CLASSROOM", accent: false },
  { label: "MICROSOFT TEAMS", accent: false },
] as const;

function ShelfUnderline() {
  return (
    <svg
      className="mml-shelf-underline"
      viewBox="0 0 280 16"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M4 11c36 4 78 5 124 2 42-2.8 84-6.5 128-2.5"
        stroke="#5ecfbe"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ShelfSection() {
  return (
    <section className="mml-shelf" aria-labelledby="mml-shelf-heading">
      <div className="mml-shelf-inner">
        <p className="mml-shelf-eyebrow">
          <span className="mml-shelf-eyebrow-dot" aria-hidden />
          THE COMPLETE TEACHING PACK
        </p>

        <h2 id="mml-shelf-heading" className="mml-shelf-title">
          One topic fills a{" "}
          <span className="mml-shelf-title-accent">
            whole shelf.
            <ShelfUnderline />
          </span>
        </h2>

        <p className="mml-shelf-sub">
          Every generation creates a coordinated set of classroom-ready resources
          for the teacher, the class and the student.
        </p>

        <div className="mml-shelf-visual">
          <Image
            src="/Group 54.svg"
            alt="Teaching pack shelf with lesson plan, presentation, speaker notes, activity sheet, answer keys, assessment paper and mark scheme"
            width={1272}
            height={622}
            className="mml-shelf-img"
            priority={false}
          />
        </div>

        <ul className="mml-shelf-tags">
          {TAGS.map(({ label, accent }) => (
            <li key={label}>
              <span className={accent ? "mml-shelf-tag mml-shelf-tag--accent" : "mml-shelf-tag"}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
