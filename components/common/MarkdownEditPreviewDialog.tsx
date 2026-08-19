"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { MarkdownSourceEditor } from "@/features/stage1/MarkdownSourceEditor";

type EditMode = "edit" | "preview";

const EDIT_MODES: readonly { id: EditMode; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
];

export function MarkdownEditPreviewDialog({
  open,
  title,
  initialValue,
  placeholder = "Update the markdown source…",
  onClose,
  onSave,
  renderPreview,
}: {
  open: boolean;
  title: string;
  initialValue: string;
  placeholder?: string;
  onClose: () => void;
  onSave: (value: string) => void | Promise<void>;
  renderPreview: (value: string) => ReactNode;
}) {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<EditMode>("edit");
  const [saving, setSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setValue(initialValue);
    setMode("edit");
    setSaving(false);
    setEditorKey((k) => k + 1);
  }, [open, initialValue]);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(value);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="markdown-edit-preview-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2
            id="markdown-edit-preview-title"
            className="text-lg font-semibold text-[#1A1C30]"
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
            {mode === "preview"
              ? "Previewing unsaved changes"
              : "Markdown source"}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {mode === "preview" ? (
            <div className="rounded-xl border border-[#E5E7EB] p-3">
              {renderPreview(value)}
            </div>
          ) : (
            <MarkdownSourceEditor
              key={editorKey}
              value={value}
              onChange={setValue}
              placeholder={placeholder}
              className="min-h-[18rem]"
            />
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} isLoading={saving}>
            Save
          </Button>
        </footer>
      </div>
    </div>
  );
}
