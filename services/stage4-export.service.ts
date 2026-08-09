import JSZip from "jszip";

import {
  buildWorksheetPdf,
  downloadBlob,
  printPdfDoc,
  sanitizeFileName,
  shareBlobFile,
} from "@/services/document-export-core";

export type Stage4ExportInput = {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  assessmentTitle: string;
  studentPaperText: string;
  markSchemeText: string;
  schoolName?: string | null;
};

function fileName(topic: string, suffix: string, ext: string): string {
  return `stage4_${sanitizeFileName(topic)}_${suffix}.${ext}`;
}

function titleLine(input: Stage4ExportInput): string {
  return input.assessmentTitle.trim() || input.topic.trim() || "Assessment";
}

function studentPdf(input: Stage4ExportInput) {
  return buildWorksheetPdf({
    title: titleLine(input),
    subtitle: "Student Paper",
    curriculumRoute: input.curriculumRoute,
    grade: input.grade,
    subject: input.subject,
    body: input.studentPaperText,
    schoolName: input.schoolName,
  });
}

function markSchemePdf(input: Stage4ExportInput) {
  return buildWorksheetPdf({
    title: titleLine(input),
    subtitle: "Mark Scheme",
    curriculumRoute: input.curriculumRoute,
    grade: input.grade,
    subject: input.subject,
    body: input.markSchemeText,
    schoolName: input.schoolName,
  });
}

export async function buildStage4BothPdfsZipBytes(
  input: Stage4ExportInput,
): Promise<Blob> {
  const zip = new JSZip();
  zip.file("student_paper.pdf", studentPdf(input).output("arraybuffer"));
  zip.file("mark_scheme.pdf", markSchemePdf(input).output("arraybuffer"));
  return zip.generateAsync({ type: "blob" });
}

export const STAGE4_DOWNLOAD_ACTIONS = [
  { id: "pdf_student", label: "PDF (Student Paper)" },
  { id: "pdf_mark_scheme", label: "PDF (Mark Scheme)" },
  { id: "zip", label: "ZIP (Student Paper + Mark Scheme PDFs)" },
  { id: "print_student", label: "Print (Student Paper)" },
  { id: "print_mark_scheme", label: "Print (Mark Scheme)" },
] as const;

export type Stage4DownloadActionId =
  (typeof STAGE4_DOWNLOAD_ACTIONS)[number]["id"];

export async function runStage4DownloadAction(
  action: Stage4DownloadActionId,
  input: Stage4ExportInput,
) {
  const student = input.studentPaperText.trim();
  const scheme = input.markSchemeText.trim();

  if (
    (action === "pdf_student" || action === "print_student") &&
    !student
  ) {
    throw new Error("Generate quiz first (student paper is empty).");
  }
  if (
    (action === "pdf_mark_scheme" || action === "print_mark_scheme") &&
    !scheme
  ) {
    throw new Error("Generate quiz first (mark scheme is empty).");
  }
  if (action === "zip" && (!student || !scheme)) {
    throw new Error(
      "Generate quiz first (need both student paper and mark scheme).",
    );
  }

  switch (action) {
    case "pdf_student":
      studentPdf(input).save(fileName(input.topic, "student_paper", "pdf"));
      break;
    case "pdf_mark_scheme":
      markSchemePdf(input).save(fileName(input.topic, "mark_scheme", "pdf"));
      break;
    case "zip": {
      const blob = await buildStage4BothPdfsZipBytes(input);
      downloadBlob(blob, fileName(input.topic, "quiz", "zip"));
      break;
    }
    case "print_student":
      printPdfDoc(studentPdf(input));
      break;
    case "print_mark_scheme":
      printPdfDoc(markSchemePdf(input));
      break;
    default:
      throw new Error("Unsupported export action.");
  }
}

export async function shareStage4QuizZip(input: Stage4ExportInput) {
  if (!input.studentPaperText.trim() || !input.markSchemeText.trim()) {
    throw new Error(
      "Generate quiz first (need both student paper and mark scheme).",
    );
  }
  const blob = await buildStage4BothPdfsZipBytes(input);
  const filename = fileName(input.topic, "quiz", "zip");
  return shareBlobFile({
    blob,
    filename,
    title: `Stage 4 — ${titleLine(input)}`,
    text: `Stage 4 quiz for ${input.topic}`,
  });
}
