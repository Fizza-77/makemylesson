/** Stage 3 formative assessment — mirrors Flutter `stage3_assessment.dart`. */

export type Stage3SourceMode = "stage2Library" | "upload";

export type FormativeKind = "quickCheck" | "practiceWorksheet" | "exitTicket";

export type Stage3Item = {
  itemNumber: number;
  purposeType: string;
  questionType: string;
  prompt: string;
  answerKey: string;
  markingGuidance: string;
  difficulty: string;
  answerKeyLabel: string;
};

export type Stage3AssessmentResult = {
  activityTitle: string;
  curriculumLabel: string;
  stage1RouteId: string;
  gradeLabel: string;
  subject: string;
  topic: string;
  teachingMethod: string;
  lessonDuration: number;
  activityFormat: string;
  studentInstructions: string;
  teacherNotes: string;
  items: Stage3Item[];
  exportMetadata: Record<string, unknown>;
  studentActivityText: string;
  teacherAnswerKeyText: string;
};

export type Stage3GenerateRequest = {
  curriculumFamily: string;
  routeId: string;
  gradeOrYear: string;
  subject: string;
  topic: string;
  teachingMethod: string;
  lessonDuration: number;
  activityFormat: string;
  selectedQuestionTypes: string[];
  numberOfItems: number;
  sourceMode: "presentation_only" | "teacher_uploaded_context";
  sourceLessonPlanText: string;
  sourcePresentationText: string;
  teacherUploadedContextText: string;
  pathwayProgram?: string | null;
  stateOrProvince?: string | null;
  stage1RouteId?: string | null;
  stage2LibraryItemId?: string | null;
  /** From the difficulty clarification question: easy | medium | hard. */
  difficulty?: string;
};

export type Stage3GenerationStatus = {
  jobId: string;
  status: string;
  progress: number;
  error: string;
  result: Stage3AssessmentResult;
};

export const STAGE3_MIN_SOURCE_CHARS = 30;

export const FORMATIVE_KINDS: {
  id: FormativeKind;
  label: string;
  format: string;
}[] = [
  { id: "quickCheck", label: "Quick check", format: "quick_check" },
  {
    id: "practiceWorksheet",
    label: "Practice worksheet",
    format: "practice_worksheet",
  },
  { id: "exitTicket", label: "Exit ticket", format: "exit_ticket" },
];

export const QUESTION_TYPE_OPTIONS: { id: string; label: string }[] = [
  { id: "multiple_choice", label: "Multiple choice" },
  { id: "true_false", label: "True / false" },
  { id: "fill_in_the_blanks", label: "Fill in the blanks" },
  { id: "short_answer", label: "Short answer" },
];

/** Mirrors Flutter `LessonDraft.formativeQuestionBounds`. */
export function formativeQuestionBounds(kind: FormativeKind): [number, number] {
  switch (kind) {
    case "quickCheck":
      return [1, 5];
    case "practiceWorksheet":
      return [1, 15];
    case "exitTicket":
      return [1, 6];
  }
}

export function defaultFormativeQuestionCount(kind: FormativeKind): number {
  switch (kind) {
    case "quickCheck":
      return 3;
    case "practiceWorksheet":
      return 10;
    case "exitTicket":
      return 3;
  }
}

export function clampFormativeQuestionCount(
  kind: FormativeKind,
  count: number,
): number {
  const [min, max] = formativeQuestionBounds(kind);
  return Math.min(max, Math.max(min, Math.round(count)));
}

export function activityFormatForKind(kind: FormativeKind): string {
  return FORMATIVE_KINDS.find((k) => k.id === kind)?.format ?? "quick_check";
}

/** Best-effort restore of formative kind from saved format / library label. */
export function formativeKindFromStored(
  activityFormat?: string | null,
  label?: string | null,
): FormativeKind {
  const format = (activityFormat ?? "").trim().toLowerCase().replace(/-/g, "_");
  const byFormat = FORMATIVE_KINDS.find((k) => k.format === format);
  if (byFormat) return byFormat.id;

  const needle = (label ?? "").trim().toLowerCase();
  if (needle.includes("exit")) return "exitTicket";
  if (needle.includes("worksheet") || needle.includes("practice")) {
    return "practiceWorksheet";
  }
  if (needle.includes("quick")) return "quickCheck";
  return "quickCheck";
}

export function questionTypeFlagsFromItems(items: Stage3Item[]): {
  multipleChoice: boolean;
  trueFalse: boolean;
  fillBlanks: boolean;
  shortAnswer: boolean;
} {
  const types = new Set(
    items.map((i) => i.questionType.trim().toLowerCase()).filter(Boolean),
  );
  if (types.size === 0) {
    return {
      multipleChoice: true,
      trueFalse: true,
      fillBlanks: false,
      shortAnswer: true,
    };
  }
  return {
    multipleChoice:
      types.has("multiple_choice") ||
      types.has("mcq") ||
      types.has("multiple choice"),
    trueFalse: types.has("true_false") || types.has("true/false") || types.has("true false"),
    fillBlanks:
      types.has("fill_in_the_blanks") ||
      types.has("fill_blanks") ||
      types.has("fill in the blanks"),
    shortAnswer:
      types.has("short_answer") ||
      types.has("short answer") ||
      types.has("open_response"),
  };
}

export function newStage3JobId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s3_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

export function stage3ItemFromJson(json: Record<string, unknown>): Stage3Item {
  return {
    itemNumber: Number(json.item_number ?? 1) || 1,
    purposeType: String(json.purpose_type ?? ""),
    questionType: String(json.question_type ?? ""),
    prompt: String(json.prompt ?? ""),
    answerKey: String(json.answer_key ?? ""),
    markingGuidance: String(json.marking_guidance ?? ""),
    difficulty: String(json.difficulty ?? ""),
    answerKeyLabel: String(json.answer_key_label ?? ""),
  };
}

export function stage3ItemToJson(item: Stage3Item): Record<string, unknown> {
  return {
    item_number: item.itemNumber,
    purpose_type: item.purposeType,
    question_type: item.questionType,
    prompt: item.prompt,
    answer_key: item.answerKey,
    marking_guidance: item.markingGuidance,
    difficulty: item.difficulty,
    answer_key_label: item.answerKeyLabel,
  };
}

export function stage3ResultFromJson(
  json: Record<string, unknown>,
): Stage3AssessmentResult {
  const itemsJson = Array.isArray(json.items) ? json.items : [];
  const items = itemsJson
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e) => stage3ItemFromJson(e));
  return {
    activityTitle: String(json.activity_title ?? ""),
    curriculumLabel: String(json.curriculum_label ?? ""),
    stage1RouteId: String(json.stage1_route_id ?? ""),
    gradeLabel: String(json.grade_label ?? ""),
    subject: String(json.subject ?? ""),
    topic: String(json.topic ?? ""),
    teachingMethod: String(json.teaching_method ?? ""),
    lessonDuration: Number(json.lesson_duration ?? 45) || 45,
    activityFormat: String(json.activity_format ?? ""),
    studentInstructions: String(json.student_instructions ?? ""),
    teacherNotes: String(json.teacher_notes ?? ""),
    items,
    exportMetadata: asRecord(json.export_metadata),
    studentActivityText: String(json.student_activity_text ?? ""),
    teacherAnswerKeyText: String(json.teacher_answer_key_text ?? ""),
  };
}

export function parseStage3Status(
  json: Record<string, unknown>,
): Stage3GenerationStatus {
  return {
    jobId: String(json.jobId ?? ""),
    status: String(json.status ?? ""),
    progress: Number(json.progress ?? 0) || 0,
    error: String(json.error ?? ""),
    result: stage3ResultFromJson(asRecord(json.result)),
  };
}

export function isStage3TerminalStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return (
    s === "completed" ||
    s === "complete" ||
    s === "completed_with_image_failures" ||
    s === "failed" ||
    s === "error"
  );
}

export function isStage3SuccessfulTerminal(status: string): boolean {
  const s = status.trim().toLowerCase();
  return (
    s === "completed" ||
    s === "complete" ||
    s === "completed_with_image_failures"
  );
}

export function hasUsableStage3Result(
  result: Stage3AssessmentResult | null | undefined,
): boolean {
  if (!result) return false;
  return (
    result.items.length > 0 || result.studentActivityText.trim().length > 0
  );
}

/** Mirrors Flutter `_stage3JsonFromResult` for library persistence. */
export function stage3JsonFromResult(
  result: Stage3AssessmentResult,
): Record<string, unknown> {
  return {
    ...result.exportMetadata,
    result: {
      activity_title: result.activityTitle,
      activity_format: result.activityFormat,
      student_activity_text: result.studentActivityText,
      teacher_answer_key_text: result.teacherAnswerKeyText,
      student_instructions: result.studentInstructions,
      teacher_notes: result.teacherNotes,
      items: result.items.map(stage3ItemToJson),
    },
  };
}

/** Hydrate result from a library activity row. */
export function stage3ResultFromLibraryJson(
  stage3Json: Record<string, unknown> | null | undefined,
  fallbackStudent = "",
  fallbackTeacher = "",
): Stage3AssessmentResult | null {
  if (!stage3Json) {
    if (!fallbackStudent.trim() && !fallbackTeacher.trim()) return null;
    return {
      activityTitle: "",
      curriculumLabel: "",
      stage1RouteId: "",
      gradeLabel: "",
      subject: "",
      topic: "",
      teachingMethod: "",
      lessonDuration: 45,
      activityFormat: "",
      studentInstructions: "",
      teacherNotes: "",
      items: [],
      exportMetadata: {},
      studentActivityText: fallbackStudent,
      teacherAnswerKeyText: fallbackTeacher,
    };
  }
  const nested = asRecord(stage3Json.result);
  const base = Object.keys(nested).length
    ? stage3ResultFromJson({
        ...stage3Json,
        ...nested,
        student_activity_text:
          nested.student_activity_text ?? stage3Json.student_activity_text,
        teacher_answer_key_text:
          nested.teacher_answer_key_text ?? stage3Json.teacher_answer_key_text,
        items: nested.items ?? stage3Json.items,
      })
    : stage3ResultFromJson(stage3Json);
  if (!base.studentActivityText.trim() && fallbackStudent.trim()) {
    base.studentActivityText = fallbackStudent;
  }
  if (!base.teacherAnswerKeyText.trim() && fallbackTeacher.trim()) {
    base.teacherAnswerKeyText = fallbackTeacher;
  }
  return base;
}


