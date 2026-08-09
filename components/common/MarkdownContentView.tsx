"use client";

import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

export const MARKDOWN_PROSE =
  "prose prose-sm max-w-none text-[#1A1C30] prose-headings:my-2 prose-headings:font-extrabold prose-headings:text-[#1A1C30] prose-p:my-1.5 prose-p:leading-relaxed prose-strong:font-extrabold prose-em:italic prose-li:my-0.5 prose-li:marker:text-[#28C2C0] prose-ul:my-1.5 prose-ol:my-1.5";

export const MARKDOWN_PROSE_COMPACT =
  "prose prose-sm max-w-none text-[#151B35] [&_strong]:font-extrabold [&_b]:font-extrabold prose-headings:my-1.5 prose-headings:text-[12px] prose-headings:font-extrabold prose-headings:text-[#151B35] prose-p:my-1 prose-p:text-[11px] prose-p:leading-relaxed sm:prose-p:text-xs prose-strong:font-extrabold prose-em:italic prose-li:my-0.5 prose-li:text-[11px] sm:prose-li:text-xs prose-li:marker:text-[#28C2C0] prose-ul:my-1 prose-ol:my-1";

type Props = {
  content: string;
  emptyPlaceholder?: string;
  className?: string;
  compact?: boolean;
};

/** Renders stored markdown as formatted text (no raw ### / ** visible). */
export function MarkdownContentView({
  content,
  emptyPlaceholder = "No content yet.",
  className,
  compact = false,
}: Props) {
  const text = content.trim();
  if (!text) {
    return (
      <p className="text-sm leading-relaxed text-[#666666]">{emptyPlaceholder}</p>
    );
  }

  return (
    <div className={cn(compact ? MARKDOWN_PROSE_COMPACT : MARKDOWN_PROSE, className)}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
