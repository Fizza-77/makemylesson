"use client";

import { useEffect, useState } from "react";

import { consumeLogoSplashRequest } from "@/lib/logo-splash";

import "./DesktopLogoSplash.css";

/** Wordmark finishes at ~3.35s; hold briefly, then fade the overlay. */
const SPLASH_HOLD_MS = 3600;
const SPLASH_FADE_MS = 450;
const DESKTOP_MQ = "(min-width: 1024px)";

/**
 * Fullscreen MML logo intro when:
 * - the web/PWA app shell first mounts on desktop, or
 * - the user just signed in (any viewport; queued via `requestLogoSplash`).
 * Skips reduced-motion users after a short hold.
 */
export function DesktopLogoSplash() {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromSignIn = consumeLogoSplashRequest();
    const isDesktop = window.matchMedia(DESKTOP_MQ).matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    // Cold open / PWA open: desktop only. Sign-in welcome: all viewports.
    if (!fromSignIn && !isDesktop) {
      setGone(true);
      return;
    }

    setMounted(true);

    if (reduceMotion) {
      const fadeTimer = window.setTimeout(() => setExiting(true), 500);
      const doneTimer = window.setTimeout(
        () => setGone(true),
        500 + SPLASH_FADE_MS,
      );
      return () => {
        window.clearTimeout(fadeTimer);
        window.clearTimeout(doneTimer);
      };
    }

    const fadeTimer = window.setTimeout(() => setExiting(true), SPLASH_HOLD_MS);
    const doneTimer = window.setTimeout(
      () => setGone(true),
      SPLASH_HOLD_MS + SPLASH_FADE_MS,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!mounted || gone) return null;

  return (
    <div
      className={`mml-logo-splash${exiting ? " mml-logo-splash--exit" : ""}`}
      role="presentation"
      aria-hidden
    >
      <div className="mml-logo-splash-stage">
        <div className="mml-logo-splash-wrap">
          <div className="mml-logo-splash-icon-box">
            <span className="mml-logo-splash-ring mml-logo-splash-ring--1" />
            <span className="mml-logo-splash-ring mml-logo-splash-ring--2" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mml-logo-splash-icon"
              src="/animations/logo-splash/icon.png"
              alt=""
              width={298}
              height={340}
              decoding="async"
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mml-logo-splash-wordmark"
            src="/animations/logo-splash/wordmark.png"
            alt=""
            width={559}
            height={223}
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}


