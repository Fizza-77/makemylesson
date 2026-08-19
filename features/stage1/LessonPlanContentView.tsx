"use client";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { structureQuestionAnswerMarkdown } from "@/lib/format-worksheet-markdown";

type Props = {
  content: string;
  emptyPlaceholder?: string;
  className?: string;
};

export function LessonPlanContentView({
  content,
  emptyPlaceholder = "Generate with AI to see your lesson plan here.",
  className,
}: Props) {
  return (
    <MarkdownContentView
      content={structureQuestionAnswerMarkdown(content)}
      emptyPlaceholder={emptyPlaceholder}
      className={className}
    />
  );
}
