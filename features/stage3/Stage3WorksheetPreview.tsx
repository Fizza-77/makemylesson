"use client";

import Link from "next/link";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import {
  answerKeyMarkdownFromItems,
  structureWorksheetMarkdown,
  studentActivityMarkdownFromItems,
} from "@/lib/format-worksheet-markdown";
import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import type { FormativeKind, Stage3AssessmentResult } from "@/types/stage3";

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
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M3 3.5h7.5L13 6v6.5a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M5 3.5V2h4v1.5M5 9h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {busy ? "Saving…" : "Save"}
    </span>
  );
}

function ClipboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="size-5"
      aria-hidden
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path strokeLinecap="round" d="M9 12h6M9 16h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 fill-current" aria-hidden>
      <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
    </svg>
  );
}

function kindLabel(kind: FormativeKind): string {
  switch (kind) {
    case "quickCheck":
      return "Quick Check";
    case "practiceWorksheet":
      return "Worksheet";
    case "exitTicket":
      return "Exit Ticket";
  }
}

export function Stage3WorksheetPreview({
  hasResult,
  isGenerating,
  previewLocked = false,
  formativeKind,
  questionCount,
  mixSelectedCount,
  result,
  showAnswerKey,
  exportMenuOpen,
  exporting,
  exportActions,
  onToggleView,
  onEdit,
  onSave,
  showSave,
  isSavingLibrary,
  onToggleExport,
  onExport,
  onShare,
  className,
}: {
  hasResult: boolean;
  isGenerating?: boolean;
  /** Out of credits — blue worksheet + locked popup (no content). */
  previewLocked?: boolean;
  formativeKind: FormativeKind;
  questionCount: number;
  mixSelectedCount: number;
  result: Stage3AssessmentResult | null;
  showAnswerKey: boolean;
  exportMenuOpen?: boolean;
  exporting?: boolean;
  exportActions: { id: string; label: string }[];
  onToggleView: (answerKey: boolean) => void;
  onEdit?: () => void;
  onSave?: () => void;
  showSave?: boolean;
  isSavingLibrary?: boolean;
  onToggleExport?: () => void;
  onExport?: (id: string) => void;
  onShare?: () => void;
  className?: string;
}) {
  const assessmentName = kindLabel(formativeKind);
  const title =
    !previewLocked && result?.activityTitle?.trim()
      ? result.activityTitle.trim()
      : "Worksheet Preview";
  const subtitle = `${assessmentName} · ${questionCount} question${questionCount === 1 ? "" : "s"}`;
  const showContent = hasResult && !!result && !previewLocked;

  const answerKeyMarkdown = (() => {
    if (!result) return "";
    const freeform = result.teacherAnswerKeyText?.trim() ?? "";
    if (freeform) return structureWorksheetMarkdown(freeform);
    if (result.items.length > 0) {
      return answerKeyMarkdownFromItems(
        result.items,
        result.activityTitle || title,
      );
    }
    return "";
  })();

  const studentMarkdown = (() => {
    if (!result) return "";
    const body = result.studentActivityText?.trim() ?? "";
    if (body) return structureWorksheetMarkdown(body);
    if (result.items.length > 0) {
      return studentActivityMarkdownFromItems(
        result.items,
        result.studentInstructions,
        result.activityTitle || title,
      );
    }
    return structureWorksheetMarkdown(
      result.studentInstructions?.trim() || "No student activity text.",
    );
  })();

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
            <ClipboardIcon />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Worksheet Preview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the student activity and answer key before downloading.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-teal-100 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap text-teal-600 uppercase">
          Preview
        </span>
      </header>

      <div className="rounded-b-2xl border-t border-slate-200 bg-white px-3 py-4 sm:px-5 sm:py-5">
        <div className="grid items-stretch gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
          {/* Teacher Marking Card — stretches to bottom, left of preview + CTAs */}
          <aside className="flex min-h-0">
            <div className="flex h-full w-full flex-col rounded-2xl border border-[#B9E6E2] bg-[#E8F8F8] p-4 pt-4 shadow-sm sm:p-5 sm:pt-5">
              <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                Teacher marking card
              </p>
              <p className="mt-6 text-[10px] font-semibold tracking-wide text-[#128C89] uppercase sm:mt-7">
                Assessment summary
              </p>
              <h3 className="mt-1 text-base font-bold text-[#151B35]">
                Teacher Review
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Your current worksheet settings appear here.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                {(
                  [
                    ["Assessment", assessmentName],
                    ["Questions", String(questionCount)],
                    [
                      "Mix",
                      `${mixSelectedCount} selected`,
                    ],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-sm"
                  >
                    <span className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      {label}
                    </span>
                    <span className="text-sm font-bold text-[#151B35]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Worksheet preview + CTAs */}
          <div className="flex min-w-0 flex-col gap-4">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#28C2C0]">
                  Worksheet Preview
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onEdit}
                    disabled={!hasResult}
                    className="relative z-10 disabled:opacity-40"
                    aria-label="Edit worksheet"
                  >
                    <EditLabel />
                  </button>
                  {showSave ? (
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={!hasResult || isSavingLibrary}
                      className="relative z-10 disabled:opacity-40"
                      aria-label="Save worksheet"
                    >
                      <SaveLabel busy={isSavingLibrary} />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mb-3 flex overflow-hidden rounded-full border-2 border-[#151B35] bg-white">
                <button
                  type="button"
                  onClick={() => onToggleView(false)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition sm:text-sm",
                    !showAnswerKey
                      ? "bg-[#E8F8F8] text-[#151B35]"
                      : "bg-white font-semibold text-[#657099]",
                  )}
                >
                  {!showAnswerKey ? <CheckIcon /> : null}
                  Student Activity
                </button>
                <button
                  type="button"
                  onClick={() => onToggleView(true)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 border-l-2 border-[#151B35] px-3 py-2.5 text-xs transition sm:text-sm",
                    showAnswerKey
                      ? "bg-[#E8F8F8] font-bold text-[#151B35]"
                      : "bg-white font-semibold text-[#657099]",
                  )}
                >
                  {showAnswerKey ? <CheckIcon /> : null}
                  Answer Key
                </button>
              </div>

              <div className="relative -ml-[5%] w-[110%] min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- public SVG; avoid Next image cache */}
                <img
                  src="/worksheet.svg?v=349"
                  alt=""
                  width={540}
                  height={462}
                  className={cn(
                    "relative z-0 h-auto w-full select-none pointer-events-none transition",
                    previewLocked &&
                      "[filter:grayscale(0.2)_sepia(0.7)_hue-rotate(175deg)_saturate(2.6)_brightness(0.92)]",
                  )}
                  draggable={false}
                />

                {/* Text only on header — inset right of spiral binder */}
                <div className="pointer-events-none absolute top-[5.5%] right-[9%] left-[18%] z-[2] text-white">
                  <p className="text-[8px] font-bold tracking-[0.12em] uppercase opacity-90 sm:text-[9px]">
                    {showAnswerKey
                      ? "Teacher answer key"
                      : "Student assessment"}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-bold sm:text-base">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium opacity-90 sm:text-[10px]">
                    {subtitle}
                  </p>
                </div>

                <div className="absolute top-[22%] right-[8.5%] bottom-[14%] left-[12%] z-[2] overflow-hidden">
                  {showContent ? (
                    <div className="theme-scroll-hover h-full overflow-auto px-1 py-1 sm:px-2 sm:py-1.5">
                      {showAnswerKey ? (
                        <MarkdownContentView
                          content={answerKeyMarkdown}
                          emptyPlaceholder="No answer key."
                          compact
                        />
                      ) : (
                        <MarkdownContentView
                          content={studentMarkdown}
                          emptyPlaceholder="No student activity text."
                          compact
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center px-3">
                      {previewLocked ? (
                        <div className="max-w-[18rem] rounded-2xl border border-slate-100 bg-white px-5 py-5 text-center shadow-lg sm:px-6 sm:py-6">
                          <p className="text-sm font-bold text-[#151B35]">
                            Generate worksheet to preview content.
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-slate-500">
                            The student activity and answer key will appear here
                            after creation.
                          </p>
                        </div>
                      ) : (
                        <div className="max-w-[18rem] text-center">
                          <p className="text-sm font-bold text-[#151B35]">
                            {isGenerating
                              ? "Generating worksheet…"
                              : "Generate worksheet to preview content."}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-slate-500">
                            {isGenerating
                              ? "Your student activity and answer key will appear here shortly."
                              : "The student activity and answer key will appear here after creation."}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="-mt-2 flex flex-col gap-3 sm:-mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <button
                    type="button"
                    disabled={!hasResult || exporting}
                    onClick={onToggleExport}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-[#151B35] shadow-sm transition hover:border-[#28C2C0]/40 disabled:opacity-50"
                  >
                    {exporting ? "Working…" : "Download / Print"}
                  </button>
                  {exportMenuOpen && hasResult ? (
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
                  disabled={!hasResult || exporting}
                  onClick={onShare}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-[#151B35] shadow-sm transition hover:border-[#28C2C0]/40 disabled:opacity-50"
                >
                  Share
                </button>
              </div>

              <div className="flex gap-3">
                <Link
                  href={ROUTES.stage2}
                  className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#151B35] shadow-sm transition hover:border-[#28C2C0]/40"
                >
                  Back
                </Link>
                <Link
                  href={ROUTES.stage4}
                  className="flex min-w-0 flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #28C2C0 0%, #3DD6D0 100%)",
                  }}
                >
                  Go to Stage 4
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
