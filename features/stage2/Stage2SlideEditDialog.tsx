"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { Stage2Slide } from "@/types/stage2";

export function Stage2SlideEditDialog({
  open,
  slide,
  onClose,
  onSave,
}: {
  open: boolean;
  slide: Stage2Slide | null;
  onClose: () => void;
  onSave: (patch: {
    slideTitle: string;
    slideContent: string[];
    speakerNotes: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open || !slide) return;
    setTitle(slide.slideTitle);
    setContent(slide.slideContent.join("\n"));
    setNotes(slide.speakerNotes);
  }, [open, slide]);

  if (!open || !slide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="stage2-edit-title"
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl"
      >
        <h2
          id="stage2-edit-title"
          className="text-lg font-semibold text-[#1A1C30]"
        >
          Edit slide {slide.slideNumber}
        </h2>
        <label className="mt-4 flex flex-col gap-1.5 text-sm">
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
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave({
                slideTitle: title.trim(),
                slideContent: content
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean),
                speakerNotes: notes.trim(),
              });
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
