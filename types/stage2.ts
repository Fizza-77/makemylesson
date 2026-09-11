/** Stage 2 presentation types — mirrors Flutter `stage2_presentation.dart`. */

export type Stage2SourceMode = "stage1Library" | "upload";

export type Stage2Slide = {
  slideNumber: number;
  slideType: string;
  slideTitle: string;
  slideContent: string[];
  slideLayout: string;
  imagePrompt: string;
  imageAssetId: string;
  imageUrl: string;
  speakerNotes: string;
  estimatedTimeMinutes: number;
  teacherAction: string;
  studentAction: string;
  teachingMethodNote: string;
  imageStatus: string;
  imageError: string;
  imageDataUrl: string;
};

export type Stage2PresentationResult = {
  presentationTitle: string;
  curriculumLabel: string;
  stage1RouteId: string;
  pathwayProgram: string;
  stateOrProvince: string;
  gradeLabel: string;
  subject: string;
  topic: string;
  teachingMethod: string;
  lessonDuration: number;
  totalSlides: number;
  presentationStyle: string;
  slides: Stage2Slide[];
  exportMetadata: Record<string, unknown>;
};

export type Stage2GenerateRequest = {
  curriculumFamily: string;
  routeId: string;
  gradeOrYear: string;
  subject: string;
  topic: string;
  teachingMethod: string;
  /** Must be one of STAGE2_LESSON_DURATIONS (matches Flutter / Cloud Function). */
  lessonDuration: number;
  /**
   * User-facing deck size (5/7/9/11/13). Backend generates slideCount − 1
   * content slides; Flutter/web prepend a Cover as display slide 1.
   */
  slideCount: number;
  sourceType: "generated_lesson_plan" | "teacher_uploaded_lesson_plan";
  sourceLessonText: string;
  pathwayProgram?: string | null;
  stateOrProvince?: string | null;
  presentationStyle: string;
  stage1LibraryItemId?: string | null;
};

export type Stage2GenerationStatus = {
  jobId: string;
  status: string;
  progress: number;
  error: string;
  result: Stage2PresentationResult;
};

export const STAGE2_DEFAULT_THEME_ID = "classic_navy";
export const STAGE2_MIN_SOURCE_CHARS = 50;

/** Allowed by Stage 2 cloud function (`lessonDuration`). */
export const STAGE2_LESSON_DURATIONS = [30, 35, 40, 45, 50, 55, 60] as const;

/**
 * User-facing slide counts from Flutter `LessonDraft.allowedStage2SlideCounts`
 * / Cloud Function `STAGE2_ALLOWED_SLIDE_COUNTS`.
 */
export const STAGE2_SLIDE_COUNT_OPTIONS = [5, 7, 9, 11, 13] as const;
export const STAGE2_DEFAULT_SLIDE_COUNT = 7;

export function snapStage2LessonDuration(minutes: number): number {
  const m = Math.max(1, Math.round(minutes) || 45);
  if ((STAGE2_LESSON_DURATIONS as readonly number[]).includes(m)) return m;
  return STAGE2_LESSON_DURATIONS.reduce((best, option) =>
    Math.abs(option - m) < Math.abs(best - m) ? option : best,
  );
}

export function snapStage2SlideCount(n: number): number {
  const count = Math.max(1, Math.round(n) || STAGE2_DEFAULT_SLIDE_COUNT);
  if ((STAGE2_SLIDE_COUNT_OPTIONS as readonly number[]).includes(count)) {
    return count;
  }
  return STAGE2_SLIDE_COUNT_OPTIONS.reduce((best, option) =>
    Math.abs(option - count) < Math.abs(best - count) ? option : best,
  );
}

/** Soft default slide count from lesson length (snapped to allowed odd options). */
export function stage2SlideCountForDurationMinutes(minutes: number): number {
  const m = snapStage2LessonDuration(minutes);
  const faqHeuristic: Record<number, number> = {
    30: 6,
    35: 7,
    40: 8,
    45: 9,
    50: 10,
    55: 11,
    60: 12,
  };
  return snapStage2SlideCount(faqHeuristic[m] ?? STAGE2_DEFAULT_SLIDE_COUNT);
}

export function newStage2JobId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s2_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

export function stage2SlideFromJson(json: Record<string, unknown>): Stage2Slide {
  const content = Array.isArray(json.slide_content)
    ? json.slide_content.map((e) => String(e))
    : Array.isArray(json.slideContent)
      ? json.slideContent.map((e) => String(e))
      : [];
  return {
    slideNumber:
      Number(json.slide_number ?? json.slideNumber ?? 1) || 1,
    slideType: String(json.slide_type ?? json.slideType ?? ""),
    slideTitle: String(json.slide_title ?? json.slideTitle ?? ""),
    slideContent: content,
    slideLayout: String(json.slide_layout ?? json.slideLayout ?? ""),
    imagePrompt: String(json.image_prompt ?? json.imagePrompt ?? ""),
    imageAssetId: String(json.image_asset_id ?? json.imageAssetId ?? ""),
    imageUrl: String(json.image_url ?? json.imageUrl ?? ""),
    speakerNotes: String(json.speaker_notes ?? json.speakerNotes ?? ""),
    estimatedTimeMinutes:
      Number(json.estimated_time_minutes ?? json.estimatedTimeMinutes ?? 5) ||
      5,
    teacherAction: String(json.teacher_action ?? json.teacherAction ?? ""),
    studentAction: String(json.student_action ?? json.studentAction ?? ""),
    teachingMethodNote: String(
      json.teaching_method_note ?? json.teachingMethodNote ?? "",
    ),
    imageStatus: String(json.image_status ?? json.imageStatus ?? "pending"),
    imageError: String(json.image_error ?? json.imageError ?? ""),
    imageDataUrl: String(json.image_data_url ?? json.imageDataUrl ?? ""),
  };
}

export function stage2SlideToJson(slide: Stage2Slide): Record<string, unknown> {
  return {
    slide_number: slide.slideNumber,
    slide_type: slide.slideType,
    slide_title: slide.slideTitle,
    slide_content: slide.slideContent,
    slide_layout: slide.slideLayout,
    image_prompt: slide.imagePrompt,
    image_asset_id: slide.imageAssetId,
    image_url: slide.imageUrl,
    speaker_notes: slide.speakerNotes,
    estimated_time_minutes: slide.estimatedTimeMinutes,
    teacher_action: slide.teacherAction,
    student_action: slide.studentAction,
    teaching_method_note: slide.teachingMethodNote,
    image_status: slide.imageStatus,
    image_error: slide.imageError,
    image_data_url: slide.imageDataUrl,
  };
}

export function stage2ResultFromJson(
  json: Record<string, unknown>,
): Stage2PresentationResult {
  const slidesJson = Array.isArray(json.slides) ? json.slides : [];
  const slides = slidesJson
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e) => stage2SlideFromJson(e));
  return {
    presentationTitle: String(json.presentation_title ?? ""),
    curriculumLabel: String(json.curriculum_label ?? ""),
    stage1RouteId: String(json.stage1_route_id ?? ""),
    pathwayProgram: String(json.pathway_program ?? ""),
    stateOrProvince: String(json.state_or_province ?? ""),
    gradeLabel: String(json.grade_label ?? ""),
    subject: String(json.subject ?? ""),
    topic: String(json.topic ?? ""),
    teachingMethod: String(json.teaching_method ?? ""),
    lessonDuration: Number(json.lesson_duration ?? 45) || 45,
    totalSlides: Number(json.total_slides ?? slides.length) || slides.length,
    presentationStyle: String(json.presentation_style ?? ""),
    slides,
    exportMetadata: asRecord(json.export_metadata),
  };
}

export function parseStage2Status(
  json: Record<string, unknown>,
): Stage2GenerationStatus {
  return {
    jobId: String(json.jobId ?? ""),
    status: String(json.status ?? ""),
    progress: Number(json.progress ?? 0) || 0,
    error: String(json.error ?? ""),
    result: stage2ResultFromJson(asRecord(json.result)),
  };
}

/** Mirrors Flutter `_isTerminalGenerationStatus` for Stage 2. */
export function isStage2TerminalStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return (
    s === "completed" ||
    s === "completed_with_image_failures" ||
    s === "failed"
  );
}

/** Mirrors Flutter `_isSuccessfulTerminalStatus` for Stage 2. */
export function isStage2SuccessfulTerminal(status: string): boolean {
  const s = status.trim().toLowerCase();
  return s === "completed" || s === "completed_with_image_failures";
}

export function stage2SlideExpectsImage(slide: Stage2Slide): boolean {
  if (slide.imageStatus.trim().toLowerCase() === "none") return false;
  return slide.imagePrompt.trim().length > 0;
}

export function coerceStage2SlidesAfterTerminal(
  slides: Stage2Slide[],
  jobStatus: string,
): Stage2Slide[] {
  if (!isStage2TerminalStatus(jobStatus)) return slides;
  return slides.map((slide) => {
    if (!stage2SlideExpectsImage(slide)) return slide;
    const status = slide.imageStatus.trim().toLowerCase();
    if (status === "success" || status === "failed") return slide;
    return {
      ...slide,
      imageStatus: "failed",
      imageError: slide.imageError.trim()
        ? slide.imageError
        : "Image generation did not complete",
    };
  });
}

/** Mirrors Flutter `_isStage2DeckReadyForSave`. */
export function isStage2DeckReadyForSave(slides: Stage2Slide[]): boolean {
  if (slides.length < 5) return false;
  for (const slide of slides) {
    const title = slide.slideTitle.trim().toLowerCase();
    if (!title || /^slide\s*\d+$/.test(title)) return false;
    if (!slide.slideContent.some((e) => e.trim())) return false;
    if (slide.speakerNotes.trim().length < 80) return false;
  }
  return true;
}

export function slidesToReviewBody(slides: Stage2Slide[]): string {
  const parts: string[] = [];
  for (const slide of slides) {
    parts.push(`## Slide ${slide.slideNumber}: ${slide.slideTitle}`);
    for (const line of slide.slideContent) {
      if (line.trim()) parts.push(`- ${line.trim()}`);
    }
    parts.push("");
  }
  return parts.join("\n").trim();
}

export function slidesToSpeakerNotes(slides: Stage2Slide[]): string {
  const parts: string[] = [];
  for (const slide of slides) {
    parts.push(`Slide ${slide.slideNumber}: ${slide.slideTitle}`);
    parts.push(slide.speakerNotes.trim() || "No notes.");
    parts.push("");
  }
  return parts.join("\n").trim();
}

/** Library JSON — strip huge data URLs when image_url exists (Flutter parity). */
export function slidesJsonForLibrary(slides: Stage2Slide[]): Record<string, unknown>[] {
  return slides.map((s) => {
    const json = stage2SlideToJson(s);
    if (String(json.image_url ?? "").trim()) {
      json.image_data_url = "";
    }
    const status = String(json.image_status ?? "").toLowerCase();
    if (
      status !== "success" &&
      status !== "failed" &&
      status !== "none" &&
      !String(json.image_url ?? "").trim()
    ) {
      json.image_status = "failed";
      if (!String(json.image_error ?? "").trim()) {
        json.image_error = "Image not ready at save time";
      }
    }
    return json;
  });
}


