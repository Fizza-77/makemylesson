const HERO_CARDS = [
  {
    id: "slides",
    src: "/svgs/slides.svg",
    modifier: "slides",
  },
  {
    id: "answerkey",
    src: "/svgs/answerkey.svg",
    modifier: "answerkey",
  },
  {
    id: "classroomactivity",
    src: "/svgs/classroomactivity.svg",
    modifier: "classroomactivity",
  },
  {
    id: "markscheme",
    src: "/svgs/markscheme.svg",
    modifier: "markscheme",
  },
  {
    id: "testpaper",
    src: "/svgs/testpaper.svg",
    modifier: "testpaper",
  },
  {
    id: "lessonplan",
    src: "/svgs/lessonplan.svg",
    modifier: "lessonplan",
  },
] as const;

export default function HeroCardStack() {
  return (
    <div
      className="mml-hero-card-stack"
      role="img"
      aria-label="Overlapping teaching pack documents: lesson plan, slides, classroom activity, test paper, answer key, and mark scheme for an ecosystems lesson."
    >
      {HERO_CARDS.map((card) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={card.id}
          src={card.src}
          alt=""
          className={`mml-hero-card-stack__card mml-hero-card-stack__card--${card.modifier}`}
          width={309}
          height={464}
          decoding="async"
          fetchPriority={card.modifier === "lessonplan" ? "high" : "auto"}
        />
      ))}
    </div>
  );
}


