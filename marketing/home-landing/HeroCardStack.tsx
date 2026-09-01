import { responsiveWebpSrcSet } from "@marketing/home-landing/responsiveWebp";

const HERO_CARD_LG = 620;
const HERO_CARD_SM = 200;

const HERO_CARDS = [
  {
    id: "slides",
    src: "/svgs/slides.webp",
    modifier: "slides",
    sizes: "(max-width: 767px) 39vw, 20vw",
  },
  {
    id: "answerkey",
    src: "/svgs/answerkey.webp",
    modifier: "answerkey",
    sizes: "(max-width: 767px) 34vw, 17vw",
  },
  {
    id: "classroomactivity",
    src: "/svgs/classroomactivity.webp",
    modifier: "classroomactivity",
    sizes: "(max-width: 767px) 40vw, 20vw",
  },
  {
    id: "markscheme",
    src: "/svgs/markscheme.webp",
    modifier: "markscheme",
    sizes: "(max-width: 767px) 32vw, 16vw",
  },
  {
    id: "testpaper",
    src: "/svgs/testpaper.webp",
    modifier: "testpaper",
    sizes: "(max-width: 767px) 32vw, 16vw",
  },
  {
    id: "lessonplan",
    src: "/svgs/lessonplan.webp",
    modifier: "lessonplan",
    sizes: "(max-width: 767px) 44vw, 22vw",
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
          srcSet={responsiveWebpSrcSet(card.src, HERO_CARD_SM, HERO_CARD_LG)}
          sizes={card.sizes}
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
