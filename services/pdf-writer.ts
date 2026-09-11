import type { jsPDF } from "jspdf";

export const PDF_INK = 26;
export const PDF_MUTED = 110;
export const PDF_RULE = 214;

const HEADER_FILL: [number, number, number] = [241, 245, 249];
const ZEBRA_FILL: [number, number, number] = [250, 252, 252];

const DEPTH_MARKERS = ["•", "-", "·"] as const;

type Run = { text: string; bold: boolean; italic: boolean };
type Word = Run;

export type PdfTable = {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  /** Relative column widths; defaults to equal columns. */
  weights?: readonly number[];
  firstColumnBold?: boolean;
};

function fontStyle(bold: boolean, italic: boolean): string {
  if (bold && italic) return "bolditalic";
  if (bold) return "bold";
  if (italic) return "italic";
  return "normal";
}

/** Split inline markdown emphasis into styled runs. */
export function parseRuns(input: string): Run[] {
  const runs: Run[] = [];
  const pattern =
    /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|(?<![\w*])\*([^*\n]+?)\*(?![\w*])|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;

  const push = (text: string, bold: boolean, italic: boolean) => {
    if (text) runs.push({ text, bold, italic });
  };

  while ((match = pattern.exec(input))) {
    push(input.slice(last, match.index), false, false);
    if (match[1] != null) push(match[1], true, true);
    else if (match[2] != null) push(match[2], true, false);
    else if (match[3] != null) push(match[3], false, true);
    else if (match[4] != null) push(match[4], false, false);
    last = pattern.lastIndex;
  }
  push(input.slice(last), false, false);
  return runs;
}

export function stripInline(input: string): string {
  return parseRuns(input)
    .map((r) => r.text)
    .join("");
}

/** True when a markdown line is a question stem that should render bold in PDFs. */
export function looksLikeQuestion(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  // Skip answer / marking labels
  if (
    /^\*{0,2}(?:answer|correct answer|marking|mark scheme|explanation|solution|rationale)\*{0,2}\s*:/i.test(
      trimmed,
    )
  ) {
    return false;
  }
  const plain = stripInline(trimmed).trim();
  if (!plain) return false;
  if (/\?\s*$/.test(plain)) return true;
  if (/\?\s*[\(\[]\s*\d+\s*marks?\s*[\]\)]\s*$/i.test(plain)) return true;
  if (/^(?:question|q)\s*\d+\b/i.test(plain)) return true;
  // Fully bolded stems produced by worksheet structuring
  if (/^\*\*[^*].+\*\*(?:\s*[\(\[]\s*\d+\s*marks?\s*[\]\)])?$/i.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Layout helper for jsPDF documents: keeps a cursor, handles page breaks, and
 * renders a markdown subset with real typographic hierarchy (bold headings,
 * hanging-indent lists, tables) instead of flat single-size text.
 */
export class PdfWriter {
  readonly doc: jsPDF;
  readonly margin: number;
  readonly contentTop: number;
  readonly pageWidth: number;
  readonly pageHeight: number;
  readonly maxWidth: number;
  y: number;

  constructor(doc: jsPDF, opts: { margin: number; contentTop: number }) {
    this.doc = doc;
    this.margin = opts.margin;
    this.contentTop = opts.contentTop;
    this.pageWidth = doc.internal.pageSize.getWidth();
    this.pageHeight = doc.internal.pageSize.getHeight();
    this.maxWidth = this.pageWidth - opts.margin * 2;
    this.y = opts.contentTop;
  }

  get bottom(): number {
    return this.pageHeight - this.margin;
  }

  get atPageStart(): boolean {
    return this.y <= this.contentTop + 0.01;
  }

  newPage(): void {
    this.doc.addPage();
    this.y = this.contentTop;
  }

  ensure(needed: number): void {
    if (this.y + needed > this.bottom) this.newPage();
  }

  gap(amount: number): void {
    this.y += amount;
  }

  rule(inset = 0): void {
    this.ensure(8);
    this.doc.setDrawColor(PDF_RULE);
    this.doc.line(
      this.margin + inset,
      this.y,
      this.pageWidth - this.margin - inset,
      this.y,
    );
  }

  hr(): void {
    this.gap(6);
    this.rule();
    this.gap(10);
  }

  /** Word-wrapped rich text with per-run bold/italic. */
  richText(
    runs: readonly Run[],
    opts: {
      x?: number;
      width?: number;
      size: number;
      lineHeight: number;
      color?: number;
      forceBold?: boolean;
    },
  ): void {
    const { doc } = this;
    const x = opts.x ?? this.margin;
    const width = opts.width ?? this.pageWidth - this.margin - x;
    const color = opts.color ?? PDF_INK;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(opts.size);
    const spaceWidth = doc.getTextWidth(" ");

    const words: Word[] = [];
    for (const run of runs) {
      const bold = opts.forceBold || run.bold;
      for (const piece of run.text.split(/\s+/)) {
        if (piece) words.push({ text: piece, bold, italic: run.italic });
      }
    }
    if (!words.length) return;

    const widthOf = (word: Word) => {
      doc.setFont("helvetica", fontStyle(word.bold, word.italic));
      doc.setFontSize(opts.size);
      return doc.getTextWidth(word.text);
    };

    const drawLine = (line: Word[]) => {
      this.ensure(opts.lineHeight);
      let cursor = x;
      for (const word of line) {
        doc.setFont("helvetica", fontStyle(word.bold, word.italic));
        doc.setFontSize(opts.size);
        doc.setTextColor(color);
        doc.text(word.text, cursor, this.y);
        cursor += doc.getTextWidth(word.text) + spaceWidth;
      }
      this.y += opts.lineHeight;
    };

    let line: Word[] = [];
    let lineWidth = 0;
    for (const word of words) {
      const wordWidth = widthOf(word);
      const advance = line.length ? spaceWidth + wordWidth : wordWidth;
      if (line.length && lineWidth + advance > width) {
        drawLine(line);
        line = [word];
        lineWidth = wordWidth;
      } else {
        line.push(word);
        lineWidth += advance;
      }
    }
    if (line.length) drawLine(line);
  }

  /**
   * @param opts.keepWith height of following content to keep on the same page,
   *   preventing a heading (or its first item) from orphaning at a page end.
   */
  heading(
    text: string,
    level: number,
    opts: { ruled?: boolean; keepWith?: number } = {},
  ): void {
    const spec =
      level <= 1
        ? { size: 14, before: 18, after: 8 }
        : level === 2
          ? { size: 13, before: 15, after: 7 }
          : level === 3
            ? { size: 11.5, before: 12, after: 5 }
            : { size: 10.5, before: 10, after: 4 };

    if (!this.atPageStart) this.gap(spec.before);
    // Default reserve is two following lines so a heading never sits alone.
    const keepWith = Math.min(opts.keepWith ?? 32, this.pageHeight * 0.55);
    this.ensure(spec.size + (opts.ruled ? 20 : 8) + keepWith);
    if (opts.ruled) {
      this.rule();
      this.gap(spec.size + 3);
    }
    this.richText(parseRuns(text), {
      size: spec.size,
      lineHeight: spec.size + 4,
      forceBold: true,
    });
    this.gap(spec.after);
  }

  /** Bold run-in label such as "Objectives:" or "Teacher Instructions:". */
  label(text: string): void {
    if (!this.atPageStart) this.gap(9);
    this.ensure(16);
    this.richText(parseRuns(text), {
      size: 10.5,
      lineHeight: 14,
      forceBold: true,
    });
    this.gap(3);
  }

  paragraph(
    text: string,
    opts: {
      size?: number;
      color?: number;
      italic?: boolean;
      bold?: boolean;
      after?: number;
    } = {},
  ): void {
    const size = opts.size ?? 10.5;
    const runs = opts.italic
      ? parseRuns(text).map((r) => ({ ...r, italic: true }))
      : parseRuns(text);
    this.richText(runs, {
      size,
      lineHeight: size + 4,
      color: opts.color,
      forceBold: opts.bold,
    });
    this.gap(opts.after ?? 5);
  }

  bullet(text: string, depth = 0, marker?: string): void {
    const size = 10.5;
    const lineHeight = 14;
    const indent = this.margin + depth * 14;
    const textX = indent + 12;
    const glyph = marker ?? DEPTH_MARKERS[Math.min(depth, 2)]!;

    this.ensure(lineHeight);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(depth === 0 ? PDF_INK : PDF_MUTED);
    this.doc.text(glyph, indent, this.y);

    this.richText(parseRuns(text), {
      x: textX,
      width: this.pageWidth - this.margin - textX,
      size,
      lineHeight,
    });
    this.gap(2);
  }

  orderedItem(
    number: string,
    text: string,
    opts: { depth?: number; bold?: boolean } = {},
  ): void {
    const depth = opts.depth ?? 0;
    const size = opts.bold ? 11 : 10.5;
    const lineHeight = size + 3.5;
    const indent = this.margin + depth * 14;
    const marker = `${number}.`;

    if (opts.bold && !this.atPageStart) this.gap(8);
    this.ensure(lineHeight);
    this.doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(PDF_INK);
    this.doc.text(marker, indent, this.y);
    const textX = indent + this.doc.getTextWidth(marker) + 5;

    this.richText(parseRuns(text), {
      x: textX,
      width: this.pageWidth - this.margin - textX,
      size,
      lineHeight,
      forceBold: opts.bold,
    });
    this.gap(opts.bold ? 4 : 2);
  }

  /** Checkbox item — Helvetica has no ballot-box glyph, so draw one. */
  checkbox(
    text: string,
    opts: { checked?: boolean; depth?: number } = {},
  ): void {
    const size = 10.5;
    const lineHeight = 14;
    const boxX = this.margin + (opts.depth ?? 0) * 14;
    const textX = boxX + 18;

    this.ensure(lineHeight);
    const boxTop = this.y - 7.5;
    this.doc.setDrawColor(120);
    this.doc.rect(boxX, boxTop, 8, 8);
    if (opts.checked) {
      this.doc.setLineWidth(1.1);
      this.doc.line(boxX + 1.6, boxTop + 4.4, boxX + 3.4, boxTop + 6.4);
      this.doc.line(boxX + 3.4, boxTop + 6.4, boxX + 6.6, boxTop + 1.8);
      this.doc.setLineWidth(0.2);
    }
    this.richText(parseRuns(text), {
      x: textX,
      width: this.pageWidth - this.margin - textX,
      size,
      lineHeight,
    });
    this.gap(3);
  }

  /** Ruled blank line for handwritten answers. */
  answerLine(): void {
    this.gap(10);
    this.rule();
    this.gap(12);
  }

  table(table: PdfTable): void {
    const { doc } = this;
    const columnCount = table.columns.length;
    if (!columnCount) return;

    const weights =
      table.weights ?? Array.from({ length: columnCount }, () => 1 / columnCount);
    const widths = table.columns.map(
      (_, i) => this.maxWidth * (weights[i] ?? 1 / columnCount),
    );
    const padX = 6;
    const padY = 5;
    const cellLine = 12;
    const size = 9;

    const widthAt = (i: number) => widths[i] ?? this.maxWidth / columnCount;

    const rowHeight = (cells: readonly string[], bold: boolean) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      let lines = 1;
      cells.forEach((cell, i) => {
        const wrapped = doc.splitTextToSize(
          cell,
          widthAt(i) - padX * 2,
        ) as string[];
        lines = Math.max(lines, wrapped.length);
      });
      return lines * cellLine + padY * 2;
    };

    const drawRow = (
      cells: readonly string[],
      opts: { bold?: boolean; fill?: [number, number, number] },
    ) => {
      const height = rowHeight(cells, Boolean(opts.bold));
      let x = this.margin;
      for (let i = 0; i < columnCount; i += 1) {
        const width = widthAt(i);
        const cell = cells[i] ?? "";
        if (opts.fill) {
          doc.setFillColor(...opts.fill);
          doc.rect(x, this.y, width, height, "F");
        }
        doc.setDrawColor(PDF_RULE);
        doc.rect(x, this.y, width, height);
        const bold =
          Boolean(opts.bold) || (table.firstColumnBold === true && i === 0);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(PDF_INK);
        const wrapped = doc.splitTextToSize(cell, width - padX * 2) as string[];
        wrapped.forEach((line, li) => {
          doc.text(line, x + padX, this.y + padY + 9 + li * cellLine);
        });
        x += width;
      }
      this.y += height;
    };

    const header = () => drawRow(table.columns, { bold: true, fill: HEADER_FILL });

    this.ensure(
      rowHeight(table.columns, true) +
        rowHeight(table.rows[0] ?? table.columns, false),
    );
    header();
    table.rows.forEach((row, i) => {
      if (this.y + rowHeight(row, false) > this.bottom) {
        this.newPage();
        header();
      }
      drawRow(row, i % 2 === 1 ? { fill: ZEBRA_FILL } : {});
    });
    this.gap(8);
  }

  /** Render a markdown subset with proper block-level formatting. */
  markdown(md: string): void {
    const lines = md.replace(/\r\n/g, "\n").split("\n");

    for (let i = 0; i < lines.length; i += 1) {
      const raw = lines[i] ?? "";
      const line = raw.trim();

      if (!line) {
        if (!this.atPageStart) this.gap(4);
        continue;
      }

      if (isTableRow(line) && isTableDivider(lines[i + 1])) {
        const columns = splitTableRow(line);
        const rows: string[][] = [];
        let cursor = i + 2;
        while (cursor < lines.length && isTableRow((lines[cursor] ?? "").trim())) {
          rows.push(splitTableRow((lines[cursor] ?? "").trim()));
          cursor += 1;
        }
        this.gap(4);
        this.table({ columns, rows });
        i = cursor - 1;
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
        this.hr();
        continue;
      }

      const heading = /^(#{1,6})\s+(.*)$/.exec(line);
      if (heading) {
        this.heading(heading[2] ?? "", heading[1]?.length ?? 1);
        continue;
      }

      if (line.startsWith(">")) {
        this.paragraph(line.replace(/^>\s?/, ""), {
          size: 10,
          color: PDF_MUTED,
          italic: true,
        });
        continue;
      }

      const indent = /^\s*/.exec(raw)?.[0].length ?? 0;
      const depth = Math.min(2, Math.floor(indent / 2));

      const task = /^[-*+]\s+\[([ xX])\]\s*(.*)$/.exec(line);
      if (task) {
        this.checkbox(task[2] ?? "", {
          checked: (task[1] ?? " ").trim().length > 0,
          depth,
        });
        continue;
      }

      const bullet = /^[-*+]\s+(.*)$/.exec(line);
      if (bullet) {
        const text = bullet[1] ?? "";
        if (looksLikeQuestion(text)) {
          // Render as a bold paragraph-style bullet for question stems in lists
          this.ensure(14);
          this.doc.setFont("helvetica", "bold");
          this.doc.setFontSize(10.5);
          this.doc.setTextColor(PDF_INK);
          const indent = this.margin + depth * 14;
          this.doc.text(DEPTH_MARKERS[Math.min(depth, 2)]!, indent, this.y);
          this.richText(parseRuns(text), {
            x: indent + 12,
            width: this.pageWidth - this.margin - indent - 12,
            size: 10.5,
            lineHeight: 14,
            forceBold: true,
          });
          this.gap(2);
        } else {
          this.bullet(text, depth);
        }
        continue;
      }

      const ordered =
        /^(\d+)[.)]\s+(.*)$/.exec(line) ||
        /^Q[ \t]*(\d+)[.)]\s+(.*)$/i.exec(line);
      if (ordered) {
        const text = ordered[2] ?? "";
        const question = looksLikeQuestion(text);
        // Top-level short numbered lines act as section headers in lesson plans.
        const asHeader =
          !question && depth === 0 && stripInline(text).length <= 80;
        this.orderedItem(ordered[1] ?? "", text, {
          depth,
          bold: asHeader || question,
        });
        continue;
      }

      const boldLine = /^\*\*(.+?)\*\*:?$/.exec(line);
      if (boldLine) {
        const inner = boldLine[1] ?? "";
        const text = inner.replace(/:\s*$/, "").trim();
        // Short run-in labels ("Objectives") gain a colon; a bold question or
        // sentence keeps the punctuation it already ends with.
        const isRunInLabel =
          !/[?!.:]$/.test(text) && text.split(/\s+/).length <= 4;
        this.label(isRunInLabel || /:\s*$/.test(inner) ? `${text}:` : text);
        continue;
      }

      if (/^[A-Z][^.!?]{0,60}:$/.test(stripInline(line))) {
        this.label(stripInline(line));
        continue;
      }

      // Unnumbered question stems (common in worksheets / speaker notes)
      if (looksLikeQuestion(line)) {
        this.paragraph(line, { bold: true, after: 5 });
        continue;
      }

      this.paragraph(line);
    }
  }
}

function isTableRow(line: string): boolean {
  return line.startsWith("|") && line.endsWith("|") && line.length > 2;
}

function isTableDivider(line: string | undefined): boolean {
  const value = (line ?? "").trim();
  if (!isTableRow(value)) return false;
  return /^\|[\s:|-]+\|$/.test(value) && value.includes("-");
}

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => stripInline(cell.trim()));
}


