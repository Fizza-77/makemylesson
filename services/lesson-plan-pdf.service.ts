import { jsPDF } from "jspdf";

export type LessonPlanPdfInput = {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  content: string;
};

function safeFilename(topic: string): string {
  const safe = topic.trim().replace(/[^a-zA-Z0-9]+/g, "_") || "lesson";
  return `lesson_plan_${safe}_${Date.now()}.pdf`;
}

/** Strip light markdown for plain PDF body (Flutter uses full markdown blocks). */
function plainContent(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .trim();
}

export function buildLessonPlanPdf(input: LessonPlanPdfInput): jsPDF {
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(input.topic.trim() || "Lesson Plan", maxWidth);
  ensureSpace(titleLines.length * 22);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 22 + 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
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
  const body = plainContent(input.content);
  const paragraphs = body.split(/\n+/);
  for (const para of paragraphs) {
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

export function downloadLessonPlanPdf(input: LessonPlanPdfInput): void {
  const doc = buildLessonPlanPdf(input);
  doc.save(safeFilename(input.topic));
}

export function printLessonPlanPdf(input: LessonPlanPdfInput): void {
  const doc = buildLessonPlanPdf(input);
  doc.autoPrint();
  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");
}

export async function shareLessonPlanPdf(input: LessonPlanPdfInput) {
  const { shareBlobFile } = await import("@/services/document-export-core");
  const doc = buildLessonPlanPdf(input);
  const blob = doc.output("blob");
  return shareBlobFile({
    blob,
    filename: safeFilename(input.topic),
    title: `Stage 1 — ${input.topic}`,
    text: `Lesson plan for ${input.topic}`,
  });
}
