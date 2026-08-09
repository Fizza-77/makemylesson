/**
 * Normalize AI / library worksheet text so markdown renders with clear structure:
 * bold question headings, one option per line, Answer / Marking guidance on their own lines.
 *
 * Important: markdown collapses single newlines into spaces, so MCQ options must become
 * a real list (or blank-line-separated paragraphs) — not just `\n`-separated lines.
 */

/** Turn "A. … B. … C. … D. …" into a markdown list (one option per line). */
function breakMcqOptions(text: string): string {
  return text.replace(
    /(?<![A-Za-z0-9])([A-D])\.\s+/g,
    (_m, letter: string, offset: number, full: string) => {
      const item = `- **${letter}.** `;
      if (offset === 0) return item;

      let i = offset - 1;
      while (i >= 0 && (full[i] === " " || full[i] === "\t")) i -= 1;
      const prevChar = i >= 0 ? full[i] : "";

      if (prevChar === "\n") {
        let j = i - 1;
        while (j >= 0 && full[j] !== "\n") j -= 1;
        const prevLine = full.slice(j + 1, i).trim();
        const prevIsOption =
          /^[A-D]\./.test(prevLine) ||
          /^- \*\*[A-D]\.\*\*/.test(prevLine) ||
          /^- [A-D]\./.test(prevLine);
        // Continue list, or start a new list after the stem
        return prevIsOption ? item : `\n${item}`;
      }

      // Mid-line "A. … B. …" — single newline keeps one contiguous markdown list
      return `\n${item}`;
    },
  );
}

/** Put Answer / Marking guidance labels on their own lines and bold them. */
function breakAnswerSections(text: string): string {
  let out = text.replace(
    /(?:^|[ \t])\*{0,2}Marking guidance:\*{0,2}[ \t]*/gi,
    (_m, offset: number) =>
      offset === 0 ? "**Marking guidance:** " : "\n\n**Marking guidance:** ",
  );

  out = out.replace(
    /(?:^|[ \t])\*{0,2}Correct answer:\*{0,2}[ \t]*/gi,
    (_m, offset: number) =>
      offset === 0 ? "**Correct answer:** " : "\n**Correct answer:** ",
  );

  // Do not match the "answer:" inside "Correct answer:"
  out = out.replace(
    /(?<![Cc]orrect )\*{0,2}Answer:\*{0,2}[ \t]*/gi,
    (_m, offset: number) => {
      if (offset === 0) return "**Answer:** ";
      const prev = out[offset - 1];
      if (prev === "\n") return "**Answer:** ";
      return "\n\n**Answer:** ";
    },
  );

  // Rejoin "Answer: 1." + "Correct answer: A" split across lines
  out = out.replace(
    /\*\*Answer:\*\*\s*(\d+)\.\s*\n+\*\*Correct answer:\*\*\s*/gi,
    "**Answer:** $1. Correct answer: ",
  );

  return out;
}

/** Promote "Question N" lines to markdown headings (bold / larger). */
function promoteQuestionHeadings(text: string): string {
  return text.replace(
    /(?:^|\n)[ \t]*#{0,6}[ \t]*\*{0,2}Question[ \t]+(\d+)\*{0,2}[ \t]*(?=\n|$)/gi,
    "\n\n### Question $1\n\n",
  );
}

function collapseExtraBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

/** Structure freeform student/teacher worksheet markdown for display. */
export function structureWorksheetMarkdown(raw: string): string {
  let text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return "";

  text = breakMcqOptions(text);
  text = breakAnswerSections(text);
  text = promoteQuestionHeadings(text);

  // Title line like "topic — Teacher Answer Guide" (with or without leading ##)
  text = text.replace(
    /^#{0,6}\s*(.+?—\s*(?:Teacher Answer Guide|Student Activity|Answer Key))\s*$/im,
    "## $1\n",
  );

  return collapseExtraBlankLines(text);
}

type WorksheetItemLike = {
  itemNumber: number;
  prompt: string;
  answerKey?: string;
  markingGuidance?: string;
  answerKeyLabel?: string;
};

function formatPromptWithOptions(prompt: string): string {
  return breakMcqOptions(prompt.trim());
}

/** Build a clean answer-key markdown document from structured Stage 3 items. */
export function answerKeyMarkdownFromItems(
  items: WorksheetItemLike[],
  title?: string,
): string {
  if (!items.length) return "";
  const parts: string[] = [];
  if (title?.trim()) {
    parts.push(`## ${title.trim()} — Teacher Answer Guide`);
  }
  for (const item of items) {
    parts.push(`### Question ${item.itemNumber}`);
    parts.push(formatPromptWithOptions(item.prompt));
    const answer = (item.answerKey ?? "").trim();
    const guidance = (item.markingGuidance ?? "").trim();
    const label = (item.answerKeyLabel ?? "Answer").trim() || "Answer";
    if (answer) {
      const answerBody = /^[A-D]$/i.test(answer)
        ? `Correct answer: ${answer.toUpperCase()}`
        : answer;
      parts.push(`**${label}:** ${answerBody}`);
    }
    if (guidance) {
      parts.push(`**Marking guidance:** ${guidance}`);
    }
  }
  return collapseExtraBlankLines(parts.join("\n\n"));
}

/** Build student activity markdown from items when freeform body is weak. */
export function studentActivityMarkdownFromItems(
  items: WorksheetItemLike[],
  instructions?: string | null,
  title?: string,
): string {
  if (!items.length) return "";
  const parts: string[] = [];
  if (title?.trim()) parts.push(`## ${title.trim()}`);
  if (instructions?.trim()) parts.push(instructions.trim());
  for (const item of items) {
    parts.push(`### Question ${item.itemNumber}`);
    parts.push(formatPromptWithOptions(item.prompt));
  }
  return collapseExtraBlankLines(parts.join("\n\n"));
}
