import type { jsPDF } from "jspdf";

import {
  personalizationHasAny,
  type ExportPersonalization,
} from "@/services/export-personalization.service";
import { PDF_INK, PDF_MUTED, PDF_RULE, type PdfWriter } from "@/services/pdf-writer";

const ACCENT = { r: 26, g: 33, b: 56 }; // #1A2138 — lesson plan brand navy

function dash(value: string | null | undefined): string {
  return (value ?? "").trim() || "-";
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function avatarSlots(
  personalization: ExportPersonalization | null | undefined,
): { dataUrl: string | null; label: string }[] {
  if (!personalization || !personalizationHasAny(personalization)) return [];
  const slots: { dataUrl: string | null; label: string }[] = [];
  if (
    personalization.schoolLogoDataUrl ||
    personalization.includeSchoolLogo
  ) {
    slots.push({
      dataUrl: personalization.schoolLogoDataUrl,
      label: "Logo",
    });
  }
  if (
    personalization.ownPictureDataUrl ||
    personalization.includeOwnPicture
  ) {
    slots.push({
      dataUrl: personalization.ownPictureDataUrl,
      label: "You",
    });
  }
  return slots;
}

function drawOneAvatar(
  doc: jsPDF,
  slot: { dataUrl: string | null; label: string },
  cx: number,
  cy: number,
  diameter: number,
) {
  if (slot.dataUrl) {
    try {
      doc.addImage(
        slot.dataUrl,
        "PNG",
        cx - diameter / 2,
        cy - diameter / 2,
        diameter,
        diameter,
      );
    } catch {
      doc.setFillColor(229, 231, 235);
      doc.circle(cx, cy, diameter / 2, "F");
    }
  } else {
    doc.setFillColor(229, 231, 235);
    doc.circle(cx, cy, diameter / 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(PDF_MUTED);
    doc.text(slot.label, cx, cy + 2.5, { align: "center" });
  }
  doc.setDrawColor(PDF_RULE);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, diameter / 2, "S");
}

/**
 * Draw school logo + teacher photo right-aligned in a row.
 * Returns the vertical space used (diameter), or 0 if nothing drawn.
 */
export function drawPersonalizationAvatars(
  doc: jsPDF,
  personalization: ExportPersonalization | null | undefined,
  opts: {
    /** Right edge of the row (avatars end here). */
    right: number;
    y: number;
    diameter?: number;
    gap?: number;
  },
): number {
  const slots = avatarSlots(personalization);
  if (!slots.length) return 0;

  const diameter = opts.diameter ?? 40;
  const gap = opts.gap ?? 10;
  const cy = opts.y + diameter / 2;

  // Draw left-to-right but positioned from the right edge.
  let x = opts.right - diameter / 2;
  for (let i = slots.length - 1; i >= 0; i -= 1) {
    drawOneAvatar(doc, slots[i]!, x, cy, diameter);
    x -= diameter + gap;
  }

  return diameter;
}

/** Horizontal width needed for the avatar cluster (for reserving title space). */
export function personalizationAvatarsWidth(
  personalization: ExportPersonalization | null | undefined,
  diameter = 40,
  gap = 10,
): number {
  const n = avatarSlots(personalization).length;
  if (n === 0) return 0;
  return n * diameter + (n - 1) * gap;
}

/**
 * Lesson-plan-style cover header used across Stage 1–4 PDF exports:
 * eyebrow + avatars (same row, avatars on the right) → title → 2-column meta → rule.
 */
export function drawLessonPlanStyleCover(
  w: PdfWriter,
  opts: {
    eyebrow: string;
    title: string;
    personalization?: ExportPersonalization | null;
    schoolName?: string | null;
    preparedBy?: string | null;
    subject?: string | null;
    grade?: string | null;
    curriculumRoute?: string | null;
    teachingStrategy?: string | null;
    duration?: string | null;
    extraMeta?: [string, string][];
  },
): void {
  const { doc } = w;
  const margin = w.margin;
  const p = opts.personalization;
  const diameter = 40;
  const avatarW = personalizationAvatarsWidth(p, diameter);
  const rowTop = w.y;

  // Same row: "LESSON PLAN" on the left, logo/photo on the right.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(ACCENT.r, ACCENT.g, ACCENT.b);
  const eyebrowY =
    avatarW > 0 ? rowTop + diameter / 2 + 3 : rowTop;
  doc.text(opts.eyebrow.toUpperCase(), margin, eyebrowY);

  if (avatarW > 0) {
    drawPersonalizationAvatars(doc, p, {
      right: margin + w.maxWidth,
      y: rowTop,
      diameter,
    });
    w.y = rowTop + diameter + 10;
  } else {
    w.gap(18);
  }

  const titleMaxWidth =
    avatarW > 0 ? Math.max(120, w.maxWidth - 8) : w.maxWidth;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(PDF_INK);
  for (const line of doc.splitTextToSize(
    opts.title.trim() || opts.eyebrow,
    titleMaxWidth,
  ) as string[]) {
    w.ensure(24);
    doc.text(line, margin, w.y);
    w.gap(24);
  }
  w.gap(8);

  const school =
    (p?.schoolName ?? opts.schoolName)?.trim() ||
    (opts.schoolName ?? "").trim();
  const prepared =
    (p?.teacherName ?? opts.preparedBy)?.trim() ||
    (opts.preparedBy ?? "").trim();

  const meta: [string, string][] = [
    ["SCHOOL", dash(school)],
    ["PREPARED BY", dash(prepared)],
    ["SUBJECT", dash(opts.subject)],
    ["GRADE / YEAR", dash(opts.grade)],
    ["CURRICULUM", dash(opts.curriculumRoute)],
  ];
  if (opts.teachingStrategy != null) {
    meta.push(["TEACHING STRATEGY", dash(opts.teachingStrategy)]);
  }
  if (opts.duration != null) {
    meta.push(["DURATION", dash(opts.duration)]);
  }
  meta.push(["DATE", formatToday()]);
  if (opts.extraMeta?.length) meta.push(...opts.extraMeta);

  const colWidth = w.maxWidth / 2;
  for (let i = 0; i < meta.length; i += 2) {
    const cells = meta.slice(i, i + 2).map(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      return {
        label,
        lines: doc.splitTextToSize(value, colWidth - 12) as string[],
      };
    });
    const rowHeight =
      11 + Math.max(...cells.map((c) => c.lines.length)) * 13 + 10;
    w.ensure(rowHeight);
    const metaRowTop = w.y;
    cells.forEach((cell, col) => {
      const x = margin + col * colWidth;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(PDF_MUTED);
      doc.text(cell.label, x, metaRowTop);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(PDF_INK);
      cell.lines.forEach((line, li) => {
        doc.text(line, x, metaRowTop + 12 + li * 13);
      });
    });
    w.y = metaRowTop + rowHeight;
  }

  w.gap(6);
  w.rule();
  w.gap(16);
}


