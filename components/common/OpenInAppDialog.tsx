"use client";

import { useEffect, useState } from "react";

import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from "@/components/common/InstallAppButton";
import {
  detectPlatform,
  isStandaloneDisplay,
  wirePwaInstallListeners,
} from "@/lib/pwa-install";

const STORAGE_KEY = "mml.openInApp.choice";
const LEGACY_STORAGE_KEY = "mml.stage1.openInApp.choice";
const ANDROID_PACKAGE = "com.skyensolutions.makemylesson.make_my_lesson";

function isMobileWebContext(): boolean {
  if (typeof window === "undefined") return false;
  if (isStandaloneDisplay()) return false;
  const platform = detectPlatform();
  if (platform === "ios" || platform === "android") return true;
  return window.matchMedia("(max-width: 767px)").matches;
}

function readStoredChoice(): "browser" | "app" | null {
  try {
    const v =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (v === "browser" || v === "app") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function storeChoice(choice: "browser" | "app") {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* ignore */
  }
}

function openNativeAppOrStore(platform: "ios" | "android" | "desktop") {
  // iOS → App Store listing for Make My Lesson
  if (platform === "ios") {
    window.location.assign(APP_STORE_URL);
    return;
  }

  // Android → try installed app first; if missing, Play Store (market:// then https)
  if (platform === "android") {
    const playHttps = GOOGLE_PLAY_URL;
    const playMarket = `market://details?id=${ANDROID_PACKAGE}`;
    const path = window.location.pathname.replace(/^\//, "") || "stage1";
    const appIntent =
      `intent://${path}#Intent;` +
      `scheme=https;` +
      `package=${ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${encodeURIComponent(playHttps)};` +
      `end`;

    const startedAt = Date.now();
    window.location.assign(appIntent);

    // If the app isn't installed / Intent is ignored, open Play Store.
    window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - startedAt > 2500) return;
      window.location.assign(playMarket);
      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.location.assign(playHttps);
        }
      }, 700);
    }, 1100);
    return;
  }

  // Fallback (rare desktop “mobile” UA): Play Store web listing
  window.location.assign(GOOGLE_PLAY_URL);
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

/**
 * Mobile-browser prompt across the teacher app: stay in browser or open the app.
 * Hidden in installed/standalone PWA and after “Continue in browser”.
 */
export function OpenInAppDialog() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    wirePwaInstallListeners();
    const nextPlatform = detectPlatform();
    setPlatform(nextPlatform);

    if (!isMobileWebContext()) return;
    if (readStoredChoice() === "browser") return;

    const id = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!open) return null;

  function continueInBrowser() {
    storeChoice("browser");
    setOpen(false);
  }

  function openInApp() {
    storeChoice("app");
    setOpen(false);
    openNativeAppOrStore(platform);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#151B35]/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="open-in-app-title"
      onClick={continueInBrowser}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #E8F8F7 0%, #F5F6FA 55%, #FFFFFF 100%)",
          }}
        >
          <div className="flex items-start gap-3">
            <span
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[#28C2C0]/25 text-[#151B35] ring-1 ring-[#28C2C0]/30"
              aria-hidden
            >
              <PhoneIcon />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2
                id="open-in-app-title"
                className="text-lg font-bold tracking-tight text-[#151B35]"
              >
                Open in the app?
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
          <p className="text-sm leading-relaxed text-[#151B35]">
            Keep working here in the browser, or open Make My Lesson in the
            mobile app for a smoother classroom workflow.
          </p>

          <button
            type="button"
            className="w-full rounded-full bg-[#28C2C0] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22B0AE]"
            onClick={openInApp}
          >
            Open in app
          </button>
          <button
            type="button"
            className="w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3.5 text-sm font-semibold text-[#151B35] transition hover:border-[#28C2C0]/50 hover:bg-[#F5FBFB]"
            onClick={continueInBrowser}
          >
            Continue in browser
          </button>
        </div>
      </div>
    </div>
  );
}
