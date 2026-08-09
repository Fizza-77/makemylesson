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
 * Offers native install prompt when available, plus App Store & Google Play.
 */
export function InstallAppButton({
  variant = "app",
  className,
  compact = false,
}: {
  variant?: Variant;
  className?: string;
  /** Icon-only on very small widths */
  compact?: boolean;
}) {
  const { installed, platform, canPromptInstall, promptInstall } =
    usePwaInstall();
  const [open, setOpen] = useState(false);
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

  if (installed) {
    return null;
  }

  const marketing = variant === "marketing";
  const label = canPromptInstall ? "Install app" : "Download app";

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-semibold transition",
          marketing
            ? "rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[13px] text-white hover:bg-white/15"
            : "rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC]",
          compact && "size-10 px-0",
          !compact && !marketing && "max-sm:size-10 max-sm:px-0",
        )}
      >
        <DownloadGlyph className="size-4 shrink-0" />
        {!compact ? (
          <span className={cn(!marketing && "max-sm:sr-only")}>{label}</span>
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
            "absolute right-0 z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-2xl border p-4 shadow-xl",
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
            Two options: install this website as an app on your device, or
            download the native app from a store.
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {canPromptInstall ? (
              <button
                type="button"
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-[13px] font-bold",
                  marketing
                    ? "bg-[#35BEBC] text-[#1A1E3A]"
                    : "bg-[#0F172A] text-white",
                )}
                onClick={() => {
                  void promptInstall().then(() => setOpen(false));
                }}
              >
                Install web app now
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
                    <li>Open this site in <strong>Safari</strong> (not Chrome).</li>
                    <li>
                      Tap the <strong>Share</strong> button (square with an arrow).
                    </li>
                    <li>
                      Scroll and tap <strong>Add to Home Screen</strong>, then Add.
                    </li>
                  </>
                ) : platform === "android" ? (
                  <>
                    <li>Open this site in <strong>Chrome</strong>.</li>
                    <li>
                      Tap the <strong>⋮</strong> menu (top right).
                    </li>
                    <li>
                      Tap <strong>Install app</strong> or{" "}
                      <strong>Add to Home screen</strong>.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Use <strong>Chrome</strong> or <strong>Edge</strong> (not
                      Firefox/Safari on desktop for one-click install).
                    </li>
                    <li>
                      Look in the address bar for a <strong>monitor + arrow</strong>{" "}
                      (install) icon and click it.
                    </li>
                    <li>
                      Or open the browser menu <strong>⋮</strong> →{" "}
                      <strong>Cast, save, and share</strong> /{" "}
                      <strong>Apps</strong> →{" "}
                      <strong>Install Make My Lesson</strong>.
                    </li>
                    <li>
                      Confirm <strong>Install</strong>. The app opens in its own
                      window.
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
              Or get the mobile app
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
