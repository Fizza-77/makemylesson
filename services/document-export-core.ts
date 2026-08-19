import { jsPDF } from "jspdf";

import { structureWorksheetMarkdown } from "@/lib/format-worksheet-markdown";
import { PDF_INK, PDF_MUTED, PdfWriter } from "@/services/pdf-writer";

/** Shared helpers for Stage 1–4 client exports (mirrors Flutter DocumentExportCoreService). */

export function sanitizeFileName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9]+/g, "_") || "export";
}

export function plainMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .trim();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export type WorksheetPdfInput = {
  title: string;
  subtitle: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  body: string;
  schoolName?: string | null;
};

const WORKSHEET_MARGIN = 48;

function drawWorksheetHeader(w: PdfWriter, input: WorksheetPdfInput): void {
  const { doc } = w;
  const school = input.schoolName?.trim();

  if (school) {
    w.paragraph(school, { size: 10, color: PDF_MUTED, after: 6 });
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(PDF_INK);
  const titleLines = doc.splitTextToSize(
    input.title.trim() || "Worksheet",
    w.maxWidth,
  ) as string[];
  for (const line of titleLines) {
    w.ensure(22);
    doc.text(line, w.margin, w.y);
    w.gap(22);
  }
  w.gap(2);

  w.paragraph(input.subtitle.trim() || "Document", {
    size: 12,
    color: PDF_MUTED,
    after: 4,
  });

  for (const line of [
    `Curriculum: ${input.curriculumRoute}`,
    `Grade: ${input.grade}`,
    `Subject: ${input.subject}`,
  ]) {
    w.paragraph(line, { size: 10, color: PDF_MUTED, after: 0 });
  }

  w.gap(6);
  w.rule();
  w.gap(16);
}

/**
 * A4 worksheet PDF used by Stage 3 & 4 (student activity, answer key, mark scheme).
 * The body keeps its markdown structure — bold question stems, answers on their own
 * line, lists and tables — rather than being flattened to one plain text size.
 */
export function buildWorksheetPdf(input: WorksheetPdfInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const writer = new PdfWriter(doc, {
    margin: WORKSHEET_MARGIN,
    contentTop: WORKSHEET_MARGIN,
  });

  drawWorksheetHeader(writer, input);
  writer.markdown(structureWorksheetMarkdown(input.body) || "—");

  return doc;
}

export function printPdfDoc(doc: jsPDF) {
  doc.autoPrint();
  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");
}

/** Web Share API with download fallback (mirrors Flutter LessonShareService apps path). */
export async function shareBlobFile(params: {
  blob: Blob;
  filename: string;
  title: string;
  text: string;
}): Promise<{ success: boolean; message: string }> {
  const file = new File([params.blob], params.filename, {
    type: params.blob.type || "application/octet-stream",
  });

  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      (!navigator.canShare || navigator.canShare({ files: [file] }))
    ) {
      await navigator.share({
        title: params.title,
        text: params.text,
        files: [file],
      });
      return { success: true, message: "Shared via system share sheet." };
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { success: false, message: "Share cancelled." };
    }
  }

  downloadBlob(params.blob, params.filename);
  return {
    success: true,
    message: "Share not available — file downloaded instead.",
  };
}
