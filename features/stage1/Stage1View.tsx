"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StageProgressNav } from "@/components/common/StageProgressNav";
import { GenerationBusyOverlay } from "@/components/common/GenerationBusyOverlay";
import { GenerationSuccessOverlay } from "@/components/common/GenerationSuccessOverlay";
import { GuestSaveToLibraryPrompt } from "@/components/common/GuestSaveToLibraryPrompt";
import { Stage1Hero } from "@/components/common/Stage1Hero";
import { StageWorkspace } from "@/components/common/StageWorkspace";
import { useGuestGeneration } from "@/features/generation/useGuestGeneration";
import { useGenerationConfirm } from "@/features/generation/useGenerationConfirm";
import {
  CreateLessonPlanButton,
  LessonDetailsShell,
} from "@/features/stage1/LessonDetailsShell";
import { LessonPlanResultPanel } from "@/features/stage1/LessonPlanResultPanel";
import { Stage1NotebookForm } from "@/features/stage1/Stage1NotebookForm";
import {
  getPathway,
  getSubjectsForGrade,
  getTopLevelById,
  getTopLevelCurriculums,
} from "@/services/curriculum.service";
import {
  resolveExportPersonalization,
  type ExportPersonalization,
} from "@/services/export-personalization.service";
import {
  downloadLessonPlanPdf,
  printLessonPlanPdf,
  shareLessonPlanPdf,
} from "@/services/lesson-plan-pdf.service";
import {
  recordStageGenerated,
} from "@/services/notification-lifecycle.service";
import {
  syncAccountSubscription,
  useAccountStore,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { useStage1DraftStore } from "@/store/stage1-draft-store";
import { toast } from "@/store/toast-store";
import { STAGE1_DURATIONS, STAGE1_METHODS } from "@/types/stage1";
import { ROUTES } from "@/lib/urls";
import { notifyStage1GenerationComplete } from "@/lib/guest-generation-notify";
import { mapFirebaseAuthError, mapFunctionsError } from "@/lib/auth-errors";

export function Stage1View() {
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
  } = useGuestGeneration(ROUTES.stage1, 1);
  const { confirmGeneration, dialog: confirmDialog } = useGenerationConfirm();

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [successFlash, setSuccessFlash] = useState(0);

  const draft = useStage1DraftStore();
  const topLevels = useMemo(() => getTopLevelCurriculums(), []);
  const top = getTopLevelById(draft.topLevelId);
  const pathway = getPathway(draft.topLevelId, draft.pathwayId);
  const subjects = getSubjectsForGrade(pathway, draft.gradeInternalId);
  const hasPlan = draft.generatedSummary.trim().length > 0;
  const displayContent = draft.generatedSummary;
  const isGenerating = draft.isGenerating;

  useEffect(() => {
    draft.hydrateFromPrefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once on mount
  }, []);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscription(user?.uid ?? null);
  }, [authReady, user?.uid]);

  async function onGenerate() {
    if (!authReady) return;
    if (draft.hasUnsupportedMapping()) {
      toast.error("This combination is not supported");
      return;
    }
    if (!draft.canGenerate()) {
      toast.error("Choose curriculum, program, grade, subject, and topic.");
      return;
    }

    if (!(await prepareGeneration())) return;
    const clarified = await confirmGeneration(1, {
      grade: draft.grade,
      pathway: draft.pathwayDisplayName,
      topic: draft.topic,
      subject: draft.subject,
    });
    if (!clarified) return;
    if (!(await consumeTrialCreditBeforeGenerate())) return;
    try {
      const result = await draft.generate(clarified.answers);
      await completeGeneration();
      setSuccessFlash((n) => n + 1);
      void recordStageGenerated(1).catch(() => null);
      notifyStage1GenerationComplete(isGuest, result);
    } catch (e) {
      toast.error(
        mapFunctionsError(e) ||
          mapFirebaseAuthError(e) ||
          "Could not generate lesson plan.",
      );
    }
  }

  async function onSaveEdit(value: string) {
    if (requireSignInToSaveLibrary()) return;
    draft.setGeneratedSummary(value);
    try {
      await draft.saveCurrentPlanToLibrary();
      toast.success("Lesson plan saved to library.");
    } catch (e) {
      toast.error(mapFunctionsError(e) || "Could not save to library.");
      throw e;
    }
  }

  function pdfInput(personalization?: ExportPersonalization | null) {
    return {
      topic: draft.topic,
      curriculumRoute: draft.mappedCurriculumName ?? draft.curriculumLabel,
      grade: draft.grade,
      subject: draft.subject,
      content: draft.generatedSummary,
      schoolName:
        personalization?.schoolName ??
        (account?.useSchoolNameInAi && account.schoolName?.trim()
          ? account.schoolName.trim()
          : null),
      preparedBy:
        personalization?.teacherName ??
        (account?.displayName?.trim() || null),
      teachingStrategy: draft.method,
      duration: draft.duration,
      personalization: personalization ?? null,
    };
  }

  async function withPersonalization() {
    return resolveExportPersonalization(account);
  }

  async function onDownloadPdf() {
    if (!hasPlan) {
      toast.info("Generate a lesson plan first.");
      return;
    }
    try {
      downloadLessonPlanPdf(pdfInput(await withPersonalization()));
      toast.success("PDF download started.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not export PDF.",
      );
    } finally {
      setExportMenuOpen(false);
    }
  }

  async function onPrintPdf() {
    if (!hasPlan) {
      toast.info("Generate a lesson plan first.");
      return;
    }
    try {
      printLessonPlanPdf(pdfInput(await withPersonalization()));
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not open print dialog.",
      );
    } finally {
      setExportMenuOpen(false);
    }
  }

  async function onSharePdf() {
    if (!hasPlan) {
      toast.info("Generate a lesson plan first.");
      return;
    }
    try {
      const result = await shareLessonPlanPdf(
        pdfInput(await withPersonalization()),
      );
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    }
  }

  function onContinueToStage2() {
    draft.ensurePlanBundleId();
    router.push(ROUTES.stage2);
  }

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <GenerationBusyOverlay
        active={isGenerating}
        stage={1}
        progress={draft.progress}
        guestMode={isGuest}
        autoDismissWhenReady={isGuest}
        status={
          draft.phase === "saving" && !isGuest
            ? "Saving to library…"
            : draft.phase
              ? `Generating… ${draft.phase}`
              : undefined
        }
        tags={[draft.grade, draft.subject, draft.topic, draft.method].filter(
          Boolean,
        )}
      />
      <Stage1Hero />
      <StageProgressNav currentStage={1} />

      <StageWorkspace context="stage1">
        <div className="flex w-full min-w-0 flex-col gap-5">
          <LessonDetailsShell
            footer={
              <div className="flex flex-col gap-2">
                {isGenerating ? (
                  <div className="mb-1 rounded-xl border border-[#E8F8F7] bg-[#F5FBFB] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1A1C30]">
                        {draft.phase === "saving" && !isGuest
                          ? "Saving to library…"
                          : `Generating… ${draft.phase || "working"}`}
                      </span>
                      <span className="text-[#666666]">
                        {draft.progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#28C2C0] transition-[width]"
                        style={{
                          width: `${Math.max(4, draft.progress)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null}
                <CreateLessonPlanButton
                  onClick={() => void onGenerate()}
                  disabled={isGenerating}
                  isLoading={isGenerating}
                />
              </div>
            }
          >
            <Stage1NotebookForm
              topLevelId={draft.topLevelId}
              pathwayId={draft.pathwayId}
              gradeInternalId={draft.gradeInternalId}
              subject={draft.subject}
              topic={draft.topic}
              method={draft.method}
              duration={draft.duration}
              topLevels={topLevels}
              pathways={top?.pathways ?? []}
              grades={pathway?.grades ?? []}
              subjects={subjects}
              methods={STAGE1_METHODS}
              durations={STAGE1_DURATIONS}
              pathwayDisabled={!top}
              gradeDisabled={!pathway}
              subjectDisabled={!draft.gradeInternalId || subjects.length === 0}
              unsupported={draft.hasUnsupportedMapping()}
              onTopLevel={(v) => draft.setTopLevel(v)}
              onPathway={(v) => draft.setPathway(v)}
              onGrade={(v) => draft.setGrade(v)}
              onSubject={(v) => draft.setSubject(v)}
              onTopic={(v) => draft.setTopic(v)}
              onMethod={(v) => draft.setMethod(v)}
              onDuration={(v) => draft.setDuration(v)}
            />
          </LessonDetailsShell>

          <GenerationSuccessOverlay trigger={successFlash}>
            <LessonPlanResultPanel
              hasPlan={hasPlan}
              isGenerating={isGenerating}
              content={displayContent}
              curriculumRoute={
                draft.mappedCurriculumName ?? draft.curriculumLabel
              }
              grade={draft.grade}
              subject={draft.subject}
              schoolLogoUrl={
                account?.useSchoolLogoInAi && account.schoolLogoUrl?.trim()
                  ? account.schoolLogoUrl.trim()
                  : null
              }
              ownPictureUrl={
                account?.useOwnPicInAi && account.profilePhotoUrl?.trim()
                  ? account.profilePhotoUrl.trim()
                  : null
              }
              linkedLibraryItemId={draft.linkedLibraryItemId}
              isSavingLibrary={draft.isSavingLibrary}
              exportMenuOpen={exportMenuOpen}
              onToggleExport={() => setExportMenuOpen((o) => !o)}
              onClear={() => draft.resetResult()}
              onDownloadPdf={onDownloadPdf}
              onPrintPdf={onPrintPdf}
              onSharePdf={() => void onSharePdf()}
              onSaveEdit={onSaveEdit}
              onSaveLibrary={() => {
                if (requireSignInToSaveLibrary()) return;
                void draft
                  .saveCurrentPlanToLibrary()
                  .then(() =>
                    toast.success("Lesson plan saved to library."),
                  )
                  .catch((e) =>
                    toast.error(
                      e instanceof Error
                        ? e.message
                        : "Could not save to library.",
                    ),
                  );
              }}
            />
          </GenerationSuccessOverlay>

          <GuestSaveToLibraryPrompt
            visible={isGuest && hasPlan}
            onSave={() => requireSignInToSaveLibrary()}
          />

          <div className="flex w-full justify-center">
            <Button
              className="w-full"
              onClick={onContinueToStage2}
              disabled={isGenerating}
            >
              {hasPlan ? "Go to Stage 2" : "Skip to Stage 2"}
            </Button>
          </div>

          {signInDialog}
          {upgradeDialog}
          {confirmDialog}
        </div>
      </StageWorkspace>
    </div>
  );
}
