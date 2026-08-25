/**
 * Normalize AI / library worksheet text so markdown renders with clear structure:
 * bold question stems, one option per line, Answer / Marking guidance on their own lines.
 *
 * Important: markdown collapses single newlines into spaces, so MCQ options must become
 * a real list (or blank-line-separated paragraphs) — not just `\n`-separated lines. The
 * same applies to answers: a lone `\n` before "Answer:" still renders on the question's
 * line, so every answer label is separated by a blank line.
 */

/** Answer-style labels, longest first so "Correct answer" wins over "Answer". */
const ANSWER_LABELS = [
  "Correct answer",
  "Acceptable answers",
  "Acceptable answer",
  "Suggested answer",
  "Expected answer",
  "Sample answer",
  "Model answer",
  "Answer key",
  "Marking guidance",
  "Marking points",
  "Mark scheme",
  "Explanation",
  "Rationale",
  "Solution",
  "Answer",
] as const;

const ANSWER_LABEL_CASING = new Map(
  ANSWER_LABELS.map((label) => [label.toLowerCase(), label]),
);

/** Trailing `\*{0,2}` keeps the pass idempotent on already-bolded `**Answer:**`. */
const ANSWER_LABEL_RE = new RegExp(
  `\\*{0,2}(${ANSWER_LABELS.join("|")})\\*{0,2}[ \\t]*:\\*{0,2}[ \\t]*`,
  "gi",
);

const ANSWER_LINE_RE = new RegExp(
  `^\\*{0,2}(?:${ANSWER_LABELS.join("|")})\\*{0,2}[ \\t]*:`,
  "i",
);

/** A line that only carries a list/number marker before the answer label. */
const BARE_MARKER_RE = /^(?:[-*+]|\d+[.)])?[ \t]*$/;
const LIST_MARKER_RE = /^[-*+][ \t]+/;
const QUESTION_NUMBER_RE = /^((?:\d+[.)]|Q[ \t]*\d+[.):]?)[ \t]+)(.*)$/i;
const QUESTION_HEADING_RE = /^#{1,6}[ \t]*(?:\*\*)?(?:Question|Q)[ \t]*\d+/i;
const TRAILING_MARKS_RE = /([ \t]*\(\d+[ \t]*marks?\))[ \t]*$/i;

/** Canonical blank for fill-in-the-blank statements. Stays literal text inside `**…**`. */
export const WORKSHEET_BLANK = "______";

/** Tickable True / False choices — a GFM task list, so both web and PDF draw boxes. */
const TRUE_FALSE_CHOICES = "- [ ] True\n- [ ] False";

const TASK_ITEM_RE = /^[-*+][ \t]+\[[ xX]\][ \t]*/;
const CHOICE_ITEM_RE = /^[-*+][ \t]+(?:\[[ xX]\]|\*\*[A-D][.)]\*\*)/;
const TRUE_FALSE_ITEM_RE = /^[-*+][ \t]+\[[ xX]\][ \t]*(?:True|False)\b/i;

/** Box glyphs, brackets and separators a model may wrap True / False choices in. */
const CHOICE_DECORATION_RE = /[☐□◻▢○●◯✓✔×x()[\]{}.:;,\-–—/|?*_\s]|\bor\b|\bvs\.?\b/gi;

/** "( ) True ( ) False", "□ True / False", "T/F" — a line that is only the choices. */
function isTrueFalseChoiceLine(line: string): boolean {
  if (!line) return false;
  const stripped = line.replace(CHOICE_DECORATION_RE, "").toLowerCase();
  return stripped === "truefalse" || stripped === "tf";
}

/** Trailing "(True/False)" / "— true or false?" tag on a statement line. */
const TRUE_FALSE_TAG_RE =
  /[\s—–-]*[([]\s*(?:true|t)\s*(?:\/|or|,)\s*(?:false|f)\s*[)\]]\s*\??\s*$|[\s—–-]+(?:true|t)\s*(?:\/|or)\s*(?:false|f)\s*\??\s*$/i;

/** Leading "True or False:" instruction on a statement line. */
const TRUE_FALSE_PREFIX_RE =
  /^(?:state\s+whether\s+)?(?:true|t)\s*(?:\/|or)\s*(?:false|f)\s*[:.\-—–]\s*/i;

const BLANK_PATTERNS: readonly RegExp[] = [
  /_{2,}/g,
  /\[\s*blank\s*\]/gi,
  /\(\s*blank\s*\)/gi,
  /(?<=^|[\s(])_(?=[\s.,;:?!)]|$)/g,
];

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

/** Put every Answer / Marking guidance label on its own line and bold it. */
function breakAnswerSections(text: string): string {
  const out = text.replace(
    ANSWER_LABEL_RE,
    (_m, rawLabel: string, offset: number) => {
      const label =
        ANSWER_LABEL_CASING.get(rawLabel.trim().toLowerCase()) ?? rawLabel;
      const labelled = `**${label}:** `;

      const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
      const beforeOnLine = text.slice(lineStart, offset);

      // Mid-line: the answer trails the question, so start a new paragraph.
      if (!BARE_MARKER_RE.test(beforeOnLine)) return `\n\n${labelled}`;

      // Inside a list item — the bullet is already its own line.
      if (beforeOnLine.trim()) return labelled;

      // Line start: a single newline still renders inline, so force a blank line.
      const blankAbove = lineStart === 0 || /\n[ \t]*\n$/.test(text.slice(0, offset));
      return blankAbove ? labelled : `\n${labelled}`;
    },
  );

  // Rejoin "Answer: 1." + "Correct answer: A" split across lines
  return out.replace(
    /\*\*Answer:\*\*\s*(\d+)\.\s*\n+\*\*Correct answer:\*\*\s*/gi,
    "**Answer:** $1. Correct answer: ",
  );
}

/** Longest stem still treated as a question when detected only by a following answer. */
const MAX_IMPLIED_STEM_LENGTH = 300;

/**
 * Bold the question itself and keep it clear of its answer. A line counts as a question
 * when it ends in "?", sits directly under a "Question N" heading, carries a fill-in-the
 * -blank gap, or is immediately followed by an answer label or a choice list. Numbering
 * and a trailing "(2 marks)" stay outside the bold so ordered lists still parse and the
 * mark allocation stays visually secondary.
 */
function boldQuestionStems(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let expectStem = false;

  const nextContentLine = (from: number): string => {
    for (let i = from; i < lines.length; i += 1) {
      const value = (lines[i] ?? "").trim();
      if (value) return value;
    }
    return "";
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      out.push(line);
      continue;
    }

    if (trimmed.startsWith("#")) {
      expectStem = QUESTION_HEADING_RE.test(trimmed);
      out.push(line);
      continue;
    }

    const followsQuestionHeading = expectStem;
    expectStem = false;

    // Already emphasized, a table row, a quote, or an option / marking bullet.
    // (PDF renderer also force-bolds question lines even without full ** wrapping.)
    if (
      trimmed.includes("**") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith(">") ||
      LIST_MARKER_RE.test(trimmed)
    ) {
      out.push(line);
      continue;
    }

    const numbered = QUESTION_NUMBER_RE.exec(trimmed);
    const marker = numbered?.[1] ?? "";
    let stem = numbered?.[2] ?? trimmed;

    const marks = TRAILING_MARKS_RE.exec(stem)?.[1] ?? "";
    if (marks) stem = stem.slice(0, stem.length - marks.length).trimEnd();

    const below = nextContentLine(i + 1);
    const shortEnough = stem.length <= MAX_IMPLIED_STEM_LENGTH;
    const answeredBelow = shortEnough && ANSWER_LINE_RE.test(below);
    const choicesBelow = shortEnough && CHOICE_ITEM_RE.test(below);
    const isQuestion =
      Boolean(stem) &&
      (followsQuestionHeading ||
        stem.endsWith("?") ||
        answeredBelow ||
        choicesBelow ||
        stem.includes(WORKSHEET_BLANK));

    if (!isQuestion) {
      out.push(line);
      continue;
    }

    // A question must open its own line rather than trailing the previous answer.
    if (out.length && (out[out.length - 1] ?? "").trim()) out.push("");

    const indent = line.slice(0, line.length - line.trimStart().length);
    out.push(`${indent}${marker}**${stem}**${marks}`);
  }

  return out.join("\n");
}

/** Give every fill-in-the-blank gap the same width, whatever the model wrote. */
function normalizeBlanks(text: string): string {
  let out = text;
  for (const pattern of BLANK_PATTERNS) {
    out = out.replace(pattern, WORKSHEET_BLANK);
  }
  return out;
}

export function hasBlank(text: string): boolean {
  return BLANK_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

/** Add a gap to a fill-in-the-blank statement that arrived without one. */
export function withTrailingBlank(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return WORKSHEET_BLANK;
  const punctuation = /[.!?]$/.exec(trimmed)?.[0] ?? "";
  const body = punctuation ? trimmed.slice(0, -1).trimEnd() : trimmed;
  return `${body} ${WORKSHEET_BLANK}${punctuation}`;
}

/**
 * Split a line into its numbering and the statement, dropping any inline True / False
 * marker. Numbering is separated first so "3. True or False: …" is still recognised.
 */
function stripTrueFalseMarkers(line: string): {
  marker: string;
  statement: string;
  changed: boolean;
} {
  const numbered = QUESTION_NUMBER_RE.exec(line);
  const marker = numbered?.[1] ?? "";
  const body = (numbered?.[2] ?? line).trim();
  const statement = body
    .replace(TRUE_FALSE_PREFIX_RE, "")
    .replace(TRUE_FALSE_TAG_RE, "")
    .trim();
  return { marker, statement, changed: statement !== body };
}

/**
 * Give every True / False statement a tickable box for each option, replacing whatever
 * inline marker the model used ("(True/False)", "□ True □ False", "True or False:").
 */
function expandTrueFalseChoices(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];

  const alreadyExpanded = (from: number): boolean => {
    for (let i = from; i < lines.length; i += 1) {
      const value = (lines[i] ?? "").trim();
      if (!value) continue;
      return TRUE_FALSE_ITEM_RE.test(value);
    }
    return false;
  };

  const pushChoices = () => {
    if ((out[out.length - 1] ?? "").trim()) out.push("");
    out.push(TRUE_FALSE_CHOICES);
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    // Keep task lists we (or the model) already produced.
    if (TASK_ITEM_RE.test(trimmed)) {
      out.push(line);
      continue;
    }

    if (isTrueFalseChoiceLine(trimmed)) {
      if (!alreadyExpanded(i + 1)) pushChoices();
      continue;
    }

    const { marker, statement, changed } = stripTrueFalseMarkers(trimmed);
    if (!changed) {
      out.push(line);
      continue;
    }

    const indent = line.slice(0, line.length - line.trimStart().length);
    if (statement) out.push(`${indent}${marker}${statement}`);
    if (!alreadyExpanded(i + 1)) pushChoices();
  }

  return out.join("\n");
}

/** Promote "Question N" lines to markdown headings (bold / larger). */
function promoteQuestionHeadings(text: string): string {
  return text.replace(
    /(?:^|\n)[ \t]*#{0,6}[ \t]*\*{0,2}Question[ \t]+(\d+)\*{0,2}[ \t]*(?=\n|$)/gi,
    "\n\n### Question $1\n\n",
  );
}

function collapseExtraBlankLines(text: string): string {
  return text
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Structure freeform student/teacher worksheet markdown for display. */
export function structureWorksheetMarkdown(raw: string): string {
  let text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return "";

  text = normalizeBlanks(text);
  text = breakMcqOptions(text);
  text = breakAnswerSections(text);
  text = expandTrueFalseChoices(text);
  text = promoteQuestionHeadings(text);
  text = boldQuestionStems(text);

  // Title line like "topic — Teacher Answer Guide" (with or without leading ##)
  text = text.replace(
    /^#{0,6}\s*(.+?—\s*(?:Teacher Answer Guide|Student Activity|Answer Key))\s*$/im,
    "## $1\n",
  );

  return collapseExtraBlankLines(text);
}

/**
 * Question/answer pass only — no MCQ option splitting. Used for lesson plans, where
 * "A." can legitimately start a sentence and must not be turned into an option list.
 */
export function structureQuestionAnswerMarkdown(raw: string): string {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return "";
  return collapseExtraBlankLines(boldQuestionStems(breakAnswerSections(text)));
}

type WorksheetItemLike = {
  itemNumber: number;
  prompt: string;
  questionType?: string;
  answerKey?: string;
  markingGuidance?: string;
  answerKeyLabel?: string;
};

export type WorksheetQuestionKind =
  | "multiple_choice"
  | "true_false"
  | "fill_in_the_blanks"
  | "short_answer"
  | "other";

/** Question type ids vary by model and by stored library data — fold them together. */
export function worksheetQuestionKind(
  raw: string | null | undefined,
): WorksheetQuestionKind {
  const value = (raw ?? "").trim().toLowerCase().replace(/[\s/-]+/g, "_");
  if (!value) return "other";
  if (value.includes("mcq") || value.includes("multiple")) {
    return "multiple_choice";
  }
  if (value.includes("true") || value === "tf" || value === "t_f") {
    return "true_false";
  }
  if (value.includes("blank") || value.includes("cloze")) {
    return "fill_in_the_blanks";
  }
  if (value.includes("short") || value.includes("open")) return "short_answer";
  return "other";
}

/** Does the text already carry True / False choices in some form? */
function mentionsTrueFalseChoices(text: string): boolean {
  return text.split("\n").some((line) => {
    const trimmed = line.trim();
    return (
      TRUE_FALSE_ITEM_RE.test(trimmed) ||
      isTrueFalseChoiceLine(trimmed) ||
      stripTrueFalseMarkers(trimmed).changed
    );
  });
}

/**
 * Display markdown for a single question whose type is known. The declared type is more
 * reliable than the prose, so it fills in what the model left out: a gap for a fill-in
 * -the-blank statement, and tickable True / False boxes for a true-false statement.
 * Both are added before structuring so the statement still gets bolded as a question.
 */
export function worksheetQuestionMarkdown(item: {
  prompt: string;
  questionType?: string | null;
}): string {
  const kind = worksheetQuestionKind(item.questionType);
  let prompt = (item.prompt ?? "").trim();
  if (!prompt) return "";

  if (kind === "fill_in_the_blanks" && !hasBlank(prompt)) {
    prompt = withTrailingBlank(prompt);
  }
  if (kind === "true_false" && !mentionsTrueFalseChoices(prompt)) {
    prompt = `${prompt}\n\n${TRUE_FALSE_CHOICES}`;
  }

  return structureWorksheetMarkdown(prompt);
}

function formatPromptWithOptions(item: WorksheetItemLike): string {
  return worksheetQuestionMarkdown({
    prompt: item.prompt,
    questionType: item.questionType,
  });
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
    parts.push(formatPromptWithOptions(item));
    const answer = (item.answerKey ?? "").trim();
    const guidance = (item.markingGuidance ?? "").trim();
    const label = (item.answerKeyLabel ?? "Answer").trim() || "Answer";
    if (answer) {
      const answerBody = /^[A-D]$/i.test(answer) ? answer.toUpperCase() : answer;
      parts.push(`**${label}:** ${answerBody}`);
    }
    if (guidance) {
      parts.push(`**Marking guidance:** ${guidance}`);
    }
  }
  return collapseExtraBlankLines(boldQuestionStems(parts.join("\n\n")));
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
    parts.push(formatPromptWithOptions(item));
  }
  return collapseExtraBlankLines(boldQuestionStems(parts.join("\n\n")));
}
