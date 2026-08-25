import JSZip from "jszip";

import {
  buildWorksheetPdf,
  downloadBlob,
  printPdfDoc,
  sanitizeFileName,
  shareBlobFile,
} from "@/services/document-export-core";
import type { ExportPersonalization } from "@/services/export-personalization.service";

export type Stage3ExportInput = {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  activityTitle: string;
  studentActivityText: string;
  teacherAnswerKeyText: string;
  schoolName?: string | null;
  preparedBy?: string | null;
  personalization?: ExportPersonalization | null;
};

function fileName(topic: string, suffix: string, ext: string): string {
  return `stage3_${sanitizeFileName(topic)}_${suffix}.${ext}`;
}

function titleLine(input: Stage3ExportInput): string {
  return input.activityTitle.trim() || input.topic.trim() || "Activity";
}

function studentPdf(input: Stage3ExportInput) {
  return buildWorksheetPdf({
    title: titleLine(input),
    subtitle: "Student Activity",
    curriculumRoute: input.curriculumRoute,
    grade: input.grade,
    subject: input.subject,
    body: input.studentActivityText,
    schoolName: input.personalization?.schoolName ?? input.schoolName,
    preparedBy: input.personalization?.teacherName ?? input.preparedBy,
    personalization: input.personalization,
  });
}

function answerKeyPdf(input: Stage3ExportInput) {
  return buildWorksheetPdf({
    title: titleLine(input),
    subtitle: "Answer Key",
    curriculumRoute: input.curriculumRoute,
    grade: input.grade,
    subject: input.subject,
    body: input.teacherAnswerKeyText,
    schoolName: input.personalization?.schoolName ?? input.schoolName,
    preparedBy: input.personalization?.teacherName ?? input.preparedBy,
    personalization: input.personalization,
  });
}

export async function buildStage3BothPdfsZipBytes(
  input: Stage3ExportInput,
): Promise<Blob> {
  const zip = new JSZip();
  zip.file("student_activity.pdf", studentPdf(input).output("arraybuffer"));
  zip.file("answer_key.pdf", answerKeyPdf(input).output("arraybuffer"));
  return zip.generateAsync({ type: "blob" });
}

export const STAGE3_DOWNLOAD_ACTIONS = [
  { id: "pdf_student", label: "PDF (Student Activity)" },
  { id: "pdf_answer_key", label: "PDF (Answer Key)" },
  { id: "zip", label: "ZIP (Student Activity + Answer Key PDFs)" },
  { id: "print_student", label: "Print (Student Activity)" },
  { id: "print_answer_key", label: "Print (Answer Key)" },
] as const;

export type Stage3DownloadActionId =
  (typeof STAGE3_DOWNLOAD_ACTIONS)[number]["id"];

export async function runStage3DownloadAction(
  action: Stage3DownloadActionId,
  input: Stage3ExportInput,
) {
  const student = input.studentActivityText.trim();
  const key = input.teacherAnswerKeyText.trim();

  if (
    (action === "pdf_student" || action === "print_student") &&
    !student
  ) {
    throw new Error("Generate worksheet first (student activity is empty).");
  }
  if (
    (action === "pdf_answer_key" || action === "print_answer_key") &&
    !key
  ) {
    throw new Error("Generate worksheet first (answer key is empty).");
  }
  if (action === "zip" && (!student || !key)) {
    throw new Error(
      "Generate worksheet first (need both student activity and answer key).",
    );
  }

  switch (action) {
    case "pdf_student":
      studentPdf(input).save(fileName(input.topic, "student_activity", "pdf"));
      break;
    case "pdf_answer_key":
      answerKeyPdf(input).save(fileName(input.topic, "answer_key", "pdf"));
      break;
    case "zip": {
      const blob = await buildStage3BothPdfsZipBytes(input);
      downloadBlob(blob, fileName(input.topic, "worksheet", "zip"));
      break;
    }
    case "print_student":
      printPdfDoc(studentPdf(input));
      break;
    case "print_answer_key":
      printPdfDoc(answerKeyPdf(input));
      break;
    default:
      throw new Error("Unsupported export action.");
  }
}

export async function shareStage3WorksheetZip(input: Stage3ExportInput) {
  if (
    !input.studentActivityText.trim() ||
    !input.teacherAnswerKeyText.trim()
  ) {
    throw new Error(
      "Generate worksheet first (need both student activity and answer key).",
    );
  }
  const blob = await buildStage3BothPdfsZipBytes(input);
  const filename = fileName(input.topic, "worksheet", "zip");
  return shareBlobFile({
    blob,
    filename,
    title: `Stage 3 — ${titleLine(input)}`,
    text: `Stage 3 worksheet for ${input.topic}`,
  });
}
