"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";
import { STAGE2_THEMES, type Stage2SlideTheme } from "@/data/stage2-themes";
import { STAGE2_MIN_SOURCE_CHARS } from "@/types/stage2";
import type { LibraryItem } from "@/types/library-item";

const SLIDE_COUNTS = [5, 7, 9, 11, 13] as const;

function MonitorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="size-5"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path strokeLinecap="round" d="M8 20h8M12 16v4" />
    </svg>
  );
}

function UploadDocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 18v-6M9.5 14.5 12 12l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LessonDocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
      <path
        d="M4 19.5V5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 1-2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 7h7M8 11h7M8 15h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M17 3h1a2 2 0 0 1 2 2v14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function themeGradient(theme: Stage2SlideTheme): string {
  const [a, b, c] = theme.backgroundGradient;
  return `linear-gradient(135deg, ${a} 0%, ${b} 50%, ${c} 100%)`;
}

function ThemeBoardCard({
  theme,
  active,
  disabled,
  onSelect,
}: {
  theme: Stage2SlideTheme;
  active: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={active}
      aria-label={theme.name}
      className={cn(
        "relative w-[9.75rem] shrink-0 outline-none disabled:opacity-50 sm:w-[10.5rem]",
        active && "scale-[1.02]",
      )}
    >
      <Image
        src="/theme board.svg"
        alt=""
        width={218}
        height={248}
        className="pointer-events-none h-auto w-full select-none"
        unoptimized
      />
      <div className="absolute top-[18%] bottom-[10%] left-[11%] right-[5%] flex flex-col items-center">
        <div
          className={cn(
            "aspect-[5/3.4] w-[90%] overflow-hidden rounded-md shadow-sm transition",
            active && "ring-2 ring-[#28C2C0] ring-offset-1",
          )}
        >
          <div
            className="flex h-full flex-col justify-between p-2"
            style={{ background: themeGradient(theme) }}
          >
            <span
              className="h-1 w-7 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              }}
            />
            <span
              className="text-center text-xl font-bold leading-none sm:text-2xl"
              style={{ color: theme.titleColor }}
            >
              Aa
            </span>
            <div className="space-y-1">
              <span
                className="block h-1 w-10 rounded-full opacity-70"
                style={{ background: theme.mutedColor }}
              />
              <span
                className="block h-1 w-7 rounded-full opacity-50"
                style={{ background: theme.mutedColor }}
              />
            </div>
          </div>
        </div>
        <p className="mt-2 w-[90%] truncate text-center text-[11px] font-bold text-[#151B35]">
          {theme.name}
        </p>
      </div>
    </button>
  );
}

export function Stage2PresentationSetup({
  sourceMode,
  themeId,
  slideCount,
  sourceLen,
  topic,
  isGenerating,
  isLoading,
  lessonPlans,
  pickerOpen,
  onTogglePicker,
  onSelectUpload,
  onSelectStage1,
  onPickLibraryItem,
  onUploadFile,
  onThemeSelect,
  onSlideCount,
  onGenerate,
  canGenerate,
}: {
  sourceMode: "stage1Library" | "upload";
  themeId: string;
  slideCount: number;
  sourceLen: number;
  topic: string;
  isGenerating?: boolean;
  isLoading?: boolean;
  lessonPlans: LibraryItem[];
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onSelectUpload: () => void;
  onSelectStage1: () => void;
  onPickLibraryItem: (item: LibraryItem) => void;
  onUploadFile: () => void;
  onThemeSelect: (id: string) => void;
  onSlideCount: (n: number) => void;
  onGenerate: () => void;
  canGenerate: boolean;
}) {
  const [showPaste, setShowPaste] = useState(false);
  const themesScrollRef = useRef<HTMLDivElement>(null);
  const themesBarRef = useRef<HTMLDivElement>(null);
  const [themesScrollWidth, setThemesScrollWidth] = useState(0);
  const syncingThemesScroll = useRef(false);
  const themesSyncRaf = useRef(0);
  const stage1Selected = sourceMode === "stage1Library" && !showPaste;
  const uploadSelected = sourceMode === "upload" || showPaste;

  useEffect(() => {
    const el = themesScrollRef.current;
    if (!el) return;
    const update = () => setThemesScrollWidth(el.scrollWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (themesSyncRaf.current) cancelAnimationFrame(themesSyncRaf.current);
    };
  }, []);

  const syncThemesScroll = useCallback(
    (from: HTMLDivElement, to: HTMLDivElement) => {
      const fromMax = from.scrollWidth - from.clientWidth;
      const toMax = to.scrollWidth - to.clientWidth;
      if (fromMax <= 0 || toMax <= 0) {
        to.scrollLeft = 0;
        return;
      }
      // Direct assignment — avoids scroll-behavior fights during continuous drag/wheel.
      to.scrollLeft = (from.scrollLeft / fromMax) * toMax;
    },
    [],
  );

  const queueThemesSync = useCallback(
    (from: HTMLDivElement | null, to: HTMLDivElement | null) => {
      if (!from || !to || syncingThemesScroll.current) return;
      if (themesSyncRaf.current) cancelAnimationFrame(themesSyncRaf.current);
      themesSyncRaf.current = requestAnimationFrame(() => {
        themesSyncRaf.current = 0;
        if (syncingThemesScroll.current) return;
        syncingThemesScroll.current = true;
        syncThemesScroll(from, to);
        // Release on next frame so the mirrored scroll event is ignored cleanly.
        requestAnimationFrame(() => {
          syncingThemesScroll.current = false;
        });
      });
    },
    [syncThemesScroll],
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#151B35]">
            <MonitorIcon />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Presentation Setup
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose your lesson source, slide theme and number of slides.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-600">
          Stage 2
        </span>
      </header>

      <div className="space-y-5 border-t border-slate-200 bg-white px-4 py-5 sm:px-5 sm:py-6">
        <div>
          <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* Teacher Clipboard — source */}
            <div className="relative rounded-2xl border border-[#E8E4DC] bg-[#FFFDF8] p-4 pt-8 shadow-sm sm:p-5 sm:pt-9">
            <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/badge.svg"
                alt=""
                width={110}
                height={46}
                className="h-auto w-[5.5rem] select-none sm:w-[6.5rem]"
                unoptimized
              />
            </div>
            <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
              Teacher clipboard
            </p>
            <h3 className="mt-1 text-base font-bold text-[#151B35]">
              Choose Lesson Plan Source
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Select where the presentation content should come from
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setShowPaste(false);
                  onSelectUpload();
                  onUploadFile();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                  uploadSelected && sourceMode === "upload"
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    uploadSelected && sourceMode === "upload"
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <UploadDocIcon />
                </span>
                <span className="text-xs font-semibold leading-snug sm:text-sm">
                  Upload From Device
                </span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setShowPaste(false);
                  onSelectStage1();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                  stage1Selected && !pickerOpen
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    stage1Selected && !pickerOpen
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <LessonDocIcon />
                </span>
                <span className="text-xs font-semibold leading-snug sm:text-sm">
                  Use lesson plan from Stage 1
                </span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setShowPaste(false);
                  onTogglePicker();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                  pickerOpen
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    pickerOpen
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <LibraryIcon />
                </span>
                <span className="text-xs font-semibold leading-snug sm:text-sm">
                  Pick from library
                </span>
              </button>
            </div>

            {stage1Selected || pickerOpen ? (
              <div className="mt-3 space-y-2">
                {pickerOpen ? (
                  <div className="max-h-40 overflow-auto rounded-xl border border-slate-200 bg-white">
                    {lessonPlans.length === 0 ? (
                      <p className="p-3 text-xs text-slate-500">
                        No plans yet.{" "}
                        <Link
                          href={ROUTES.stage1}
                          className="font-semibold text-[#28C2C0]"
                        >
                          Generate one
                        </Link>
                        .
                      </p>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {lessonPlans.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[#F5FBFB]"
                              onClick={() => onPickLibraryItem(item)}
                            >
                              <span className="text-xs font-semibold text-[#151B35]">
                                {item.topic || "Untitled plan"}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {[item.grade, item.subject]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
                {sourceLen >= STAGE2_MIN_SOURCE_CHARS ? (
                  <p className="text-[11px] text-slate-500">
                    {`Source ready${topic ? ` · ${topic}` : ""}`}
                  </p>
                ) : null}
              </div>
            ) : null}

            {uploadSelected &&
            sourceMode === "upload" &&
            sourceLen >= STAGE2_MIN_SOURCE_CHARS ? (
              <p className="mt-3 text-[11px] text-slate-500">
                {`Uploaded source ready (${sourceLen.toLocaleString()} characters)`}
              </p>
            ) : null}
          </div>

          {/* Teacher Theme Library */}
          <div className="flex min-w-0 flex-col">
            <div
              className="rounded-2xl border border-[#DDE6E8] p-4 pt-8 shadow-sm sm:p-5 sm:pt-9"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(53, 190, 188, 0.08) 0%, rgba(53, 190, 188, 0) 28%)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                    Teacher theme library
                  </p>
                  <h3 className="mt-1 text-base font-bold text-[#151B35]">
                    Choose Your Slide Theme
                  </h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                    Each theme is pinned like a teacher resource note. Pick the
                    style that best fits your lesson.
                  </p>
                </div>
                <p className="shrink-0 pt-5 text-[10px] font-medium text-slate-400">
                  Scroll to explore
                </p>
              </div>

              <div
                ref={themesScrollRef}
                className="theme-scroll-inner mt-4 flex gap-3 overflow-x-auto"
                onScroll={() => {
                  queueThemesSync(themesScrollRef.current, themesBarRef.current);
                }}
              >
                {STAGE2_THEMES.map((theme) => (
                  <ThemeBoardCard
                    key={theme.id}
                    theme={theme}
                    active={theme.id === themeId}
                    disabled={isGenerating}
                    onSelect={() => onThemeSelect(theme.id)}
                  />
                ))}
              </div>
            </div>

            {/* Cyan scrollbar outside theme card — sits in the gap above Number of slides */}
            <div
              ref={themesBarRef}
              className="theme-scroll mt-[5px] overflow-x-auto"
              aria-hidden
              onScroll={() => {
                queueThemesSync(themesBarRef.current, themesScrollRef.current);
              }}
            >
              <div style={{ width: Math.max(themesScrollWidth, 1), height: 1 }} />
            </div>
          </div>
        </div>

        {/* Number of slides — top edge meets theme scrollbar */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#28C2C0]">
                Number of slides
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Choose how many slides to generate for this deck.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SLIDE_COUNTS.map((n) => {
                const active = slideCount === n;
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => onSlideCount(n)}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full text-sm font-bold transition",
                      active
                        ? "border-[3px] border-[#28C2C0] bg-[#E8F8F8] text-[#28C2C0]"
                        : "border border-slate-200 bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                      isGenerating && "opacity-50",
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </div>

        <button
          type="button"
          disabled={isGenerating || !canGenerate}
          onClick={onGenerate}
          className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:brightness-100"
          style={{
            backgroundImage: "linear-gradient(90deg, #0D1430 0%, #202B52 100%)",
          }}
        >
          {isLoading || isGenerating
            ? "Creating…"
            : "Create My Presentation And Notes"}
        </button>
      </div>
    </section>
  );
}
