"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { LessonPlanContentView } from "@/features/stage1/LessonPlanContentView";
import { Stage2SlideCanvas } from "@/features/stage2/Stage2SlideCanvas";
import { stage2ThemeById } from "@/data/stage2-themes";
import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import type { Stage2Slide } from "@/types/stage2";

function EditLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-[#28C2C0]">
      <span className="h-3.5 w-px bg-slate-400" aria-hidden />
      Edit
      <span className="h-3.5 w-px bg-slate-400" aria-hidden />
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
  activeSlideIndex: number;
  themeId: string;
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
  const activeSlide = slides[activeSlideIndex] ?? null;
  const theme = stage2ThemeById(themeId);
  const slideLabel =
    activeSlide?.slideTitle?.trim() ||
    activeSlide?.slideType?.trim() ||
    (hasDeck ? `Slide ${activeSlideIndex + 1}` : "Title Slide");
  const slideCountLabel = hasDeck
    ? `${slides.length} slide${slides.length === 1 ? "" : "s"}`
    : isGenerating
      ? "Generating…"
      : "0 slides";

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
        <div className="grid items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
          {/* Lesson Storyboard — sticky like tips/Ayla; tall lists scroll inside */}
          <aside className="z-20 lg:sticky lg:top-[5.25rem] lg:self-start">
            <div className="group flex max-h-[calc(100vh-6.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                  slides.map((slide, idx) => {
                    const active = idx === activeSlideIndex;
                    const name =
                      slide.slideTitle?.trim() ||
                      slide.slideType?.trim() ||
                      `Slide ${idx + 1}`;
                    return (
                      <button
                        key={`${slide.slideNumber}-${idx}`}
                        type="button"
                        onClick={() => onSelectSlide?.(idx)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-3 text-left transition sm:px-4",
                          active
                            ? "bg-[#E8F8F8]"
                            : "bg-white hover:bg-slate-50",
                        )}
                      >
                        <span className="w-4 shrink-0 text-sm font-semibold text-slate-500">
                          {idx + 1}
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
                  })
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
          </aside>

          {/* Current slide + notes */}
          <div className="flex min-w-0 flex-col gap-4">
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
                    className="relative z-10 disabled:opacity-40"
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
                  {hasDeck && activeSlide ? (
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
                      !hasDeck || activeSlideIndex >= slides.length - 1
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
                    className="relative z-10 disabled:opacity-40"
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

              {/* Fill allotted width; align notebook left under "Speaker Notes" */}
              <div className="group relative -mt-0.5 -ml-[6%] w-[112%] min-w-0">
                <Image
                  src="/speakernotes.svg"
                  alt=""
                  width={518}
                  height={343}
                  className="h-auto w-full select-none"
                  unoptimized
                />
                <div className="absolute top-[24%] right-[calc(9%+5px)] bottom-[18%] left-[9%] flex flex-col px-0 sm:top-[25%] sm:right-[calc(10%+5px)] sm:bottom-[19%] sm:left-[10%]">
                  <div className="flex shrink-0 items-center justify-between gap-2 text-[9px] font-bold tracking-[0.08em] text-[#28C2C0] uppercase sm:text-[10px]">
                    <span>Speaker notes</span>
                    <span>Teacher notes</span>
                  </div>

                  <p className="mt-2 shrink-0 text-base font-bold text-[#151B35] sm:mt-2.5 sm:text-lg">
                    {hasDeck
                      ? `Slide ${activeSlideIndex + 1} Notes`
                      : "Slide 1 Notes"}
                  </p>

                  <div className="mt-2 h-[3px] w-full shrink-0 rounded-full bg-[#202B52]" />

                  <div className="theme-scroll-hover mt-2.5 min-h-0 flex-1 overflow-auto">
                    {hasDeck ? (
                      <LessonPlanContentView
                        content={activeSlide?.speakerNotes ?? ""}
                        emptyPlaceholder="No speaker notes for this slide."
                        className="prose prose-sm max-w-none text-slate-500 prose-headings:my-1.5 prose-headings:text-sm prose-headings:font-bold prose-headings:text-[#151B35] prose-p:my-1 prose-p:text-xs prose-p:leading-relaxed sm:prose-p:text-sm prose-strong:font-bold prose-strong:text-[#151B35] prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-li:marker:text-[#28C2C0]"
                      />
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
