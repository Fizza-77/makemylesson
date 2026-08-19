"use client";

import { cn } from "@/lib/utils";

/**
 * Raw markdown source editing, for fixing structure the rich-text editor
 * abstracts away (tables, heading levels, nested list indentation).
 */
export function MarkdownSourceEditor({
  value,
  onChange,
  placeholder = "Edit the markdown source…",
  className,
}: {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      className={cn(
        "w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 font-mono text-[12.5px]",
        "leading-relaxed text-[#1A1C30] outline-none",
        "focus:border-[#28C2C0] focus:ring-2 focus:ring-[#28C2C0]/20",
        className,
      )}
    />
  );
}
