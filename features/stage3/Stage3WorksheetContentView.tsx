"use client";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { worksheetQuestionMarkdown } from "@/lib/format-worksheet-markdown";
import type { Stage3Item } from "@/types/stage3";

function ItemBlock({ item }: { item: Stage3Item }) {
  return (
    <div className="rounded-xl border border-[#E8F8F7] bg-[#FAFCFC] px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#28C2C0]">
        Q{item.itemNumber}
        {item.difficulty ? ` · ${item.difficulty}` : ""}
      </p>
      <div className="mt-2 text-sm text-[#1A1C30]">
        <MarkdownContentView
          content={worksheetQuestionMarkdown(item)}
          className="prose-p:my-0 prose-p:text-sm prose-p:font-medium"
          compact
        />
      </div>
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
