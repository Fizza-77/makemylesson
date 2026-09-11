"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SCREENS = [
  {
    src: "/mockups/mockup1.jpeg",
    alt: "Make My Lesson app — lesson plan stage on mobile",
  },
  {
    src: "/mockups/mockup2.jpeg",
    alt: "Make My Lesson app — presentation stage on mobile",
  },
  {
    src: "/mockups/mockup3.jpeg",
    alt: "Make My Lesson app — classroom activity stage on mobile",
  },
] as const;

const HOLD_MS = 4000;
const TRANSITION_S = 1.35;
const CYCLE_MS = HOLD_MS + TRANSITION_S * 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

const rest = {
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  rotateY: 0,
  rotateZ: 0,
  opacity: 1,
  zIndex: 2,
};

const incoming = {
  x: 80,
  y: 10,
  z: -100,
  scale: 0.88,
  rotateY: 25,
  rotateZ: 2,
  opacity: 0.3,
  zIndex: 1,
};

const outgoing = {
  x: -45,
  y: 5,
  z: -80,
  scale: 0.92,
  rotateY: -22,
  rotateZ: -2,
  opacity: 0.25,
  zIndex: 3,
};

function PhoneScreen({
  src,
  alt,
  fetchPriority = "auto",
}: {
  src: string;
  alt: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  return (
    <>
      <span className="mml-mkt-phone-notch" aria-hidden />
      <div className="mml-mkt-phone-screen">
        <Image
          src={src}
          alt={alt}
          width={390}
          height={844}
          className="mml-mkt-phone-img"
          sizes="(max-width: 720px) 42vw, 198px"
          loading="eager"
          fetchPriority={fetchPriority}
        />
      </div>
    </>
  );
}

export default function HeroPhoneCarousel() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SCREENS.length);
    }, reduceMotion ? HOLD_MS : CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const screen = SCREENS[index];

  return (
    <div className="mml-mkt-phones">
      <div className="sr-only">
        {SCREENS.map((item, i) => (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={390}
            height={844}
            loading="eager"
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}
      </div>

      <div className="mml-mkt-phone-glow" aria-hidden />

      <div className="mml-mkt-phone-stage">
        <div className="mml-mkt-phone mml-mkt-phone--sizer" aria-hidden>
          <PhoneScreen
            src={SCREENS[0].src}
            alt={SCREENS[0].alt}
            fetchPriority="high"
          />
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            key={screen.src}
            className="mml-mkt-phone mml-mkt-phone--layer"
            initial={reduceMotion ? { opacity: 0 } : incoming}
            animate={reduceMotion ? { opacity: 1 } : rest}
            exit={reduceMotion ? { opacity: 0 } : outgoing}
            transition={
              reduceMotion
                ? { duration: 0.35, ease: "easeOut" }
                : { duration: TRANSITION_S, ease: EASE }
            }
          >
            <PhoneScreen
              src={screen.src}
              alt={screen.alt}
              fetchPriority={screen.src === SCREENS[0].src ? "high" : "auto"}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


