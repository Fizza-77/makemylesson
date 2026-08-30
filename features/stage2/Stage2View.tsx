"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Stage2Hero } from "@/components/common/Stage2Hero";
import { StageProgressNav } from "@/components/common/StageProgressNav";
import { GenerationBusyOverlay } from "@/components/common/GenerationBusyOverlay";
import { GenerationSuccessOverlay } from "@/components/common/GenerationSuccessOverlay";
import { GuestSaveToLibraryPrompt } from "@/components/common/GuestSaveToLibraryPrompt";
import { StageWorkspace } from "@/components/common/StageWorkspace";
import { useGuestGeneration } from "@/features/generation/useGuestGeneration";
import { useGenerationConfirm } from "@/features/generation/useGenerationConfirm";
import { Stage2PresentationSetup } from "@/features/stage2/Stage2PresentationSetup";
import { PresentationResultPanel } from "@/features/stage2/PresentationResultPanel";
import { Stage2SlideEditDialog } from "@/features/stage2/Stage2SlideEditDialog";
import { mapFunctionsError } from "@/lib/auth-errors";
import { sortActionsByExportPreference } from "@/lib/export-format-prefs";
import { ROUTES } from "@/lib/urls";
import { notifyStage2GenerationComplete } from "@/lib/guest-generation-notify";
import { STAGE2_MIN_SOURCE_CHARS } from "@/types/stage2";
import {
  recordStageGenerated,
} from "@/services/notification-lifecycle.service";
import {
  syncAccountSubscription,
  useAccountStore,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import {
  syncLibraryCatalogSubscription,
  useLibraryCatalogStore,
} from "@/store/library-catalog-store";
import { useStage1DraftStore } from "@/store/stage1-draft-store";
import { useStage2DraftStore } from "@/store/stage2-draft-store";
import { toast } from "@/store/toast-store";
import {
  runStage2DownloadAction,
  shareStage2Zip,
  STAGE2_DOWNLOAD_ACTIONS,
  type Stage2DownloadActionId,
  type Stage2ExportInput,
} from "@/services/stage2-export.service";
import { resolveExportPersonalization } from "@/services/export-personalization.service";
import { pickAndParseStageSource } from "@/services/stage-source-parser.service";

export function Stage2View() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const account = useAccountStore((s) => s.account);
  const {
    isGuest,
    prepareGeneration,
    consumeTrialCreditBeforeGenerate,
    completeGeneration,
    requireSignInToSaveLibrary,
    signInDialog,
    upgradeDialog,
  } = useGuestGeneration(ROUTES.stage2, 2);
  const { confirmGeneration, dialog: confirmDialog } = useGenerationConfirm();

  const libraryItems = useLibraryCatalogStore((s) => s.items);
  const lessonPlans = useMemo(
    () => libraryItems.filter((i) => i.kind === "lessonPlan"),
    [libraryItems],
  );

  const stage1 = useStage1DraftStore();
  const draft = useStage2DraftStore();

  const [editOpen, setEditOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [successFlash, setSuccessFlash] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [libraryDirty, setLibraryDirty] = useState(false);
  /** Display index including Cover as 0 (Flutter parity). */
  const [displayIndex, setDisplayIndex] = useState(0);
  const slidesBaselineRef = useRef("");

  const hasDeck = draft.slides.length > 0;
  const displayCount = hasDeck ? draft.slides.length + 1 : 0;
  const isCoverSelected = hasDeck && displayIndex === 0;
  const contentIndex = isCoverSelected ? 0 : Math.max(0, displayIndex - 1);
  const activeSlide = isCoverSelected
    ? null
    : (draft.slides[contentIndex] ?? null);
  const displaySlides = draft.slides;
  const isGenerating = draft.isGenerating;
  const sourceLen = draft.sourceLessonText.trim().length;

  const coverData = useMemo(
    () => ({
      topic: draft.presentationTitle || draft.topic || "Presentation",
      grade: draft.grade || "",
      subject: draft.subjectName || draft.subject || "",
      curriculum:
        draft.mappedCurriculumName || draft.curriculumLabel || "",
      schoolName:
        account?.useSchoolNameInAi && account.schoolName?.trim()
          ? account.schoolName.trim()
          : null,
      teacherName: account?.displayName?.trim() || null,
      schoolLogoUrl:
        account?.useSchoolLogoInAi && account.schoolLogoUrl?.trim()
          ? account.schoolLogoUrl.trim()
          : null,
      ownPictureUrl:
        account?.useOwnPicInAi && account.profilePhotoUrl?.trim()
          ? account.profilePhotoUrl.trim()
          : null,
    }),
    [
      account?.displayName,
      account?.profilePhotoUrl,
      account?.schoolLogoUrl,
      account?.schoolName,
      account?.useOwnPicInAi,
      account?.useSchoolLogoInAi,
      account?.useSchoolNameInAi,
      draft.curriculumLabel,
      draft.grade,
      draft.mappedCurriculumName,
      draft.presentationTitle,
      draft.subject,
      draft.subjectName,
      draft.topic,
    ],
  );

  const slidesFingerprint = useMemo(
    () => JSON.stringify(draft.slides),
    [draft.slides],
  );

  const linkedPresentationId = draft.linkedPresentationLibraryItemId;
  const prevLinkedPresentationId = useRef(linkedPresentationId);

  useEffect(() => {
    if (!hasDeck) {
      setDisplayIndex(0);
      return;
    }
    setDisplayIndex((i) => Math.min(Math.max(0, i), displayCount - 1));
  }, [displayCount, hasDeck, slidesFingerprint]);

  useEffect(() => {
    if (prevLinkedPresentationId.current !== linkedPresentationId) {
      prevLinkedPresentationId.current = linkedPresentationId;
      slidesBaselineRef.current = slidesFingerprint;
      setLibraryDirty(false);
      setDisplayIndex(0);
      return;
    }
    if (!linkedPresentationId) {
      setLibraryDirty(false);
      return;
    }
    if (!slidesBaselineRef.current) {
      slidesBaselineRef.current = slidesFingerprint;
      setLibraryDirty(false);
      return;
    }
    setLibraryDirty(slidesFingerprint !== slidesBaselineRef.current);
  }, [slidesFingerprint, linkedPresentationId]);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscription(user?.uid ?? null);
    if (user?.uid) syncLibraryCatalogSubscription(user.uid);
  }, [authReady, user?.uid]);

  useEffect(() => {
    const text = stage1.generatedSummary.trim();
    if (!text) return;
    draft.seedFromStage1Session({
      libraryItemId: stage1.linkedLibraryItemId,
      lessonText: text,
      topic: stage1.topic,
      curriculumRoute:
        stage1.mappedCurriculumName ?? stage1.curriculumLabel,
      grade: stage1.grade,
      subject: stage1.subject,
      planBundleId: stage1.planBundleId,
      topLevelId: stage1.topLevelId,
      pathwayId: stage1.pathwayId,
      pathwayDisplayName: stage1.pathwayDisplayName,
      method: stage1.method,
      duration: stage1.duration,
      mappedCurriculumId: stage1.mappedCurriculumId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed when Stage 1 content changes
  }, [
    stage1.generatedSummary,
    stage1.linkedLibraryItemId,
    stage1.planBundleId,
  ]);

  async function onGenerate() {
    if (!authReady) return;
    if (!draft.canGenerate()) {
      toast.info(
        `Add a lesson source with at least ${STAGE2_MIN_SOURCE_CHARS} characters.`,
      );
      return;
    }

    if (!(await prepareGeneration())) return;
    const clarified = await confirmGeneration(2, {
      grade: draft.grade,
      pathway: draft.pathwayDisplayName,
      topic: draft.topic,
      subject: draft.subject,
      isUploadSource: draft.sourceMode === "upload",
      sourceText: draft.sourceLessonText,
      sourceFileName: draft.sourceFileName,
    });
    if (!clarified) return;

    if (!(await consumeTrialCreditBeforeGenerate())) return;

    try {
      const result = await draft.generate(clarified.answers);
      await completeGeneration();
      setSuccessFlash((n) => n + 1);
      void recordStageGenerated(2).catch(() => null);
      notifyStage2GenerationComplete(isGuest, result, {
        hasUsableDeck: draft.hasUsableDeck(),
        slideCount: draft.slides.length,
      });
    } catch (e) {
      toast.error(mapFunctionsError(e));
    }
  }

  async function onSaveLibrary() {
    if (requireSignInToSaveLibrary()) return;
    try {
      await draft.saveCurrentDeckToLibrary();
      slidesBaselineRef.current = JSON.stringify(
        useStage2DraftStore.getState().slides,
      );
      setLibraryDirty(false);
      toast.success("Presentation saved to library.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function onRetryImage() {
    if (!activeSlide) return;
    try {
      await draft.retryImage(activeSlide.slideNumber);
      toast.info("Image retry requested.");
    } catch (e) {
      toast.error(mapFunctionsError(e));
    }
  }

  async function exportInput(): Promise<Stage2ExportInput> {
    const personalization = await resolveExportPersonalization(account);
    return {
      topic: draft.presentationTitle || draft.topic || "Presentation",
      curriculumRoute:
        draft.mappedCurriculumName ?? draft.curriculumLabel ?? "Curriculum",
      grade: draft.grade || "—",
      subject: draft.subject || "—",
      slides: draft.slides,
      themeId: draft.themeId,
      schoolName: personalization.schoolName,
      teacherName: personalization.teacherName,
      personalization,
    };
  }

  async function onExport(action: Stage2DownloadActionId) {
    if (!draft.slides.length) {
      toast.info("Generate slides first.");
      return;
    }
    setExportMenuOpen(false);
    setExporting(true);
    try {
      await runStage2DownloadAction(action, await exportInput());
      toast.success(
        STAGE2_DOWNLOAD_ACTIONS.find((a) => a.id === action)?.label
          ? `${STAGE2_DOWNLOAD_ACTIONS.find((a) => a.id === action)!.label} ready.`
          : "Export ready.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export slides.");
    } finally {
      setExporting(false);
    }
  }

  async function onShare() {
    if (!draft.slides.length) {
      toast.info("Generate slides first.");
      return;
    }
    setExporting(true);
    try {
      const result = await shareStage2Zip(await exportInput());
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    } finally {
      setExporting(false);
    }
  }

  async function onUploadFile() {
    try {
      const parsed = await pickAndParseStageSource("lessonDocument");
      if (!parsed) return;
      draft.setUploadedSource({
        fileName: parsed.fileName,
        lessonText: parsed.text,
      });
      toast.success(`Loaded “${parsed.fileName}”`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read file.");
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <GenerationBusyOverlay
        active={isGenerating}
        stage={2}
        progress={draft.progress}
        guestMode={isGuest}
        autoDismissWhenReady={isGuest}
        status={draft.status || undefined}
        tags={[
          draft.grade || stage1.grade,
          draft.subject || stage1.subject,
          draft.topic || stage1.topic,
          stage1.method,
        ].filter(Boolean)}
      />
      <Stage2Hero />
      <StageProgressNav currentStage={2} />

      <StageWorkspace context="stage2">
        <div className="flex w-full min-w-0 flex-col gap-4 pb-8">
          <Stage2PresentationSetup
            sourceMode={draft.sourceMode}
            themeId={draft.themeId}
            slideCount={draft.slideCount}
            sourceLen={sourceLen}
            topic={draft.topic}
            sourceFileName={draft.sourceFileName}
            isGenerating={draft.isGenerating}
            isLoading={draft.isGenerating}
            lessonPlans={lessonPlans}
            pickerOpen={pickerOpen}
            onTogglePicker={() => {
              draft.setSourceMode("stage1Library");
              setPickerOpen((v) => !v);
            }}
            onSelectUpload={() => {
              setPickerOpen(false);
              draft.setSourceMode("upload");
            }}
            onSelectStage1={() => {
              setPickerOpen(false);
              draft.setSourceMode("stage1Library");
              if (stage1.generatedSummary.trim()) {
                draft.setLibrarySource({
                  libraryItemId: stage1.linkedLibraryItemId ?? "",
                  lessonText: stage1.generatedSummary,
                  topic: stage1.topic,
                  curriculumRoute:
                    stage1.mappedCurriculumName ?? stage1.curriculumLabel,
                  grade: stage1.grade,
                  subject: stage1.subject,
                  planBundleId: stage1.planBundleId,
                  topLevelId: stage1.topLevelId,
                  pathwayId: stage1.pathwayId,
                  pathwayDisplayName: stage1.pathwayDisplayName,
                  method: stage1.method,
                  duration: stage1.duration,
                  mappedCurriculumId: stage1.mappedCurriculumId,
                });
              } else {
                setPickerOpen(true);
                toast.info(
                  "No Stage 1 plan in this session — pick one from your library.",
                );
              }
            }}
            onPickLibraryItem={(item) => {
              draft.setLibrarySource({
                libraryItemId: item.id,
                lessonText: item.reviewBody,
                topic: item.topic,
                curriculumRoute: item.curriculumRoute,
                grade: item.grade,
                subject: item.subject,
                planBundleId: item.planBundleId,
              });
              setPickerOpen(false);
              toast.info(`Using “${item.topic || "Lesson plan"}”`);
            }}
            onUploadFile={() => void onUploadFile()}
            onClearUpload={() => draft.clearUploadedSource()}
            onThemeSelect={(id) => draft.setThemeId(id)}
            onSlideCount={(n) => draft.setSlideCount(n)}
            onGenerate={() => void onGenerate()}
            canGenerate={draft.canGenerate()}
          />

          {isGenerating || draft.error ? (
            <Card className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-[#1A1C30]">
                  {isGenerating ? "Generating…" : "Status"}
                </span>
                <span className="text-[#666666]">
                  {`${draft.status || "—"} · ${Math.min(draft.progress, 100)}%`}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8F8F7]">
                <div
                  className="h-full rounded-full bg-[#28C2C0] transition-all"
                  style={{
                    width: `${Math.min(draft.progress, 100)}%`,
                  }}
                />
              </div>
              {draft.error ? (
                <p className="text-sm text-red-600">{draft.error}</p>
              ) : null}
              {isGenerating ? (
                <div className="flex items-center gap-2 text-xs text-[#666666]">
                  <Spinner className="size-4" />
                  Text slides and images may finish at different times.
                </div>
              ) : null}
            </Card>
          ) : null}

          <GenerationSuccessOverlay trigger={successFlash}>
            <PresentationResultPanel
              hasDeck={hasDeck}
              isGenerating={isGenerating}
              title={
                draft.presentationTitle ||
                draft.topic ||
                "Exploring Ecosystems"
              }
              slides={displaySlides}
              activeSlideIndex={displayIndex}
              themeId={draft.themeId}
              cover={coverData}
              linkedLibraryItemId={draft.linkedPresentationLibraryItemId}
              isSavingLibrary={draft.isSavingLibrary}
              exportMenuOpen={exportMenuOpen}
              exporting={exporting}
              exportActions={sortActionsByExportPreference(
                STAGE2_DOWNLOAD_ACTIONS,
              )}
              onToggleExport={() => setExportMenuOpen((o) => !o)}
              onExport={(id) => void onExport(id as Stage2DownloadActionId)}
              onShare={() => void onShare()}
              onSaveLibrary={() => void onSaveLibrary()}
              onPrev={() => setDisplayIndex((i) => Math.max(0, i - 1))}
              onNext={() =>
                setDisplayIndex((i) => Math.min(displayCount - 1, i + 1))
              }
              onSelectSlide={(idx) => setDisplayIndex(idx)}
              onEdit={() => {
                if (!hasDeck) return;
                if (!isCoverSelected) {
                  draft.setActiveSlideIndex(contentIndex);
                }
                setEditOpen(true);
              }}
              showSave={
                Boolean(draft.linkedPresentationLibraryItemId) && libraryDirty
              }
              onSave={() => void onSaveLibrary()}
              onRetryImage={() => void onRetryImage()}
              onClear={() => {
                draft.resetResult();
                slidesBaselineRef.current = "";
                setLibraryDirty(false);
                setDisplayIndex(0);
              }}
            />
          </GenerationSuccessOverlay>

          <GuestSaveToLibraryPrompt
            visible={isGuest && hasDeck}
            onSave={() => requireSignInToSaveLibrary()}
          />

          <Stage2SlideEditDialog
            open={editOpen}
            slide={isCoverSelected ? null : activeSlide}
            cover={isCoverSelected ? coverData : null}
            themeId={draft.themeId}
            totalSlides={displayCount}
            onClose={() => setEditOpen(false)}
            onSaveCover={(patch) => {
              draft.setPresentationTitle(patch.topic);
              setEditOpen(false);
              if (draft.linkedPresentationLibraryItemId) {
                setLibraryDirty(true);
              } else if (!requireSignInToSaveLibrary()) {
                void draft
                  .saveCurrentDeckToLibrary()
                  .then(() => toast.success("Cover saved."))
                  .catch(() => toast.info("Cover updated locally."));
              }
            }}
            onSaveSlide={(patch) => {
              draft.updateSlide(contentIndex, patch);
              setEditOpen(false);
              if (draft.linkedPresentationLibraryItemId) {
                setLibraryDirty(true);
              } else if (!requireSignInToSaveLibrary()) {
                void draft
                  .saveCurrentDeckToLibrary()
                  .then(() => toast.success("Slide saved."))
                  .catch(() => toast.info("Slide updated locally."));
              }
            }}
          />
          {signInDialog}
          {upgradeDialog}
          {confirmDialog}
        </div>
      </StageWorkspace>
    </div>
  );
}
