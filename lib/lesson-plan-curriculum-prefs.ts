/**
 * Client-only Stage 1 curriculum defaults.
 * Mirrors Flutter `LessonPlanCurriculumPrefs` / SharedPreferences keys.
 * Never writes to Firestore — local browser storage only.
 */

export type LessonPlanPrefsSnapshot = {
  topLevelId: string;
  pathwayId: string;
  pathwayDisplayName: string;
  gradeInternalId: string;
  gradeDisplayName: string;
  subjectDisplayName: string;
  subjectName: string;
  subjectCode: string;
  topic: string;
  method: string;
  duration: string;
};

/** Same string keys as Flutter `StorageKeys`. */
export const LessonPlanStorageKeys = {
  topLevelId: "lesson_plan_top_level_id",
  pathwayId: "lesson_plan_pathway_id",
  pathwayDisplay: "lesson_plan_pathway_display",
  gradeInternalId: "lesson_plan_grade_internal_id",
  gradeDisplay: "lesson_plan_grade_display",
  subjectDisplay: "lesson_plan_subject_display",
  subjectName: "lesson_plan_subject_name",
  subjectCode: "lesson_plan_subject_code",
  topic: "lesson_plan_topic",
  method: "lesson_plan_method",
  duration: "lesson_plan_duration",
  /** Web-only display cache (Flutter resolves name from curriculum catalog). */
  curriculumLabel: "lesson_plan_curriculum_label",
} as const;

const TOP_LEVEL_LABELS: Record<string, string> = {
  us: "US Curriculum",
  british: "British Curriculum",
  ib: "IB Curriculum",
  australian: "Australian Curriculum",
  canadian: "Canadian Curriculum",
};

function emptySnapshot(): LessonPlanPrefsSnapshot {
  return {
    topLevelId: "",
    pathwayId: "",
    pathwayDisplayName: "",
    gradeInternalId: "",
    gradeDisplayName: "",
    subjectDisplayName: "",
    subjectName: "",
    subjectCode: "",
    topic: "",
    method: "Direct instruction",
    duration: "45 minutes",
  };
}

export function hasMeaningfulLessonPlanPrefs(
  snap: LessonPlanPrefsSnapshot,
): boolean {
  const nonEmpty = (v: string) => v.trim().length > 0;
  return (
    nonEmpty(snap.topLevelId) ||
    nonEmpty(snap.pathwayId) ||
    nonEmpty(snap.pathwayDisplayName) ||
    nonEmpty(snap.gradeInternalId) ||
    nonEmpty(snap.gradeDisplayName) ||
    nonEmpty(snap.subjectDisplayName) ||
    nonEmpty(snap.subjectName) ||
    nonEmpty(snap.topic)
  );
}

function readKey(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeKey(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

function removeKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function loadLessonPlanCurriculumPrefs(): LessonPlanPrefsSnapshot | null {
  const snap: LessonPlanPrefsSnapshot = {
    topLevelId: readKey(LessonPlanStorageKeys.topLevelId),
    pathwayId: readKey(LessonPlanStorageKeys.pathwayId),
    pathwayDisplayName: readKey(LessonPlanStorageKeys.pathwayDisplay),
    gradeInternalId: readKey(LessonPlanStorageKeys.gradeInternalId),
    gradeDisplayName: readKey(LessonPlanStorageKeys.gradeDisplay),
    subjectDisplayName: readKey(LessonPlanStorageKeys.subjectDisplay),
    subjectName: readKey(LessonPlanStorageKeys.subjectName),
    subjectCode: readKey(LessonPlanStorageKeys.subjectCode),
    topic: readKey(LessonPlanStorageKeys.topic),
    method: readKey(LessonPlanStorageKeys.method) || "Direct instruction",
    duration: readKey(LessonPlanStorageKeys.duration) || "45 minutes",
  };
  if (!hasMeaningfulLessonPlanPrefs(snap)) return null;
  return snap;
}

export function saveLessonPlanCurriculumPrefs(
  snap: LessonPlanPrefsSnapshot & { curriculumLabel?: string },
) {
  writeKey(LessonPlanStorageKeys.topLevelId, snap.topLevelId);
  writeKey(LessonPlanStorageKeys.pathwayId, snap.pathwayId);
  writeKey(LessonPlanStorageKeys.pathwayDisplay, snap.pathwayDisplayName);
  writeKey(LessonPlanStorageKeys.gradeInternalId, snap.gradeInternalId);
  writeKey(LessonPlanStorageKeys.gradeDisplay, snap.gradeDisplayName);
  writeKey(LessonPlanStorageKeys.subjectDisplay, snap.subjectDisplayName);
  writeKey(LessonPlanStorageKeys.subjectName, snap.subjectName);
  writeKey(LessonPlanStorageKeys.subjectCode, snap.subjectCode);
  writeKey(LessonPlanStorageKeys.topic, snap.topic);
  writeKey(LessonPlanStorageKeys.method, snap.method);
  writeKey(LessonPlanStorageKeys.duration, snap.duration);
  if (snap.curriculumLabel?.trim()) {
    writeKey(LessonPlanStorageKeys.curriculumLabel, snap.curriculumLabel.trim());
  }
}

export function clearLessonPlanCurriculumPrefs() {
  for (const key of Object.values(LessonPlanStorageKeys)) {
    removeKey(key);
  }
}

export function curriculumLabelForPrefs(
  snap: LessonPlanPrefsSnapshot | null,
): string | null {
  if (!snap) return null;
  const cached = readKey(LessonPlanStorageKeys.curriculumLabel).trim();
  if (cached) return cached;
  const id = snap.topLevelId.trim().toLowerCase();
  if (id && TOP_LEVEL_LABELS[id]) return TOP_LEVEL_LABELS[id];
  if (snap.topLevelId.trim()) return snap.topLevelId.trim();
  return null;
}

/** Profile card line — friendly empty state when nothing meaningful is saved. */
export function formatSavedCurriculumLine(
  snap: LessonPlanPrefsSnapshot | null,
): string {
  if (!snap || !hasMeaningfulLessonPlanPrefs(snap)) return "Not set";
  const curriculum = curriculumLabelForPrefs(snap);
  if (!curriculum) return "Not set";
  const path = snap.pathwayDisplayName.trim()
    ? `${snap.pathwayDisplayName.trim()} → `
    : "";
  const grade = snap.gradeDisplayName.trim();
  const subject = snap.subjectDisplayName.trim();
  const parts = [`${curriculum} → ${path}${grade} → ${subject}`]
    .map((s) => s.replace(/\s*→\s*$/, "").replace(/\s*→\s*→/g, " → ").trim())
    .join("");
  return parts || "Not set";
}

export function formatSavedTopicLine(
  snap: LessonPlanPrefsSnapshot | null,
): string {
  const topic = snap?.topic.trim() ?? "";
  return topic || "Not set";
}

export { emptySnapshot as emptyLessonPlanPrefsSnapshot };


