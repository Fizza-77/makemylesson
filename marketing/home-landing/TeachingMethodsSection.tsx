"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";

const METHODS = [
  {
    num: "01",
    title: "General (Teacher-Led)",
    icon: "/frame-1.svg",
    definition:
      "Teacher-led instruction with direct, explicit teaching — structured, curriculum-aligned lessons where the teacher guides the full sequence.",
  },
  {
    num: "02",
    title: "Flipped Classroom",
    icon: "/frame-2.svg",
    definition:
      "Move direct instruction outside class with pre-class content, then use lesson time for practice, discussion and deeper application.",
  },
  {
    num: "03",
    title: "Blended Learning",
    icon: "/frame-3.svg",
    definition:
      "Combine face-to-face teaching with online learning in one connected sequence so digital and classroom work reinforce each other.",
  },
  {
    num: "04",
    title: "Gamification",
    icon: "/frame-4.svg",
    definition:
      "Apply points, levels and challenges to boost engagement while keeping every activity aligned to curriculum outcomes.",
  },
] as const;

function MethodCard({
  num,
  title,
  icon,
  definition,
}: (typeof METHODS)[number]) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      className={`mml-tm-card${active ? " mml-tm-card--active" : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
      aria-label={`${title}. ${active ? definition : "See definition"}`}
      aria-pressed={active}
    >
      <span className="mml-tm-card-front">
        <span className="mml-tm-card-top">
          <span className="mml-tm-card-badge">{num}</span>
          <span className="mml-tm-card-dot" aria-hidden />
        </span>
        <span className="mml-tm-card-icon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" width={80} height={80} />
        </span>
        <span className="mml-tm-card-title">{title}</span>
        <span className="mml-tm-card-link">See Definition</span>
      </span>

      <span className="mml-tm-card-back">
        <span className="mml-tm-card-badge">{num}</span>
        <span className="mml-tm-card-back-title">{title}</span>
        <span className="mml-tm-card-def">{definition}</span>
      </span>
    </button>
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
          label on the plan. Inquiry-Based Learning builds around questions and
          discovery; Collaborative Learning adds structured pair and group work
          throughout.
        </p>

        <p className="mml-tm-hint">
          <RefreshCw size={14} strokeWidth={2.2} aria-hidden />
          Hover or tap a card to see the definition
        </p>

        <div className="mml-tm-grid" role="list">
          {METHODS.map((method) => (
            <div key={method.num} className="mml-tm-grid-item" role="listitem">
              <MethodCard {...method} />
            </div>
          ))}
        </div>

        <Link href="/teaching-methods" className="mml-tm-view-all">
          View All 16 Methods
          <ChevronDown size={16} strokeWidth={2.4} aria-hidden />
        </Link>

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
