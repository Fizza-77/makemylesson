"use client";

import { useState } from "react";

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

const REVIEW_SLIDES: Review[][] = [
  [
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
  ],
  [
    {
      quote:
        "Used it for a Year 9 unit last week. The speaker notes were the bit I didn't expect to keep — they were actually usable as-is.",
      name: "Hannah L.",
      initials: "HL",
      role: "Geography Teacher",
      tone: "teal",
      pin: "navy",
      tilt: "left",
      stars: "white",
      avatar: "navy",
    },
    {
      quote:
        "We're on the Australian curriculum and it finally stops me pasting ChatGPT output into a template that never quite fits.",
      name: "Tom W.",
      initials: "TW",
      role: "Year 7–10 Maths",
      tone: "navy",
      pin: "cyan",
      tilt: "right",
      stars: "cyan",
      avatar: "cyan",
    },
    {
      quote:
        "Not perfect every time, but editing a full pack takes me a fraction of what building from scratch used to.",
      name: "Aisha N.",
      initials: "AN",
      role: "SENCO / English",
      tone: "mint",
      pin: "navy",
      tilt: "left",
      stars: "navy",
      avatar: "teal",
    },
    {
      quote:
        "Exported to Teams for my cover teacher and everything stayed aligned. That alone saved an awkward Monday morning.",
      name: "Chris D.",
      initials: "CD",
      role: "KS3 Science",
      tone: "navy",
      pin: "cyan",
      tilt: "right",
      stars: "white",
      avatar: "teal",
    },
    {
      quote:
        "The IB MYP wording was close enough that I only tweaked tone. That never happens with generic tools.",
      name: "Laura S.",
      initials: "LS",
      role: "MYP Humanities",
      tone: "mint",
      pin: "cyan",
      tilt: "left",
      stars: "navy",
      avatar: "teal",
    },
    {
      quote:
        "I still rewrite a few slides to sound like me, but the sequence is already there. Huge difference on busy weeks.",
      name: "Ryan F.",
      initials: "RF",
      role: "Middle School",
      tone: "teal",
      pin: "navy",
      tilt: "right",
      stars: "white",
      avatar: "navy",
    },
    {
      quote:
        "Parents asked where the worksheet came from. I told them I made it — which is mostly true after twenty minutes of edits.",
      name: "Nadia K.",
      initials: "NK",
      role: "Primary Years",
      tone: "navy",
      pin: "cyan",
      tilt: "left",
      stars: "cyan",
      avatar: "cyan",
    },
    {
      quote:
        "Our NQT used it for her first observation lesson. She still taught it — she just wasn't building resources at midnight.",
      name: "Ben A.",
      initials: "BA",
      role: "Mentor Teacher",
      tone: "navy",
      pin: "cyan",
      tilt: "right",
      stars: "white",
      avatar: "teal",
    },
  ],
  [
    {
      quote:
        "The mark scheme matched the paper better than what I usually cobble together the night before.",
      name: "Sophie R.",
      initials: "SR",
      role: "GCSE English",
      tone: "mint",
      pin: "navy",
      tilt: "left",
      stars: "navy",
      avatar: "teal",
    },
    {
      quote:
        "I open Ayla when a lesson lands flat and I need a second activity fast. Feels like texting a colleague.",
      name: "Jake P.",
      initials: "JP",
      role: "PE / Health",
      tone: "teal",
      pin: "cyan",
      tilt: "right",
      stars: "white",
      avatar: "navy",
    },
    {
      quote:
        "Ontario expectations are picky. This was the first tool that didn't give me US-style objectives by default.",
      name: "Megan C.",
      initials: "MC",
      role: "Grade 8",
      tone: "navy",
      pin: "navy",
      tilt: "left",
      stars: "cyan",
      avatar: "cyan",
    },
    {
      quote:
        "Shared a ZIP with my parallel teacher. Same topic, same route — we each still taught it differently.",
      name: "David O.",
      initials: "DO",
      role: "Science Lead",
      tone: "navy",
      pin: "cyan",
      tilt: "right",
      stars: "white",
      avatar: "teal",
    },
    {
      quote:
        "I was sceptical of AI lesson tools. This one at least gives me something I'd show another adult.",
      name: "Claire H.",
      initials: "CH",
      role: "Drama / English",
      tone: "mint",
      pin: "cyan",
      tilt: "left",
      stars: "navy",
      avatar: "teal",
    },
  ],
];

function Stars({ color }: { color: Review["stars"] }) {
  const fill =
    color === "cyan" ? "#159f9b" : color === "white" ? "#ffffff" : "#0e294c";

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

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className={`mml-rv-card mml-rv-card--${review.tone}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={review.pin === "cyan" ? "/cyan-pin.svg" : "/navy-pin.svg"}
        alt="Decorative review pin"
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
  );
}

export default function ReviewsSection() {
  const [page, setPage] = useState(0);

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

        <div className="mml-rv-board">
          <div className="mml-rv-viewport" aria-live="polite">
            <div
              className="mml-rv-track"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {REVIEW_SLIDES.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className="mml-rv-slide"
                  aria-hidden={page !== slideIndex}
                  aria-label={`Reviews page ${slideIndex + 1}`}
                >
                  {slide.map((review) => (
                    <ReviewCard
                      key={`${slideIndex}-${review.name}`}
                      review={review}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mml-rv-dots" role="tablist" aria-label="Review pages">
          {REVIEW_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={page === i}
              aria-label={`Show reviews page ${i + 1}`}
              className={`mml-rv-dot${page === i ? " mml-rv-dot--active" : ""}`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
