"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";
import type { LibraryItem } from "@/types/library-item";
import {
  FORMATIVE_KINDS,
  QUESTION_TYPE_OPTIONS,
  STAGE3_MIN_SOURCE_CHARS,
  type FormativeKind,
} from "@/types/stage3";

const KIND_META: Record<
  FormativeKind,
  {
    badge: string;
    title: string;
    description: string;
    footer?: string;
  }
> = {
  quickCheck: {
    badge: "Fast check",
    title: "Quick Check",
    description: "Up to 5 quick questions. Gauge student understanding quickly.",
  },
  practiceWorksheet: {
    badge: "Practice",
    title: "Worksheet",
    description:
      "Up to 15 questions. Deep practice and review for the whole class.",
    footer: "Longer practice set",
  },
  exitTicket: {
    badge: "End of lesson",
    title: "Exit Ticket",
    description: "Targeted questions for the end of the lesson check-in.",
    footer: "Quick evidence of learning",
  },
};

const TYPE_LETTERS = ["A", "B", "C", "D"] as const;

function UploadDocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
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

function DeckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckCircle({ active }: { active: boolean }) {
  return active ? (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#28C2C0] text-white">
      <svg viewBox="0 0 12 12" className="size-2.5 fill-current" aria-hidden>
        <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
      </svg>
    </span>
  ) : (
    <span className="size-5 shrink-0 rounded-full border-2 border-[#28C2C0]" />
  );
}

function AssessmentBoardCard({
  kind,
  selected,
  questionCount,
  qMin,
  qMax,
  disabled,
  onSelect,
  onQuestionCount,
}: {
  kind: FormativeKind;
  selected: boolean;
  questionCount: number;
  qMin: number;
  qMax: number;
  disabled?: boolean;
  onSelect: () => void;
  onQuestionCount: (n: number) => void;
}) {
  const meta = KIND_META[kind];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex h-full w-full min-w-0 flex-col items-center outline-none disabled:opacity-50",
        selected && "z-[1]",
      )}
    >
      {/* Clip sits above the card — never bordered */}
      <Image
        src="/assessmentclip.svg"
        alt=""
        width={58}
        height={36}
        className="relative z-10 -mb-2.5 h-auto w-[42%] max-w-[3.75rem] shrink-0 select-none pointer-events-none"
        unoptimized
      />

      {/* Only this card gets the cyan border when selected */}
      <div
        className={cn(
          "relative flex min-h-[11.5rem] w-full flex-1 flex-col rounded-2xl border-2 bg-white px-3 pb-3 pt-7 text-left shadow-sm transition",
          selected
            ? "border-[#28C2C0]"
            : "border-[#DDE6E8] hover:border-[#28C2C0]/40",
        )}
      >
        <span className="absolute top-3.5 right-3 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-slate-500 uppercase">
          {meta.badge}
        </span>

        <div className="mt-1 flex items-center gap-1.5 pr-14">
          <CheckCircle active={selected} />
          <span className="whitespace-nowrap text-xs font-bold text-[#151B35] sm:text-sm">
            {meta.title}
          </span>
        </div>

        <p className="mt-2 min-h-[2.7rem] line-clamp-3 text-[9px] leading-snug text-slate-500 sm:min-h-[3rem] sm:text-[10px]">
          {meta.description}
        </p>

        {/* Fixed-height footer so selected/unselected cards stay equal */}
        <div
          className="mt-auto min-h-[3.75rem] pt-3"
          onClick={selected ? (e) => e.stopPropagation() : undefined}
          onKeyDown={selected ? (e) => e.stopPropagation() : undefined}
        >
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-1">
                <p className="text-[8px] font-bold tracking-wide text-[#28C2C0] uppercase">
                  Number of questions
                </p>
                <p className="text-[9px] font-semibold text-[#151B35]">
                  {questionCount} question{questionCount === 1 ? "" : "s"}
                </p>
              </div>
              <input
                type="range"
                min={qMin}
                max={qMax}
                value={questionCount}
                disabled={disabled}
                onChange={(e) => onQuestionCount(Number(e.target.value))}
                className="mt-1 w-full accent-[#28C2C0]"
              />
              <div className="flex justify-between text-[8px] text-slate-400">
                <span>{qMin}</span>
                <span>{qMax}</span>
              </div>
            </>
          ) : meta.footer ? (
            <p className="border-t border-dashed border-slate-200 pt-2 text-[9px] font-medium text-slate-500">
              {meta.footer}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function Stage3AssessmentBuilder({
  sourceMode,
  sourceLen,
  topic,
  formativeKind,
  questionCount,
  qMin,
  qMax,
  multipleChoice,
  trueFalse,
  fillBlanks,
  shortAnswer,
  presentations,
  pickerOpen,
  isGenerating,
  canGenerate,
  onTogglePicker,
  onSelectUpload,
  onSelectStage2,
  onPickLibraryItem,
  onUploadFile,
  onPasteText,
  sourceText,
  onFormativeKind,
  onQuestionCount,
  onQuestionType,
  onGenerate,
}: {
  sourceMode: "stage2Library" | "upload";
  sourceLen: number;
  topic: string;
  formativeKind: FormativeKind;
  questionCount: number;
  qMin: number;
  qMax: number;
  multipleChoice: boolean;
  trueFalse: boolean;
  fillBlanks: boolean;
  shortAnswer: boolean;
  presentations: LibraryItem[];
  pickerOpen: boolean;
  isGenerating?: boolean;
  canGenerate: boolean;
  onTogglePicker: () => void;
  onSelectUpload: () => void;
  onSelectStage2: () => void;
  onPickLibraryItem: (item: LibraryItem) => void;
  onUploadFile: () => void;
  onPasteText: (text: string) => void;
  sourceText: string;
  onFormativeKind: (kind: FormativeKind) => void;
  onQuestionCount: (n: number) => void;
  onQuestionType: (
    key: "multipleChoice" | "trueFalse" | "fillBlanks" | "shortAnswer",
    value: boolean,
  ) => void;
  onGenerate: () => void;
}) {
  const [showPaste, setShowPaste] = useState(false);
  const stage2Selected = sourceMode === "stage2Library" && !showPaste;
  const uploadSelected = sourceMode === "upload" || showPaste;

  const typeState = [
    multipleChoice,
    trueFalse,
    fillBlanks,
    shortAnswer,
  ] as const;
  const typeKeys = [
    "multipleChoice",
    "trueFalse",
    "fillBlanks",
    "shortAnswer",
  ] as const;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#151B35]">
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
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Assessment Builder
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose your source, assessment type and question mix.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-600">
          Stage 3
        </span>
      </header>

      <div className="space-y-5 border-t border-slate-200 bg-white px-4 py-5 sm:px-5 sm:py-6">
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]">
          {/* Teacher Clipboard — light cyan */}
          <div className="relative rounded-2xl border border-[#B9E6E2] bg-[#E8F8F8] p-4 pt-11 shadow-sm sm:p-5 sm:pt-12">
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
            <h3 className="mt-1 whitespace-nowrap text-sm font-bold text-[#151B35] sm:text-base">
              Choose Assessment Source
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Select where the assessment content should come from
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
                  uploadSelected && sourceMode === "upload" && !showPaste
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    uploadSelected && sourceMode === "upload" && !showPaste
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <UploadDocIcon />
                </span>
                <span className="text-[11px] font-semibold leading-snug sm:text-xs">
                  Upload From Device
                </span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setShowPaste(false);
                  onSelectStage2();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                  stage2Selected && !pickerOpen
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    stage2Selected && !pickerOpen
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <DeckIcon />
                </span>
                <span className="text-[11px] font-semibold leading-snug sm:text-xs">
                  Use slides from Stage 2
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
                <span className="text-[11px] font-semibold leading-snug sm:text-xs">
                  Pick from library
                </span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  onSelectUpload();
                  setShowPaste(true);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                  showPaste
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#151B35] hover:border-[#28C2C0]/50",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    showPaste
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <LibraryIcon />
                </span>
                <span className="text-[11px] font-semibold leading-snug sm:text-xs">
                  Paste text
                </span>
              </button>
            </div>

            {pickerOpen ? (
              <div className="mt-3 max-h-40 overflow-auto rounded-xl border border-slate-200 bg-white">
                {presentations.length === 0 ? (
                  <p className="p-3 text-xs text-slate-500">
                    No presentations yet.{" "}
                    <Link
                      href={ROUTES.stage2}
                      className="font-semibold text-[#28C2C0]"
                    >
                      Generate one
                    </Link>
                    .
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {presentations.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[#F5FBFB]"
                          onClick={() => onPickLibraryItem(item)}
                        >
                          <span className="text-xs font-semibold text-[#151B35]">
                            {item.topic || "Untitled presentation"}
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

            {showPaste ? (
              <textarea
                className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#28C2C0]"
                value={sourceText}
                disabled={isGenerating}
                placeholder="Paste presentation or lesson context…"
                onChange={(e) => onPasteText(e.target.value)}
              />
            ) : null}

            {sourceLen >= STAGE3_MIN_SOURCE_CHARS ? (
              <p className="mt-3 text-[11px] text-slate-500">
                {`Source ready${topic ? ` · ${topic}` : ""}`}
              </p>
            ) : null}
          </div>

          {/* Assessment format + question mix column */}
          <div className="flex min-w-0 flex-col gap-4">
            <div
              className="rounded-2xl border border-[#DDE6E8] p-4 pt-5 shadow-sm sm:p-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(53, 190, 188, 0.08) 0%, rgba(53, 190, 188, 0) 28%)",
              }}
            >
              <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                1 · Assessment format
              </p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <h3 className="text-base font-bold text-[#151B35]">
                  Choose Assessment Type
                </h3>
                <p className="shrink-0 text-[10px] font-medium text-slate-400">
                  Select one
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-3">
                {FORMATIVE_KINDS.map((kind) => (
                  <AssessmentBoardCard
                    key={kind.id}
                    kind={kind.id}
                    selected={formativeKind === kind.id}
                    questionCount={questionCount}
                    qMin={qMin}
                    qMax={qMax}
                    disabled={isGenerating}
                    onSelect={() => onFormativeKind(kind.id)}
                    onQuestionCount={onQuestionCount}
                  />
                ))}
              </div>
            </div>

            {/* Question Mix — directly under assessment type cards */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                  2 · Question mix
                </p>
                <h3 className="mt-1 text-base font-bold text-[#151B35] sm:text-lg">
                  Select Question Types
                </h3>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-[#F7F8FA] p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold tracking-wide text-[#30416F] uppercase">
                    Teacher marking palette
                  </p>
                  <span
                    className="h-1.5 w-10 shrink-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #28C2C0 0%, #202B52 100%)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {QUESTION_TYPE_OPTIONS.map((opt, i) => {
                    const key = typeKeys[i];
                    const checked = typeState[i];
                    const letter = TYPE_LETTERS[i];
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => onQuestionType(key, !checked)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border bg-white px-3 py-3 text-left transition",
                          checked
                            ? "border-[#28C2C0] shadow-sm"
                            : "border-slate-200 hover:border-[#28C2C0]/40",
                          isGenerating && "opacity-50",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                            checked
                              ? "bg-[#28C2C0] text-white"
                              : "bg-[#E8F8F8] text-[#30416F]",
                          )}
                        >
                          {letter}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-semibold text-[#151B35]">
                          {opt.label}
                        </span>
                        <CheckCircle active={checked} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating || !canGenerate}
              onClick={onGenerate}
              className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:brightness-100"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #0D1430 0%, #202B52 100%)",
              }}
            >
              {isGenerating ? "Creating…" : "Create My Worksheet"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
