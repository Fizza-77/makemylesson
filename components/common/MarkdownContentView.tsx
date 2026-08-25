"use client";

import type { HTMLAttributes, ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export const MARKDOWN_PROSE =
  "prose prose-sm max-w-none text-[#1A1C30] prose-headings:my-2 prose-headings:font-extrabold prose-headings:text-[#1A1C30] prose-p:my-1.5 prose-p:leading-relaxed prose-strong:font-extrabold prose-em:italic prose-li:my-0.5 prose-li:marker:text-[#28C2C0] prose-ul:my-1.5 prose-ol:my-1.5";

export const MARKDOWN_PROSE_COMPACT =
  "prose prose-sm max-w-none text-[#151B35] [&_strong]:font-extrabold [&_b]:font-extrabold prose-headings:my-1.5 prose-headings:text-[12px] prose-headings:font-extrabold prose-headings:text-[#151B35] prose-p:my-1 prose-p:text-[11px] prose-p:leading-relaxed sm:prose-p:text-xs prose-strong:font-extrabold prose-em:italic prose-li:my-0.5 prose-li:text-[11px] sm:prose-li:text-xs prose-li:marker:text-[#28C2C0] prose-ul:my-1 prose-ol:my-1";

/** Shared with LessonPlanSupplementView Section titles. */
export const LESSON_PLAN_SECTION_HEADING =
  "m-0 mb-2 font-[inherit] text-[15px] font-extrabold leading-snug tracking-tight text-[#151B35]";

/**
 * Matches Stage 1 supplement sections (Success Criteria, Curriculum Alignment, …):
 * same heading classes, 13px relaxed body, teal list markers, section rhythm.
 */
export const MARKDOWN_PROSE_LESSON_PLAN =
  "max-w-none font-[inherit] text-[13px] leading-relaxed text-[#1A1C30] " +
  "[&_p]:my-1.5 [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[#1A1C30] " +
  "[&_strong]:font-extrabold [&_strong]:text-[#1A1C30] [&_b]:font-extrabold [&_em]:italic " +
  "[&_ul]:my-1.5 [&_ol]:my-1.5 [&_ul]:pl-5 [&_ol]:pl-5 " +
  "[&_li]:my-1.5 [&_li]:text-[13px] [&_li]:leading-relaxed [&_li]:marker:text-[#28C2C0] " +
  "[&_hr]:my-5 [&_hr]:border-slate-200 " +
  "[&>:first-child]:mt-0";

type Props = {
  content: string;
  emptyPlaceholder?: string;
  className?: string;
  compact?: boolean;
  /** Stage 1 lesson plan + library review — match Success Criteria typography. */
  lessonPlan?: boolean;
};

const REMARK_PLUGINS = [remarkGfm];

function LessonPlanHeading({
  as: Tag,
  children,
  className,
  ...props
}: {
  as: "h1" | "h2" | "h3" | "h4";
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag
      {...props}
      className={cn(
        LESSON_PLAN_SECTION_HEADING,
        Tag === "h4" && "text-[13px] font-bold",
        "mt-5 first:mt-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Rubric tables are wider than the stage panels, so they scroll on their own. */
const MARKDOWN_COMPONENTS: Components = {
  table: ({ node: _node, children, ...props }) => (
    <div className="markdown-table-scroll">
      <table {...props}>{children}</table>
    </div>
  ),
};

const LESSON_PLAN_COMPONENTS: Components = {
  ...MARKDOWN_COMPONENTS,
  h1: ({ node: _node, children, ...props }) => (
    <LessonPlanHeading as="h1" {...props}>
      {children}
    </LessonPlanHeading>
  ),
  h2: ({ node: _node, children, ...props }) => (
    <LessonPlanHeading as="h2" {...props}>
      {children}
    </LessonPlanHeading>
  ),
  h3: ({ node: _node, children, ...props }) => (
    <LessonPlanHeading as="h3" {...props}>
      {children}
    </LessonPlanHeading>
  ),
  h4: ({ node: _node, children, ...props }) => (
    <LessonPlanHeading as="h4" {...props}>
      {children}
    </LessonPlanHeading>
  ),
};

/** Renders stored markdown as formatted text (no raw ### / ** visible). */
export function MarkdownContentView({
  content,
  emptyPlaceholder = "No content yet.",
  className,
  compact = false,
  lessonPlan = false,
}: Props) {
  const text = content.trim();
  if (!text) {
    return (
      <p className="text-sm leading-relaxed text-[#666666]">{emptyPlaceholder}</p>
    );
  }

  const prose = lessonPlan
    ? MARKDOWN_PROSE_LESSON_PLAN
    : compact
      ? MARKDOWN_PROSE_COMPACT
      : MARKDOWN_PROSE;

  return (
    <div className={cn("markdown-body", prose, className)}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        components={lessonPlan ? LESSON_PLAN_COMPONENTS : MARKDOWN_COMPONENTS}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
