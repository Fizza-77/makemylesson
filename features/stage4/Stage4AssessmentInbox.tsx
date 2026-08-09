"use client";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import type { LibraryItem } from "@/types/library-item";
import { STAGE4_MIN_SOURCE_CHARS } from "@/types/stage4";

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
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

function FormativeDocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Stage4AssessmentInbox({
  sourceMode,
  sourceLen,
  topic,
  activities,
  pickerOpen,
  isGenerating,
  onSelectUpload,
  onSelectStage3,
  onTogglePicker,
  onPickLibraryItem,
  onUploadFile,
  onPasteText,
  sourceText,
}: {
  sourceMode: "stage3Library" | "upload";
  sourceLen: number;
  topic: string;
  activities: LibraryItem[];
  pickerOpen: boolean;
  isGenerating?: boolean;
  onSelectUpload: () => void;
  onSelectStage3: () => void;
  onTogglePicker: () => void;
  onPickLibraryItem: (item: LibraryItem) => void;
  onUploadFile: () => void;
  onPasteText: (text: string) => void;
  sourceText: string;
}) {
  const sourceReady = sourceLen >= STAGE4_MIN_SOURCE_CHARS;
  const stage3Selected = sourceMode === "stage3Library";
  const uploadSelected = sourceMode === "upload";

  const selectedTitle =
    topic.trim() ||
    (stage3Selected ? "Quick Check Assessment" : "Uploaded source");
  const selectedDesc = stage3Selected
    ? "Stage 3 content is ready to expand into a quiz or full test."
    : sourceReady
      ? "Your uploaded source is ready to expand into a quiz or full test."
      : "Upload a file or paste text to continue.";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_-12px_rgba(13,20,48,0.18)]">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#151B35]">
            <FolderIcon />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Assessment Inbox
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Collect the source material that will become the final student
              paper.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-600 uppercase">
          Source
        </span>
      </header>

      <div className="border-t border-slate-200 px-4 py-5 sm:px-5 sm:py-6">
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Navy Teacher Inbox */}
          <div className="flex flex-col rounded-2xl bg-[#151B35] p-5 sm:p-6">
            <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
              Teacher inbox
            </p>
            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              Choose Quiz or Test Source
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Select a file or reuse the formative assessment created in Stage
              3.
            </p>

            <div className="mt-auto flex justify-center pt-6">
              <Image
                src="/assessmentmaterial.svg"
                alt="Assessment Material — Ready for final paper"
                width={243}
                height={128}
                className="h-auto w-full max-w-[15rem] select-none sm:max-w-[17rem]"
                unoptimized
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  onSelectUpload();
                  onUploadFile();
                }}
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-3 text-left transition",
                  uploadSelected
                    ? "border-[#28C2C0] bg-white shadow-sm ring-1 ring-[#28C2C0]/30"
                    : "border-slate-200 bg-white hover:border-[#28C2C0]/40",
                  isGenerating && "opacity-50",
                )}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#E8F8F8] text-[#28C2C0]">
                  <UploadIcon />
                </span>
                <p className="mt-2 text-xs font-bold text-[#151B35] sm:text-[13px]">
                  Upload From Device
                </p>
                <p className="mt-1 text-[10px] leading-snug text-slate-500 sm:text-[11px]">
                  Use a lesson file, notes or an existing question paper.
                </p>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={onSelectStage3}
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-3 text-left transition",
                  stage3Selected && !pickerOpen
                    ? "border-[#28C2C0] bg-[#28C2C0] text-white shadow-sm"
                    : "border-slate-200 bg-white text-[#151B35] hover:border-[#28C2C0]/40",
                  isGenerating && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    stage3Selected && !pickerOpen
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F8F8] text-[#28C2C0]",
                  )}
                >
                  <FormativeDocIcon />
                </span>
                <p className="mt-2 text-xs font-bold sm:text-[13px]">
                  Use Formative Assessment from Stage 3
                </p>
                <p
                  className={cn(
                    "mt-1 text-[10px] leading-snug sm:text-[11px]",
                    stage3Selected && !pickerOpen
                      ? "text-white/85"
                      : "text-slate-500",
                  )}
                >
                  Build the final paper from the assessment already created.
                </p>
              </button>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={onTogglePicker}
              className={cn(
                "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition",
                pickerOpen
                  ? "border-[#28C2C0] bg-[#E8F8F8] text-[#128C89]"
                  : "border-slate-200 text-slate-600 hover:border-[#28C2C0]/40",
                isGenerating && "opacity-50",
              )}
            >
              {pickerOpen ? "Hide library picker" : "Pick Stage 3 activity from library"}
            </button>

            {pickerOpen ? (
              <div className="max-h-40 overflow-auto rounded-xl border border-slate-200 bg-white">
                {activities.length === 0 ? (
                  <p className="p-3 text-xs text-slate-500">
                    No Stage 3 activities yet.{" "}
                    <Link
                      href={ROUTES.stage3}
                      className="font-semibold text-[#28C2C0]"
                    >
                      Generate one
                    </Link>
                    .
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {activities.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[#F5FBFB]"
                          onClick={() => onPickLibraryItem(item)}
                        >
                          <span className="text-xs font-semibold text-[#151B35]">
                            {item.topic || "Untitled activity"}
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

            {uploadSelected ? (
              <textarea
                className="min-h-[88px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#28C2C0]"
                value={sourceText}
                disabled={isGenerating}
                placeholder="Or paste formative activity / lesson context…"
                onChange={(e) => onPasteText(e.target.value)}
              />
            ) : null}

            {/* Selected source */}
            <div className="rounded-2xl border border-[#B9E6E2] bg-[#E8F8F8] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                  Selected source
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#128C89] shadow-sm">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      sourceReady ? "bg-[#28C2C0]" : "bg-slate-300",
                    )}
                  />
                  {sourceReady ? "Ready" : "Needed"}
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h4 className="text-base font-bold text-[#151B35]">
                  {selectedTitle}
                </h4>
                <p className="text-xs leading-relaxed text-slate-500 sm:max-w-[55%] sm:text-right">
                  {selectedDesc}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-sm">
                  <p className="text-[9px] font-semibold tracking-wide text-slate-400 uppercase">
                    Origin
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#151B35]">
                    {stage3Selected ? "Stage 3" : "Upload"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-sm">
                  <p className="text-[9px] font-semibold tracking-wide text-slate-400 uppercase">
                    Status
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#151B35]">
                    {sourceReady ? "Ready to build" : "Add source"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
