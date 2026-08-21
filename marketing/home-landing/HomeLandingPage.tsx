import HomeHeroSection from "@marketing/home-landing/HomeHeroSection";
import MeetAylaSection from "@marketing/home-landing/MeetAylaSection";
import CurriculumCoverageSection from "@marketing/home-landing/CurriculumCoverageSection";
import ReviewsSection from "@marketing/home-landing/ReviewsSection";
import SisterPlatformsSection from "@marketing/home-landing/SisterPlatformsSection";
import PricingSection from "@marketing/home-landing/PricingSection";

const TRUST_INDICATORS = [
  {
    key: "curriculum",
    title: "Curriculum Aligned",
    tone: "purple" as const,
    icon: "book" as const,
    description: (
      <>
        Aligned with{" "}
        <span className="mml-trust-pill mml-trust-pill--purple">
          71+ curricula
        </span>{" "}
        worldwide. All grade levels.
      </>
    ),
  },
  {
    key: "customizable",
    title: "Fully Customizable",
    tone: "teal" as const,
    icon: "sliders" as const,
    description: "Edit, adjust, and tailor every part to your teaching style.",
  },
  {
    key: "export",
    title: "Export & Share",
    tone: "orange" as const,
    icon: "cloud" as const,
    description: "Download or share to Google Classroom and Microsoft Teams.",
  },
  {
    key: "teacher-first",
    title: "Teacher First",
    tone: "pink" as const,
    icon: "shield" as const,
    description: "Built for teachers. Saved profiles, history & easy reuse.",
  },
  {
    key: "methods",
    title: "16 Teaching Methods",
    tone: "blue" as const,
    icon: "grad" as const,
    description: "Use the best-fit methods to engage every learner.",
  },
  {
    key: "teachers",
    title: "50K+ Teachers",
    tone: "green" as const,
    icon: "people" as const,
    description: "Trusted by 50K+ teachers worldwide.",
  },
  {
    key: "rating",
    title: "4.8/5 Teacher Rating",
    tone: "yellow" as const,
    icon: "star" as const,
    description: "Loved by teachers around the world for results that matter.",
  },
] as const;

function TrustIcon({ name }: { name: (typeof TRUST_INDICATORS)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: "mml-trust-icon-svg",
  };
  switch (name) {
    case "book":
      return (
        <svg {...common}>
          <path d="M4.5 6.5c2.2-1.2 4.4-1.4 7.5.2v11.6c-3.1-1.6-5.3-1.4-7.5-.2V6.5Z" />
          <path d="M19.5 6.5c-2.2-1.2-4.4-1.4-7.5.2v11.6c3.1-1.6 5.3-1.4 7.5-.2V6.5Z" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <path d="M5 7h14M5 12h14M5 17h14" />
          <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="17" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M8.2 17.5h8.1A3.7 3.7 0 0 0 18.5 10.6a5.2 5.2 0 0 0-9.9 1.5A3.5 3.5 0 0 0 8.2 17.5Z" />
          <path d="M12 11.2v5.2M9.8 14.2 12 16.4l2.2-2.2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.5 19 6.2v5.1c0 4.4-2.9 7.4-7 8.7-4.1-1.3-7-4.3-7-8.7V6.2L12 3.5Z" />
          <path d="m9.4 12.1 1.8 1.8 3.5-3.7" />
        </svg>
      );
    case "grad":
      return (
        <svg {...common}>
          <path d="m3.5 10 8.5-4.2L20.5 10 12 14.2 3.5 10Z" />
          <path d="M7.2 12.2v4.2c0 1.5 2.2 2.8 4.8 2.8s4.8-1.3 4.8-2.8v-4.2" />
          <path d="M19.2 10.5v5.2" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.2" r="2.4" />
          <circle cx="16.2" cy="9" r="2" />
          <path d="M3.8 18.2c.4-2.6 2.4-4 5.2-4s4.8 1.4 5.2 4" />
          <path d="M14.2 14.6c1.7-.4 3.5.2 4.5 2.2.4.8.5 1.6.5 1.4" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3.6 2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 15.4 7.4 17.8l.9-5.1-3.8-3.6 5.2-.8L12 3.6Z" />
        </svg>
      );
  }
}

export default function HomeLandingPage() {
  return (
    <>
      <HomeHeroSection />

      <section className="mml-trust" aria-label="Trust indicators">
        <div className="mml-trust-inner">
          <div className="mml-trust-card">
            <ul className="mml-trust-row">
              {TRUST_INDICATORS.map((item) => (
                <li key={item.key} className="mml-trust-item">
                  <span
                    className={`mml-trust-icon mml-trust-icon--${item.tone}`}
                    aria-hidden
                  >
                    <TrustIcon name={item.icon} />
                  </span>
                  <p className="mml-trust-title">{item.title}</p>
                  <p className="mml-trust-desc">{item.description}</p>
                </li>
              ))}
            </ul>
            <p className="mml-trust-note">
              These numbers are live, real, and updated every week. We&apos;re a
              new platform — we&apos;d rather show you where we actually are than
              pretend to be somewhere we&apos;re not. Join us early and help us
              build something genuine.
            </p>
          </div>
        </div>
      </section>

      <MeetAylaSection />
      <div className="mml-band-gap" aria-hidden />
      <CurriculumCoverageSection />
      <div className="mml-band-gap" aria-hidden />
      <ReviewsSection />
      <SisterPlatformsSection />
      <PricingSection />
    </>
  );
}
