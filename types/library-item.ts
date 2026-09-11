import { Timestamp, type DocumentData } from "firebase/firestore";

export type LibraryItemKind =
  | "lessonPlan"
  | "presentation"
  | "activity"
  | "assessment"
  | "completePack";

export interface LibraryItem {
  id: string;
  stage: number;
  kind: LibraryItemKind;
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  generatedAt: Date;
  reviewBody: string;
  isFavourite: boolean;
  completePackStages: number;
  planBundleId?: string | null;
  stage2JobId?: string | null;
  presentationStyle?: string | null;
  activityOrAssessmentLabel?: string | null;
  speakerNotes?: string | null;
  presentationSlidesJson?: Record<string, unknown>[] | null;
  teacherReviewBody?: string | null;
  stage3Json?: Record<string, unknown> | null;
  stage4Json?: Record<string, unknown> | null;
}

const KIND_SET = new Set<LibraryItemKind>([
  "lessonPlan",
  "presentation",
  "activity",
  "assessment",
  "completePack",
]);

export function libraryItemKindFromStorage(raw: string): LibraryItemKind {
  const v = raw.trim() as LibraryItemKind;
  return KIND_SET.has(v) ? v : "lessonPlan";
}

function emptyToNull(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

export function libraryItemFromFirestore(
  id: string,
  data: DocumentData,
): LibraryItem {
  const generatedAtRaw = data.generatedAt;
  const generatedAt =
    generatedAtRaw instanceof Timestamp
      ? generatedAtRaw.toDate()
      : new Date();
  const slides = data.presentationSlides;
  return {
    id,
    stage: typeof data.stage === "number" ? data.stage : Number(data.stage) || 1,
    kind: libraryItemKindFromStorage(String(data.kind ?? "")),
    topic: String(data.topic ?? ""),
    curriculumRoute: String(data.curriculumRoute ?? ""),
    grade: String(data.grade ?? ""),
    subject: String(data.subject ?? ""),
    generatedAt,
    reviewBody: String(data.reviewBody ?? ""),
    isFavourite: data.isFavourite === true,
    completePackStages:
      typeof data.completePackStages === "number"
        ? data.completePackStages
        : Number(data.completePackStages) || 0,
    planBundleId: emptyToNull(data.planBundleId),
    stage2JobId: emptyToNull(data.stage2JobId),
    presentationStyle: emptyToNull(data.presentationStyle),
    activityOrAssessmentLabel: emptyToNull(data.activityOrAssessmentLabel),
    speakerNotes: emptyToNull(data.speakerNotes),
    presentationSlidesJson: Array.isArray(slides)
      ? slides
          .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
          .map((e) => ({ ...e }))
      : null,
    teacherReviewBody: emptyToNull(data.teacherReviewBody),
    stage3Json:
      data.stage3Json && typeof data.stage3Json === "object"
        ? (data.stage3Json as Record<string, unknown>)
        : null,
    stage4Json:
      data.stage4Json && typeof data.stage4Json === "object"
        ? (data.stage4Json as Record<string, unknown>)
        : null,
  };
}

/**
 * Mirrors Flutter `LibraryItem.toFirestore()` exactly (same field names/nulls).
 * Caller should merge `updatedAt: serverTimestamp()` (Flutter uses FieldValue.serverTimestamp).
 */
export function libraryItemToFirestore(item: LibraryItem): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    stage: item.stage,
    kind: item.kind,
    topic: item.topic,
    curriculumRoute: item.curriculumRoute,
    grade: item.grade,
    subject: item.subject,
    generatedAt: Timestamp.fromDate(item.generatedAt),
    reviewBody: item.reviewBody,
    isFavourite: item.isFavourite,
    completePackStages: item.completePackStages,
    presentationStyle: item.presentationStyle ?? null,
    activityOrAssessmentLabel: item.activityOrAssessmentLabel ?? null,
    speakerNotes: item.speakerNotes ?? null,
    presentationSlides: item.presentationSlidesJson ?? null,
    teacherReviewBody: item.teacherReviewBody ?? null,
    stage3Json: item.stage3Json ?? null,
    stage4Json: item.stage4Json ?? null,
  };
  const bundle = item.planBundleId?.trim();
  if (bundle) payload.planBundleId = bundle;
  const job = item.stage2JobId?.trim();
  if (job) payload.stage2JobId = job;
  return payload;
}


