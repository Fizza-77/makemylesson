export type SubjectInfo = {
  name: string;
  code: string | null;
  displayName: string;
};

export type GradeInfo = {
  gradeId: string;
  displayName: string;
  ageRange: string | null;
  stage: string | null;
  subjects: SubjectInfo[];
};

export type CurriculumPathway = {
  id: string;
  name: string;
  curriculumId: string;
  grades: GradeInfo[];
};

export type TopLevelCurriculum = {
  id: string;
  name: string;
  pathways: CurriculumPathway[];
};

export type LessonPlanSelection = {
  topLevelId: string;
  pathwayId: string;
  gradeId: string;
  gradeDisplayName: string;
  subjectDisplayName: string;
  subjectName: string;
  subjectCode: string | null;
  curriculumId: string;
  curriculumName: string;
  topic: string;
  method: string;
  durationMinutes: number;
};

export type Stage1GenerationStatus = {
  jobId: string;
  status: string;
  progress: number;
  phase: string;
  error: string;
  content: string;
};

/** Mirrors Flutter LessonDraft.allowedMethods */
export const STAGE1_METHODS = [
  "General (Teacher-Led Instruction)",
  "Flipped Classroom",
  "Blended Learning",
  "Gamification",
  "Project-Based Learning",
  "Inquiry-Based Learning",
  "Collaborative Learning",
  "Personalised Learning",
  "Competency-Based Learning",
  "Experiential Learning",
  "Mindfulness & Social-Emotional Learning",
  "Spaced Learning",
  "Service Learning",
  "Problem-Based Learning",
  "Crossover Learning",
  "Kinesthetic Learning",
] as const;

/** Mirrors Flutter LessonDraft.allowedDurations / STAGE1_ALLOWED_DURATIONS */
export const STAGE1_DURATIONS = [
  "30 minutes",
  "35 minutes",
  "40 minutes",
  "45 minutes",
  "50 minutes",
  "55 minutes",
  "60 minutes",
] as const;

export const STAGE1_DEFAULT_METHOD = STAGE1_METHODS[0];
export const STAGE1_DEFAULT_DURATION = "45 minutes";

export function parseDurationMinutes(label: string): number {
  const m = /(\d+)/.exec(label);
  if (!m) return 45;
  return Number.parseInt(m[1]!, 10) || 45;
}

export function subjectFromDisplay(display: string): SubjectInfo {
  const codeMatch = /\(([^)]+)\)/.exec(display);
  if (codeMatch) {
    const raw = codeMatch[1]?.trim() ?? "";
    const digits = /^(\d+)$/.exec(raw);
    const code = digits ? digits[1]! : raw;
    const name = display.split("(")[0]?.trim() ?? display.trim();
    return {
      name,
      code,
      displayName: code ? `${name} (${code})` : name,
    };
  }
  const name = display.trim();
  return { name, code: null, displayName: name };
}

export function pathwayLabelForTopLevel(id: string): string {
  switch (id.toLowerCase()) {
    case "british":
      return "Choose Pathway";
    case "us":
      return "Choose Program";
    case "ib":
      return "Choose Programme";
    case "australian":
      return "Choose State/Territory";
    case "canadian":
      return "Choose Province/Territory";
    default:
      return "Choose Pathway";
  }
}

export function newStage1JobId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s1_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function parseStage1Status(json: Record<string, unknown>): Stage1GenerationStatus {
  const result =
    json.result && typeof json.result === "object"
      ? (json.result as Record<string, unknown>)
      : {};
  const content = String(json.content ?? result.content ?? "").trim();
  return {
    jobId: String(json.jobId ?? ""),
    status: String(json.status ?? ""),
    progress: Number(json.progress ?? 0) || 0,
    phase: String(json.phase ?? ""),
    error: String(json.error ?? ""),
    content,
  };
}

export function isTerminalGenerationStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return s === "completed" || s === "complete" || s === "failed" || s === "error";
}

export function isSuccessfulTerminalStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return s === "completed" || s === "complete";
}
