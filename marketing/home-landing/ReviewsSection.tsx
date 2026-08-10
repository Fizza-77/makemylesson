type ReviewTone = "navy" | "teal" | "mint";
type PinColor = "cyan" | "navy";
type PinTilt = "left" | "right";

type Review = {
  quote: string;
  name: string;
  initials: string;
  role: string;
  tone: ReviewTone;
  pin: PinColor;
  tilt: PinTilt;
  stars: "cyan" | "white" | "navy";
  avatar: "cyan" | "navy" | "teal";
};

const REVIEWS: Review[] = [
  {
    quote:
      "Finally an AI tool that actually understands Cambridge IGCSE formatting. Everything looks genuinely professional.",
    name: "James T.",
    initials: "JT",
    role: "IGCSE Biology",
    tone: "navy",
    pin: "cyan",
    tilt: "right",
    stars: "cyan",
    avatar: "cyan",
  },
  {
    quote:
      "I was spending hours every Sunday on planning. Now I start from a complete pack and refine it for my class.",
    name: "Sarah M.",
    initials: "SM",
    role: "Secondary Teacher",
    tone: "teal",
    pin: "navy",
    tilt: "left",
    stars: "white",
    avatar: "navy",
  },
  {
    quote:
      "The curriculum route options save me from constantly rewriting generic AI output.",
    name: "Daniel R.",
    initials: "DR",
    role: "Senior Secondary",
    tone: "navy",
    pin: "cyan",
    tilt: "right",
    stars: "white",
    avatar: "cyan",
  },
  {
    quote:
      "The lesson plan, slides and activity actually feel connected instead of generated separately.",
    name: "Priya K.",
    initials: "PK",
    role: "Science Teacher",
    tone: "mint",
    pin: "navy",
    tilt: "left",
    stars: "navy",
    avatar: "teal",
  },
  {
    quote:
      "The assessment and mark scheme make the pack feel complete. It removes several separate planning jobs.",
    name: "Mark H.",
    initials: "MH",
    role: "History Teacher",
    tone: "mint",
    pin: "cyan",
    tilt: "left",
    stars: "navy",
    avatar: "teal",
  },
  {
    quote:
      "I like that it still expects me to review the material. It feels like a planning assistant rather than a replacement.",
    name: "Olivia P.",
    initials: "OP",
    role: "Primary Teacher",
    tone: "navy",
    pin: "cyan",
    tilt: "right",
    stars: "white",
    avatar: "teal",
  },
  {
    quote:
      "Ayla is especially useful when I need a quick differentiation idea without rebuilding the whole lesson.",
    name: "Emily C.",
    initials: "EC",
    role: "English Teacher",
    tone: "teal",
    pin: "navy",
    tilt: "left",
    stars: "navy",
    avatar: "navy",
  },
  {
    quote:
      "The pack format gives our department a more consistent starting point without making every teacher teach the same way.",
    name: "Michael B.",
    initials: "MB",
    role: "Head of Department",
    tone: "navy",
    pin: "cyan",
    tilt: "right",
    stars: "white",
    avatar: "teal",
  },
];

function Stars({ color }: { color: Review["stars"] }) {
  const fill =
    color === "cyan" ? "#35bebc" : color === "white" ? "#ffffff" : "#1a1e3a";

  return (
    <div className="mml-rv-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="mml-rv-star"
          viewBox="0 0 20 20"
          width="16"
          height="16"
          aria-hidden
        >
          <path
            fill={fill}
            d="M10 1.5l2.35 5.1 5.55.7-4.1 3.85.1 5.55L10 14.7l-4.9 2.5.1-5.55-4.1-3.85 5.55-.7L10 1.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="mml-rv" id="reviews" aria-labelledby="mml-rv-heading">
      <div className="mml-rv-inner">
        <p className="mml-rv-eyebrow">
          <span className="mml-rv-eyebrow-dots" aria-hidden>
            <span className="mml-rv-eyebrow-dot mml-rv-eyebrow-dot--teal" />
            <span className="mml-rv-eyebrow-dot mml-rv-eyebrow-dot--muted" />
          </span>
          REVIEWS
        </p>

        <h2 id="mml-rv-heading" className="mml-rv-title">
          Pinned in staffrooms worldwide.
        </h2>

        <p className="mml-rv-sub">
          Real teacher reactions, presented like the notes that get passed
          around a staffroom when someone finds something useful.
        </p>

        <div className="mml-rv-board" role="list">
          {REVIEWS.map((review) => (
            <article
              key={review.name}
              className={`mml-rv-card mml-rv-card--${review.tone}`}
              role="listitem"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  review.pin === "cyan" ? "/cyan-pin.svg" : "/navy-pin.svg"
                }
                alt=""
                aria-hidden
                className={`mml-rv-pin mml-rv-pin--${review.tilt}`}
                width={44}
                height={61}
              />

              <Stars color={review.stars} />

              <p className="mml-rv-quote">&ldquo;{review.quote}&rdquo;</p>

              <div className="mml-rv-author">
                <span
                  className={`mml-rv-avatar mml-rv-avatar--${review.avatar}`}
                  aria-hidden
                >
                  {review.initials}
                </span>
                <span className="mml-rv-author-meta">
                  <span className="mml-rv-author-name">{review.name}</span>
                  <span className="mml-rv-author-role">{review.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
