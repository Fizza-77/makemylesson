import JSZip from "jszip";

import { buildLessonPlanPdf } from "@/services/lesson-plan-pdf.service";
import {
  downloadBlob,
  sanitizeFileName,
  shareBlobFile,
} from "@/services/document-export-core";
import type { ExportPersonalization } from "@/services/export-personalization.service";
import {
  buildStage2ZipBytes,
  type Stage2ExportInput,
} from "@/services/stage2-export.service";
import { buildStage3BothPdfsZipBytes } from "@/services/stage3-export.service";
import { buildStage4BothPdfsZipBytes } from "@/services/stage4-export.service";
import type { LibraryItem } from "@/types/library-item";
import { stage2SlideFromJson } from "@/types/stage2";

export type PlanBundleMembers = {
  lessonPlan?: LibraryItem | null;
  presentation?: LibraryItem | null;
  activity?: LibraryItem | null;
  assessment?: LibraryItem | null;
};

function activityTitle(item: LibraryItem): string {
  const json = item.stage3Json as { activity_title?: string } | null;
  return (
    (typeof json?.activity_title === "string" && json.activity_title.trim()) ||
    item.topic ||
    "Activity"
  );
}

function assessmentTitle(item: LibraryItem): string {
  const json = item.stage4Json as { assessment_title?: string } | null;
  return (
    (typeof json?.assessment_title === "string" &&
      json.assessment_title.trim()) ||
    item.topic ||
    "Assessment"
  );
}

export async function buildCompletePackZipBlob(params: {
  pack: LibraryItem;
  members: PlanBundleMembers;
  schoolName?: string | null;
  preparedBy?: string | null;
  personalization?: ExportPersonalization | null;
}): Promise<Blob | null> {
  const { pack, members, schoolName, preparedBy, personalization } = params;
  const school =
    personalization?.schoolName?.trim() || schoolName?.trim() || null;
  const teacher =
    personalization?.teacherName?.trim() || preparedBy?.trim() || null;
  const zip = new JSZip();
  let fileCount = 0;

  const lesson = members.lessonPlan;
  if (lesson?.reviewBody?.trim()) {
    const pdf = buildLessonPlanPdf({
      topic: pack.topic,
      curriculumRoute: pack.curriculumRoute,
      grade: pack.grade,
      subject: pack.subject,
      content: lesson.reviewBody,
      schoolName: school,
      preparedBy: teacher,
      personalization,
    });
    zip.file("stage1_lesson_plan.pdf", pdf.output("arraybuffer"));
    fileCount++;
  }

  const presentation = members.presentation;
  if (presentation) {
    const slides = (presentation.presentationSlidesJson ?? []).map((raw) =>
      stage2SlideFromJson(raw),
    );
    if (slides.length) {
      const stage2Input: Stage2ExportInput = {
        topic: pack.topic,
        curriculumRoute: pack.curriculumRoute,
        grade: pack.grade,
        subject: pack.subject,
        slides,
        themeId: presentation.presentationStyle || "classic_navy",
        schoolName: school,
        teacherName: teacher,
        personalization,
      };
      const stage2Zip = await buildStage2ZipBytes(stage2Input);
      if (stage2Zip) {
        zip.file("stage2_slides_and_notes.zip", stage2Zip);
        fileCount++;
      }
    }
  }

  const activity = members.activity;
  if (
    activity?.reviewBody?.trim() &&
    activity.teacherReviewBody?.trim()
  ) {
    const stage3Zip = await buildStage3BothPdfsZipBytes({
      topic: pack.topic,
      curriculumRoute: pack.curriculumRoute,
      grade: pack.grade,
      subject: pack.subject,
      activityTitle: activityTitle(activity),
      studentActivityText: activity.reviewBody,
      teacherAnswerKeyText: activity.teacherReviewBody,
      schoolName: school,
      preparedBy: teacher,
      personalization,
    });
    zip.file("stage3_worksheet.zip", stage3Zip);
    fileCount++;
  }

  const assessment = members.assessment;
  if (
    assessment?.reviewBody?.trim() &&
    assessment.teacherReviewBody?.trim()
  ) {
    const stage4Zip = await buildStage4BothPdfsZipBytes({
      topic: pack.topic,
      curriculumRoute: pack.curriculumRoute,
      grade: pack.grade,
      subject: pack.subject,
      assessmentTitle: assessmentTitle(assessment),
      studentPaperText: assessment.reviewBody,
      markSchemeText: assessment.teacherReviewBody,
      schoolName: school,
      preparedBy: teacher,
      personalization,
    });
    zip.file("stage4_quiz.zip", stage4Zip);
    fileCount++;
  }

  if (fileCount === 0) return null;
  return zip.generateAsync({ type: "blob" });
}

export async function downloadCompletePackZip(params: {
  pack: LibraryItem;
  members: PlanBundleMembers;
  schoolName?: string | null;
  preparedBy?: string | null;
  personalization?: ExportPersonalization | null;
}) {
  const blob = await buildCompletePackZipBlob(params);
  if (!blob) {
    throw new Error(
      "Nothing to export yet. Save all stages to the library first.",
    );
  }
  downloadBlob(
    blob,
    `complete_plan_${sanitizeFileName(params.pack.topic)}.zip`,
  );
}

export async function shareCompletePackZip(params: {
  pack: LibraryItem;
  members: PlanBundleMembers;
  schoolName?: string | null;
  preparedBy?: string | null;
  personalization?: ExportPersonalization | null;
}) {
  const blob = await buildCompletePackZipBlob(params);
  if (!blob) {
    throw new Error(
      "Nothing to export yet. Save all stages to the library first.",
    );
  }
  const filename = `complete_plan_${sanitizeFileName(params.pack.topic)}.zip`;
  return shareBlobFile({
    blob,
    filename,
    title: `Complete plan — ${params.pack.topic}`,
    text: `Complete lesson pack for ${params.pack.topic}`,
  });
}


