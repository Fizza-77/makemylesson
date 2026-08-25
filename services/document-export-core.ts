import { jsPDF } from "jspdf";

import { structureWorksheetMarkdown } from "@/lib/format-worksheet-markdown";
import type { ExportPersonalization } from "@/services/export-personalization.service";
import { drawLessonPlanStyleCover } from "@/services/pdf-branding";
import { PdfWriter } from "@/services/pdf-writer";

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
  preparedBy?: string | null;
  personalization?: ExportPersonalization | null;
};

const WORKSHEET_MARGIN = 48;

function drawWorksheetHeader(w: PdfWriter, input: WorksheetPdfInput): void {
  drawLessonPlanStyleCover(w, {
    eyebrow: input.subtitle.trim() || "Worksheet",
    title: input.title.trim() || "Worksheet",
    personalization: input.personalization,
    schoolName: input.schoolName,
    preparedBy: input.preparedBy,
    subject: input.subject,
    grade: input.grade,
    curriculumRoute: input.curriculumRoute,
  });
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
