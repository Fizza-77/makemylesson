"use client";

import { create } from "zustand";

import {
  fallbackStage2RouteId,
  mapStage2RouteId,
} from "@/data/stage2-route-map";
import { stage2ThemeById } from "@/data/stage2-themes";
import { newPlanBundleId } from "@/lib/plan-bundle-id";
import { toUserMessage } from "@/lib/user-facing-error";
import { shouldSkipLibrarySave } from "@/lib/guest-session";
import {
  findCurriculumIdFromName,
} from "@/services/curriculum.service";
import {
  addPresentationFromStage2,
  updatePresentationBody,
  updatePresentationStyle,
} from "@/services/library-catalog.service";
import {
  generateStage2Presentation,
  getStage2GenerationStatus,
  retryStage2Image,
  startStage2ImageJobs,
} from "@/services/stage2-ai.service";
import { hydrateSlidesForLibrary } from "@/services/stage2-slide-storage.service";
import type { ClarificationAnswer } from "@/types/stage-clarification";
import {
  coerceStage2SlidesAfterTerminal,
  isStage2DeckReadyForSave,
  isStage2SuccessfulTerminal,
  isStage2TerminalStatus,
  newStage2JobId,
  slidesJsonForLibrary,
  slidesToReviewBody,
  slidesToSpeakerNotes,
  snapStage2LessonDuration,
  snapStage2SlideCount,
  STAGE2_DEFAULT_SLIDE_COUNT,
  STAGE2_DEFAULT_THEME_ID,
  STAGE2_MIN_SOURCE_CHARS,
  stage2SlideCountForDurationMinutes,
  stage2SlideFromJson,
  type Stage2Slide,
  type Stage2SourceMode,
} from "@/types/stage2";
import {
  parseDurationMinutes,
  STAGE1_DEFAULT_DURATION,
  STAGE1_DEFAULT_METHOD,
  subjectFromDisplay,
} from "@/types/stage1";

export type Stage2DraftState = {
  sourceMode: Stage2SourceMode;
  sourceLibraryItemId: string | null;
  sourceFileName: string | null;
  sourceLessonText: string;
  themeId: string;
  /** Target slide count for generation UI (5/7/9/11/13 — Flutter parity). */
  slideCount: number;
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
  linkedPresentationLibraryItemId: string | null;
  slides: Stage2Slide[];
  presentationTitle: string;
  isGenerating: boolean;
  isSavingLibrary: boolean;
  jobId: string | null;
  status: string;
  progress: number;
  error: string | null;
  /** Slide index currently shown in the viewer (0-based). */
  activeSlideIndex: number;
};

type Stage2Store = Stage2DraftState & {
  setSourceMode: (mode: Stage2SourceMode) => void;
  setThemeId: (themeId: string) => void;
  setSlideCount: (n: number) => void;
  setUploadedSource: (params: { fileName: string; lessonText: string }) => void;
  clearUploadedSource: () => void;
  setUploadText: (text: string) => void;
  setLibrarySource: (params: {
    libraryItemId: string;
    lessonText: string;
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
  /** Seed from in-session Stage 1 draft when available. */
  seedFromStage1Session: (params: {
    libraryItemId: string | null;
    lessonText: string;
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
  loadPresentationFromLibrary: (item: {
    id: string;
    topic: string;
    subject: string;
    grade: string;
    curriculumRoute: string;
    reviewBody: string;
    speakerNotes?: string | null;
    presentationSlidesJson?: Record<string, unknown>[] | null;
    presentationStyle?: string | null;
    planBundleId?: string | null;
    stage2JobId?: string | null;
  }) => Promise<void>;
  setActiveSlideIndex: (index: number) => void;
  setPresentationTitle: (title: string) => void;
  updateSlide: (index: number, patch: Partial<Stage2Slide>) => void;
  canGenerate: () => boolean;
  hasUsableDeck: () => boolean;
  ensurePlanBundleId: () => string;
  generate: (
    clarificationAnswers?: ClarificationAnswer[],
  ) => Promise<{ savedToLibrary: boolean; saveError?: string }>;
  retryImage: (slideNumber: number) => Promise<void>;
  saveCurrentDeckToLibrary: () => Promise<void>;
  resetResult: () => void;
};

const initial: Stage2DraftState = {
  sourceMode: "stage1Library",
  sourceLibraryItemId: null,
  sourceFileName: null,
  sourceLessonText: "",
  themeId: STAGE2_DEFAULT_THEME_ID,
  slideCount: STAGE2_DEFAULT_SLIDE_COUNT,
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
  linkedPresentationLibraryItemId: null,
  slides: [],
  presentationTitle: "",
  isGenerating: false,
  isSavingLibrary: false,
  jobId: null,
  status: "",
  progress: 0,
  error: null,
  activeSlideIndex: 0,
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

function effectiveRouteId(s: Stage2DraftState): string {
  const mapped = s.mappedCurriculumId?.trim();
  if (mapped) return mapStage2RouteId(mapped);
  const pathway = s.pathwayId.trim();
  if (pathway) return pathway;
  return fallbackStage2RouteId(s.topLevelId);
}

function effectiveGrade(grade: string): string {
  const t = grade.trim();
  return t || "Not specified";
}

function effectiveTopic(topic: string): string {
  const t = topic.trim();
  return t || "From uploaded lesson materials";
}

function effectiveSubject(subject: string, subjectName: string): string {
  const pick = subjectName.trim() || subject.trim();
  return pick || "General";
}

function effectiveFamily(topLevelId: string): string {
  const t = topLevelId.trim();
  return t || "british";
}

/**
 * The theme is deck-level metadata that library exports and previews read from
 * the saved item, so a linked deck has to persist it right away. Otherwise a
 * theme picked after loading from the library only lives in this store and
 * exports keep using the previously saved style.
 */
async function syncThemeToLibrary(itemId: string, themeId: string) {
  try {
    const { getFirebaseAuth } = await import("@/firebase/config");
    if (!getFirebaseAuth().currentUser) return;
    await updatePresentationStyle({ id: itemId, presentationStyle: themeId });
    const { useLibraryCatalogStore } = await import(
      "@/store/library-catalog-store"
    );
    const catalog = useLibraryCatalogStore.getState();
    catalog.setItems(
      catalog.items.map((i) =>
        i.id === itemId ? { ...i, presentationStyle: themeId } : i,
      ),
    );
  } catch (e) {
    console.warn("[Stage2] theme sync to library failed", e);
  }
}

async function persistDeckToLibrary(
  get: () => Stage2Store,
  set: (
    partial:
      | Partial<Stage2DraftState>
      | ((s: Stage2DraftState) => Partial<Stage2DraftState>),
  ) => void,
): Promise<{ saved: boolean; saveError?: string }> {
  const s = get();
  if (!isStage2DeckReadyForSave(s.slides)) {
    return {
      saved: false,
      saveError:
        "Generated output is incomplete. Please regenerate to get full slides and rich speaker notes.",
    };
  }

  const { getFirebaseAuth } = await import("@/firebase/config");
  if (shouldSkipLibrarySave()) {
    return { saved: false };
  }
  if (!getFirebaseAuth().currentUser) {
    return { saved: false, saveError: "Sign in to save to your library." };
  }

  const topic =
    s.presentationTitle.trim() || effectiveTopic(s.topic);
  const grade = effectiveGrade(s.grade);
  const subject = effectiveSubject(s.subject, s.subjectName);
  const curriculumRoute = s.mappedCurriculumName ?? s.curriculumLabel;
  const bundleId = get().ensurePlanBundleId();
  const slidesJson = slidesJsonForLibrary(s.slides);
  const reviewBody = slidesToReviewBody(s.slides);
  const speakerNotes = slidesToSpeakerNotes(s.slides);
  const linkedId = s.linkedPresentationLibraryItemId?.trim();

  set({ isSavingLibrary: true });
  try {
    if (!linkedId) {
      const saved = await addPresentationFromStage2({
        topic,
        curriculumRoute,
        grade,
        subject,
        reviewBody,
        speakerNotes,
        presentationSlidesJson: slidesJson,
        presentationStyle: s.themeId,
        planBundleId: bundleId,
        stage2JobId: s.jobId,
      });
      set({
        linkedPresentationLibraryItemId: saved.id,
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

    await updatePresentationBody({
      id: linkedId,
      reviewBody,
      speakerNotes,
      presentationSlidesJson: slidesJson,
      topic,
      curriculumRoute,
      grade,
      subject,
      presentationStyle: s.themeId,
      stage2JobId: s.jobId,
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
      saveError: toUserMessage(e, "Failed to save presentation."),
    };
  } finally {
    set({ isSavingLibrary: false });
  }
}

export const useStage2DraftStore = create<Stage2Store>((set, get) => ({
  ...initial,

  setSourceMode: (mode) =>
    set({
      sourceMode: mode,
      status: "",
      progress: 0,
      jobId: null,
      error: null,
    }),

  setThemeId: (themeId) => {
    const resolved = stage2ThemeById(themeId).id;
    if (resolved === get().themeId) return;
    set({ themeId: resolved });
    const linkedId = get().linkedPresentationLibraryItemId?.trim();
    if (linkedId) void syncThemeToLibrary(linkedId, resolved);
  },

  setSlideCount: (n) => {
    set({ slideCount: snapStage2SlideCount(n) });
  },

  setUploadedSource: ({ fileName, lessonText }) =>
    set({
      sourceMode: "upload",
      sourceLibraryItemId: null,
      sourceFileName: fileName,
      sourceLessonText: lessonText,
      status: "",
      progress: 0,
      jobId: null,
      slides: [],
      presentationTitle: "",
      linkedPresentationLibraryItemId: null,
      error: null,
      activeSlideIndex: 0,
    }),

  clearUploadedSource: () =>
    set({
      sourceFileName: null,
      sourceLessonText: "",
      sourceLibraryItemId: null,
    }),

  setUploadText: (text) =>
    set({
      sourceMode: "upload",
      sourceLessonText: text,
      sourceLibraryItemId: null,
    }),

  setLibrarySource: (params) => {
    const mappedFromRoute =
      params.mappedCurriculumId?.trim() ||
      findCurriculumIdFromName(params.curriculumRoute);
    const parsed = subjectFromDisplay(params.subject);
    const libId = params.libraryItemId.trim() || null;
    set({
      sourceMode: "stage1Library",
      sourceLibraryItemId: libId,
      sourceFileName: null,
      sourceLessonText: params.lessonText,
      topic: params.topic,
      grade: params.grade,
      subject: params.subject,
      subjectName: parsed.name,
      mappedCurriculumId: mappedFromRoute,
      mappedCurriculumName: params.curriculumRoute || null,
      curriculumLabel: params.curriculumRoute || get().curriculumLabel,
      planBundleId:
        params.planBundleId?.trim() || get().planBundleId,
      topLevelId: params.topLevelId ?? get().topLevelId,
      pathwayId: params.pathwayId ?? get().pathwayId,
      pathwayDisplayName:
        params.pathwayDisplayName ?? get().pathwayDisplayName,
      method: params.method ?? get().method,
      duration: params.duration ?? get().duration,
      slideCount: snapStage2SlideCount(
        stage2SlideCountForDurationMinutes(
          parseDurationMinutes(params.duration ?? get().duration),
        ),
      ),
      status: "",
      progress: 0,
      jobId: null,
      slides: [],
      presentationTitle: "",
      linkedPresentationLibraryItemId: null,
      error: null,
      activeSlideIndex: 0,
    });
  },

  seedFromStage1Session: (params) => {
    const current = get();
    // Don't overwrite an in-progress generate or an already-chosen richer source.
    if (current.isGenerating) return;
    if (
      current.slides.length > 0 &&
      current.sourceLessonText.trim() === params.lessonText.trim()
    ) {
      return;
    }
    if (
      current.sourceLessonText.trim().length >= STAGE2_MIN_SOURCE_CHARS &&
      current.sourceMode === "upload"
    ) {
      return;
    }
    if (!params.lessonText.trim()) return;

    const mappedFromRoute =
      params.mappedCurriculumId?.trim() ||
      findCurriculumIdFromName(params.curriculumRoute);
    const parsed = subjectFromDisplay(params.subject);
    set({
      sourceMode: "stage1Library",
      sourceLibraryItemId: params.libraryItemId,
      sourceFileName: null,
      sourceLessonText: params.lessonText,
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
      slideCount: snapStage2SlideCount(
        stage2SlideCountForDurationMinutes(
          parseDurationMinutes(params.duration),
        ),
      ),
    });
  },

  loadPresentationFromLibrary: async (item) => {
    const jobId = item.stage2JobId?.trim() || "";
    const rawSlides = (item.presentationSlidesJson ?? [])
      .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
      .map((e) => {
        const slide = stage2SlideFromJson(e);
        // Flutter `slidesFromPresentationLibraryItem` parity.
        if (jobId && !slide.imageAssetId.trim()) {
          return {
            ...slide,
            imageAssetId: `${jobId}_slide_${slide.slideNumber}`,
          };
        }
        if (slide.imageUrl.trim()) {
          return { ...slide, imageStatus: "success", imageError: "" };
        }
        return slide;
      });
    let slides = rawSlides;
    try {
      slides = await hydrateSlidesForLibrary(rawSlides, jobId || null);
    } catch {
      slides = rawSlides;
    }
    const parsed = subjectFromDisplay(item.subject);
    const mappedId = findCurriculumIdFromName(item.curriculumRoute);
    const themeId = stage2ThemeById(item.presentationStyle).id;
    const slideCount = snapStage2SlideCount(
      slides.length || get().slideCount,
    );
    set({
      sourceMode: "stage1Library",
      sourceLessonText:
        item.reviewBody?.trim() ||
        slidesToReviewBody(slides) ||
        get().sourceLessonText,
      topic: item.topic,
      grade: item.grade,
      subject: item.subject,
      subjectName: parsed.name,
      curriculumLabel: item.curriculumRoute,
      mappedCurriculumName: item.curriculumRoute,
      mappedCurriculumId: mappedId,
      themeId,
      slideCount,
      slides,
      presentationTitle: item.topic,
      planBundleId: item.planBundleId?.trim() || get().planBundleId,
      linkedPresentationLibraryItemId: item.id,
      jobId: jobId || null,
      status: slides.length ? "completed" : "",
      progress: slides.length ? 100 : 0,
      error: null,
      activeSlideIndex: 0,
      isGenerating: false,
    });
  },

  setActiveSlideIndex: (index) => set({ activeSlideIndex: index }),

  setPresentationTitle: (title) =>
    set({ presentationTitle: title.trim() }),

  updateSlide: (index, patch) => {
    const slides = [...get().slides];
    const current = slides[index];
    if (!current) return;
    slides[index] = { ...current, ...patch };
    set({ slides });
  },

  canGenerate: () => {
    const s = get();
    return s.sourceLessonText.trim().length >= STAGE2_MIN_SOURCE_CHARS;
  },

  hasUsableDeck: () => isStage2DeckReadyForSave(get().slides),

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
      slides: [],
      presentationTitle: "",
      status: "",
      progress: 0,
      error: null,
      jobId: null,
      isGenerating: false,
      linkedPresentationLibraryItemId: null,
      activeSlideIndex: 0,
    });
  },

  saveCurrentDeckToLibrary: async () => {
    const result = await persistDeckToLibrary(get, set);
    if (!result.saved) {
      throw new Error(result.saveError || "Failed to save presentation.");
    }
  },

  retryImage: async (slideNumber) => {
    const jobId = get().jobId?.trim();
    if (!jobId) throw new Error("No Stage 2 job to retry.");
    await retryStage2Image({ jobId, slideNumber });
    const status = await getStage2GenerationStatus(jobId);
    const slides = coerceStage2SlidesAfterTerminal(
      status.result.slides.length ? status.result.slides : get().slides,
      status.status,
    );
    set({
      slides,
      status: status.status,
      progress: status.progress,
      presentationTitle:
        status.result.presentationTitle || get().presentationTitle,
    });
  },

  generate: async (clarificationAnswers = []) => {
    const s = get();
    if (!get().canGenerate()) {
      throw new Error(
        `Lesson source must contain at least ${STAGE2_MIN_SOURCE_CHARS} characters.`,
      );
    }

    const jobId = newStage2JobId();
    activeJobId = jobId;
    stopPolling();

    set({
      isGenerating: true,
      jobId,
      status: "generating_text",
      progress: 5,
      slides: [],
      presentationTitle: "",
      error: null,
      linkedPresentationLibraryItemId: null,
      activeSlideIndex: 0,
    });

    let savedToLibrary = false;
    let saveError: string | undefined;
    let finalized = false;

    const tryFinalize = async () => {
      if (finalized || activeJobId !== jobId) return;
      const deck = get().slides;
      if (!deck.length) return;
      if (!isStage2SuccessfulTerminal(get().status)) return;
      finalized = true;
      stopPolling();
      set({ isGenerating: false });
      const result = await persistDeckToLibrary(get, set);
      savedToLibrary = result.saved;
      saveError = result.saveError;
    };

    pollTimer = setInterval(() => {
      void (async () => {
        if (activeJobId !== jobId || finalized) return;
        try {
          const status = await getStage2GenerationStatus(jobId);
          if (activeJobId !== jobId || finalized) return;
          pollFailures = 0;
          const rawSlides =
            status.result.slides.length > 0
              ? status.result.slides
              : get().slides;
          const slides = coerceStage2SlidesAfterTerminal(
            rawSlides,
            status.status,
          );
          set({
            status: status.status,
            progress: status.progress,
            slides,
            presentationTitle:
              status.result.presentationTitle || get().presentationTitle,
            isGenerating: !isStage2TerminalStatus(status.status),
            error: status.error || null,
          });
          if (isStage2TerminalStatus(status.status)) {
            if (isStage2SuccessfulTerminal(status.status) && slides.length) {
              await tryFinalize();
            } else if (status.status === "failed") {
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

    try {
      const generated = await generateStage2Presentation(
        {
          curriculumFamily: effectiveFamily(s.topLevelId),
          routeId: effectiveRouteId(s),
          pathwayProgram: s.pathwayDisplayName || null,
          stateOrProvince: null,
          gradeOrYear: effectiveGrade(s.grade),
          subject: effectiveSubject(s.subject, s.subjectName),
          topic: effectiveTopic(s.topic),
          teachingMethod: s.method,
          lessonDuration: snapStage2LessonDuration(
            parseDurationMinutes(s.duration),
          ),
          slideCount: snapStage2SlideCount(s.slideCount),
          presentationStyle: s.themeId,
          sourceType:
            s.sourceMode === "stage1Library"
              ? "generated_lesson_plan"
              : "teacher_uploaded_lesson_plan",
          sourceLessonText: s.sourceLessonText.trim(),
          stage1LibraryItemId: s.sourceLibraryItemId,
        },
        jobId,
        clarificationAnswers,
      );

      if (activeJobId !== jobId) return { savedToLibrary: false };

      set({
        isGenerating: !isStage2TerminalStatus(generated.status),
        jobId: generated.jobId || jobId,
        status: generated.status,
        progress: generated.progress,
        slides: generated.result.slides.length
          ? generated.result.slides
          : get().slides,
        presentationTitle: generated.result.presentationTitle,
        error: generated.error || null,
      });

      void startStage2ImageJobs(generated.jobId || jobId).catch(() => {
        // Polling keeps UI live if kickoff times out (Flutter parity).
      });

      if (
        isStage2TerminalStatus(generated.status) &&
        isStage2SuccessfulTerminal(generated.status) &&
        get().slides.length
      ) {
        await tryFinalize();
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

    // Wait briefly for poll to finish if still generating.
    if (get().isGenerating) {
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (!get().isGenerating || activeJobId !== jobId) {
            clearInterval(check);
            resolve();
          }
        }, 500);
        setTimeout(() => {
          clearInterval(check);
          resolve();
        }, 6 * 60 * 1000);
      });
    }

    return { savedToLibrary, saveError };
  },
}));


