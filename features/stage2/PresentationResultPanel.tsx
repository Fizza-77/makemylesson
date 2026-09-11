"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { Button } from "@/components/ui/Button";
import { LessonPlanContentView } from "@/features/stage1/LessonPlanContentView";
import {
  Stage2CoverCanvas,
  type Stage2CoverData,
} from "@/features/stage2/Stage2CoverCanvas";
import { Stage2SlideCanvas } from "@/features/stage2/Stage2SlideCanvas";
import { stage2ThemeById } from "@/data/stage2-themes";
import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import type { Stage2Slide } from "@/types/stage2";

const STORYBOARD_WIDTH_KEY = "mml.stage2.storyboardWidth";
const STORYBOARD_MIN_W = 168;
const STORYBOARD_MAX_W = 420;
const STORYBOARD_DEFAULT_W = 288;
const PREVIEW_MIN_W = 320;

function readStoryboardWidth(): number {
  if (typeof window === "undefined") return STORYBOARD_DEFAULT_W;
  const raw = Number.parseInt(
    window.localStorage.getItem(STORYBOARD_WIDTH_KEY) ?? "",
    10,
  );
  if (!Number.isFinite(raw)) return STORYBOARD_DEFAULT_W;
  return Math.min(STORYBOARD_MAX_W, Math.max(STORYBOARD_MIN_W, raw));
}

function EditLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#28C2C0] transition hover:brightness-90">
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M11.5 2.5a1.5 1.5 0 0 1 2.1 2.1L5.2 13H3v-2.2L11.5 2.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      Edit
    </span>
  );
}

function SaveLabel({ busy }: { busy?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#28C2C0] transition hover:brightness-90">
      <span className="h-3.5 w-px bg-[#28C2C0]/50" aria-hidden />
      {busy ? "Saving…" : "Save"}
      <span className="h-3.5 w-px bg-[#28C2C0]/50" aria-hidden />
    </span>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M15 6 9 12l6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function SlideThumbPreview({
  themeId,
  title,
}: {
  themeId: string;
  title: string;
}) {
  const theme = stage2ThemeById(themeId);
  return (
    <div
      className="flex h-12 w-[4.75rem] shrink-0 flex-col items-start justify-between rounded-lg p-1.5 shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${theme.backgroundGradient[0]}, ${theme.backgroundGradient[1]})`,
      }}
    >
      <span
        className="h-1 w-5 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
        }}
      />
      <span
        className="w-full truncate text-center text-[8px] font-semibold leading-tight"
        style={{ color: theme.titleColor }}
      >
        {title}
      </span>
    </div>
  );
}

export function PresentationResultPanel({
  hasDeck,
  isGenerating,
  title,
  slides,
  activeSlideIndex,
  themeId,
  cover,
  linkedLibraryItemId,
  isSavingLibrary,
  exportMenuOpen,
  exporting,
  exportActions,
  onToggleExport,
  onExport,
  onShare,
  onSaveLibrary,
  onPrev,
  onNext,
  onSelectSlide,
  onEdit,
  onSave,
  showSave,
  onRetryImage,
  onClear,
  className,
}: {
  hasDeck: boolean;
  isGenerating?: boolean;
  title: string;
  slides: Stage2Slide[];
  /** Display index including Cover as slide 1 (Flutter parity). */
  activeSlideIndex: number;
  themeId: string;
  cover?: Stage2CoverData | null;
  linkedLibraryItemId?: string | null;
  isSavingLibrary?: boolean;
  exportMenuOpen?: boolean;
  exporting?: boolean;
  exportActions: { id: string; label: string }[];
  onToggleExport?: () => void;
  onExport?: (id: string) => void;
  onShare?: () => void;
  onSaveLibrary?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectSlide?: (index: number) => void;
  onEdit?: () => void;
  onSave?: () => void;
  /** Show Save next to Edit after local changes (e.g. opened library item edited). */
  showSave?: boolean;
  onRetryImage?: () => void;
  onClear?: () => void;
  className?: string;
}) {
  // Backend returns content slides only; Cover is prepended client-side.
  const displayCount = hasDeck ? slides.length + 1 : 0;
  const isCover = hasDeck && activeSlideIndex === 0;
  const contentIndex = isCover ? -1 : activeSlideIndex - 1;
  const activeSlide =
    contentIndex >= 0 ? (slides[contentIndex] ?? null) : null;
  const theme = stage2ThemeById(themeId);
  const coverData: Stage2CoverData = cover ?? {
    topic: title,
    grade: "",
    subject: "",
    curriculum: "",
  };
  const slideLabel = isCover
    ? "Cover"
    : activeSlide?.slideTitle?.trim() ||
      activeSlide?.slideType?.trim() ||
      (hasDeck ? `Slide ${activeSlideIndex + 1}` : "Title Slide");
  const slideCountLabel = hasDeck
    ? `${displayCount} slide${displayCount === 1 ? "" : "s"}`
    : isGenerating
      ? "Generating…"
      : "0 slides";
  const notesHeading = hasDeck
    ? isCover
      ? "Cover Slide Notes"
      : `Slide ${activeSlideIndex + 1} Notes`
    : "Slide 1 Notes";
  const coverNotes =
    "This is the cover slide. It shows your school name and your name (from Profile), plus the lesson topic, grade, subject and curriculum. Personalization can be changed in your Profile.";

  const rowRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(STORYBOARD_DEFAULT_W);
  const [storyboardWidth, setStoryboardWidth] = useState(STORYBOARD_DEFAULT_W);
  const [resizing, setResizing] = useState(false);
  widthRef.current = storyboardWidth;

  useEffect(() => {
    const stored = readStoryboardWidth();
    widthRef.current = stored;
    setStoryboardWidth(stored);
  }, []);

  const persistWidth = useCallback((width: number) => {
    try {
      window.localStorage.setItem(STORYBOARD_WIDTH_KEY, String(width));
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const handle = event.currentTarget;
      const startX = event.clientX;
      const startW = widthRef.current;
      const rowW = rowRef.current?.clientWidth ?? 0;
      const maxW = Math.min(
        STORYBOARD_MAX_W,
        Math.max(
          STORYBOARD_MIN_W,
          rowW > 0 ? rowW - PREVIEW_MIN_W : STORYBOARD_MAX_W,
        ),
      );
      handle.setPointerCapture(event.pointerId);
      setResizing(true);
      const prevCursor = document.body.style.cursor;
      const prevSelect = document.body.style.userSelect;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (moveEvent: PointerEvent) => {
        const next = Math.round(startW + (moveEvent.clientX - startX));
        const clamped = Math.min(maxW, Math.max(STORYBOARD_MIN_W, next));
        widthRef.current = clamped;
        setStoryboardWidth(clamped);
      };
      const onUp = () => {
        handle.releasePointerCapture(event.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        document.body.style.cursor = prevCursor;
        document.body.style.userSelect = prevSelect;
        setResizing(false);
        persistWidth(widthRef.current);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [persistWidth],
  );

  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-t-2xl px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#151B35]">
            <MonitorIcon />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Presentation Studio
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">
              {`${title} —`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasDeck ? (
            <Button
              variant="ghost"
              className="px-2 py-1 text-xs"
              onClick={onClear}
            >
              Clear
            </Button>
          ) : null}
          <span className="inline-flex shrink-0 items-center rounded-full border border-teal-100 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap text-teal-600">
            {slideCountLabel}
          </span>
        </div>
      </header>

      <div className="rounded-b-2xl border-t border-slate-200 bg-white px-3 py-4 sm:px-5 sm:py-5">
        <div
          ref={rowRef}
          className={cn(
            "flex flex-col gap-4 lg:flex-row lg:items-start",
            resizing && "select-none",
          )}
        >
          {/* Lesson Storyboard — sticky like tips/Ayla; width is user-resizable on desktop */}
          <aside
            className="relative z-20 w-full max-lg:!w-full lg:sticky lg:top-[5.25rem] lg:shrink-0 lg:self-start"
            style={{ width: storyboardWidth }}
          >
            <div className="group flex max-h-[calc(100vh-6.5rem)] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="shrink-0 border-b border-slate-200 bg-[#FFFDF8] px-4 py-3.5">
                <p className="text-[10px] font-semibold tracking-wide text-[#128C89] uppercase">
                  Lesson storyboard
                </p>
                <h3 className="mt-0.5 text-base font-bold text-[#151B35]">
                  Slide Thumbnails
                </h3>
              </div>

              <div className="theme-scroll-hover min-h-0 flex-1 divide-y divide-slate-200 overflow-y-auto">
                {hasDeck ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectSlide?.(0)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-3 text-left transition sm:px-4",
                        isCover
                          ? "bg-[#E8F8F8]"
                          : "bg-white hover:bg-slate-50",
                      )}
                    >
                      <span className="w-4 shrink-0 text-sm font-semibold text-slate-500">
                        1
                      </span>
                      <SlideThumbPreview themeId={themeId} title="Cover" />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm font-medium",
                          isCover ? "text-[#128C89]" : "text-slate-500",
                        )}
                      >
                        Cover
                      </span>
                    </button>
                    {slides.map((slide, idx) => {
                      const displayIdx = idx + 1;
                      const active = displayIdx === activeSlideIndex;
                      const name =
                        slide.slideTitle?.trim() ||
                        slide.slideType?.trim() ||
                        `Slide ${displayIdx + 1}`;
                      return (
                        <button
                          key={`${slide.slideNumber}-${idx}`}
                          type="button"
                          onClick={() => onSelectSlide?.(displayIdx)}
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-3 text-left transition sm:px-4",
                            active
                              ? "bg-[#E8F8F8]"
                              : "bg-white hover:bg-slate-50",
                          )}
                        >
                          <span className="w-4 shrink-0 text-sm font-semibold text-slate-500">
                            {displayIdx + 1}
                          </span>
                          <SlideThumbPreview themeId={themeId} title={name} />
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate text-sm font-medium",
                              active ? "text-[#128C89]" : "text-slate-500",
                            )}
                          >
                            {name}
                          </span>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  (
                    [
                      "Title Slide",
                      "Introduction",
                      "Concept Explanation",
                      "Guided Practice",
                      "Reflection",
                    ] as const
                  ).map((name, idx) => (
                    <div
                      key={name}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 sm:px-4",
                        idx === 0 ? "bg-[#E8F8F8]" : "bg-white",
                      )}
                    >
                      <span className="w-4 shrink-0 text-sm font-semibold text-slate-500">
                        {idx + 1}
                      </span>
                      <SlideThumbPreview themeId={themeId} title={name} />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm font-medium",
                          idx === 0 ? "text-[#128C89]" : "text-slate-500",
                        )}
                      >
                        {name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <button
              type="button"
              aria-label="Resize storyboard"
              title="Drag to resize"
              onPointerDown={onResizePointerDown}
              onDoubleClick={() => {
                widthRef.current = STORYBOARD_DEFAULT_W;
                setStoryboardWidth(STORYBOARD_DEFAULT_W);
                persistWidth(STORYBOARD_DEFAULT_W);
              }}
              className="absolute top-0 -right-2 z-30 hidden h-full w-4 cursor-col-resize touch-none items-center justify-center lg:flex"
            >
              <span
                className={cn(
                  "h-16 w-1 rounded-full bg-slate-300 transition",
                  resizing ? "bg-[#28C2C0]" : "hover:bg-[#28C2C0]",
                )}
              />
            </button>
          </aside>

          {/* Current slide + notes */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div>
              <div className="mb-0 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#28C2C0]">
                  Current Slide
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onEdit}
                    disabled={!hasDeck}
                    className="relative z-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Edit slide"
                  >
                    <EditLabel />
                  </button>
                  {showSave ? (
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={!hasDeck || isSavingLibrary}
                      className="relative z-10 disabled:opacity-40"
                      aria-label="Save presentation"
                    >
                      <SaveLabel busy={isSavingLibrary} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Align monitor bezel left edge under "Current Slide"; sit flush below label */}
              <div className="relative -mt-0.5 -ml-[4.5%] w-[109%] min-w-0">
                <div className="absolute top-[6.5%] right-[8%] bottom-[16%] left-[8%] z-[1] overflow-hidden">
                  {hasDeck && isCover ? (
                    <Stage2CoverCanvas
                      data={coverData}
                      themeId={themeId}
                      totalSlides={displayCount}
                      fill
                      className="h-full w-full rounded-none"
                    />
                  ) : hasDeck && activeSlide ? (
                    <Stage2SlideCanvas
                      slide={activeSlide}
                      themeId={themeId}
                      fill
                      className="h-full w-full rounded-none"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-none px-4 text-center"
                      style={{
                        background: `linear-gradient(135deg, ${theme.backgroundGradient[0]}, ${theme.backgroundGradient[1]})`,
                      }}
                    >
                      <span
                        className="h-1 w-10 rounded-full"
                        style={{ background: theme.accentPrimary }}
                      />
                      <p
                        className="text-lg font-bold sm:text-2xl"
                        style={{ color: theme.titleColor }}
                      >
                        {theme.name} Theme
                      </p>
                      <p
                        className="max-w-[16rem] text-xs sm:text-sm"
                        style={{ color: theme.mutedColor }}
                      >
                        {isGenerating
                          ? "Generating your slides…"
                          : "Your slides will appear here after generation."}
                      </p>
                    </div>
                  )}
                </div>
                <Image
                  src="/slidemonitor.svg"
                  alt=""
                  width={555}
                  height={402}
                  className="relative z-[2] h-auto w-full select-none pointer-events-none"
                  unoptimized
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:px-4">
                <p className="min-w-0 truncate text-sm font-semibold text-[#151B35]">
                  {slideLabel}
                  <span className="text-[#28C2C0]"> — Active</span>
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={!hasDeck || activeSlideIndex <= 0}
                    onClick={onPrev}
                    className="flex size-9 items-center justify-center rounded-lg bg-[#E8F8F8] text-[#1A9E9C] transition hover:bg-[#D5F3F2] disabled:opacity-40"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    disabled={
                      !hasDeck || activeSlideIndex >= displayCount - 1
                    }
                    onClick={onNext}
                    className="flex size-9 items-center justify-center rounded-lg bg-[#E8F8F8] text-[#1A9E9C] transition hover:bg-[#D5F3F2] disabled:opacity-40"
                    aria-label="Next slide"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>

              {hasDeck &&
              activeSlide?.imagePrompt.trim() &&
              activeSlide.imageStatus.toLowerCase() === "failed" ? (
                <button
                  type="button"
                  onClick={onRetryImage}
                  className="mt-2 text-xs font-semibold text-[#28C2C0] hover:underline"
                >
                  Retry image
                </button>
              ) : null}
            </div>

            {/* Speaker notes */}
            <div>
              <div className="mb-0 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#28C2C0]">
                  Speaker Notes
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onEdit}
                    disabled={!hasDeck}
                    className="relative z-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Edit notes"
                  >
                    <EditLabel />
                  </button>
                  {showSave ? (
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={!hasDeck || isSavingLibrary}
                      className="relative z-10 disabled:opacity-40"
                      aria-label="Save presentation"
                    >
                      <SaveLabel busy={isSavingLibrary} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Mobile web: landscape card (no SVG) */}
              <div className="mt-2 flex aspect-[16/10] min-h-[14rem] w-full flex-col overflow-hidden rounded-[18px] border-[5px] border-[#35BEBC] bg-[#F7FBFA] md:hidden">
                <header className="shrink-0 border-b border-slate-200/80 bg-white px-3.5 py-3 sm:px-4">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold tracking-[0.08em] text-[#28C2C0] uppercase">
                    <span>Speaker notes</span>
                    <span>Teacher notes</span>
                  </div>
                  <p className="mt-1.5 text-base font-bold text-[#151B35]">
                    {notesHeading}
                  </p>
                  <div className="mt-2 h-[3px] w-full rounded-full bg-[#202B52]" />
                </header>

                <div className="theme-scroll-hover min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-3 sm:px-4">
                  {hasDeck ? (
                    isCover ? (
                      <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                        {coverNotes}
                      </p>
                    ) : (
                      <LessonPlanContentView
                        content={activeSlide?.speakerNotes ?? ""}
                        emptyPlaceholder="No speaker notes for this slide."
                        lessonPlan={false}
                        className="prose prose-sm max-w-none text-slate-500 prose-headings:my-1.5 prose-headings:text-sm prose-headings:font-bold prose-headings:text-[#151B35] prose-p:my-1 prose-p:text-xs prose-p:leading-relaxed sm:prose-p:text-sm prose-strong:font-bold prose-strong:text-[#151B35] prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-li:marker:text-[#28C2C0]"
                      />
                    )
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-500 sm:text-sm">
                        {isGenerating
                          ? "Notes will appear here as slides are generated…"
                          : "Speaker notes will appear after generation as rich teaching guidance."}
                      </p>
                      {!isGenerating ? (
                        <div className="mt-4 space-y-2.5" aria-hidden>
                          <div className="h-px w-full bg-slate-300/70" />
                          <div className="h-px w-[85%] bg-slate-300/60" />
                          <div className="h-px w-[70%] bg-slate-300/50" />
                        </div>
                      ) : null}
                    </>
                  )}
                </div>

                {!hasDeck ? (
                  <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200/60 bg-white px-3.5 py-2 text-[8px] font-semibold tracking-[0.1em] text-slate-400 uppercase sm:px-4 sm:text-[9px]">
                    <span>Make my lesson</span>
                    <span>Presentation notes</span>
                  </footer>
                ) : null}
              </div>

              {/* Desktop: notebook SVG with overlaid notes */}
              <div className="group relative -mt-0.5 -ml-[6%] hidden w-[112%] min-w-0 md:block">
                <Image
                  src={hasDeck ? "/speakernotes-tall.svg" : "/speakernotes.svg"}
                  alt=""
                  width={518}
                  height={hasDeck ? 463 : 343}
                  className="h-auto w-full select-none"
                  unoptimized
                />
                <div
                  className={cn(
                    "absolute right-[calc(9%+5px)] left-[9%] flex flex-col px-0 sm:right-[calc(10%+5px)] sm:left-[10%]",
                    hasDeck
                      ? "top-[17.8%] bottom-[13.3%] sm:top-[18.5%] sm:bottom-[14.1%]"
                      : "top-[24%] bottom-[18%] sm:top-[25%] sm:bottom-[19%]",
                  )}
                >
                  <div className="flex shrink-0 items-center justify-between gap-2 text-[9px] font-bold tracking-[0.08em] text-[#28C2C0] uppercase sm:text-[10px]">
                    <span>Speaker notes</span>
                    <span>Teacher notes</span>
                  </div>

                  <p className="mt-2 shrink-0 text-base font-bold text-[#151B35] sm:mt-2.5 sm:text-lg">
                    {notesHeading}
                  </p>

                  <div className="mt-2 h-[3px] w-full shrink-0 rounded-full bg-[#202B52]" />

                  <div className="theme-scroll-hover mt-2.5 min-h-0 flex-1 overflow-auto">
                    {hasDeck ? (
                      isCover ? (
                        <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                          {coverNotes}
                        </p>
                      ) : (
                        <LessonPlanContentView
                          content={activeSlide?.speakerNotes ?? ""}
                          emptyPlaceholder="No speaker notes for this slide."
                          lessonPlan={false}
                          className="prose prose-sm max-w-none text-slate-500 prose-headings:my-1.5 prose-headings:text-sm prose-headings:font-bold prose-headings:text-[#151B35] prose-p:my-1 prose-p:text-xs prose-p:leading-relaxed sm:prose-p:text-sm prose-strong:font-bold prose-strong:text-[#151B35] prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-li:marker:text-[#28C2C0]"
                        />
                      )
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-500 sm:text-sm">
                          {isGenerating
                            ? "Notes will appear here as slides are generated…"
                            : "Speaker notes will appear after generation as rich teaching guidance."}
                        </p>
                        {!isGenerating ? (
                          <div className="mt-4 space-y-2.5" aria-hidden>
                            <div className="h-px w-full bg-slate-300/70" />
                            <div className="h-px w-[85%] bg-slate-300/60" />
                            <div className="h-px w-[70%] bg-slate-300/50" />
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  {!hasDeck ? (
                    <div className="mt-auto flex shrink-0 translate-y-2 items-center justify-between gap-2 pb-0 text-[8px] font-semibold tracking-[0.1em] text-slate-400 uppercase sm:translate-y-2.5 sm:pb-0.5 sm:text-[9px]">
                      <span>Make my lesson</span>
                      <span>Presentation notes</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* CTAs below speaker notes */}
              <div className="mt-1 flex flex-col gap-3 sm:mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!hasDeck || exporting}
                      onClick={onToggleExport}
                      className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-[#151B35] shadow-sm transition hover:border-[#28C2C0]/40 disabled:opacity-50"
                    >
                      {exporting ? "Working…" : "Download / Print"}
                    </button>
                    {exportMenuOpen && hasDeck ? (
                      <div className="absolute bottom-full left-0 z-10 mb-1 min-w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                        {exportActions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                            onClick={() => onExport?.(action.id)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={!hasDeck || exporting}
                    onClick={onShare}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-[#151B35] shadow-sm transition hover:border-[#28C2C0]/40 disabled:opacity-50"
                  >
                    Share
                  </button>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={ROUTES.stage1}
                    className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#151B35] shadow-sm transition hover:border-[#28C2C0]/40"
                  >
                    Back
                  </Link>
                  <Link
                    href={ROUTES.stage3}
                    className="flex min-w-0 flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #28C2C0 0%, #3DD6D0 100%)",
                    }}
                  >
                    Go to Stage 3
                  </Link>
                </div>

                {hasDeck && !linkedLibraryItemId ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isSavingLibrary}
                      onClick={onSaveLibrary}
                      className="text-xs font-semibold text-[#28C2C0] hover:underline disabled:opacity-50"
                    >
                      {isSavingLibrary ? "Saving…" : "Save to library"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


