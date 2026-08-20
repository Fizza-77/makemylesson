import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MML_APP } from "@marketing/lib/appUrls.js";

type StageAlign = "left" | "right";

function StageCard({
  step,
  title,
  description,
  art,
  align,
  href,
}: {
  step: string;
  title: string;
  description: string;
  art: string;
  align: StageAlign;
  href: string;
}) {
  return (
    <div className="mml-hero-stage-drift">
      <Link
        href={href}
        className="mml-hero-stage-card-link"
        aria-label={`${title} — open stage ${step.replace(/^0/, "")}`}
      >
        <span className="mml-hero-stage-try" aria-hidden>
          Try me!
        </span>
        <article className={`mml-hero-stage-card mml-hero-stage-card--${align}`}>
          <span className="mml-hero-stage-orb" aria-hidden />
          <div className="mml-hero-stage-top">
            <div className="mml-hero-stage-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art}
                alt=""
                aria-hidden
                className="mml-hero-stage-icon"
                width={56}
                height={56}
                loading="eager"
                decoding="async"
                fetchPriority="low"
              />
              <p className="mml-hero-stage-title">{title}</p>
            </div>
            <span className="mml-hero-stage-num">{step}</span>
          </div>
          <p className="mml-hero-stage-copy">{description}</p>
          <span className="mml-hero-stage-cta">
            Start now
            <ArrowRight size={12} strokeWidth={2.6} aria-hidden />
          </span>
        </article>
      </Link>
    </div>
  );
}

function StageArrow({
  id,
  variant,
}: {
  id: string;
  variant: "left-top" | "left-bottom" | "right-top" | "right-bottom";
}) {
  const paths = {
    "left-top": "M2 7 C 24 7, 44 20, 74 21",
    "left-bottom": "M2 21 C 24 21, 44 8, 74 7",
    "right-top": "M78 7 C 56 7, 36 20, 6 21",
    "right-bottom": "M78 21 C 56 21, 36 8, 6 7",
  } as const;

  return (
    <svg
      className={`mml-hero-stage-arrow mml-hero-stage-arrow--${variant}`}
      viewBox="0 0 80 28"
      fill="none"
      aria-hidden
    >
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="5.2"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M1 1 L5.4 3.5 L1 6"
            stroke="#35C4C8"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </marker>
      </defs>
      <path
        d={paths[variant]}
        stroke="#35C4C8"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

export default function HeroStageCluster({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mml-hero-cluster">
      <div className="mml-hero-cluster-col mml-hero-cluster-col--left">
        <div className="mml-hero-stage-slot">
          <StageCard
            step="01"
            title="Lesson Plan"
            description="Build your lesson plan with ease."
            art="/svgs/Plan.svg"
            align="left"
            href={MML_APP.stage1}
          />
          <StageArrow id="mml-hero-arrow-plan" variant="left-top" />
        </div>
        <div className="mml-hero-stage-slot">
          <StageCard
            step="02"
            title="Presentations"
            description="Turn your lesson into ready-to-use slides."
            art="/svgs/Present.svg"
            align="left"
            href={MML_APP.stage2}
          />
          <StageArrow id="mml-hero-arrow-present" variant="left-bottom" />
        </div>
      </div>

      <div className="mml-hero-cluster-phone">{children}</div>

      <div className="mml-hero-cluster-col mml-hero-cluster-col--right">
        <div className="mml-hero-stage-slot">
          <StageCard
            step="03"
            title="Classroom Activity"
            description="Use activities and worksheets to involve students."
            art="/svgs/Engage.svg"
            align="right"
            href={MML_APP.stage3}
          />
          <StageArrow id="mml-hero-arrow-engage" variant="right-top" />
        </div>
        <div className="mml-hero-stage-slot">
          <StageCard
            step="04"
            title="Assessment"
            description="Track learning and measure progress."
            art="/svgs/Assess.svg"
            align="right"
            href={MML_APP.stage4}
          />
          <StageArrow id="mml-hero-arrow-assess" variant="right-bottom" />
        </div>
      </div>
    </div>
  );
}
