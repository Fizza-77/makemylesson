"use client";

import { useEffect, useId, useRef, useState } from "react";

import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";

export const APP_STORE_URL = "https://apps.apple.com/app/id6762620632";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.skyensolutions.makemylesson.make_my_lesson";

type Variant = "marketing" | "app";

/**
 * Download / install control for marketing + teacher PWA chrome.
 * Uses early-captured `beforeinstallprompt` when available; always shows a
 * fallback panel so the control never silently does nothing.
 */
export function InstallAppButton({
  variant = "app",
  className,
  compact = false,
  expanded = false,
}: {
  variant?: Variant;
  className?: string;
  compact?: boolean;
  /** Full-width control with visible label (e.g. mobile nav drawer). */
  expanded?: boolean;
}) {
  const { installed, platform, canPromptInstall, promptInstall } =
    usePwaInstall();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Already running as installed PWA — hide install / "App installed" CTA.
  if (installed) return null;

  const marketing = variant === "marketing";
  const label = canPromptInstall ? "Install app" : "Download app";
  const iconOnlyMobile = !compact && !marketing && !expanded;

  async function handleInstallClick() {
    setBusy(true);
    setStatus(null);
    try {
      if (canPromptInstall) {
        const accepted = await promptInstall();
        if (accepted) {
          setStatus("Installed — you can open Make My Lesson from your apps.");
          setOpen(true);
          return;
        }
        setStatus("Install was dismissed. You can try again or use a store link.");
        setOpen(true);
        return;
      }
      setOpen((v) => !v);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative inline-flex", expanded && "w-full", className)}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={busy}
        onClick={() => void handleInstallClick()}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 transition disabled:opacity-60",
          marketing
            ? "rounded-full border-[1.5px] border-[#35BEBC] bg-transparent px-3.5 py-2 text-[length:var(--site-nav-font-size,13px)] font-bold text-white hover:bg-[#35BEBC]/15"
            : "rounded-full border-[1.5px] border-[#1A1E3A] bg-white px-3.5 py-2 text-[length:var(--site-nav-font-size,13px)] font-bold text-[#1A1E3A] hover:bg-[#1A1E3A] hover:text-white",
          compact && "size-10 px-0",
          iconOnlyMobile && "max-sm:size-10 max-sm:px-0",
          expanded && "h-auto min-h-11 w-full px-4 py-3",
        )}
      >
        <DownloadGlyph className="size-4 shrink-0" />
        {!compact ? (
          <span className={cn(iconOnlyMobile && "max-sm:sr-only")}>{label}</span>
        ) : (
          <span className="sr-only">{label}</span>
        )}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Download Make My Lesson"
          className={cn(
            "absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border p-4 shadow-xl",
            marketing
              ? "border-white/10 bg-[#1A1E3A] text-white"
              : "border-[#E5E7EB] bg-white text-[#0F172A]",
          )}
        >
          <p
            className={cn(
              "text-[13px] font-bold",
              marketing ? "text-white" : "text-[#0F172A]",
            )}
          >
            Get the app
          </p>
          <p
            className={cn(
              "mt-1 text-[12px] leading-relaxed",
              marketing ? "text-white/60" : "text-[#64748B]",
            )}
          >
            Install this site as an app, or download from the App Store / Google
            Play.
          </p>

          {status ? (
            <p
              className={cn(
                "mt-2 rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                marketing
                  ? "bg-white/5 text-[#35BEBC]"
                  : "bg-[#E7F7F6] text-[#0F172A]",
              )}
              role="status"
            >
              {status}
            </p>
          ) : null}

          <div className="mt-3 flex flex-col gap-2">
            {canPromptInstall ? (
              <button
                type="button"
                disabled={busy}
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-[13px] font-bold disabled:opacity-60",
                  marketing
                    ? "bg-[#35BEBC] text-[#1A1E3A]"
                    : "bg-[#0F172A] text-white",
                )}
                onClick={() => void handleInstallClick()}
              >
                {busy ? "Opening install…" : "Install web app now"}
              </button>
            ) : null}

            {!canPromptInstall ? (
              <ol
                className={cn(
                  "list-decimal space-y-1.5 rounded-xl px-3 py-2.5 pl-7 text-[12px] leading-relaxed",
                  marketing
                    ? "bg-white/5 text-white/80"
                    : "bg-[#F5F6FA] text-[#475569]",
                )}
              >
                {platform === "ios" ? (
                  <>
                    <li>
                      Open this site in <strong>Safari</strong> (required on
                      iPhone/iPad).
                    </li>
                    <li>
                      Tap <strong>Share</strong> (square with an arrow).
                    </li>
                    <li>
                      Tap <strong>Add to Home Screen</strong>, then Add.
                    </li>
                  </>
                ) : platform === "android" ? (
                  <>
                    <li>
                      Open this site in <strong>Chrome</strong>.
                    </li>
                    <li>
                      Tap the <strong>⋮</strong> menu (top right).
                    </li>
                    <li>
                      Tap <strong>Install app</strong> or{" "}
                      <strong>Add to Home screen</strong>.
                    </li>
                    <li>
                      If Install is missing, use a production HTTPS build (or{" "}
                      <code className="text-[11px]">next start</code> locally)
                      — the service worker is required.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Use <strong>Chrome</strong> or <strong>Edge</strong>.
                    </li>
                    <li>
                      Look for the <strong>install</strong> icon in the address
                      bar, or menu → <strong>Install Make My Lesson</strong>.
                    </li>
                    <li>
                      On localhost, run{" "}
                      <code className="text-[11px]">npm run build</code> then{" "}
                      <code className="text-[11px]">npm run start</code> (or set{" "}
                      <code className="text-[11px]">PWA_DEV=1</code>). The
                      install prompt needs a service worker.
                    </li>
                  </>
                )}
              </ol>
            ) : null}

            <p
              className={cn(
                "mt-1 text-[11px] font-semibold uppercase tracking-wide",
                marketing ? "text-white/45" : "text-[#94A3B8]",
              )}
            >
              Native mobile apps
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-[13px] font-semibold no-underline",
                marketing
                  ? "border border-white/20 text-white hover:bg-white/10"
                  : "border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F8FAFC]",
              )}
              onClick={() => setOpen(false)}
            >
              Download on the App Store
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-[13px] font-semibold no-underline",
                marketing
                  ? "border border-white/20 text-white hover:bg-white/10"
                  : "border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F8FAFC]",
              )}
              onClick={() => setOpen(false)}
            >
              Get it on Google Play
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DownloadGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}


