"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

import {
  editableHtmlToMarkdown,
  markdownToEditableHtml,
} from "@/lib/markdown-rich-text";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
};

function runFormat(command: string) {
  try {
    document.execCommand(command, false);
  } catch {
    /* ignore unsupported commands */
  }
}

export function MarkdownRichTextEditor({
  value,
  onChange,
  placeholder = "Update your generated lesson plan...",
  className,
  editorClassName,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastMarkdownRef = useRef(value);
  const skipNextSyncRef = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    if (value === lastMarkdownRef.current) return;
    lastMarkdownRef.current = value;
    el.innerHTML = markdownToEditableHtml(value);
  }, [value]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = markdownToEditableHtml(value);
    lastMarkdownRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount hydrate only
  }, []);

  function emitFromDom() {
    const el = editorRef.current;
    if (!el) return;
    const md = editableHtmlToMarkdown(el.innerHTML);
    lastMarkdownRef.current = md;
    skipNextSyncRef.current = true;
    onChange(md);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      runFormat("bold");
      emitFromDom();
      return;
    }
    if (key === "i") {
      e.preventDefault();
      runFormat("italic");
      emitFromDom();
    }
  }

  function applyToolbar(command: "bold" | "italic") {
    editorRef.current?.focus();
    runFormat(command);
    emitFromDom();
  }

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB]", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E5E7EB] bg-[#F8FAFB] px-2 py-1.5">
        <button
          type="button"
          title="Bold (Ctrl+B)"
          aria-label="Bold"
          className="rounded-md px-2.5 py-1 text-sm font-bold text-[#1A1C30] hover:bg-white"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyToolbar("bold")}
        >
          B
        </button>
        <button
          type="button"
          title="Italic (Ctrl+I)"
          aria-label="Italic"
          className="rounded-md px-2.5 py-1 text-sm italic text-[#1A1C30] hover:bg-white"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyToolbar("italic")}
        >
          I
        </button>
        <span className="ml-1 hidden text-[11px] text-[#8A93A3] sm:inline">
          Ctrl+B bold · Ctrl+I italic
        </span>
      </div>
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={cn(
          "prose prose-sm max-w-none h-[min(50vh,28rem)] overflow-y-auto px-3 py-3 text-sm leading-relaxed text-[#1A1C30] outline-none",
          "prose-headings:my-2 prose-headings:font-extrabold prose-headings:text-[#1A1C30]",
          "prose-p:my-1.5 prose-p:leading-relaxed prose-strong:font-extrabold",
          "prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5",
          "empty:before:pointer-events-none empty:before:text-[#9AA3B2] empty:before:content-[attr(data-placeholder)]",
          "focus:ring-0",
          editorClassName,
        )}
        onInput={emitFromDom}
        onBlur={emitFromDom}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
