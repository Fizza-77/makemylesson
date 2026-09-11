"use client";

import { create } from "zustand";

import {
  loadLessonPlanCurriculumPrefs,
  saveLessonPlanCurriculumPrefs,
} from "@/lib/lesson-plan-curriculum-prefs";
import { newPlanBundleId } from "@/lib/plan-bundle-id";
import { toUserMessage } from "@/lib/user-facing-error";
import { shouldSkipLibrarySave } from "@/lib/guest-session";
import {
  getTopLevelById,
  getPathway,
  normalizeStage1SelectionAgainstTree,
  resolveMappedCurriculum,
  resolveStage1SelectionFromLibrary,
} from "@/services/curriculum.service";
import {
  addLessonPlanFromStage1,
  updateLessonPlanBody,
} from "@/services/library-catalog.service";
import {
  generateStage1LessonPlan,
  getStage1GenerationStatus,
} from "@/services/stage1-ai.service";
import type { ClarificationAnswer } from "@/types/stage-clarification";
import {
  isSuccessfulTerminalStatus,
  isTerminalGenerationStatus,
  newStage1JobId,
  parseDurationMinutes,
  STAGE1_DEFAULT_DURATION,
  STAGE1_DEFAULT_METHOD,
  subjectFromDisplay,
  type LessonPlanSelection,
} from "@/types/stage1";

export type Stage1DraftState = {
  topLevelId: string;
  curriculumLabel: string;
  pathwayId: string;
  pathwayDisplayName: string;
  gradeInternalId: string;
  grade: string;
  subject: string;
  subjectName: string;
  subjectCode: string | null;
  topic: string;
  method: string;
  duration: string;
  mappedCurriculumId: string | null;
  mappedCurriculumName: string | null;
  generatedSummary: string;
  /** Correlates Stage 1–4 library rows (Flutter `planBundleId`). */
  planBundleId: string | null;
  /** Saved Stage 1 library item id for updates. */
  linkedLibraryItemId: string | null;
  isGenerating: boolean;
  isSavingLibrary: boolean;
  jobId: string | null;
  status: string;
  progress: number;
  phase: string;
  error: string | null;
};

type Stage1Store = Stage1DraftState & {
  hydrateFromPrefs: () => void;
  persistForm: () => void;
  setTopLevel: (id: string) => void;
  setPathway: (pathwayId: string) => void;
  setGrade: (gradeId: string) => void;
  setSubject: (displayName: string) => void;
  setTopic: (topic: string) => void;
  setMethod: (method: string) => void;
  setDuration: (duration: string) => void;
  recomputeMapping: () => void;
  canGenerate: () => boolean;
  hasUnsupportedMapping: () => boolean;
  generate: (
    clarificationAnswers?: ClarificationAnswer[],
  ) => Promise<{ savedToLibrary: boolean; saveError?: string }>;
  setGeneratedSummary: (content: string) => void;
  ensurePlanBundleId: () => string;
  saveCurrentPlanToLibrary: () => Promise<void>;
  /** Open a saved Stage 1 plan into the draft (edit / continue). */
  loadLessonPlanFromLibrary: (item: {
    id: string;
    topic: string;
    subject: string;
    grade: string;
    curriculumRoute: string;
    reviewBody: string;
    planBundleId?: string | null;
  }) => void;
  /** Prefill curriculum fields for regenerate (clears body; keeps bundle). */
  prefillFromLibraryItem: (item: {
    topic: string;
    subject: string;
    grade: string;
    curriculumRoute: string;
    planBundleId?: string | null;
  }) => void;
  resetResult: () => void;
};

const initial: Stage1DraftState = {
  topLevelId: "british",
  curriculumLabel: "British Curriculum",
  pathwayId: "",
  pathwayDisplayName: "",
  gradeInternalId: "",
  grade: "",
  subject: "",
  subjectName: "",
  subjectCode: null,
  topic: "",
  method: STAGE1_DEFAULT_METHOD,
  duration: STAGE1_DEFAULT_DURATION,
  mappedCurriculumId: null,
  mappedCurriculumName: null,
  generatedSummary: "",
  planBundleId: null,
  linkedLibraryItemId: null,
  isGenerating: false,
  isSavingLibrary: false,
  jobId: null,
  status: "",
  progress: 0,
  phase: "",
  error: null,
};

let pollTimer: ReturnType<typeof setInterval> | null = null;
let activeJobId: string | null = null;
let pollFailures = 0;
let persistTimer: ReturnType<typeof setTimeout> | null = null;

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  pollFailures = 0;
}

function persistSnapshot(s: Stage1DraftState) {
  saveLessonPlanCurriculumPrefs({
    topLevelId: s.topLevelId,
    pathwayId: s.pathwayId,
    pathwayDisplayName: s.pathwayDisplayName,
    gradeInternalId: s.gradeInternalId,
    gradeDisplayName: s.grade,
    subjectDisplayName: s.subject,
    subjectName: s.subjectName,
    subjectCode: s.subjectCode ?? "",
    topic: s.topic,
    method: s.method,
    duration: s.duration,
    curriculumLabel: s.curriculumLabel,
  });
}

function schedulePersist(get: () => Stage1DraftState) {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistSnapshot(get());
  }, 300);
}

function flushPersist(get: () => Stage1DraftState) {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  persistSnapshot(get());
}

async function finalizeStage1Plan(
  set: (
    partial:
      | Partial<Stage1DraftState>
      | ((state: Stage1DraftState) => Partial<Stage1DraftState>),
  ) => void,
  get: () => Stage1Store,
  content: string,
): Promise<{ savedToLibrary: boolean; saveError?: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { savedToLibrary: false };

  // End the generating UI as soon as the cloud function returns content.
  // Library save must not extend perceived generation time.
  set({
    generatedSummary: trimmed,
    progress: 100,
    status: "completed",
    phase: "completed",
    isGenerating: false,
    error: null,
  });

  let savedToLibrary = false;
  let saveError: string | undefined;
  if (shouldSkipLibrarySave()) {
    return { savedToLibrary, saveError };
  }
  try {
    await get().saveCurrentPlanToLibrary();
    savedToLibrary = Boolean(get().linkedLibraryItemId);
    if (!savedToLibrary) {
      saveError = "Library save skipped — check topic, grade, and subject.";
    }
  } catch (e) {
    saveError =
      toUserMessage(e, "Could not save lesson plan to library.");
    console.warn("[Stage1] library save failed", e);
  }

  return { savedToLibrary, saveError };
}

export const useStage1DraftStore = create<Stage1Store>((set, get) => ({
  ...initial,

  hydrateFromPrefs: () => {
    const snap = loadLessonPlanCurriculumPrefs();
    if (!snap) return;
    const normalized = normalizeStage1SelectionAgainstTree({
      topLevelId: snap.topLevelId || initial.topLevelId,
      pathwayId: snap.pathwayId,
      pathwayDisplayName: snap.pathwayDisplayName,
      gradeInternalId: snap.gradeInternalId,
      grade: snap.gradeDisplayName,
      subject: snap.subjectDisplayName,
      subjectName: snap.subjectName,
      subjectCode: snap.subjectCode || null,
    });
    const topLevelId = normalized.topLevelId || initial.topLevelId;
    const top = getTopLevelById(topLevelId);
    set({
      topLevelId,
      curriculumLabel: normalized.curriculumLabel || top?.name || initial.curriculumLabel,
      pathwayId: normalized.pathwayId,
      pathwayDisplayName: normalized.pathwayDisplayName,
      gradeInternalId: normalized.gradeInternalId,
      grade: normalized.grade,
      subject: normalized.subject,
      subjectName: normalized.subjectName,
      subjectCode: normalized.subjectCode,
      topic: snap.topic,
      method: snap.method || STAGE1_DEFAULT_METHOD,
      duration: snap.duration || STAGE1_DEFAULT_DURATION,
      mappedCurriculumId: normalized.mappedCurriculumId,
      mappedCurriculumName: normalized.mappedCurriculumName,
    });
  },

  persistForm: () => schedulePersist(get),

  setTopLevel: (id) => {
    const top = getTopLevelById(id);
    set({
      topLevelId: id,
      curriculumLabel: top?.name ?? id,
      pathwayId: "",
      pathwayDisplayName: "",
      gradeInternalId: "",
      grade: "",
      subject: "",
      subjectName: "",
      subjectCode: null,
      topic: "",
      mappedCurriculumId: null,
      mappedCurriculumName: null,
      planBundleId: null,
      linkedLibraryItemId: null,
    });
    schedulePersist(get);
  },

  setPathway: (pathwayId) => {
    const { topLevelId } = get();
    const pathway = getPathway(topLevelId, pathwayId);
    set({
      pathwayId,
      pathwayDisplayName: pathway?.name ?? "",
      gradeInternalId: "",
      grade: "",
      subject: "",
      subjectName: "",
      subjectCode: null,
      topic: "",
      mappedCurriculumId: null,
      mappedCurriculumName: null,
      planBundleId: null,
      linkedLibraryItemId: null,
    });
    schedulePersist(get);
  },

  setGrade: (gradeId) => {
    const { topLevelId, pathwayId } = get();
    const pathway = getPathway(topLevelId, pathwayId);
    const grade = pathway?.grades.find((g) => g.gradeId === gradeId);
    set({
      gradeInternalId: gradeId,
      grade: grade?.displayName ?? gradeId,
      subject: "",
      subjectName: "",
      subjectCode: null,
      topic: "",
      planBundleId: null,
      linkedLibraryItemId: null,
    });
    get().recomputeMapping();
    schedulePersist(get);
  },

  setSubject: (displayName) => {
    const parsed = subjectFromDisplay(displayName);
    set({
      subject: parsed.displayName,
      subjectName: parsed.name,
      subjectCode: parsed.code,
    });
    schedulePersist(get);
  },

  setTopic: (topic) => {
    set({ topic });
    schedulePersist(get);
  },

  setMethod: (method) => {
    set({ method });
    schedulePersist(get);
  },

  setDuration: (duration) => {
    set({ duration });
    schedulePersist(get);
  },

  recomputeMapping: () => {
    const { pathwayId, gradeInternalId } = get();
    if (!pathwayId || !gradeInternalId) {
      set({ mappedCurriculumId: null, mappedCurriculumName: null });
      return;
    }
    const mapped = resolveMappedCurriculum(pathwayId, gradeInternalId);
    set({
      mappedCurriculumId: mapped?.id ?? null,
      mappedCurriculumName: mapped?.name ?? null,
    });
  },

  canGenerate: () => {
    const s = get();
    return Boolean(
      s.pathwayId.trim() &&
        s.gradeInternalId.trim() &&
        s.subject.trim() &&
        s.topic.trim() &&
        s.mappedCurriculumId?.trim(),
    );
  },

  hasUnsupportedMapping: () => {
    const s = get();
    return Boolean(
      s.pathwayId && s.gradeInternalId && !s.mappedCurriculumId?.trim(),
    );
  },

  setGeneratedSummary: (content) => set({ generatedSummary: content }),

  loadLessonPlanFromLibrary: (item) => {
    const parsed = subjectFromDisplay(item.subject);
    const resolved = resolveStage1SelectionFromLibrary({
      curriculumRoute: item.curriculumRoute,
      grade: item.grade,
      subject: item.subject,
    });
    const subjectDisplay = resolved?.subject || item.subject;
    const subjectParsed = subjectFromDisplay(subjectDisplay);
    set({
      topic: item.topic,
      subject: subjectDisplay,
      subjectName: subjectParsed.name,
      subjectCode: subjectParsed.code ?? parsed.code,
      grade: resolved?.grade || item.grade,
      gradeInternalId: resolved?.gradeInternalId || get().gradeInternalId,
      topLevelId: resolved?.topLevelId || get().topLevelId,
      curriculumLabel:
        resolved?.curriculumLabel ||
        item.curriculumRoute ||
        get().curriculumLabel,
      pathwayId: resolved?.pathwayId || get().pathwayId,
      pathwayDisplayName:
        resolved?.pathwayDisplayName || get().pathwayDisplayName,
      mappedCurriculumId:
        resolved?.mappedCurriculumId ?? get().mappedCurriculumId,
      mappedCurriculumName:
        resolved?.mappedCurriculumName ||
        item.curriculumRoute ||
        get().mappedCurriculumName,
      generatedSummary: item.reviewBody,
      linkedLibraryItemId: item.id,
      planBundleId: item.planBundleId?.trim() || get().planBundleId,
      status: "completed",
      progress: 100,
      phase: "completed",
      error: null,
    });
    if (resolved) get().recomputeMapping();
    flushPersist(get);
  },

  prefillFromLibraryItem: (item) => {
    const parsed = subjectFromDisplay(item.subject);
    const resolved = resolveStage1SelectionFromLibrary({
      curriculumRoute: item.curriculumRoute,
      grade: item.grade,
      subject: item.subject,
    });
    const subjectDisplay = resolved?.subject || item.subject;
    const subjectParsed = subjectFromDisplay(subjectDisplay);
    set({
      topic: item.topic,
      subject: subjectDisplay,
      subjectName: subjectParsed.name,
      subjectCode: subjectParsed.code ?? parsed.code,
      grade: resolved?.grade || item.grade,
      gradeInternalId: resolved?.gradeInternalId || "",
      topLevelId: resolved?.topLevelId || get().topLevelId,
      curriculumLabel:
        resolved?.curriculumLabel ||
        item.curriculumRoute ||
        get().curriculumLabel,
      pathwayId: resolved?.pathwayId || "",
      pathwayDisplayName: resolved?.pathwayDisplayName || "",
      mappedCurriculumId: resolved?.mappedCurriculumId ?? null,
      mappedCurriculumName:
        resolved?.mappedCurriculumName || item.curriculumRoute || null,
      generatedSummary: "",
      linkedLibraryItemId: null,
      planBundleId: item.planBundleId?.trim() || get().planBundleId,
      status: "",
      progress: 0,
      phase: "",
      error: null,
      jobId: null,
    });
    if (resolved) get().recomputeMapping();
    flushPersist(get);
  },

  ensurePlanBundleId: () => {
    const existing = get().planBundleId?.trim() ?? "";
    if (existing) return existing;
    const id = newPlanBundleId();
    set({ planBundleId: id });
    return id;
  },

  saveCurrentPlanToLibrary: async () => {
    const s = get();
    const body = s.generatedSummary.trim();
    if (!body) {
      throw new Error("No lesson plan content to save.");
    }
    const topic = s.topic.trim();
    if (!topic || !s.grade.trim() || !s.subject.trim()) {
      throw new Error(
        "Topic, grade, and subject are required to save to the library.",
      );
    }

    const { getFirebaseAuth } = await import("@/lib/firebase/config");
    if (shouldSkipLibrarySave()) {
      throw new Error("Sign in to save to your library.");
    }
    if (!getFirebaseAuth().currentUser) {
      throw new Error("Sign in to save to your library.");
    }

    const curriculumRoute = s.mappedCurriculumName ?? s.curriculumLabel;
    const bundleId = get().ensurePlanBundleId();
    const linkedId = s.linkedLibraryItemId?.trim();

    set({ isSavingLibrary: true });
    try {
      if (!linkedId) {
        const saved = await addLessonPlanFromStage1({
          topic,
          curriculumRoute,
          grade: s.grade,
          subject: s.subject,
          reviewBody: body,
          planBundleId: bundleId,
        });
        set({
          linkedLibraryItemId: saved.id,
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
        return;
      }
      await updateLessonPlanBody({
        id: linkedId,
        reviewBody: body,
        topic,
        curriculumRoute,
        grade: s.grade,
        subject: s.subject,
        planBundleId: bundleId,
      });
      const uid = getFirebaseAuth().currentUser?.uid;
      if (uid) {
        const { syncLibraryCatalogSubscription } = await import(
          "@/store/library-catalog-store"
        );
        syncLibraryCatalogSubscription(uid, { force: true });
      }
    } finally {
      set({ isSavingLibrary: false });
    }
  },

  resetResult: () =>
    set({
      generatedSummary: "",
      status: "",
      progress: 0,
      phase: "",
      error: null,
      jobId: null,
      // Keep planBundleId + linkedLibraryItemId so regenerate updates same journey.
    }),

  generate: async (clarificationAnswers = []) => {
    const s = get();
    if (!get().canGenerate() || !s.mappedCurriculumId) {
      throw new Error(
        "Choose curriculum, program, grade, subject, and topic.",
      );
    }
    if (get().hasUnsupportedMapping()) {
      throw new Error("This combination is not supported");
    }

    const selection: LessonPlanSelection = {
      topLevelId: s.topLevelId,
      pathwayId: s.pathwayId,
      gradeId: s.gradeInternalId,
      gradeDisplayName: s.grade,
      subjectDisplayName: s.subject,
      subjectName: s.subjectName || subjectFromDisplay(s.subject).name,
      subjectCode: s.subjectCode,
      curriculumId: s.mappedCurriculumId,
      curriculumName: s.mappedCurriculumName ?? "",
      topic: s.topic.trim(),
      method: s.method,
      durationMinutes: parseDurationMinutes(s.duration),
    };

    const jobId = newStage1JobId();
    activeJobId = jobId;
    stopPolling();
    set({
      isGenerating: true,
      jobId,
      status: "generating",
      progress: 5,
      phase: "preparing",
      generatedSummary: "",
      error: null,
    });

    let finalized = false;
    let finalizeResult: { savedToLibrary: boolean; saveError?: string } = {
      savedToLibrary: false,
    };
    const tryFinalize = async (content: string) => {
      if (finalized || activeJobId !== jobId) return;
      if (!content.trim()) return;
      finalized = true;
      stopPolling();
      finalizeResult = await finalizeStage1Plan(set, get, content);
    };

    pollTimer = setInterval(() => {
      void (async () => {
        if (activeJobId !== jobId || finalized) return;
        try {
          const status = await getStage1GenerationStatus(jobId);
          if (activeJobId !== jobId || finalized) return;
          pollFailures = 0;
          const content = status.content || get().generatedSummary;
          const phase = status.phase.trim() || get().phase;

          if (isTerminalGenerationStatus(status.status)) {
            if (isSuccessfulTerminalStatus(status.status)) {
              if (!content.trim()) {
                set({
                  status: status.status,
                  progress: Math.min(status.progress, 99),
                  phase,
                  isGenerating: true,
                });
                return;
              }
              await tryFinalize(content);
              return;
            }
            if (status.status === "failed") {
              stopPolling();
              set({
                isGenerating: false,
                status: "failed",
                progress: 0,
                phase: "failed",
                error: status.error || "Generation failed.",
              });
            }
            return;
          }

          set({
            status: status.status,
            progress: Math.min(status.progress, 98),
            phase,
            generatedSummary: content,
            isGenerating: true,
          });
        } catch {
          pollFailures += 1;
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

    try {
      const content = await generateStage1LessonPlan(
        selection,
        jobId,
        clarificationAnswers,
      );
      if (activeJobId !== jobId) return finalizeResult;
      await tryFinalize(content);
      return finalizeResult;
    } catch (e) {
      stopPolling();
      if (activeJobId !== jobId || finalized) return finalizeResult;
      const message = toUserMessage(e, "Could not generate lesson plan.");
      set({
        isGenerating: false,
        status: "failed",
        progress: 0,
        phase: "failed",
        error: message,
      });
      throw e;
    }
  },
}));


