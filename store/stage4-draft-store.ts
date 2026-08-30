"use client";

import { create } from "zustand";

import {
  fallbackStage2RouteId,
  mapStage2RouteId,
} from "@/data/stage2-route-map";
import { newPlanBundleId } from "@/lib/plan-bundle-id";
import { toUserMessage } from "@/lib/user-facing-error";
import { shouldSkipLibrarySave } from "@/lib/guest-session";
import {
  findCurriculumIdFromName,
  resolveStage1SelectionFromLibrary,
} from "@/services/curriculum.service";
import {
  addAssessmentFromStage4,
  updateAssessmentFromStage4,
} from "@/services/library-catalog.service";
import {
  generateStage4Assessment,
  getStage4GenerationStatus,
} from "@/services/stage4-ai.service";
import {
  difficultyFromAnswers,
  type ClarificationAnswer,
} from "@/types/stage-clarification";
import {
  assessmentTypeForKind,
  clampStage4MarksToDuration,
  clampSummativeQuestionCount,
  defaultSummativeQuestionCount,
  hasUsableStage4Result,
  isStage4SuccessfulTerminal,
  isStage4TerminalStatus,
  midpointMarksForStage4Minutes,
  newStage4JobId,
  parseStage4QuestionsFromRawJson,
  questionTypeFlagsFromStage4Questions,
  quizDurationIndexFromMinutes,
  STAGE4_DURATION_MINUTES,
  STAGE4_MIN_SOURCE_CHARS,
  stage4JsonFromResult,
  stage4ResultFromLibraryJson,
  summativeKindFromStored,
  type Stage4AssessmentResult,
  type Stage4SourceMode,
  type SummativeKind,
} from "@/types/stage4";
import {
  STAGE1_DEFAULT_METHOD,
  subjectFromDisplay,
} from "@/types/stage1";

export type Stage4DraftState = {
  sourceMode: Stage4SourceMode;
  sourceLibraryItemId: string | null;
  sourceFileName: string | null;
  sourceAssessmentText: string;
  quizKind: SummativeKind | null;
  questionCount: number;
  quizDurationIndex: number;
  totalMarks: number;
  quizMultipleChoice: boolean;
  quizTrueFalse: boolean;
  quizFillBlanks: boolean;
  quizShortAnswer: boolean;
  topLevelId: string;
  curriculumLabel: string;
  pathwayId: string;
  pathwayDisplayName: string;
  grade: string;
  subject: string;
  subjectName: string;
  topic: string;
  method: string;
  mappedCurriculumId: string | null;
  mappedCurriculumName: string | null;
  planBundleId: string | null;
  linkedAssessmentLibraryItemId: string | null;
  result: Stage4AssessmentResult | null;
  isGenerating: boolean;
  isSavingLibrary: boolean;
  jobId: string | null;
  status: string;
  progress: number;
  phase: string;
  error: string | null;
};

type Stage4Store = Stage4DraftState & {
  setSourceMode: (mode: Stage4SourceMode) => void;
  setQuizKind: (kind: SummativeKind) => void;
  setQuestionCount: (count: number) => void;
  setQuizDurationIndex: (index: number) => void;
  setTotalMarks: (marks: number) => void;
  setQuestionType: (
    key:
      | "quizMultipleChoice"
      | "quizTrueFalse"
      | "quizFillBlanks"
      | "quizShortAnswer",
    value: boolean,
  ) => void;
  setUploadedSource: (params: {
    fileName: string;
    assessmentText: string;
  }) => void;
  clearUploadedSource: () => void;
  setLibrarySource: (params: {
    libraryItemId: string;
    assessmentText: string;
    topic: string;
    curriculumRoute: string;
    grade: string;
    subject: string;
    planBundleId?: string | null;
    topLevelId?: string;
    pathwayId?: string;
    pathwayDisplayName?: string;
    method?: string;
    mappedCurriculumId?: string | null;
  }) => void;
  seedFromStage3Session: (params: {
    libraryItemId: string | null;
    assessmentText: string;
    topic: string;
    curriculumRoute: string;
    grade: string;
    subject: string;
    planBundleId?: string | null;
    topLevelId: string;
    pathwayId: string;
    pathwayDisplayName: string;
    method: string;
    mappedCurriculumId: string | null;
  }) => void;
  loadAssessmentFromLibrary: (item: {
    id: string;
    topic: string;
    subject: string;
    grade: string;
    curriculumRoute: string;
    reviewBody: string;
    teacherReviewBody?: string | null;
    stage4Json?: Record<string, unknown> | null;
    planBundleId?: string | null;
    /** Stage 3 activity used as the previous source (same plan bundle). */
    sourceLibraryItemId?: string | null;
    sourceAssessmentText?: string | null;
  }) => void;
  setStudentAssessmentText: (text: string) => void;
  setTeacherMarkSchemeText: (text: string) => void;
  canGenerate: () => boolean;
  ensurePlanBundleId: () => string;
  durationMinutes: () => number;
  generate: (
    clarificationAnswers?: ClarificationAnswer[],
  ) => Promise<{ savedToLibrary: boolean; saveError?: string }>;
  saveCurrentToLibrary: () => Promise<void>;
  resetResult: () => void;
  resetAll: () => void;
};

const initial: Stage4DraftState = {
  sourceMode: "stage3Library",
  sourceLibraryItemId: null,
  sourceFileName: null,
  sourceAssessmentText: "",
  quizKind: null,
  questionCount: 8,
  quizDurationIndex: 4, // 45 min
  totalMarks: midpointMarksForStage4Minutes(45),
  quizMultipleChoice: false,
  quizTrueFalse: false,
  quizFillBlanks: false,
  quizShortAnswer: false,
  topLevelId: "british",
  curriculumLabel: "British Curriculum",
  pathwayId: "",
  pathwayDisplayName: "",
  grade: "",
  subject: "",
  subjectName: "",
  topic: "",
  method: STAGE1_DEFAULT_METHOD,
  mappedCurriculumId: null,
  mappedCurriculumName: null,
  planBundleId: null,
  linkedAssessmentLibraryItemId: null,
  result: null,
  isGenerating: false,
  isSavingLibrary: false,
  jobId: null,
  status: "",
  progress: 0,
  phase: "",
  error: null,
};

let pollTimer: ReturnType<typeof setInterval> | null = null;
let pollFailures = 0;
let activeJobId: string | null = null;

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  pollFailures = 0;
}

function effectiveRouteId(s: Stage4DraftState): string {
  const mapped = s.mappedCurriculumId?.trim();
  if (mapped) return mapStage2RouteId(mapped);
  const pathway = s.pathwayId.trim();
  if (pathway) return pathway;
  return fallbackStage2RouteId(s.topLevelId);
}

function effectiveGrade(grade: string): string {
  return grade.trim() || "Not specified";
}

function effectiveTopic(topic: string): string {
  return topic.trim() || "From uploaded lesson materials";
}

function effectiveSubject(subject: string, subjectName: string): string {
  return subjectName.trim() || subject.trim() || "General";
}

function selectedTypes(s: Stage4DraftState): string[] {
  const out: string[] = [];
  if (s.quizMultipleChoice) out.push("multiple_choice");
  if (s.quizTrueFalse) out.push("true_false");
  if (s.quizFillBlanks) out.push("fill_in_the_blanks");
  if (s.quizShortAnswer) out.push("short_answer");
  return out;
}

function durationMinutesOf(s: Stage4DraftState): number {
  const i = Math.min(
    STAGE4_DURATION_MINUTES.length - 1,
    Math.max(0, s.quizDurationIndex),
  );
  return STAGE4_DURATION_MINUTES[i]!;
}

async function persistToLibrary(
  get: () => Stage4Store,
  set: (
    partial:
      | Partial<Stage4DraftState>
      | ((s: Stage4DraftState) => Partial<Stage4DraftState>),
  ) => void,
): Promise<{ saved: boolean; saveError?: string }> {
  const s = get();
  const result = s.result;
  if (!hasUsableStage4Result(result) || !result) {
    return { saved: false, saveError: "No assessment content to save." };
  }

  const { getFirebaseAuth } = await import("@/firebase/config");
  if (shouldSkipLibrarySave()) {
    return { saved: false };
  }
  if (!getFirebaseAuth().currentUser) {
    return { saved: false, saveError: "Sign in to save to your library." };
  }

  const topic = effectiveTopic(s.topic);
  const grade = effectiveGrade(s.grade);
  const subject = effectiveSubject(s.subject, s.subjectName);
  const curriculumRoute = s.mappedCurriculumName ?? s.curriculumLabel;
  const bundleId = get().ensurePlanBundleId();
  const stage4Json = stage4JsonFromResult(result);
  const linkedId = s.linkedAssessmentLibraryItemId?.trim();

  set({ isSavingLibrary: true });
  try {
    if (!linkedId) {
      const saved = await addAssessmentFromStage4({
        topic,
        curriculumRoute,
        grade,
        subject,
        studentReviewBody: result.studentAssessmentText,
        teacherReviewBody: result.teacherMarkSchemeText,
        stage4Json,
        planBundleId: bundleId,
      });
      set({
        linkedAssessmentLibraryItemId: saved.id,
        planBundleId: bundleId,
      });
      const { useLibraryCatalogStore, syncLibraryCatalogSubscription } =
        await import("@/store/library-catalog-store");
      const catalog = useLibraryCatalogStore.getState();
      if (!catalog.items.some((i) => i.id === saved.id)) {
        catalog.setItems([saved, ...catalog.items]);
      }
      const uid = getFirebaseAuth().currentUser?.uid;
      if (uid) syncLibraryCatalogSubscription(uid, { force: true });
      return { saved: true };
    }

    await updateAssessmentFromStage4({
      id: linkedId,
      studentReviewBody: result.studentAssessmentText,
      teacherReviewBody: result.teacherMarkSchemeText,
      stage4Json,
      topic,
      curriculumRoute,
      grade,
      subject,
    });
    const uid = getFirebaseAuth().currentUser?.uid;
    if (uid) {
      const { syncLibraryCatalogSubscription } = await import(
        "@/store/library-catalog-store"
      );
      syncLibraryCatalogSubscription(uid, { force: true });
    }
    return { saved: true };
  } catch (e) {
    return {
      saved: false,
      saveError:
        toUserMessage(e, "Failed to save assessment."),
    };
  } finally {
    set({ isSavingLibrary: false });
  }
}

export const useStage4DraftStore = create<Stage4Store>((set, get) => ({
  ...initial,

  setSourceMode: (mode) =>
    set({
      sourceMode: mode,
      status: "",
      progress: 0,
      phase: "",
      jobId: null,
      result: null,
      linkedAssessmentLibraryItemId: null,
      error: null,
    }),

  setQuizKind: (kind) =>
    set({
      quizKind: kind,
      questionCount: defaultSummativeQuestionCount(kind),
    }),

  setQuestionCount: (count) =>
    set({
      questionCount: clampSummativeQuestionCount(
        get().quizKind ?? "quiz",
        count,
      ),
    }),

  setQuizDurationIndex: (index) => {
    const i = Math.min(
      STAGE4_DURATION_MINUTES.length - 1,
      Math.max(0, index),
    );
    const minutes = STAGE4_DURATION_MINUTES[i]!;
    set({
      quizDurationIndex: i,
      totalMarks: midpointMarksForStage4Minutes(minutes),
    });
  },

  setTotalMarks: (marks) =>
    set({
      totalMarks: clampStage4MarksToDuration(
        marks,
        durationMinutesOf(get()),
      ),
    }),

  setQuestionType: (key, value) => set({ [key]: value }),

  setUploadedSource: ({ fileName, assessmentText }) =>
    set({
      sourceMode: "upload",
      sourceLibraryItemId: null,
      sourceFileName: fileName,
      sourceAssessmentText: assessmentText,
      status: "",
      progress: 0,
      phase: "",
      jobId: null,
      result: null,
      linkedAssessmentLibraryItemId: null,
      error: null,
    }),

  clearUploadedSource: () =>
    set({
      sourceFileName: null,
      sourceAssessmentText: "",
      sourceLibraryItemId: null,
    }),

  setLibrarySource: (params) => {
    const mappedFromRoute =
      params.mappedCurriculumId?.trim() ||
      findCurriculumIdFromName(params.curriculumRoute);
    const parsed = subjectFromDisplay(params.subject);
    set({
      sourceMode: "stage3Library",
      sourceLibraryItemId: params.libraryItemId.trim() || null,
      sourceFileName: null,
      sourceAssessmentText: params.assessmentText,
      topic: params.topic,
      grade: params.grade,
      subject: params.subject,
      subjectName: parsed.name,
      mappedCurriculumId: mappedFromRoute,
      mappedCurriculumName: params.curriculumRoute || null,
      curriculumLabel: params.curriculumRoute || get().curriculumLabel,
      planBundleId: params.planBundleId?.trim() || get().planBundleId,
      topLevelId: params.topLevelId ?? get().topLevelId,
      pathwayId: params.pathwayId ?? get().pathwayId,
      pathwayDisplayName:
        params.pathwayDisplayName ?? get().pathwayDisplayName,
      method: params.method ?? get().method,
      status: "",
      progress: 0,
      phase: "",
      jobId: null,
      result: null,
      linkedAssessmentLibraryItemId: null,
      error: null,
    });
  },

  seedFromStage3Session: (params) => {
    const current = get();
    if (current.isGenerating) return;
    // Don't overwrite a library assessment opened into Stage 4.
    if (current.linkedAssessmentLibraryItemId?.trim() && current.result) {
      return;
    }
    if (
      current.sourceAssessmentText.trim().length >= STAGE4_MIN_SOURCE_CHARS &&
      current.sourceMode === "upload"
    ) {
      return;
    }
    if (!params.assessmentText.trim()) return;
    if (
      current.sourceAssessmentText.trim() ===
        params.assessmentText.trim() &&
      current.result
    ) {
      return;
    }

    const mappedFromRoute =
      params.mappedCurriculumId?.trim() ||
      findCurriculumIdFromName(params.curriculumRoute);
    const parsed = subjectFromDisplay(params.subject);
    set({
      sourceMode: "stage3Library",
      sourceLibraryItemId: params.libraryItemId,
      sourceFileName: null,
      sourceAssessmentText: params.assessmentText,
      topic: params.topic,
      grade: params.grade,
      subject: params.subject,
      subjectName: parsed.name,
      mappedCurriculumId: mappedFromRoute,
      mappedCurriculumName: params.curriculumRoute || null,
      curriculumLabel: params.curriculumRoute || current.curriculumLabel,
      planBundleId: params.planBundleId?.trim() || current.planBundleId,
      topLevelId: params.topLevelId,
      pathwayId: params.pathwayId,
      pathwayDisplayName: params.pathwayDisplayName,
      method: params.method,
    });
  },

  loadAssessmentFromLibrary: (item) => {
    const result = stage4ResultFromLibraryJson(
      item.stage4Json,
      item.reviewBody,
      item.teacherReviewBody ?? "",
    );
    const resolved = resolveStage1SelectionFromLibrary({
      curriculumRoute: item.curriculumRoute,
      grade: item.grade,
      subject: item.subject,
    });
    const parsed = subjectFromDisplay(
      resolved?.subject || item.subject || result?.subject || "",
    );
    const questions = result
      ? parseStage4QuestionsFromRawJson(result.rawJson)
      : [];
    const typeFlags = questionTypeFlagsFromStage4Questions(questions);
    const assessmentTypeRaw =
      (result?.rawJson.assessment_type as string | undefined) ||
      (result?.exportMetadata.assessment_type as string | undefined) ||
      (item.stage4Json?.assessment_type as string | undefined) ||
      result?.assessmentTitle ||
      "";
    const quizKind = summativeKindFromStored(assessmentTypeRaw);
    const durationMinutes =
      result?.assessmentDurationMinutes ||
      Number(result?.rawJson.assessment_duration_minutes ?? 45) ||
      45;
    const quizDurationIndex = quizDurationIndexFromMinutes(durationMinutes);
    const questionCount = clampSummativeQuestionCount(
      quizKind,
      questions.length > 0
        ? questions.length
        : defaultSummativeQuestionCount(quizKind),
    );
    const totalMarks = clampStage4MarksToDuration(
      result?.totalMarks || midpointMarksForStage4Minutes(durationMinutes),
      STAGE4_DURATION_MINUTES[quizDurationIndex]!,
    );
    const priorSource =
      item.sourceAssessmentText?.trim() ||
      item.reviewBody?.trim() ||
      result?.studentAssessmentText?.trim() ||
      item.topic;

    set({
      sourceMode: "stage3Library",
      sourceLibraryItemId: item.sourceLibraryItemId?.trim() || null,
      sourceFileName: null,
      sourceAssessmentText: priorSource,
      topic: item.topic || result?.topic || "",
      grade: resolved?.grade || item.grade || result?.gradeOrYear || "",
      subject: resolved?.subject || item.subject || result?.subject || "",
      subjectName:
        parsed.name || result?.subject || resolved?.subject || "",
      curriculumLabel:
        resolved?.curriculumLabel ||
        item.curriculumRoute ||
        result?.curriculumLabel ||
        "",
      mappedCurriculumName:
        resolved?.mappedCurriculumName ||
        item.curriculumRoute ||
        result?.curriculumLabel ||
        null,
      mappedCurriculumId:
        resolved?.mappedCurriculumId ||
        findCurriculumIdFromName(item.curriculumRoute),
      topLevelId: resolved?.topLevelId || get().topLevelId,
      pathwayId: resolved?.pathwayId || "",
      pathwayDisplayName: resolved?.pathwayDisplayName || "",
      method: result?.teachingMethod?.trim() || STAGE1_DEFAULT_METHOD,
      quizKind,
      questionCount,
      quizDurationIndex,
      totalMarks,
      quizMultipleChoice: typeFlags.quizMultipleChoice,
      quizTrueFalse: typeFlags.quizTrueFalse,
      quizFillBlanks: typeFlags.quizFillBlanks,
      quizShortAnswer: typeFlags.quizShortAnswer,
      result,
      planBundleId: item.planBundleId?.trim() || get().planBundleId,
      linkedAssessmentLibraryItemId: item.id,
      status: result ? "completed" : "",
      progress: result ? 100 : 0,
      phase: result ? "completed" : "",
      error: null,
      isGenerating: false,
      jobId: null,
    });
  },

  setStudentAssessmentText: (text) => {
    const result = get().result;
    if (!result) return;
    set({ result: { ...result, studentAssessmentText: text } });
  },

  setTeacherMarkSchemeText: (text) => {
    const result = get().result;
    if (!result) return;
    set({ result: { ...result, teacherMarkSchemeText: text } });
  },

  canGenerate: () => {
    const s = get();
    return (
      s.sourceAssessmentText.trim().length >= STAGE4_MIN_SOURCE_CHARS &&
      s.quizKind != null &&
      selectedTypes(s).length > 0
    );
  },

  durationMinutes: () => durationMinutesOf(get()),

  ensurePlanBundleId: () => {
    const existing = get().planBundleId?.trim() ?? "";
    if (existing) return existing;
    const id = newPlanBundleId();
    set({ planBundleId: id });
    return id;
  },

  resetResult: () => {
    stopPolling();
    activeJobId = null;
    set({
      result: null,
      status: "",
      progress: 0,
      phase: "",
      error: null,
      jobId: null,
      isGenerating: false,
      linkedAssessmentLibraryItemId: null,
    });
  },

  resetAll: () => {
    stopPolling();
    activeJobId = null;
    set(initial);
  },

  saveCurrentToLibrary: async () => {
    const result = await persistToLibrary(get, set);
    if (!result.saved) {
      throw new Error(result.saveError || "Failed to save assessment.");
    }
  },

  generate: async (clarificationAnswers = []) => {
    const s = get();
    if (!get().canGenerate()) {
      if (!s.quizKind) {
        throw new Error("Please choose a quiz or test type.");
      }
      if (selectedTypes(s).length === 0) {
        throw new Error("Please select at least one question type.");
      }
      throw new Error(
        `Source must contain at least ${STAGE4_MIN_SOURCE_CHARS} characters.`,
      );
    }
    const quizKind = s.quizKind!;

    const jobId = newStage4JobId();
    activeJobId = jobId;
    stopPolling();

    set({
      isGenerating: true,
      jobId,
      status: "generating",
      progress: 10,
      phase: "preparing",
      result: null,
      error: null,
      linkedAssessmentLibraryItemId: null,
    });

    let savedToLibrary = false;
    let saveError: string | undefined;
    let finalized = false;

    const tryFinalize = async (result: Stage4AssessmentResult) => {
      if (finalized || activeJobId !== jobId) return;
      if (!hasUsableStage4Result(result)) return;
      finalized = true;
      stopPolling();
      set({
        isGenerating: false,
        result,
        status: "completed",
        progress: 100,
        phase: "completed",
      });
      const persist = await persistToLibrary(get, set);
      savedToLibrary = persist.saved;
      saveError = persist.saveError;
    };

    pollTimer = setInterval(() => {
      void (async () => {
        if (activeJobId !== jobId || finalized) return;
        try {
          const status = await getStage4GenerationStatus(jobId);
          if (activeJobId !== jobId || finalized) return;
          pollFailures = 0;
          const nextResult =
            hasUsableStage4Result(status.result) && status.result
              ? status.result
              : get().result;
          set({
            status: status.status,
            progress: status.progress,
            phase: status.phase || get().phase,
            result: nextResult,
            isGenerating: !isStage4TerminalStatus(status.status),
            error: status.error || null,
          });
          if (isStage4TerminalStatus(status.status)) {
            if (
              isStage4SuccessfulTerminal(status.status) &&
              nextResult &&
              hasUsableStage4Result(nextResult)
            ) {
              await tryFinalize(nextResult);
            } else if (
              status.status === "failed" ||
              status.status === "error"
            ) {
              stopPolling();
              set({
                isGenerating: false,
                status: "failed",
                progress: 0,
                phase: "failed",
                error: status.error || "Generation failed.",
              });
            }
          }
        } catch {
          pollFailures++;
          if (pollFailures >= 3) {
            stopPolling();
            set({
              isGenerating: false,
              status: "failed",
              phase: "failed",
              error: "Lost connection while checking generation status.",
            });
          }
        }
      })();
    }, 2000);

    const routeId = effectiveRouteId(s);
    const durationMin = durationMinutesOf(s);
    const totalMarks = clampStage4MarksToDuration(s.totalMarks, durationMin);

    try {
      const generated = await generateStage4Assessment(
        {
          curriculumFamily: s.topLevelId.trim() || "british",
          routeId,
          stage1RouteId: routeId,
          pathwayProgram: s.pathwayDisplayName || null,
          stateOrProvince: null,
          gradeOrYear: effectiveGrade(s.grade),
          subject: effectiveSubject(s.subject, s.subjectName),
          topic: effectiveTopic(s.topic),
          teachingMethod: s.method,
          assessmentDurationMinutes: durationMin,
          assessmentType: assessmentTypeForKind(quizKind),
          selectedQuestionTypes: selectedTypes(s),
          sourceMode:
            s.sourceMode === "stage3Library"
              ? "stage3_formative_assessment"
              : "teacher_uploaded_formative_assessment",
          sourceStage3Activity:
            s.sourceMode === "stage3Library"
              ? s.sourceAssessmentText.trim()
              : "",
          teacherUploadedContextText:
            s.sourceMode === "upload" ? s.sourceAssessmentText.trim() : "",
          stage3LibraryItemId: s.sourceLibraryItemId,
          totalMarks,
          numberOfItems: clampSummativeQuestionCount(
            quizKind,
            s.questionCount,
          ),
          difficulty: difficultyFromAnswers(clarificationAnswers),
        },
        jobId,
        clarificationAnswers,
      );

      if (activeJobId !== jobId) return { savedToLibrary: false };

      stopPolling();
      const result = generated.result;
      set({
        isGenerating: false,
        jobId: generated.jobId || jobId,
        status: "completed",
        progress: 100,
        phase: "completed",
        result: hasUsableStage4Result(result) ? result : get().result,
        error: generated.error || null,
      });

      if (hasUsableStage4Result(result)) {
        await tryFinalize(result);
      }
    } catch (e) {
      stopPolling();
      activeJobId = null;
      set({
        isGenerating: false,
        status: "failed",
        progress: 0,
        phase: "failed",
        error: toUserMessage(e, "Generation failed."),
      });
      throw e;
    }

    return { savedToLibrary, saveError };
  },
}));
