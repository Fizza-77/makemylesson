"use client";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { structureWorksheetMarkdown } from "@/lib/format-worksheet-markdown";
import type { Stage3Item } from "@/types/stage3";

function normalizeType(raw: string): string {
  const t = raw.trim().toLowerCase().replace(/-/g, "_");
  if (t === "mcq" || t === "multiplechoice" || t === "multiple_choice") {
    return "multiple_choice";
  }
  if (t === "truefalse" || t === "true_false" || t === "tf") {
    return "true_false";
  }
  if (t === "fill_in_the_blanks" || t === "fill_blanks") {
    return "fill_in_the_blanks";
  }
  return t;
}

function ItemBlock({ item }: { item: Stage3Item }) {
  const type = normalizeType(item.questionType);
  const structuredPrompt = structureWorksheetMarkdown(item.prompt);
  const lines = structuredPrompt
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-[#E8F8F7] bg-[#FAFCFC] px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#28C2C0]">
        Q{item.itemNumber}
        {item.difficulty ? ` · ${item.difficulty}` : ""}
      </p>
      {type === "multiple_choice" ? (
        <div className="mt-2 space-y-1.5 text-sm text-[#1A1C30]">
          {lines.map((line, i) =>
            i === 0 ? (
              <MarkdownContentView
                key={i}
                content={line}
                className="prose-p:my-0 prose-p:text-sm prose-p:font-medium"
                compact
              />
            ) : (
              <p key={i} className="pl-1">
                {line}
              </p>
            ),
          )}
        </div>
      ) : type === "true_false" ? (
        <div className="mt-2 space-y-2 text-sm text-[#1A1C30]">
          <MarkdownContentView
            content={structuredPrompt || item.prompt}
            className="prose-p:my-0 prose-p:text-sm prose-p:font-medium"
            compact
          />
          <div className="flex gap-4 text-[#666666]">
            <span>□ True</span>
            <span>□ False</span>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <MarkdownContentView
            content={structuredPrompt || item.prompt}
            className="prose-p:my-0 prose-p:text-sm prose-p:font-medium"
            compact
          />
        </div>
      )}
    </div>
  );
}

export function Stage3WorksheetContentView({
  items,
  instructions,
  emptyPlaceholder = "Generate an activity to preview content.",
}: {
  items: Stage3Item[];
  instructions?: string | null;
  emptyPlaceholder?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-[#666666]">{emptyPlaceholder}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {instructions?.trim() ? (
        <div>
          <h3 className="text-sm font-semibold text-[#1A1C30]">Instructions</h3>
          <div className="mt-1">
            <MarkdownContentView content={instructions} compact />
          </div>
        </div>
      ) : null}
      <div>
        <h3 className="text-sm font-semibold text-[#28C2C0]">Questions</h3>
        <div className="mt-2 flex flex-col gap-3">
          {items.map((item) => (
            <ItemBlock key={item.itemNumber} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
