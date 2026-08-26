"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { LessonPlanContentView } from "@/features/stage1/LessonPlanContentView";
import { LessonPlanSupplementView } from "@/features/stage1/LessonPlanSupplementView";
import { MarkdownSourceEditor } from "@/features/stage1/MarkdownSourceEditor";
import { cn } from "@/lib/utils";

type EditMode = "edit" | "preview";

const EDIT_MODES: readonly { id: EditMode; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
];

function CheckMark() {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center rounded bg-teal-500 text-white">
      <svg viewBox="0 0 12 12" className="size-2.5 fill-current" aria-hidden>
        <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
      </svg>
    </span>
  );
}

function PersonalizationCircles({
  schoolLogoUrl,
  ownPictureUrl,
}: {
  schoolLogoUrl?: string | null;
  ownPictureUrl?: string | null;
}) {
  const logo = schoolLogoUrl?.trim() || "";
  const photo = ownPictureUrl?.trim() || "";
  if (!logo && !photo) return null;

  return (
    <div className="flex shrink-0 items-center gap-2.5 self-start">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt="School logo"
          className="size-11 rounded-full border border-slate-200 bg-white object-cover shadow-sm sm:size-12"
        />
      ) : null}
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt="Teacher photo"
          className="size-11 rounded-full border border-slate-200 bg-white object-cover shadow-sm sm:size-12"
        />
      ) : null}
    </div>
  );
}

export function LessonPlanResultPanel({
  hasPlan,
  isGenerating,
  content,
  curriculumRoute,
  grade,
  subject,
  schoolLogoUrl,
  ownPictureUrl,
  linkedLibraryItemId,
  isSavingLibrary,
  exportMenuOpen,
  onToggleExport,
  onClear,
  onDownloadPdf,
  onPrintPdf,
  onSharePdf,
  onSaveLibrary,
  onSaveEdit,
  className,
}: {
  hasPlan: boolean;
  isGenerating?: boolean;
  content: string;
  /** Curriculum metadata for the standard appended sections. */
  curriculumRoute?: string;
  grade?: string;
  subject?: string;
  /** School logo URL when personalization is enabled. */
  schoolLogoUrl?: string | null;
  /** Teacher photo URL when personalization is enabled. */
  ownPictureUrl?: string | null;
  linkedLibraryItemId?: string | null;
  isSavingLibrary?: boolean;
  exportMenuOpen?: boolean;
  onToggleExport?: () => void;
  onClear?: () => void;
  onDownloadPdf?: () => void;
  onPrintPdf?: () => void;
  onSharePdf?: () => void;
  onSaveLibrary?: () => void;
  onSaveEdit?: (value: string) => void | Promise<void>;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("edit");
  const [draft, setDraft] = useState(content);
  const [editBaseline, setEditBaseline] = useState(content);
  const [saving, setSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!editing) setDraft(content);
  }, [content, editing]);

  useEffect(() => {
    if (!hasPlan) setEditing(false);
  }, [hasPlan]);

  const dirty = draft.trim() !== editBaseline.trim();
  // While editing, Save sits next to Edit (enabled once text changes).
  const showSave = editing;

  const planArticle = (body: ReactNode) => (
    <article className="flex min-h-[16rem] flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      {/* Logo/photo sit on the same top row as the plan title + meta, right-aligned. */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-5">{body}</div>
        <PersonalizationCircles
          schoolLogoUrl={schoolLogoUrl}
          ownPictureUrl={ownPictureUrl}
        />
      </div>
    </article>
  );

  const statusLabel = hasPlan
    ? editing
      ? dirty
        ? "Unsaved"
        : "Editing"
      : "Ready"
    : isGenerating
      ? "Generating…"
      : "Not generated";

  function startEdit() {
    setDraft(content);
    setEditBaseline(content);
    setEditorKey((k) => k + 1);
    setEditMode("edit");
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(content);
    setEditing(false);
  }

  async function saveEdit() {
    const trimmed = draft.trim();
    if (!trimmed || !onSaveEdit) return;
    setSaving(true);
    try {
      await onSaveEdit(trimmed);
      setEditBaseline(trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 bg-white px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
            <Image
              src="/icons/lesson-plan.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
              unoptimized
            />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Lesson Plan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? editMode === "preview"
                  ? "Previewing your unsaved changes."
                  : "Editing markdown source — headings, lists, and tables."
                : "Your generated lesson appears below."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasPlan ? (
            <>
              {editing ? (
                <SegmentedToggle
                  value={editMode}
                  options={EDIT_MODES}
                  onChange={setEditMode}
                  ariaLabel="Editing mode"
                />
              ) : null}
              <Button
                variant="ghost"
                className="px-2 py-1 text-xs"
                onClick={editing ? cancelEdit : startEdit}
                disabled={saving}
              >
                {editing ? "Cancel" : "Edit"}
              </Button>
              {showSave ? (
                <Button
                  className="px-3 py-1 text-xs"
                  onClick={() => void saveEdit()}
                  isLoading={saving || Boolean(isSavingLibrary)}
                  disabled={!draft.trim() || !dirty}
                >
                  Save
                </Button>
              ) : null}
              {!editing && !linkedLibraryItemId ? (
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={onClear}
                >
                  Clear
                </Button>
              ) : null}
            </>
          ) : null}
          <span className="inline-flex shrink-0 items-center rounded-full border border-teal-100 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap text-teal-600">
            {statusLabel}
          </span>
        </div>
      </header>

      <div className="border-t border-slate-200 bg-[#F7F8FA] px-4 py-5 sm:px-5 sm:py-6">
        {hasPlan ? (
          editing ? (
            editMode === "edit" ? (
              <MarkdownSourceEditor
                key={editorKey}
                value={draft}
                onChange={setDraft}
                placeholder="Edit your lesson plan markdown…"
                className="min-h-[16rem] max-h-[min(70vh,36rem)]"
              />
            ) : (
              planArticle(
                <>
                  <LessonPlanContentView content={draft} />
                  <LessonPlanSupplementView
                    curriculumRoute={curriculumRoute ?? ""}
                    grade={grade ?? ""}
                    subject={subject ?? ""}
                  />
                </>,
              )
            )
          ) : (
            planArticle(
              <>
                <LessonPlanContentView content={content} />
                <LessonPlanSupplementView
                  curriculumRoute={curriculumRoute ?? ""}
                  grade={grade ?? ""}
                  subject={subject ?? ""}
                />
              </>,
            )
          )
        ) : (
          <div className="relative flex min-h-[16rem] flex-col items-stretch gap-6 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-[#F3F5F7] px-4 py-8 sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 right-16 size-28 rounded-full bg-[#2DD4BF]/45 blur-2xl"
            />
            <div className="relative z-[1] mx-auto w-full max-w-[220px] shrink-0 sm:mx-0 sm:max-w-[260px]">
              <Image
                src="/lesson-plan.svg"
                alt=""
                width={280}
                height={220}
                className="h-auto w-full"
                unoptimized
              />
            </div>
            <div className="relative z-[1] min-w-0 flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#151B35] sm:text-xl">
                {isGenerating
                  ? "Generating your lesson plan…"
                  : "Generate a lesson plan to see it here."}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Your plan will appear in this workspace after the lesson details
                are selected.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                <FeaturePill>Learning objectives</FeaturePill>
                <FeaturePill>Timed steps</FeaturePill>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasPlan && !editing ? (
        <footer className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="relative">
            <Button
              variant="outline"
              className="text-xs"
              onClick={onToggleExport}
            >
              Download / Print
            </Button>
            {exportMenuOpen ? (
              <div className="absolute bottom-full left-0 z-10 mb-1 min-w-[9rem] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                  onClick={onDownloadPdf}
                >
                  PDF
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                  onClick={onPrintPdf}
                >
                  Print
                </button>
              </div>
            ) : null}
          </div>
          <Button variant="outline" className="text-xs" onClick={onSharePdf}>
            Share
          </Button>
          {!linkedLibraryItemId ? (
            <Button
              variant="outline"
              className="text-xs"
              isLoading={isSavingLibrary}
              onClick={onSaveLibrary}
            >
              Save to library
            </Button>
          ) : null}
        </footer>
      ) : null}
    </section>
  );
}

function FeaturePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50/80 px-2.5 py-1.5 text-xs font-medium text-[#151B35]">
      <CheckMark />
      {children}
    </span>
  );
}
