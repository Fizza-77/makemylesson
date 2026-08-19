"use client";

import { useEffect, useState } from "react";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { Button } from "@/components/ui/Button";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import {
  Stage2CoverCanvas,
  type Stage2CoverData,
} from "@/features/stage2/Stage2CoverCanvas";
import { Stage2SlideCanvas } from "@/features/stage2/Stage2SlideCanvas";
import type { Stage2Slide } from "@/types/stage2";

type EditMode = "edit" | "preview";

const EDIT_MODES: readonly { id: EditMode; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
];

export function Stage2SlideEditDialog({
  open,
  slide,
  cover,
  themeId,
  totalSlides,
  onClose,
  onSaveSlide,
  onSaveCover,
}: {
  open: boolean;
  slide: Stage2Slide | null;
  cover?: Stage2CoverData | null;
  themeId: string;
  totalSlides?: number;
  onClose: () => void;
  onSaveSlide: (patch: {
    slideTitle: string;
    slideContent: string[];
    speakerNotes: string;
  }) => void;
  onSaveCover?: (patch: { topic: string }) => void;
}) {
  const isCover = Boolean(cover) && !slide;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<EditMode>("edit");

  useEffect(() => {
    if (!open) return;
    if (slide) {
      setTitle(slide.slideTitle);
      setContent(slide.slideContent.join("\n"));
      setNotes(slide.speakerNotes);
    } else if (cover) {
      setTitle(cover.topic);
      setContent("");
      setNotes("");
    }
    setMode("edit");
  }, [open, slide, cover]);

  if (!open || (!slide && !cover)) return null;

  const bullets = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const previewSlide: Stage2Slide | null = slide
    ? {
        ...slide,
        slideTitle: title.trim() || slide.slideTitle,
        slideContent: bullets,
        speakerNotes: notes,
      }
    : null;
  const previewCover: Stage2CoverData | null = cover
    ? { ...cover, topic: title.trim() || cover.topic }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="stage2-edit-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2
            id="stage2-edit-title"
            className="text-lg font-semibold text-[#1A1C30]"
          >
            {isCover ? "Edit cover slide" : `Edit slide ${slide?.slideNumber}`}
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
              : isCover
                ? "Edit the cover title"
                : "Edit title, bullets, and notes"}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {mode === "preview" ? (
            <div className="space-y-4">
              {isCover && previewCover ? (
                <Stage2CoverCanvas
                  data={previewCover}
                  themeId={themeId}
                  totalSlides={totalSlides ?? 1}
                />
              ) : previewSlide ? (
                <>
                  <Stage2SlideCanvas slide={previewSlide} themeId={themeId} />
                  <div className="rounded-xl border border-[#E5E7EB] p-3">
                    <p className="text-[11px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                      Speaker notes
                    </p>
                    <div className="mt-2">
                      <MarkdownContentView
                        content={notes}
                        emptyPlaceholder="No speaker notes yet."
                        compact
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : isCover ? (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[#1A1C30]">Cover title</span>
              <input
                className="rounded-xl border border-[#E5E7EB] px-3 py-2.5 outline-none focus:border-[#28C2C0]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="text-xs text-[#8A93A3]">
                School name and teacher name come from Profile.
              </span>
            </label>
          ) : (
            <>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-[#1A1C30]">Title</span>
                <input
                  className="rounded-xl border border-[#E5E7EB] px-3 py-2.5 outline-none focus:border-[#28C2C0]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="mt-3 flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-[#1A1C30]">
                  Bullet points (one per line)
                </span>
                <textarea
                  className="min-h-[120px] rounded-xl border border-[#E5E7EB] px-3 py-2.5 outline-none focus:border-[#28C2C0]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>
              <label className="mt-3 flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-[#1A1C30]">Speaker notes</span>
                <textarea
                  className="min-h-[100px] rounded-xl border border-[#E5E7EB] px-3 py-2.5 outline-none focus:border-[#28C2C0]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (isCover) {
                onSaveCover?.({ topic: title.trim() });
              } else {
                onSaveSlide({
                  slideTitle: title.trim(),
                  slideContent: bullets,
                  speakerNotes: notes.trim(),
                });
              }
              onClose();
            }}
            disabled={!title.trim() && isCover}
          >
            Save
          </Button>
        </footer>
      </div>
    </div>
  );
}
