import Link from "next/link";
import { ArrowRight } from "lucide-react";

function LessonUnderline() {
  return (
    <svg
      className="mml-cta-underline"
      viewBox="0 0 220 14"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M4 9c32 3.5 72 4 112 1.5 38-2.5 74-6.5 100-2"
        stroke="#35bebc"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FinalCtaSection() {
  return (
    <section className="mml-cta" aria-labelledby="mml-cta-heading">
      <div className="mml-cta-frame">
        <div className="mml-cta-screen">
          <h2 id="mml-cta-heading" className="mml-cta-title">
            Start Your{" "}
            <span className="mml-cta-title-accent">
              First Lesson
              <LessonUnderline />
            </span>{" "}
            Now
          </h2>

          <p className="mml-cta-sub">
            Your next class is one topic away. Plan, present, assess and teach —
            free to start, no credit card required.
          </p>

          <Link href="/signup" className="mml-cta-btn">
            Start Your First Lesson
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </Link>

          <p className="mml-cta-meta">
            <span>Free trial</span>
            <span className="mml-cta-meta-dot" aria-hidden />
            <span>Instant setup</span>
            <span className="mml-cta-meta-dot" aria-hidden />
            <span>Cancel anytime</span>
          </p>
        </div>

        <div className="mml-cta-ledge" aria-hidden>
          <span className="mml-cta-eraser" />
        </div>
      </div>
    </section>
  );
}
