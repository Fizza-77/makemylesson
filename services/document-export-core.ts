import { jsPDF } from "jspdf";

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

/** A4 markdown-ish worksheet PDF used by Stage 3 & 4. */
export function buildWorksheetPdf(input: WorksheetPdfInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  if (input.schoolName?.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80);
    const schoolLines = doc.splitTextToSize(input.schoolName.trim(), maxWidth);
    ensureSpace(schoolLines.length * 14 + 8);
    doc.text(schoolLines, margin, y);
    y += schoolLines.length * 14 + 8;
    doc.setTextColor(0);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(
    input.title.trim() || "Worksheet",
    maxWidth,
  );
  ensureSpace(titleLines.length * 22);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 22 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(90);
  ensureSpace(16);
  doc.text(input.subtitle.trim() || "Document", margin, y);
  y += 16;

  doc.setFontSize(10);
  for (const line of [
    `Curriculum: ${input.curriculumRoute}`,
    `Grade: ${input.grade}`,
    `Subject: ${input.subject}`,
  ]) {
    ensureSpace(14);
    doc.text(line, margin, y);
    y += 14;
  }
  y += 12;
  doc.setTextColor(0);

  doc.setFontSize(11);
  const body = plainMarkdown(input.body.trim() || "—");
  for (const para of body.split(/\n+/)) {
    if (!para.trim()) {
      y += 8;
      continue;
    }
    const lines = doc.splitTextToSize(para, maxWidth);
    for (const line of lines) {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 14;
    }
    y += 4;
  }

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
