"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { LessonPlanContentView } from "@/features/stage1/LessonPlanContentView";
import { MarkdownRichTextEditor } from "@/features/stage1/MarkdownRichTextEditor";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  initialValue: string;
  title?: string;
  onClose: () => void;
  onSave: (value: string) => void | Promise<void>;
};

export function LessonPlanEditDialog({
  open,
  initialValue,
  title = "Edit Lesson Plan",
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setPreview(false);
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

        <div className="flex gap-1 border-b border-[#E5E7EB] px-5 py-2">
          <button
            type="button"
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              !preview
                ? "bg-[#E8F8F7] text-[#1A1C30]"
                : "text-[#666666] hover:bg-[#F5F6FA]",
            )}
            onClick={() => setPreview(false)}
          >
            Edit
          </button>
          <button
            type="button"
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              preview
                ? "bg-[#E8F8F7] text-[#1A1C30]"
                : "text-[#666666] hover:bg-[#F5F6FA]",
            )}
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {preview ? (
            <div className="rounded-xl border border-[#E5E7EB] p-3">
              <LessonPlanContentView content={value} />
            </div>
          ) : (
            <MarkdownRichTextEditor
              key={editorKey}
              value={value}
              onChange={setValue}
              placeholder="Update your generated lesson plan..."
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
