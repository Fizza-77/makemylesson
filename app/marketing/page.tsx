import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  GraduationCap,
  ListChecks,
  Monitor,
} from "lucide-react";
import BeforeAfterSection from "./BeforeAfterSection";
import ShelfSection from "./ShelfSection";
import MeetAylaSection from "./MeetAylaSection";
import TeachingMethodsSection from "./TeachingMethodsSection";
import CurriculumCoverageSection from "./CurriculumCoverageSection";
import ReviewsSection from "./ReviewsSection";
import SisterPlatformsSection from "./SisterPlatformsSection";
import PricingSection from "./PricingSection";
import FinalCtaSection from "./FinalCtaSection";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/teaching-methods", label: "Teaching methods" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQs" },
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact", label: "Contact Us" },
] as const;

const STAGES = [
  {
    num: "01",
    name: "Plan",
    desc: "Curriculum-aligned lesson plan in seconds.",
    Icon: ClipboardList,
  },
  {
    num: "02",
    name: "Present",
    desc: "Slides with speaker notes, ready to project.",
    Icon: Monitor,
  },
  {
    num: "03",
    name: "Assess",
    desc: "Worksheets, quizzes and exams that match the lesson.",
    Icon: ListChecks,
  },
  {
    num: "04",
    name: "Teach",
    desc: "Walk in prepared — everything in one pack.",
    Icon: GraduationCap,
  },
] as const;

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
        stroke="#5ec4de"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M8 13c48 3 96 2 144-1 40-2.5 82-5 128-2"
        stroke="#7dd3e8"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export default function MarketingPage() {
  return (
    <>
      <nav className="mml-mkt-nav" aria-label="Main navigation">
        <div className="mml-mkt-nav-inner">
          <Link href="/" className="mml-mkt-brand">
            Make My Lesson
          </Link>

          <ul className="mml-mkt-links">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          <div className="mml-mkt-actions">
            <Link href="/login" className="mml-mkt-signin">
              Sign in
            </Link>
            <Link href="/signup" className="mml-mkt-get-started">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="mml-mkt-hero">
        <div className="mml-mkt-hero-inner">
          <div className="mml-mkt-laptop">
            <div className="mml-mkt-screen">
              <div className="mml-mkt-badge">
                <span className="mml-mkt-badge-dot" aria-hidden />
                AI-POWERED CO-TEACHER • GRADES 1–12
              </div>

              <h1 className="mml-mkt-title">
                <span className="mml-mkt-title-line">Create Complete Lessons in</span>
                <span className="mml-mkt-title-accent">
                  4 Simple Stages
                  <StageUnderline />
                </span>
              </h1>

              <p className="mml-mkt-sub">
                Plan, present, assess and teach — a full lesson pack in minutes,
                aligned to your curriculum. Slides, worksheets, quizzes and
                teaching plans, all from one topic.
              </p>

              <div className="mml-mkt-stages">
                {STAGES.map(({ num, name, desc, Icon }, index) => (
                  <div key={num} className="mml-mkt-stage-slot">
                    {index > 0 ? (
                      <span className="mml-mkt-arrow" aria-hidden>
                        <Image
                          src="/arrow.svg"
                          alt=""
                          width={28}
                          height={31}
                          className="mml-mkt-arrow-img"
                        />
                      </span>
                    ) : null}
                    <article className="mml-mkt-stage">
                      <span className="mml-mkt-stage-label">STAGE {num}</span>
                      <Icon
                        className="mml-mkt-stage-icon"
                        size={22}
                        strokeWidth={1.7}
                        aria-hidden
                      />
                      <h2 className="mml-mkt-stage-name">{name}</h2>
                      <p className="mml-mkt-stage-desc">{desc}</p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
            <div className="mml-mkt-laptop-chin" aria-hidden>
              <span className="mml-mkt-chin-pill" />
              <span className="mml-mkt-chin-badge" />
            </div>
            <div className="mml-mkt-laptop-base" aria-hidden />
          </div>

          <div className="mml-mkt-ctas">
            <Link href="/signup" className="mml-mkt-cta-primary">
              Start Your First Lesson — Free
              <span aria-hidden>→</span>
            </Link>
            <Link href="/#how-it-works" className="mml-mkt-cta-secondary">
              See a Sample Lesson
              <span className="mml-mkt-cta-icon" aria-hidden>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M2 1.2v7.6L8.5 5 2 1.2z" />
                </svg>
              </span>
            </Link>
          </div>

          <p className="mml-mkt-trust">
            Free to start • No card needed • Grades 1–12 • Any curriculum
          </p>
        </div>
      </main>

      <section className="mml-mkt-stats" aria-label="Key stats">
        <div className="mml-mkt-stats-inner">
          <Image
            src="/Group 3.svg"
            alt="15h saved weekly by teachers, 1.2M resources created, 98% accuracy rate, and 50K+ active teachers"
            width={1340}
            height={245}
            className="mml-mkt-stats-img"
            priority={false}
          />
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
