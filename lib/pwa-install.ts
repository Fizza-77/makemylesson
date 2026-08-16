"use client";

/**
 * Module-level PWA install helpers.
 *
 * Chrome fires `beforeinstallprompt` once, often before React hydrates.
 * We only call `preventDefault()` while custom install UI is mounted
 * (ref-counted). Otherwise the browser keeps its native install UI.
 */

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Listener = () => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
let captureRefCount = 0;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mq || iosStandalone;
}

export function detectPlatform(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function ensureInstalledFlag() {
  if (typeof window === "undefined") return;
  if (isStandaloneDisplay()) {
    installed = true;
    deferredPrompt = null;
  }
}

function onBeforeInstallPrompt(e: Event) {
  // Without preventDefault, Chromium can show its own install UI.
  // Only suppress + stash the event while custom install controls are active.
  if (captureRefCount <= 0) return;
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  notify();
}

function onAppInstalled() {
  installed = true;
  deferredPrompt = null;
  notify();
}

let wired = false;

/** Call once from the client. Safe to call multiple times. */
export function wirePwaInstallListeners() {
  if (typeof window === "undefined" || wired) return;
  wired = true;
  ensureInstalledFlag();
  window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  window.addEventListener("appinstalled", onAppInstalled);
}

/**
 * Opt into deferred `beforeinstallprompt` capture for custom install UI.
 * Ref-counted so multiple controls can mount safely.
 */
export function acquirePwaInstallCapture() {
  wirePwaInstallListeners();
  captureRefCount += 1;
}

export function releasePwaInstallCapture() {
  captureRefCount = Math.max(0, captureRefCount - 1);
  if (captureRefCount === 0) {
    deferredPrompt = null;
    notify();
  }
}

export function subscribePwaInstall(listener: Listener): () => void {
  wirePwaInstallListeners();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function getPwaInstalled() {
  ensureInstalledFlag();
  return installed;
}

export async function promptPwaInstall(): Promise<
  "accepted" | "dismissed" | "unavailable"
> {
  wirePwaInstallListeners();
  const promptEvent = deferredPrompt;
  if (!promptEvent) return "unavailable";

  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    deferredPrompt = null;
    if (choice.outcome === "accepted") {
      installed = true;
    }
    notify();
    return choice.outcome;
  } catch {
    deferredPrompt = null;
    notify();
    return "unavailable";
  }
}

// Eager wire as soon as this module loads in the browser.
if (typeof window !== "undefined") {
  wirePwaInstallListeners();
}
