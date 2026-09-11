import Image from "next/image";
import Link from "next/link";

import SectionLink from "@marketing/components/SectionLink";
import HeroCardStack from "@marketing/home-landing/HeroCardStack";
import { MML_APP } from "@marketing/lib/appUrls";

const CURRICULUMS = [
  {
    id: "aus",
    label: "AUS",
    flag: "/Flags/aus-flag.webp",
    alt: "Australia flag",
  },
  {
    id: "uk",
    label: "UK",
    flag: "/Flags/UK-flag.svg",
    alt: "United Kingdom flag",
  },
  {
    id: "ca",
    label: "Canada",
    flag: "/Flags/canada-flag.webp",
    alt: "Canada flag",
  },
  {
    id: "ib",
    label: "IB",
    flag: "/Flags/us-flag.webp",
    alt: "United States flag",
  },
  {
    id: "us",
    label: "US / AP",
    flag: "/Flags/us-flag.webp",
    alt: "United States flag",
  },
] as const;

const STEPS = [
  {
    title: "Lesson Plan",
    href: MML_APP.stage1,
    copy: "Tell us your topic, grade, subject, and duration. We'll build a structured, curriculum-aligned plan.",
  },
  {
    title: "Presentation",
    href: MML_APP.stage2,
    copy: "Get slide-by-slide content with speaker notes and beautiful visuals.",
  },
  {
    title: "Classroom Activity",
    href: MML_APP.stage3,
    copy: "Engage students with ready-to-use activities, worksheets, and group tasks.",
  },
  {
    title: "Assessment",
    href: MML_APP.stage4,
    copy: "Create assessments with answer keys and marking guides. Any stage. Any order. You're in control.",
  },
] as const;

const PERKS = [
  "5 Free Lesson Plans",
  "Save 5 Hrs on Lesson Prep",
  "No Card Required",
] as const;

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.7 8.15 6.85 10.2 11.3 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepArrow() {
  return (
    <svg
      className="mml-mkt-hero-step-arrow"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 3.5 12.5 9 6 14.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeHeroSection() {
  return (
    <main className="mml-mkt-hero" id="hero">
      <div className="mml-mkt-hero-grid-bg" aria-hidden />
      <div className="mml-mkt-hero-glow" aria-hidden />

      <div className="mml-mkt-hero-inner">
        <div className="mml-mkt-hero-split">
          <div className="mml-mkt-hero-copy-col">
            <div className="mml-mkt-hero-cta-stack">
              <div className="mml-mkt-hero-heading">
                <p className="mml-mkt-hero-kicker">
                  For teachers · 5 curriculum families · 16 teaching methods
                </p>

                <h1 className="mml-mkt-hero-title">
                  Plan, <span className="mml-mkt-hero-title-mark">Teach</span>, Assess.
                </h1>
              </div>

              <div className="mml-mkt-hero-body">
                <p className="mml-mkt-hero-lead">
                  Create a complete, curriculum-aligned teaching pack from lesson plan
                  to slides, activities and assessment in{" "}
                  <strong className="mml-mkt-hero-lead-accent">around 10 minutes.</strong>
                </p>

                <div className="mml-mkt-hero-ctas">
                  <a href={MML_APP.stage1} className="mml-mkt-hero-cta-primary">
                    Create Your First Lesson — Free
                  </a>
                  <Link
                    href="/features/lesson-plan-generator"
                    className="mml-mkt-hero-cta-secondary"
                  >
                    See a Sample Teaching Pack
                  </Link>
                </div>

                <ul className="mml-mkt-hero-perks">
                  {PERKS.map((perk) => (
                    <li key={perk}>
                      <span className="mml-mkt-hero-perk-icon">
                        <CheckIcon />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                <div className="mml-mkt-hero-flags" aria-label="Curriculum families">
                  {CURRICULUMS.map((item) => (
                    <SectionLink
                      key={item.id}
                      sectionId="curriculum"
                      href="/"
                      className="mml-mkt-hero-flag"
                    >
                    <Image
                      src={item.flag}
                      alt={item.alt}
                      width={28}
                      height={20}
                      className="mml-mkt-hero-flag-img"
                    />
                      <span>{item.label}</span>
                    </SectionLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mml-mkt-hero-visual-col">
            <HeroCardStack />
          </div>
        </div>

        {/* Steps section — full-width below the hero split */}
        <div className="mml-mkt-hero-steps-wrap">
          <p className="mml-mkt-hero-steps-heading">
            From Plan to Classroom in <span>4 Simple Steps.</span>
          </p>
          <ol className="mml-mkt-hero-steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="mml-mkt-hero-step">
                {index > 0 ? <StepArrow /> : null}
                <a href={step.href} className="mml-mkt-hero-step-link">
                  <span className="mml-mkt-hero-step-num">{index + 1}</span>
                  <h2>{step.title}</h2>
                  <p>{step.copy}</p>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}


