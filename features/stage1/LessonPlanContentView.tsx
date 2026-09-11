"use client";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";

type Props = {
  content: string;
  emptyPlaceholder?: string;
  className?: string;
  /**
   * When false, use default markdown prose (speaker notes, misc previews).
   * Lesson plans default to the Success Criteria / supplement typography.
   */
  lessonPlan?: boolean;
};

/**
 * Promote AI section titles to real headings so they share Success Criteria styling:
 * - `**Exit Ticket Collection:**` / `**Learning Objectives**`
 * - plain title lines ending with `:` (short, title-like)
 */
function promoteStandaloneBoldTitles(md: string): string {
  let out = md.replace(
    /^(?:[ \t]*)(?:\*\*|__)([^*\n_]{2,90}?)(?:\*\*|__)[ \t]*$/gm,
    (_match, title: string) => `## ${title.trim().replace(/:+$/, "")}`,
  );
  // Already-markdown headings: drop a trailing colon so they read like Success Criteria
  out = out.replace(
    /^(#{1,4}[ \t]+.+?):[ \t]*$/gm,
    (_match, heading: string) => heading.trimEnd(),
  );
  return out;
}

export function LessonPlanContentView({
  content,
  emptyPlaceholder = "Generate a lesson plan to see it here.",
  className,
  lessonPlan = true,
}: Props) {
  const prepared = lessonPlan
    ? promoteStandaloneBoldTitles(content)
    : content;

  return (
    <MarkdownContentView
      content={prepared}
      emptyPlaceholder={emptyPlaceholder}
      className={className}
      lessonPlan={lessonPlan}
    />
  );
}


