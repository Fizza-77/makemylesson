import Image from "next/image";

const PLATFORMS = [
  {
    key: "studiely",
    tone: "mint" as const,
    title: "Studiely — For Students",
    badge: "Start studying smarter",
    description:
      "AI-powered study support for students across the same curriculum systems as Make My Lesson.",
    href: "https://studiely.com",
    logo: "/studiely-logo.jpeg",
  },
  {
    key: "linguatude",
    tone: "navy" as const,
    title: "Linguatude — For English Test Preparation",
    badge: "IELTS, TOEFL, PTE AND CAMBRIDGE",
    description:
      "English test preparation for learners pursuing university, immigration or career goals.",
    href: "https://linguatude.com",
    logo: "/linguatude-logo.png",
  },
  {
    key: "worksheeta",
    tone: "mint" as const,
    title: "Worksheeta — For Teachers",
    badge: "AI-POWERED WORKSHEETS",
    description:
      "Create differentiated, ready-to-print worksheets and answer keys from a single topic.",
    href: "https://worksheeta.com",
    logo: "/worksheeta.jpeg",
  },
] as const;

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
            <span className="mml-sp-logo">
              <Image
                src={platform.logo}
                alt={`${platform.title} logo`}
                width={40}
                height={40}
                className="mml-sp-logo-img"
              />
            </span>

            <h3 className="mml-sp-name">{platform.title}</h3>
            <span className="mml-sp-badge">{platform.badge}</span>
            <p className="mml-sp-body">{platform.description}</p>

            <span className="mml-sp-cta">
              Read More
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
