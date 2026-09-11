"use client";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { structureWorksheetMarkdown } from "@/lib/format-worksheet-markdown";

/**
 * Renders Stage 3 / Stage 4 question bodies (student activity, answer key, mark
 * scheme) with the same structure the PDF exports use: bold question stems, one
 * option per line, and each answer on its own line below its question.
 */
export function WorksheetContentView({
  content,
  emptyPlaceholder,
  className,
  compact,
}: {
  content: string;
  emptyPlaceholder?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <MarkdownContentView
      content={structureWorksheetMarkdown(content)}
      emptyPlaceholder={emptyPlaceholder}
      className={className}
      compact={compact}
    />
  );
}


