"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { LessonPlanContentView } from "@/features/stage1/LessonPlanContentView";
import { LessonPlanSupplementView } from "@/features/stage1/LessonPlanSupplementView";
import { MarkdownSourceEditor } from "@/features/stage1/MarkdownSourceEditor";

type EditMode = "edit" | "preview";

const EDIT_MODES: readonly { id: EditMode; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
];

type Props = {
  open: boolean;
  initialValue: string;
  title?: string;
  /** When set, Preview also shows the standard appended lesson-plan sections. */
  supplement?: { curriculumRoute: string; grade: string; subject: string };
  renderPreview?: (value: string) => ReactNode;
  onClose: () => void;
  onSave: (value: string) => void | Promise<void>;
};

export function LessonPlanEditDialog({
  open,
  initialValue,
  title = "Edit Lesson Plan",
  supplement,
  renderPreview,
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<EditMode>("edit");
  const [saving, setSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setMode("edit");
      setSaving(false);
      setEditorKey((k) => k + 1);
    }
  }, [open, initialValue]);

  if (!open) return null;

  async function handleSave() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onSave(trimmed);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-plan-edit-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2
            id="lesson-plan-edit-title"
            className="text-lg font-bold text-[#1A1C30]"
          >
            {title}
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-[#666666] hover:bg-[#F5F6FA]"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-2.5">
          <SegmentedToggle
            value={mode}
            options={EDIT_MODES}
            onChange={setMode}
            ariaLabel="Editing mode"
          />
          <p className="hidden text-xs text-[#8A93A3] sm:block">
            {mode === "preview" ? "Previewing unsaved changes" : "Markdown source"}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {mode === "preview" ? (
            <div className="rounded-xl border border-[#E5E7EB] p-3">
              {renderPreview ? (
                renderPreview(value)
              ) : (
                <>
                  <LessonPlanContentView content={value} />
                  {supplement ? (
                    <LessonPlanSupplementView
                      curriculumRoute={supplement.curriculumRoute}
                      grade={supplement.grade}
                      subject={supplement.subject}
                      className="mt-6 border-t border-slate-200 pt-5"
                    />
                  ) : null}
                </>
              )}
            </div>
          ) : (
            <MarkdownSourceEditor
              key={editorKey}
              value={value}
              onChange={setValue}
              placeholder="Update the markdown source…"
              className="min-h-[18rem]"
            />
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSave()}
            isLoading={saving}
            disabled={!value.trim()}
          >
            Save
          </Button>
        </footer>
      </div>
    </div>
  );
}
