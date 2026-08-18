"use client";

import { create } from "zustand";

import {
  fallbackStage2RouteId,
  mapStage2RouteId,
} from "@/data/stage2-route-map";
import { newPlanBundleId } from "@/lib/plan-bundle-id";
import { toUserMessage } from "@/lib/user-facing-error";
import { findCurriculumIdFromName } from "@/services/curriculum.service";
import {
  addActivityFromStage3,
  updateActivityFromStage3,
} from "@/services/library-catalog.service";
import {
  generateStage3Assessment,
  getStage3GenerationStatus,
} from "@/services/stage3-ai.service";
import {
  activityFormatForKind,
  clampFormativeQuestionCount,
  defaultFormativeQuestionCount,
  FORMATIVE_KINDS,
  formativeKindFromStored,
  hasUsableStage3Result,
  isStage3SuccessfulTerminal,
  isStage3TerminalStatus,
  newStage3JobId,
  questionTypeFlagsFromItems,
  STAGE3_MIN_SOURCE_CHARS,
  stage3JsonFromResult,
  stage3ResultFromLibraryJson,
  type FormativeKind,
  type Stage3AssessmentResult,
  type Stage3SourceMode,
} from "@/types/stage3";
import {
  parseDurationMinutes,
  STAGE1_DEFAULT_DURATION,
  STAGE1_DEFAULT_METHOD,
  subjectFromDisplay,
} from "@/types/stage1";

export type Stage3DraftState = {
  sourceMode: Stage3SourceMode;
  sourceLibraryItemId: string | null;
  sourceFileName: string | null;
  sourcePresentationText: string;
  formativeKind: FormativeKind;
  questionCount: number;
  multipleChoice: boolean;
  trueFalse: boolean;
  fillBlanks: boolean;
  shortAnswer: boolean;
  topLevelId: string;
  curriculumLabel: string;
  pathwayId: string;
  pathwayDisplayName: string;
  grade: string;
  subject: string;
  subjectName: string;
  topic: string;
  method: string;
  duration: string;
  mappedCurriculumId: string | null;
  mappedCurriculumName: string | null;
  planBundleId: string | null;
  linkedActivityLibraryItemId: string | null;
  result: Stage3AssessmentResult | null;
  isGenerating: boolean;
  isSavingLibrary: boolean;
  jobId: string | null;
  status: string;
  progress: number;
  error: string | null;
};

type Stage3Store = Stage3DraftState & {
  setSourceMode: (mode: Stage3SourceMode) => void;
  setFormativeKind: (kind: FormativeKind) => void;
  setQuestionCount: (count: number) => void;
  setQuestionType: (
    key: "multipleChoice" | "trueFalse" | "fillBlanks" | "shortAnswer",
    value: boolean,
  ) => void;
  setUploadedSource: (params: {
    fileName: string;
    presentationText: string;
  }) => void;
  setLibrarySource: (params: {
    libraryItemId: string;
    presentationText: string;
    topic: string;
    curriculumRoute: string;
    grade: string;
    subject: string;
    planBundleId?: string | null;
    topLevelId?: string;
    pathwayId?: string;
    pathwayDisplayName?: string;
    method?: string;
    duration?: string;
    mappedCurriculumId?: string | null;
  }) => void;
  seedFromStage2Session: (params: {
    libraryItemId: string | null;
    presentationText: string;
    topic: string;
    curriculumRoute: string;
    grade: string;
    subject: string;
    planBundleId?: string | null;
    topLevelId: string;
    pathwayId: string;
    pathwayDisplayName: string;
    method: string;
    duration: string;
    mappedCurriculumId: string | null;
  }) => void;
  loadActivityFromLibrary: (item: {
    id: string;
    topic: string;
    subject: string;
    grade: string;
    curriculumRoute: string;
    reviewBody: string;
    teacherReviewBody?: string | null;
    stage3Json?: Record<string, unknown> | null;
    planBundleId?: string | null;
    activityOrAssessmentLabel?: string | null;
  }) => void;
  setStudentActivityText: (text: string) => void;
  setTeacherAnswerKeyText: (text: string) => void;
  canGenerate: () => boolean;
  ensurePlanBundleId: () => string;
  generate: () => Promise<{ savedToLibrary: boolean; saveError?: string }>;
  saveCurrentToLibrary: () => Promise<void>;
  resetResult: () => void;
  resetAll: () => void;
};

const initial: Stage3DraftState = {
  sourceMode: "stage2Library",
  sourceLibraryItemId: null,
  sourceFileName: null,
  sourcePresentationText: "",
  formativeKind: "quickCheck",
  questionCount: 3,
  multipleChoice: true,
  trueFalse: true,
  fillBlanks: false,
  shortAnswer: true,
  topLevelId: "british",
  curriculumLabel: "British Curriculum",
  pathwayId: "",
  pathwayDisplayName: "",
  grade: "",
  subject: "",
  subjectName: "",
  topic: "",
  method: STAGE1_DEFAULT_METHOD,
  duration: STAGE1_DEFAULT_DURATION,
  mappedCurriculumId: null,
  mappedCurriculumName: null,
  planBundleId: null,
  linkedActivityLibraryItemId: null,
  result: null,
  isGenerating: false,
  isSavingLibrary: false,
  jobId: null,
  status: "",
  progress: 0,
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

function effectiveRouteId(s: Stage3DraftState): string {
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

function selectedTypes(s: Stage3DraftState): string[] {
  const out: string[] = [];
  if (s.multipleChoice) out.push("multiple_choice");
  if (s.trueFalse) out.push("true_false");
  if (s.fillBlanks) out.push("fill_in_the_blanks");
  if (s.shortAnswer) out.push("short_answer");
  return out;
}

async function persistToLibrary(
  get: () => Stage3Store,
  set: (
    partial:
      | Partial<Stage3DraftState>
      | ((s: Stage3DraftState) => Partial<Stage3DraftState>),
  ) => void,
): Promise<{ saved: boolean; saveError?: string }> {
  const s = get();
  const result = s.result;
  if (!hasUsableStage3Result(result) || !result) {
    return { saved: false, saveError: "No activity content to save." };
  }

  const { getFirebaseAuth } = await import("@/firebase/config");
  if (!getFirebaseAuth().currentUser) {
    return { saved: false, saveError: "Sign in to save to your library." };
  }

  const topic = effectiveTopic(s.topic);
  const grade = effectiveGrade(s.grade);
  const subject = effectiveSubject(s.subject, s.subjectName);
  const curriculumRoute = s.mappedCurriculumName ?? s.curriculumLabel;
  const bundleId = get().ensurePlanBundleId();
  const stage3Json = stage3JsonFromResult({
    ...result,
    activityFormat:
      result.activityFormat.trim() || activityFormatForKind(s.formativeKind),
  });
  const linkedId = s.linkedActivityLibraryItemId?.trim();

  set({ isSavingLibrary: true });
  try {
    if (!linkedId) {
      const saved = await addActivityFromStage3({
        topic,
        curriculumRoute,
        grade,
        subject,
        studentReviewBody: result.studentActivityText,
        teacherReviewBody: result.teacherAnswerKeyText,
        stage3Json,
        planBundleId: bundleId,
        activityLabel:
          FORMATIVE_KINDS.find((k) => k.id === s.formativeKind)?.label ??
          "Activity",
      });
      set({
        linkedActivityLibraryItemId: saved.id,
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

    await updateActivityFromStage3({
      id: linkedId,
      studentReviewBody: result.studentActivityText,
      teacherReviewBody: result.teacherAnswerKeyText,
      stage3Json,
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
      saveError: toUserMessage(e, "Failed to save activity."),
    };
  } finally {
    set({ isSavingLibrary: false });
  }
}

export const useStage3DraftStore = create<Stage3Store>((set, get) => ({
  ...initial,

  setSourceMode: (mode) =>
    set({
      sourceMode: mode,
      status: "",
      progress: 0,
      jobId: null,
      result: null,
      linkedActivityLibraryItemId: null,
      error: null,
    }),

  setFormativeKind: (kind) =>
    set({
      formativeKind: kind,
      questionCount: defaultFormativeQuestionCount(kind),
    }),

  setQuestionCount: (count) =>
    set({
      questionCount: clampFormativeQuestionCount(get().formativeKind, count),
    }),

  setQuestionType: (key, value) => set({ [key]: value }),

  setUploadedSource: ({ fileName, presentationText }) =>
    set({
      sourceMode: "upload",
      sourceLibraryItemId: null,
      sourceFileName: fileName,
      sourcePresentationText: presentationText,
      status: "",
      progress: 0,
      jobId: null,
      result: null,
      linkedActivityLibraryItemId: null,
      error: null,
    }),

  setLibrarySource: (params) => {
    const mappedFromRoute =
      params.mappedCurriculumId?.trim() ||
      findCurriculumIdFromName(params.curriculumRoute);
    const parsed = subjectFromDisplay(params.subject);
    set({
      sourceMode: "stage2Library",
      sourceLibraryItemId: params.libraryItemId.trim() || null,
      sourceFileName: null,
      sourcePresentationText: params.presentationText,
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
      duration: params.duration ?? get().duration,
      status: "",
      progress: 0,
      jobId: null,
      result: null,
      linkedActivityLibraryItemId: null,
      error: null,
    });
  },

  seedFromStage2Session: (params) => {
    const current = get();
    if (current.isGenerating) return;
    // Don't overwrite a library activity opened into Stage 3.
    if (current.linkedActivityLibraryItemId?.trim() && current.result) return;
    if (
      current.sourcePresentationText.trim().length >= STAGE3_MIN_SOURCE_CHARS &&
      current.sourceMode === "upload"
    ) {
      return;
    }
    if (!params.presentationText.trim()) return;
    if (
      current.sourcePresentationText.trim() ===
        params.presentationText.trim() &&
      current.result
    ) {
      return;
    }

    const mappedFromRoute =
      params.mappedCurriculumId?.trim() ||
      findCurriculumIdFromName(params.curriculumRoute);
    const parsed = subjectFromDisplay(params.subject);
    set({
      sourceMode: "stage2Library",
      sourceLibraryItemId: params.libraryItemId,
      sourceFileName: null,
      sourcePresentationText: params.presentationText,
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
      duration: params.duration,
    });
  },

  loadActivityFromLibrary: (item) => {
    const result = stage3ResultFromLibraryJson(
      item.stage3Json,
      item.reviewBody,
      item.teacherReviewBody ?? "",
    );
    const parsed = subjectFromDisplay(item.subject);
    const mappedId = findCurriculumIdFromName(item.curriculumRoute);
    const formativeKind = formativeKindFromStored(
      result?.activityFormat,
      item.activityOrAssessmentLabel,
    );
    const itemCount = result?.items.length ?? 0;
    const questionCount = clampFormativeQuestionCount(
      formativeKind,
      itemCount > 0 ? itemCount : defaultFormativeQuestionCount(formativeKind),
    );
    const typeFlags = questionTypeFlagsFromItems(result?.items ?? []);
    const sourceText =
      item.reviewBody?.trim() ||
      result?.studentActivityText?.trim() ||
      result?.activityTitle?.trim() ||
      item.topic;
    set({
      sourceMode: "stage2Library",
      sourcePresentationText: sourceText,
      topic: item.topic || result?.topic || "",
      grade: item.grade || result?.gradeLabel || "",
      subject: item.subject || result?.subject || "",
      subjectName: parsed.name || result?.subject || "",
      curriculumLabel: item.curriculumRoute || result?.curriculumLabel || "",
      mappedCurriculumName:
        item.curriculumRoute || result?.curriculumLabel || null,
      mappedCurriculumId: mappedId,
      formativeKind,
      questionCount,
      multipleChoice: typeFlags.multipleChoice,
      trueFalse: typeFlags.trueFalse,
      fillBlanks: typeFlags.fillBlanks,
      shortAnswer: typeFlags.shortAnswer,
      result,
      planBundleId: item.planBundleId?.trim() || get().planBundleId,
      linkedActivityLibraryItemId: item.id,
      status: result ? "completed" : "",
      progress: result ? 100 : 0,
      error: null,
      isGenerating: false,
      jobId: null,
    });
  },

  setStudentActivityText: (text) => {
    const result = get().result;
    if (!result) return;
    set({ result: { ...result, studentActivityText: text } });
  },

  setTeacherAnswerKeyText: (text) => {
    const result = get().result;
    if (!result) return;
    set({ result: { ...result, teacherAnswerKeyText: text } });
  },

  canGenerate: () => {
    const s = get();
    return (
      s.sourcePresentationText.trim().length >= STAGE3_MIN_SOURCE_CHARS &&
      selectedTypes(s).length > 0
    );
  },

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
      error: null,
      jobId: null,
      isGenerating: false,
      linkedActivityLibraryItemId: null,
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
      throw new Error(result.saveError || "Failed to save activity.");
    }
  },

  generate: async () => {
    const s = get();
    if (!get().canGenerate()) {
      if (selectedTypes(s).length === 0) {
        throw new Error("Please select at least one question type.");
      }
      throw new Error(
        `Source must contain at least ${STAGE3_MIN_SOURCE_CHARS} characters.`,
      );
    }

    const jobId = newStage3JobId();
    activeJobId = jobId;
    stopPolling();

    set({
      isGenerating: true,
      jobId,
      status: "generating",
      progress: 10,
      result: null,
      error: null,
      linkedActivityLibraryItemId: null,
    });

    let savedToLibrary = false;
    let saveError: string | undefined;
    let finalized = false;

    const tryFinalize = async (result: Stage3AssessmentResult) => {
      if (finalized || activeJobId !== jobId) return;
      if (!hasUsableStage3Result(result)) return;
      finalized = true;
      stopPolling();
      set({
        isGenerating: false,
        result,
        status: get().status || "completed",
        progress: Math.max(get().progress, 100),
      });
      const persist = await persistToLibrary(get, set);
      savedToLibrary = persist.saved;
      saveError = persist.saveError;
    };

    pollTimer = setInterval(() => {
      void (async () => {
        if (activeJobId !== jobId || finalized) return;
        try {
          const status = await getStage3GenerationStatus(jobId);
          if (activeJobId !== jobId || finalized) return;
          pollFailures = 0;
          const nextResult =
            hasUsableStage3Result(status.result) && status.result
              ? status.result
              : get().result;
          set({
            status: status.status,
            progress: status.progress,
            result: nextResult,
            isGenerating: !isStage3TerminalStatus(status.status),
            error: status.error || null,
          });
          if (isStage3TerminalStatus(status.status)) {
            if (
              isStage3SuccessfulTerminal(status.status) &&
              nextResult &&
              hasUsableStage3Result(nextResult)
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
              error: "Lost connection while checking generation status.",
            });
          }
        }
      })();
    }, 2000);

    const routeId = effectiveRouteId(s);
    try {
      const generated = await generateStage3Assessment(
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
          lessonDuration: parseDurationMinutes(s.duration),
          activityFormat: activityFormatForKind(s.formativeKind),
          selectedQuestionTypes: selectedTypes(s),
          numberOfItems: clampFormativeQuestionCount(
            s.formativeKind,
            s.questionCount,
          ),
          sourceMode:
            s.sourceMode === "stage2Library"
              ? "presentation_only"
              : "teacher_uploaded_context",
          sourceLessonPlanText: "",
          sourcePresentationText: s.sourcePresentationText.trim(),
          teacherUploadedContextText:
            s.sourceMode === "upload" ? s.sourcePresentationText.trim() : "",
          stage2LibraryItemId: s.sourceLibraryItemId,
        },
        jobId,
      );

      if (activeJobId !== jobId) return { savedToLibrary: false };

      // Flutter cancels poll when generate returns — adopt result immediately.
      stopPolling();
      const result = generated.result;
      set({
        isGenerating: false,
        jobId: generated.jobId || jobId,
        status: generated.status,
        progress: generated.progress || 100,
        result: hasUsableStage3Result(result) ? result : get().result,
        error: generated.error || null,
      });

      if (
        isStage3SuccessfulTerminal(generated.status) ||
        hasUsableStage3Result(result)
      ) {
        if (hasUsableStage3Result(result)) {
          await tryFinalize(result);
        }
      } else if (
        generated.status === "failed" ||
        generated.status === "error"
      ) {
        set({
          isGenerating: false,
          status: "failed",
          progress: 0,
          error: generated.error || "Generation failed.",
        });
      }
    } catch (e) {
      stopPolling();
      activeJobId = null;
      set({
        isGenerating: false,
        status: "failed",
        progress: 0,
        error: toUserMessage(e, "Generation failed."),
      });
      throw e;
    }

    return { savedToLibrary, saveError };
  },
}));
