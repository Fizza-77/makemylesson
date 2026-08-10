"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Stage4AssessmentContentView } from "@/features/stage4/Stage4AssessmentContentView";
import {
  parseStage4QuestionsFromRawJson,
  SUMMATIVE_KINDS,
  type Stage4AssessmentResult,
  type SummativeKind,
} from "@/types/stage4";

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 3v5h5M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function kindLabel(kind: SummativeKind | null): string {
  if (!kind) return "Quiz";
  return SUMMATIVE_KINDS.find((k) => k.id === kind)?.label ?? "Quiz";
}

function PackSlot({
  label,
  children,
  contentClassName,
}: {
  label: string;
  children: ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="relative mb-1 flex min-h-9 items-center">
        <p className="z-10 text-[10px] font-semibold tracking-wide text-white uppercase">
          {label}
        </p>
        <div className="pointer-events-none absolute inset-x-0 -top-1 flex justify-center">
          <Image
            src="/pin.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 select-none"
            unoptimized
          />
        </div>
      </div>
      <div className={cn("min-w-0 flex-1", contentClassName)}>{children}</div>
    </div>
  );
}

export function Stage4AssessmentReviewWall({
  quizKind,
  questionCount,
  durationMinutes,
  totalMarks,
  result,
  isGenerating,
  isSavingLibrary,
  exporting,
  exportMenuOpen,
  exportActions,
  linkedLibraryItemId,
  onPreview,
  onToggleExport,
  onExport,
  onShare,
  onSaveLibrary,
  className,
}: {
  quizKind: SummativeKind | null;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  result: Stage4AssessmentResult | null;
  isGenerating?: boolean;
  isSavingLibrary?: boolean;
  exporting?: boolean;
  exportMenuOpen?: boolean;
  exportActions: { id: string; label: string }[];
  linkedLibraryItemId?: string | null;
  onPreview: () => void;
  onToggleExport: () => void;
  onExport: (id: string) => void;
  onShare: () => void;
  onSaveLibrary: () => void;
  className?: string;
}) {
  const hasResult = !!result;
  const paperTitle =
    result?.paperTitle?.trim() ||
    result?.assessmentTitle?.trim() ||
    `Generated ${kindLabel(quizKind)}`;
  const paperMeta = `${kindLabel(quizKind)} · ${questionCount} Qs · ${durationMinutes} min`;
  const schemeTitle = result?.markSchemeLabel?.trim() || "Mark Scheme";
  const studentBody = result?.studentAssessmentText?.trim() || "";
  const schemeBody = result?.teacherMarkSchemeText?.trim() || "";
  const structuredQuestionCount = result
    ? parseStage4QuestionsFromRawJson(result.rawJson).length
    : 0;
  const hasStudentContent =
    Boolean(studentBody) || structuredQuestionCount > 0;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#151B35]">
            <DocIcon />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Assessment Review Wall
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pin the Paper and Mark Scheme for final review.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onPreview}
          className="shrink-0 rounded-full bg-[#E8F8F8] px-4 py-1.5 text-sm font-semibold text-[#1A9E9C] transition hover:bg-[#D5F3F2]"
        >
          Preview
        </button>
      </header>

      <div className="border-t border-slate-200 px-4 py-5 sm:px-5 sm:py-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#202B52] to-[#0D1430] p-4 sm:p-5">
          <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
            Pinned assessment pack
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-5">
            <PackSlot label="Student paper" contentClassName="mt-8 sm:mt-10">
              <div className="overflow-hidden rounded-2xl bg-[#EEF2F5] shadow-sm">
                <div className="bg-gradient-to-r from-[#20AAA7] to-[#35BEBC] px-4 py-3 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-medium tracking-wide uppercase opacity-90">
                        Student assessment
                      </p>
                      <p className="mt-0.5 truncate text-base font-bold">
                        {paperTitle}
                      </p>
                    </div>
                    <p className="shrink-0 pt-0.5 text-right text-[11px] text-white/85">
                      {paperMeta}
                    </p>
                  </div>
                </div>
                <div className="relative min-h-[16rem] px-4 py-10 sm:min-h-[18rem]">
                  {hasResult && hasStudentContent ? (
                    <div className="max-h-72 overflow-auto text-left">
                      <Stage4AssessmentContentView result={result} />
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[14rem] flex-col items-center justify-center text-center sm:min-h-[16rem]">
                      <p className="text-sm font-bold text-[#151B35]">
                        {isGenerating
                          ? "Generating assessment…"
                          : "Assessment not generated."}
                      </p>
                      <p className="mt-1 max-w-[16rem] text-[11px] text-slate-500">
                        The student paper will appear here after creation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </PackSlot>

            <PackSlot label="Mark scheme" contentClassName="mt-8 sm:mt-10">
              <div className="overflow-hidden rounded-2xl bg-[#EEF2F5] shadow-sm">
                <div className="bg-gradient-to-r from-[#202B52] to-[#30416F] px-4 py-3 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium tracking-wide uppercase opacity-90">
                        Teacher copy
                      </p>
                      <p className="mt-0.5 truncate text-base font-bold">
                        {schemeTitle}
                      </p>
                    </div>
                    <p className="shrink-0 pt-0.5 text-right text-[11px] text-white/85">
                      Total · {result?.totalMarks ?? totalMarks} marks
                    </p>
                  </div>
                </div>
                <div className="relative min-h-[16rem] px-4 py-10 sm:min-h-[18rem]">
                  {hasResult && schemeBody ? (
                    <div className="theme-scroll-hover max-h-72 overflow-auto">
                      <MarkdownContentView content={schemeBody} />
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[14rem] flex-col items-center justify-center text-center sm:min-h-[16rem]">
                      <p className="text-sm font-bold text-[#151B35]">
                        {isGenerating
                          ? "Preparing mark scheme…"
                          : "Scheme not ready."}
                      </p>
                      <p className="mt-1 max-w-[16rem] text-[11px] text-slate-500">
                        The marking guidance will appear beside the paper.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </PackSlot>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 sm:px-5">
          <Link
            href={ROUTES.stage3}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#151B35] transition hover:bg-slate-50"
          >
            ← Back
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                disabled={!hasResult || exporting}
                onClick={onToggleExport}
                className={cn(
                  "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#151B35] transition hover:bg-slate-50",
                  (!hasResult || exporting) && "opacity-50",
                )}
              >
                Download / Print
              </button>
              {exportMenuOpen && hasResult ? (
                <div className="absolute right-0 bottom-full z-20 mb-1 min-w-[16rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  {exportActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() => onExport(action.id)}
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
              className={cn(
                "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#151B35] transition hover:bg-slate-50",
                (!hasResult || exporting) && "opacity-50",
              )}
            >
              Share
            </button>

            <button
              type="button"
              disabled={!hasResult || isGenerating || isSavingLibrary}
              onClick={onSaveLibrary}
              className={cn(
                "rounded-xl bg-[#28C2C0] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95",
                (!hasResult || isGenerating || isSavingLibrary) && "opacity-50",
              )}
            >
              {isSavingLibrary
                ? "Saving…"
                : linkedLibraryItemId
                  ? "Update in Library"
                  : "Save to Library"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
