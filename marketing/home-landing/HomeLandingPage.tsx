import Image from "next/image";
import Link from "next/link";

import BeforeAfterSection from "@marketing/home-landing/BeforeAfterSection";
import ShelfSection from "@marketing/home-landing/ShelfSection";
import MeetAylaSection from "@marketing/home-landing/MeetAylaSection";
import TeachingMethodsSection from "@marketing/home-landing/TeachingMethodsSection";
import CurriculumCoverageSection from "@marketing/home-landing/CurriculumCoverageSection";
import ReviewsSection from "@marketing/home-landing/ReviewsSection";
import SisterPlatformsSection from "@marketing/home-landing/SisterPlatformsSection";
import PricingSection from "@marketing/home-landing/PricingSection";
import FinalCtaSection from "@marketing/home-landing/FinalCtaSection";
import { MML_APP } from "@marketing/lib/appUrls";

const STAGES = [
  {
    num: "01",
    name: "Plan",
    desc: "Curriculum-aligned lesson plan in seconds.",
    iconSrc: "/plan.svg",
    href: MML_APP.stage1,
  },
  {
    num: "02",
    name: "Present",
    desc: "Slides with speaker notes, ready to project.",
    iconSrc: "/present.svg",
    href: MML_APP.stage2,
  },
  {
    num: "03",
    name: "Assess",
    desc: "Worksheets, quizzes and exams that match the lesson.",
    iconSrc: "/assess.svg",
    href: MML_APP.stage3,
  },
  {
    num: "04",
    name: "Teach",
    desc: "Walk in prepared — everything in one pack.",
    iconSrc: "/teach.svg",
    href: MML_APP.stage4,
  },
] as const;

const STATS = [
  {
    value: "15h",
    label: "Saved weekly by teachers through automated document coordination.",
    tone: "light" as const,
    icon: "clock" as const,
  },
  {
    value: "1.2M",
    label: "Resources created for classrooms worldwide this year.",
    tone: "dark" as const,
    icon: "doc" as const,
  },
  {
    value: "98%",
    label: "Accuracy rate across curriculum-specific alignment checks.",
    tone: "light" as const,
    icon: "shield" as const,
  },
  {
    value: "50K+",
    label: "Active teachers planning daily with Ayla's AI engine.",
    tone: "dark" as const,
    icon: "people" as const,
  },
] as const;

function StatIcon({ name }: { name: (typeof STATS)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: "mml-mkt-stat-icon-svg",
  };
  switch (name) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 8.2v4.1l2.8 1.7" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M8 3.75h5.2L17.5 8v12.25H8z" />
          <path d="M13.1 3.75V8H17.5" />
          <path d="M10.2 12.2h5.1M10.2 15.4h5.1" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.6 18.4 6v5.2c0 4-2.7 6.9-6.4 8.2-3.7-1.3-6.4-4.2-6.4-8.2V6L12 3.6Z" />
          <path d="m9.4 12.1 1.9 1.9 3.6-3.8" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="2.6" />
          <circle cx="15.4" cy="9.4" r="2.2" />
          <path d="M4.8 18.2c.7-2.6 2.7-4 4.2-4s3.5 1.4 4.2 4" />
          <path d="M13.2 14.4c1.1-.5 2.4-.4 3.5.4 1.2.9 1.9 2.2 2.2 3.4" />
        </svg>
      );
  }
}

function StageUnderline() {
  return (
    <svg
      className="mml-mkt-title-underline"
      viewBox="0 0 320 18"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M3 11c42 6 88 7 132 4 46-3 92-8 140-5 12 .8 28 2.5 40 4"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M8 13c48 3 96 2 144-1 40-2.5 82-5 128-2"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function StageArrow() {
  return (
    <svg
      className="mml-mkt-arrow-img"
      width="28"
      height="31"
      viewBox="0 0 40 44"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 24C12 19 24 27 33 21M27 17L34 21L29 27"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeLandingPage() {
  return (
    <>
      <main className="mml-mkt-hero">
        <div className="mml-mkt-hero-inner">
          <div className="mml-mkt-laptop">
            <div className="mml-mkt-screen">
              <div className="mml-mkt-hero-top">
                <div className="mml-mkt-hero-copy">
                  <div className="mml-mkt-badge">
                    <span className="mml-mkt-badge-dot" aria-hidden />
                    AI-POWERED CO-TEACHER • GRADES 1–12
                  </div>

                  <h1 className="mml-mkt-title">
                    <span className="mml-mkt-title-line">Create Complete</span>
                    <span className="mml-mkt-title-line">Lessons in</span>
                    <span className="mml-mkt-title-accent">
                      4 Simple Stages
                      <StageUnderline />
                    </span>
                  </h1>

                  <p className="mml-mkt-sub">
                    <span className="mml-mkt-sub-line">
                      Plan, present, assess and teach a full lesson pack in minutes,
                    </span>
                    <span className="mml-mkt-sub-line">
                      aligned to your curriculum. Slides, worksheets, quizzes and
                    </span>
                    <span className="mml-mkt-sub-line">
                      teaching plans, all from one topic.
                    </span>
                  </p>
                </div>

                <div className="mml-mkt-hero-phone" aria-hidden>
                  <div className="mml-mkt-phone-frame">
                    <div className="mml-mkt-phone-notch" />
                    <div className="mml-mkt-phone-screen">
                      <Image
                        src="/mockups/mockup.jpeg"
                        alt=""
                        width={390}
                        height={844}
                        className="mml-mkt-phone-img"
                        sizes="(max-width: 960px) 200px, 240px"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mml-mkt-stages">
                {STAGES.map(({ num, name, desc, iconSrc, href }, index) => (
                  <div key={num} className="mml-mkt-stage-slot">
                    {index > 0 ? (
                      <span className="mml-mkt-arrow" aria-hidden>
                        <StageArrow />
                      </span>
                    ) : null}
                    <Link href={href} className="mml-mkt-stage">
                      <span className="mml-mkt-stage-label">STAGE {num}</span>
                      <Image
                        src={iconSrc}
                        alt=""
                        width={44}
                        height={44}
                        className="mml-mkt-stage-icon"
                        aria-hidden
                      />
                      <h2 className="mml-mkt-stage-name">{name}</h2>
                      <p className="mml-mkt-stage-desc">{desc}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="mml-mkt-laptop-base" aria-hidden />
          </div>

          <div className="mml-mkt-ctas">
            <Link href="/signup" className="mml-mkt-cta-primary">
              Start Your First Lesson — Free
              <span aria-hidden>→</span>
            </Link>
            <Link href="/#how-it-works" className="mml-mkt-cta-secondary">
              <span className="mml-mkt-cta-icon" aria-hidden>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M2 1.2v7.6L8.5 5 2 1.2z" />
                </svg>
              </span>
              See a Sample Lesson
            </Link>
          </div>

          <p className="mml-mkt-trust">
            Free to start <span className="mml-mkt-trust-dot" aria-hidden>•</span>{" "}
            No card needed <span className="mml-mkt-trust-dot" aria-hidden>•</span>{" "}
            Grades 1–12 <span className="mml-mkt-trust-dot" aria-hidden>•</span>{" "}
            Any curriculum
          </p>
        </div>
      </main>

      <section className="mml-mkt-stats" aria-label="Key stats">
        <div className="mml-mkt-stats-inner">
          <ul className="mml-mkt-stats-grid">
            {STATS.map((stat) => (
              <li
                key={stat.value}
                className={`mml-mkt-stat-card mml-mkt-stat-card--${stat.tone}`}
              >
                <span className="mml-mkt-stat-icon" aria-hidden>
                  <StatIcon name={stat.icon} />
                </span>
                <p className="mml-mkt-stat-value">{stat.value}</p>
                <p className="mml-mkt-stat-label">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BeforeAfterSection />
      <ShelfSection />
      <MeetAylaSection />
      <TeachingMethodsSection />
      <CurriculumCoverageSection />
      <ReviewsSection />
      <SisterPlatformsSection />
      <PricingSection />
      <FinalCtaSection />
    </>
  );
}
