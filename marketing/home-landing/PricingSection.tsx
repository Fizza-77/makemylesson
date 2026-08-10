import Link from "next/link";
import { Check } from "lucide-react";

type Plan = {
  key: string;
  name: string;
  tone: "white" | "teal";
  popular?: boolean;
  wasPrice?: string;
  price: string;
  priceSuffix?: string;
  priceNote: string;
  features: string[];
  featureStyle: "dots" | "checks";
  cta: string;
  href: string;
  footnote?: string;
};

const PLANS: Plan[] = [
  {
    key: "free",
    name: "Free",
    tone: "white",
    price: "$0",
    priceNote: "Forever free",
    features: ["5 total generations", "Notes (5 only)", "Flashcards (5 only)"],
    featureStyle: "dots",
    cta: "Get Started",
    href: "/signup",
    footnote: "After 5 gens, upgrade.",
  },
  {
    key: "monthly",
    name: "Monthly",
    tone: "white",
    wasPrice: "$14.99",
    price: "$9.99",
    priceSuffix: "/mo",
    priceNote: "One payment per month of access",
    features: [
      "Total 100 generations for 1 month",
      "Unlimited Notes & Flashcards",
      "Export PDF & Word",
    ],
    featureStyle: "dots",
    cta: "Choose Monthly",
    href: "/pricing",
    footnote: "Cancel anytime.",
  },
  {
    key: "3mo",
    name: "3 Months",
    tone: "white",
    wasPrice: "$39.99",
    price: "$26.99",
    priceSuffix: " total",
    priceNote: "$8.99 USD/mo · one payment per 3 months of access",
    features: [
      "Total 300 generations for 3 months",
      "Everything in Monthly",
      "Unlimited all tools",
    ],
    featureStyle: "dots",
    cta: "Choose 3 Months",
    href: "/pricing",
    footnote: "Cancel anytime.",
  },
  {
    key: "6mo",
    name: "6 Months",
    tone: "white",
    popular: true,
    wasPrice: "$74.99",
    price: "$49.99",
    priceSuffix: " total",
    priceNote: "$8.33 USD/mo · one payment per 6 months of access",
    features: [
      "Total 600 generations for 6 months",
      "Everything in Monthly",
      "Unlimited all tools",
    ],
    featureStyle: "dots",
    cta: "Choose 6 Months",
    href: "/pricing",
    footnote: "Cancel anytime.",
  },
  {
    key: "annual",
    name: "Annual",
    tone: "white",
    wasPrice: "$139.99",
    price: "$89.99",
    priceSuffix: " total",
    priceNote: "$7.50 USD/mo · One annual payment",
    features: [
      "Total 1200 generations for 12 months",
      "Everything in Monthly",
      "Unlimited all tools",
    ],
    featureStyle: "checks",
    cta: "Choose Annual",
    href: "/pricing",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`mml-pr-card mml-pr-card--${plan.tone}${
        plan.popular ? " mml-pr-card--popular" : ""
      }`}
    >
      {plan.popular ? <span className="mml-pr-badge">POPULAR</span> : null}

      <h3 className="mml-pr-name">{plan.name}</h3>

      <div className="mml-pr-price-block">
        {plan.wasPrice ? (
          <span className="mml-pr-was">{plan.wasPrice}</span>
        ) : null}
        <p className="mml-pr-price">
          <span className="mml-pr-price-main">{plan.price}</span>
          {plan.priceSuffix ? (
            <span className="mml-pr-price-suffix">{plan.priceSuffix}</span>
          ) : null}
        </p>
        <p className="mml-pr-price-note">{plan.priceNote}</p>
      </div>

      <ul
        className={`mml-pr-features mml-pr-features--${plan.featureStyle}`}
      >
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="mml-pr-feature-icon" aria-hidden>
              {plan.featureStyle === "checks" ? (
                <Check size={11} strokeWidth={3} />
              ) : null}
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={plan.href} className="mml-pr-cta">
        {plan.cta}
      </Link>

      {plan.footnote ? (
        <p className="mml-pr-footnote">{plan.footnote}</p>
      ) : null}
    </article>
  );
}

export default function PricingSection() {
  return (
    <section className="mml-pr" id="pricing" aria-labelledby="mml-pr-heading">
      <div className="mml-pr-glow mml-pr-glow--left" aria-hidden />
      <div className="mml-pr-glow mml-pr-glow--right" aria-hidden />

      <div className="mml-pr-inner">
        <p className="mml-pr-eyebrow">
          <span className="mml-pr-eyebrow-dots" aria-hidden>
            <span className="mml-pr-eyebrow-dot mml-pr-eyebrow-dot--teal" />
            <span className="mml-pr-eyebrow-dot mml-pr-eyebrow-dot--muted" />
          </span>
          SIMPLE PLANS FOR EVERY TEACHER
        </p>

        <h2 id="mml-pr-heading" className="mml-pr-title">
          Pricing that{" "}
          <span className="mml-pr-title-accent">fits your teaching.</span>
        </h2>

        <p className="mml-pr-sub">
          Start free, then choose the access period that works best for you.
        </p>

        <div className="mml-pr-grid">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
