import Image from "next/image";
import { ExternalLink } from "lucide-react";

const PLATFORMS = [
  {
    key: "mml",
    tone: "mint" as const,
    title: "Make My Lesson",
    subtitle: "— For Teachers",
    badge: "AI-POWERED LESSON PLANNING",
    paragraphs: [
      "Generates complete, curriculum-aligned teaching materials from a single topic — lesson plans, presentations, activities and assessments.",
      "Make My Lesson is our sister platform built for teachers. Where Studiely supports the student preparing for the exam, Make My Lesson supports the teacher preparing the lesson.",
    ],
    cta: "Visit Make My Lesson",
    href: "https://makemylesson.app",
    logo: "/logo-makemylesson2.png",
  },
  {
    key: "linguatude",
    tone: "navy" as const,
    title: "Linguatude — For",
    subtitle: "English Test Preparation",
    badge: "IELTS, TOEFL, PTE AND CAMBRIDGE",
    paragraphs: [
      "Built for learners whose next university place, immigration step or career opportunity depends on achieving a target English score.",
      "Where Studiely supports curriculum study, Linguatude supports the test that opens the next door.",
    ],
    cta: "Visit Linguatude",
    href: "https://linguatude.com",
    logo: "/logo-linguatude.jpg",
  },
  {
    key: "worksheeta",
    tone: "mint" as const,
    title: "Worksheeta — For",
    subtitle: "Teachers",
    badge: "AI-POWERED WORKSHEETS",
    paragraphs: [
      "Creates ready-to-print practice worksheets, classroom activities and answer keys from a single topic — differentiated for the learners in front of you.",
      "Worksheeta is our sister platform built for teachers who need classroom-ready worksheets fast. Where Make My Lesson delivers the complete teaching pack, Worksheeta focuses on the practice materials students use in class and at home.",
    ],
    cta: "Visit Worksheeta",
    href: "https://worksheeta.com",
    logo: "/logo (512x512).png",
  },
] as const;

function CornerArrow({ tone }: { tone: "mint" | "navy" }) {
  return (
    <svg
      className={`mml-sp-corner-arrow mml-sp-corner-arrow--${tone}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SisterPlatformsSection() {
  return (
    <section
      className="mml-sp"
      id="sister-platforms"
      aria-labelledby="mml-sp-heading"
    >
      <h2 id="mml-sp-heading" className="sr-only">
        Sister platforms
      </h2>

      <div className="mml-sp-grid">
        {PLATFORMS.map((platform) => (
          <a
            key={platform.key}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`mml-sp-card mml-sp-card--${platform.tone}`}
          >
            <span className="mml-sp-card-top">
              <span className="mml-sp-logo">
                <Image
                  src={platform.logo}
                  alt=""
                  width={48}
                  height={48}
                  className="mml-sp-logo-img"
                />
              </span>
              <CornerArrow tone={platform.tone} />
            </span>

            <h3 className="mml-sp-name">
              <span className="mml-sp-name-title">{platform.title}</span>
              <span className="mml-sp-name-sub">{platform.subtitle}</span>
            </h3>

            <span className="mml-sp-badge">{platform.badge}</span>

            <div className="mml-sp-body">
              {platform.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <span className="mml-sp-cta">
              {platform.cta}
              <ExternalLink size={14} strokeWidth={2.2} aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
