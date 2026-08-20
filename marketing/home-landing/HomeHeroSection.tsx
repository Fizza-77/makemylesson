import Image from "next/image";
import Link from "next/link";

import HeroBackdrop from "@marketing/home-landing/HeroBackdrop";
import SectionLink from "@marketing/components/SectionLink";
import { MML_APP } from "@marketing/lib/appUrls";

const HERO_MOCKUPS = [
  {
    src: "/mockups/mockup1.jpeg",
    className: "mml-mkt-hero-phone--primary",
  },
  {
    src: "/mockups/mockup2.jpeg",
    className: "mml-mkt-hero-phone--secondary",
  },
] as const;

export default function HomeHeroSection() {
  return (
    <main className="mml-mkt-hero" id="hero">
      <div className="mml-mkt-hero-grid-bg" aria-hidden />
      <div className="mml-mkt-hero-glow" aria-hidden />
      <HeroBackdrop />

      <div className="mml-mkt-hero-inner mml-mkt-hero-split">
        <div className="mml-mkt-hero-copy-col">
          <p className="mml-mkt-hero-eyebrow">
            <span className="mml-mkt-hero-eyebrow-dot" aria-hidden />
            AI lesson planner for teachers
          </p>

          <h1 className="mml-mkt-hero-title">
            <span className="mml-mkt-hero-title-line">The AI Lesson Planner</span>
            <span className="mml-mkt-hero-title-line">and Lesson Plan Generator</span>
            <span className="mml-mkt-hero-title-line mml-mkt-hero-title-line--accent">
              for Curriculum-Aligned Teaching Packs
            </span>
          </h1>

          <p className="mml-mkt-hero-lead">
            Your curriculum, your output. Select your route, enter your topic, and
            get a standards-based, classroom-ready pack with lesson plan, AI
            presentation, classroom activity, and summative assessment with mark
            scheme <strong>in minutes, not hours.</strong> Save 2–3 hours per
            lesson and cut lesson preparation time.
          </p>

          <div className="mml-mkt-hero-ctas">
            <Link href={MML_APP.stage1} className="mml-mkt-hero-cta-primary">
              Build Your First Teaching Pack Free
              <svg
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </Link>
            <SectionLink
              sectionId="sample-lesson"
              href="/"
              className="mml-mkt-hero-cta-secondary"
            >
              See How It Works ↓
            </SectionLink>
          </div>
        </div>

        <div className="mml-mkt-hero-visual-col" aria-hidden>
          <div className="mml-mkt-hero-mockups">
            <div className="mml-mkt-hero-mockups-glow" />
            <div className="mml-mkt-hero-mockups-ring" />
            {HERO_MOCKUPS.map(({ src, className }) => (
              <div key={src} className={`mml-mkt-hero-phone ${className}`}>
                <div className="mml-mkt-hero-phone-notch" />
                <div className="mml-mkt-hero-phone-screen">
                  <Image
                    src={src}
                    alt=""
                    width={390}
                    height={844}
                    className="mml-mkt-hero-phone-img"
                    sizes="(max-width: 960px) 42vw, 220px"
                    priority
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
