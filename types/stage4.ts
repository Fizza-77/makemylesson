/** Stage 4 summative assessment — mirrors Flutter `stage4_assessment.dart`. */

export type Stage4SourceMode = "stage3Library" | "upload";

export type SummativeKind = "quiz" | "fullTest" | "exitTicket";

export type Stage4AssessmentResult = {
  assessmentTitle: string;
  curriculumLabel: string;
  stage1RouteId: string;
  gradeOrYear: string;
  subject: string;
  topic: string;
  teachingMethod: string;
  assessmentDurationMinutes: number;
  totalMarks: number;
  paperTitle: string;
  markSchemeLabel: string;
  studentAssessmentText: string;
  teacherMarkSchemeText: string;
  exportMetadata: Record<string, unknown>;
  rawJson: Record<string, unknown>;
};

export type Stage4GenerateRequest = {
  curriculumFamily: string;
  routeId: string;
  gradeOrYear: string;
  subject: string;
  topic: string;
  teachingMethod: string;
  assessmentDurationMinutes: number;
  assessmentType: string;
  selectedQuestionTypes: string[];
  sourceMode:
    | "stage3_formative_assessment"
    | "teacher_uploaded_formative_assessment";
  sourceStage3Activity: string;
  teacherUploadedContextText: string;
  pathwayProgram?: string | null;
  stateOrProvince?: string | null;
  stage1RouteId?: string | null;
  stage3LibraryItemId?: string | null;
  totalMarks?: number | null;
  numberOfItems: number;
  /** From the difficulty clarification question: easy | medium | hard. */
  difficulty?: string;
};

export type Stage4GenerationStatus = {
  jobId: string;
  status: string;
  progress: number;
  phase: string;
  error: string;
  result: Stage4AssessmentResult;
};

export type Stage4QuestionView = {
  number: number;
  questionType: string;
  questionText: string;
  marks: number;
  answerKey: string;
  markingPoints: string[];
};

export const STAGE4_MIN_SOURCE_CHARS = 30;

export const STAGE4_DURATION_MINUTES = [15, 20, 30, 40, 45, 60] as const;

export const SUMMATIVE_KINDS: {
  id: SummativeKind;
  label: string;
  format: string;
}[] = [
  { id: "quiz", label: "Quiz", format: "quiz" },
  { id: "fullTest", label: "Full test", format: "full_test" },
  { id: "exitTicket", label: "Exit ticket", format: "exit_ticket" },
];

export const STAGE4_QUESTION_TYPES: { id: string; label: string }[] = [
  { id: "multiple_choice", label: "Multiple choice" },
  { id: "true_false", label: "True / false" },
  { id: "fill_in_the_blanks", label: "Fill in the blanks" },
  { id: "short_answer", label: "Short answer" },
];

/** Mirrors Flutter `LessonDraft.stage4MarksBoundsForMinutes`. */
export function stage4MarksBoundsForMinutes(minutes: number): {
  min: number;
  max: number;
} {
  switch (minutes) {
    case 15:
      return { min: 5, max: 10 };
    case 20:
      return { min: 8, max: 15 };
    case 30:
      return { min: 10, max: 20 };
    case 40:
      return { min: 15, max: 30 };
    case 45:
      return { min: 20, max: 35 };
    case 60:
      return { min: 25, max: 50 };
    default:
      return { min: 5, max: 50 };
  }
}

export function midpointMarksForStage4Minutes(minutes: number): number {
  const b = stage4MarksBoundsForMinutes(minutes);
  return Math.min(b.max, Math.max(b.min, Math.round((b.min + b.max) / 2)));
}

export function clampStage4MarksToDuration(
  marks: number,
  minutes: number,
): number {
  const b = stage4MarksBoundsForMinutes(minutes);
  return Math.min(b.max, Math.max(b.min, Math.round(marks)));
}

export function summativeQuestionBounds(kind: SummativeKind): [number, number] {
  switch (kind) {
    case "quiz":
      return [1, 10];
    case "fullTest":
      return [1, 40];
    case "exitTicket":
      return [1, 6];
  }
}

export function defaultSummativeQuestionCount(kind: SummativeKind): number {
  switch (kind) {
    case "quiz":
      return 8;
    case "fullTest":
      return 25;
    case "exitTicket":
      return 3;
  }
}

export function clampSummativeQuestionCount(
  kind: SummativeKind,
  count: number,
): number {
  const [min, max] = summativeQuestionBounds(kind);
  return Math.min(max, Math.max(min, Math.round(count)));
}

export function assessmentTypeForKind(kind: SummativeKind): string {
  return SUMMATIVE_KINDS.find((k) => k.id === kind)?.format ?? "quiz";
}

/** Restore workshop paper type from stored assessment_type / label. */
export function summativeKindFromStored(
  raw: string | null | undefined,
): SummativeKind {
  const t = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (
    t === "full_test" ||
    t === "fulltest" ||
    t === "test" ||
    t.includes("full_test")
  ) {
    return "fullTest";
  }
  if (
    t === "exit_ticket" ||
    t === "exitticket" ||
    t.includes("exit_ticket") ||
    t.includes("exit ticket")
  ) {
    return "exitTicket";
  }
  return "quiz";
}

/** Nearest Stage 4 duration chip index for a saved minute value. */
export function quizDurationIndexFromMinutes(minutes: number): number {
  const target = Number(minutes) || 45;
  let best = 4; // 45 min default
  let bestDiff = Infinity;
  STAGE4_DURATION_MINUTES.forEach((m, i) => {
    const d = Math.abs(m - target);
    if (d < bestDiff) {
      bestDiff = d;
      best = i;
    }
  });
  return best;
}

/** Infer workshop question-type toggles from parsed Stage 4 questions. */
export function questionTypeFlagsFromStage4Questions(
  questions: { questionType: string }[],
): {
  quizMultipleChoice: boolean;
  quizTrueFalse: boolean;
  quizFillBlanks: boolean;
  quizShortAnswer: boolean;
} {
  let quizMultipleChoice = false;
  let quizTrueFalse = false;
  let quizFillBlanks = false;
  let quizShortAnswer = false;
  for (const q of questions) {
    const t = q.questionType.trim().toLowerCase().replace(/-/g, "_");
    if (
      t.includes("multiple_choice") ||
      t === "mcq" ||
      t.includes("multiplechoice")
    ) {
      quizMultipleChoice = true;
    } else if (t.includes("true_false") || t === "tf" || t.includes("truefalse")) {
      quizTrueFalse = true;
    } else if (
      t.includes("fill_in_the_blanks") ||
      t.includes("fill_blank") ||
      t.includes("cloze")
    ) {
      quizFillBlanks = true;
    } else if (
      t.includes("short_answer") ||
      t.includes("shortanswer") ||
      t.includes("open")
    ) {
      quizShortAnswer = true;
    }
  }
  if (
    !quizMultipleChoice &&
    !quizTrueFalse &&
    !quizFillBlanks &&
    !quizShortAnswer
  ) {
    quizMultipleChoice = true;
  }
  return {
    quizMultipleChoice,
    quizTrueFalse,
    quizFillBlanks,
    quizShortAnswer,
  };
}

export function newStage4JobId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s4_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

export function stage4ResultFromJson(
  json: Record<string, unknown>,
): Stage4AssessmentResult {
  return {
    assessmentTitle: String(json.assessment_title ?? ""),
    curriculumLabel: String(json.curriculum_label ?? ""),
    stage1RouteId: String(json.stage1_route_id ?? ""),
    gradeOrYear: String(json.grade_or_year ?? json.grade_label ?? ""),
    subject: String(json.subject ?? ""),
    topic: String(json.topic ?? ""),
    teachingMethod: String(json.teaching_method ?? ""),
    assessmentDurationMinutes:
      Number(json.assessment_duration_minutes ?? 45) || 45,
    totalMarks: Number(json.total_marks ?? 20) || 20,
    paperTitle: String(json.paper_title ?? ""),
    markSchemeLabel: String(
      json.mark_scheme_label ?? "Teacher Mark Scheme",
    ),
    studentAssessmentText: String(
      json.student_assessment_text ?? json.student_paper_text ?? "",
    ),
    teacherMarkSchemeText: String(
      json.teacher_mark_scheme_text ?? json.teacher_answer_key_text ?? "",
    ),
    exportMetadata: asRecord(json.export_metadata),
    rawJson: { ...json },
  };
}

export function stage4ResultToJson(
  result: Stage4AssessmentResult,
): Record<string, unknown> {
  return {
    ...result.rawJson,
    assessment_title: result.assessmentTitle,
    curriculum_label: result.curriculumLabel,
    stage1_route_id: result.stage1RouteId,
    grade_or_year: result.gradeOrYear,
    subject: result.subject,
    topic: result.topic,
    teaching_method: result.teachingMethod,
    assessment_duration_minutes: result.assessmentDurationMinutes,
    total_marks: result.totalMarks,
    paper_title: result.paperTitle,
    mark_scheme_label: result.markSchemeLabel,
    student_assessment_text: result.studentAssessmentText,
    teacher_mark_scheme_text: result.teacherMarkSchemeText,
    export_metadata: result.exportMetadata,
  };
}

export function parseStage4Status(
  json: Record<string, unknown>,
): Stage4GenerationStatus {
  return {
    jobId: String(json.jobId ?? ""),
    status: String(json.status ?? ""),
    progress: Number(json.progress ?? 0) || 0,
    phase: String(json.phase ?? ""),
    error: String(json.error ?? ""),
    result: stage4ResultFromJson(asRecord(json.result)),
  };
}

export function isStage4TerminalStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return (
    s === "completed" ||
    s === "complete" ||
    s === "completed_with_image_failures" ||
    s === "failed" ||
    s === "error"
  );
}

export function isStage4SuccessfulTerminal(status: string): boolean {
  const s = status.trim().toLowerCase();
  return (
    s === "completed" ||
    s === "complete" ||
    s === "completed_with_image_failures"
  );
}

export function hasUsableStage4Result(
  result: Stage4AssessmentResult | null | undefined,
): boolean {
  if (!result) return false;
  return (
    result.studentAssessmentText.trim().length > 0 ||
    result.teacherMarkSchemeText.trim().length > 0
  );
}

/** Mirrors Flutter `stage4JsonFromResult`. */
export function stage4JsonFromResult(
  result: Stage4AssessmentResult,
): Record<string, unknown> {
  return {
    ...result.exportMetadata,
    result: stage4ResultToJson(result),
  };
}

export function stage4ResultFromLibraryJson(
  stage4Json: Record<string, unknown> | null | undefined,
  fallbackStudent = "",
  fallbackTeacher = "",
): Stage4AssessmentResult | null {
  if (!stage4Json) {
    if (!fallbackStudent.trim() && !fallbackTeacher.trim()) return null;
    return {
      assessmentTitle: "",
      curriculumLabel: "",
      stage1RouteId: "",
      gradeOrYear: "",
      subject: "",
      topic: "",
      teachingMethod: "",
      assessmentDurationMinutes: 45,
      totalMarks: 20,
      paperTitle: "",
      markSchemeLabel: "Teacher Mark Scheme",
      studentAssessmentText: fallbackStudent,
      teacherMarkSchemeText: fallbackTeacher,
      exportMetadata: {},
      rawJson: {},
    };
  }
  const nested = asRecord(stage4Json.result);
  const base = Object.keys(nested).length
    ? stage4ResultFromJson({ ...stage4Json, ...nested })
    : stage4ResultFromJson(stage4Json);
  if (!base.studentAssessmentText.trim() && fallbackStudent.trim()) {
    base.studentAssessmentText = fallbackStudent;
  }
  if (!base.teacherMarkSchemeText.trim() && fallbackTeacher.trim()) {
    base.teacherMarkSchemeText = fallbackTeacher;
  }
  return base;
}

/** Mirrors Flutter `parseStage4QuestionsFromRawJson`. */
export function parseStage4QuestionsFromRawJson(
  rawJson: Record<string, unknown>,
): Stage4QuestionView[] {
  const sections = rawJson.sections;
  if (!Array.isArray(sections)) return [];
  const out: Stage4QuestionView[] = [];
  for (const section of sections) {
    if (!section || typeof section !== "object") continue;
    const questions = (section as Record<string, unknown>).questions;
    if (!Array.isArray(questions)) continue;
    for (const q of questions) {
      if (!q || typeof q !== "object") continue;
      const map = q as Record<string, unknown>;
      const marking = Array.isArray(map.marking_points)
        ? map.marking_points.map((e) => String(e))
        : [];
      out.push({
        number: Number(map.number ?? map.question_number ?? out.length + 1) || out.length + 1,
        questionType: String(map.question_type ?? map.type ?? ""),
        questionText: String(
          map.question_text ?? map.prompt ?? map.question ?? "",
        ),
        marks: Number(map.marks ?? map.mark ?? 1) || 1,
        answerKey: String(map.answer_key ?? map.answer ?? ""),
        markingPoints: marking,
      });
    }
  }
  return out;
}
