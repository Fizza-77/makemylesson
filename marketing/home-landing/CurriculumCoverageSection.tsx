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

type ListItem =
  | string
  | {
      title: string;
      detail: string;
    };

type CurriculumCard = {
  id: string;
  title: string;
  range: string;
  tone: "navy" | "white" | "cyan";
  flag: string;
  flagAlt: string;
  structure: string;
  structureClass: string;
  items: ListItem[];
  more?: "navy" | "cyan";
  numTone?: "cyan" | "navy";
};

const CARDS: CurriculumCard[] = [
  {
    id: "uk",
    title: "United Kingdom",
    range: "Primary to Pre-University",
    tone: "navy",
    flag: "/UK.png",
    flagAlt: "United Kingdom flag",
    structure: "/UK.svg",
    structureClass: "mml-cc-structure--uk",
    items: [
      "UK National Curriculum",
      "Cambridge IGCSE, AS & A Level",
      "Pearson Edexcel IGCSE, AS & A Level",
    ],
  },
  {
    id: "us",
    title: "United States",
    range: "Kindergarten to College Admissions",
    tone: "white",
    flag: "/Flags/US-flag.svg",
    flagAlt: "United States flag",
    structure: "/US.svg",
    structureClass: "mml-cc-structure--us",
    items: [
      { title: "Foundational", detail: "Common Core State Standards" },
      { title: "Advanced", detail: "Advanced Placement (AP)" },
      { title: "Admissions", detail: "Digital SAT" },
    ],
  },
  {
    id: "ib",
    title: "International Baccalaureate",
    range: "Primary to Diploma Programme",
    tone: "white",
    flag: "/Flags/US-flag.svg",
    flagAlt: "United States flag",
    structure: "/IB.svg",
    structureClass: "mml-cc-structure--ib",
    items: [
      "Primary Years Programme (PYP)",
      "Middle Years Programme (MYP)",
      "Diploma Programme (DP)",
    ],
  },
  {
    id: "au",
    title: "Australia",
    range: "Primary to Senior Secondary",
    tone: "white",
    flag: "/Flags/Aus-flag.svg",
    flagAlt: "Australia flag",
    structure: "/Australia.svg",
    structureClass: "mml-cc-structure--au",
    items: [
      "New South Wales – Higher School Certificate (HSC)",
      "Victoria – Victorian Certificate of Education (VCE)",
      "Queensland – Queensland Certificate",
    ],
    more: "cyan",
  },
  {
    id: "ca",
    title: "Canada",
    range: "Primary to High School Graduation",
    tone: "white",
    flag: "/Flags/Canada-flag.svg",
    flagAlt: "Canada flag",
    structure: "/Canada.svg",
    structureClass: "mml-cc-structure--ca",
    items: [
      "Ontario – Ontario Secondary School Diploma (OSSD)",
      "British Columbia – Dogwood Diploma",
      "Alberta – Alberta High School Diploma",
    ],
    more: "cyan",
  },
];

function CardList({
  items,
  numTone = "cyan",
}: {
  items: ListItem[];
  numTone?: "cyan" | "navy";
}) {
  return (
    <ol className={`mml-cc-list mml-cc-list--${numTone}`}>
      {items.map((item, i) => {
        const isObj = typeof item === "object";
        return (
          <li key={i} className="mml-cc-list-item">
            <span className="mml-cc-num" aria-hidden>
              {i + 1}
            </span>
            <span className="mml-cc-list-body">
              {isObj ? (
                <>
                  <span className="mml-cc-list-title">{item.title}</span>
                  <span className="mml-cc-list-detail">{item.detail}</span>
                </>
              ) : (
                item
              )}
            </span>
          </li>
        );
      })}
    </ol>
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

        <div className="mml-cc-grid" role="list">
          {CARDS.map((card) => (
            <article
              key={card.id}
              className={`mml-cc-card mml-cc-card--${card.id} mml-cc-card--${card.tone}`}
              role="listitem"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.structure}
                alt=""
                aria-hidden
                className={`mml-cc-structure ${card.structureClass}`}
              />

              <div className="mml-cc-card-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.flag}
                  alt={card.flagAlt}
                  className="mml-cc-flag"
                  width={48}
                  height={32}
                />
              </div>

              <div className="mml-cc-card-body">
                <h3 className="mml-cc-card-title">{card.title}</h3>
                <p className="mml-cc-card-range">{card.range}</p>
                <CardList items={card.items} numTone={card.numTone ?? "cyan"} />
                {card.more ? (
                  <p className={`mml-cc-more mml-cc-more--${card.more}`}>
                    Read more....
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
