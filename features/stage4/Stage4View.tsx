"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { StageProgressNav } from "@/components/common/StageProgressNav";
import { GenerationBusyOverlay } from "@/components/common/GenerationBusyOverlay";
import { GenerationSuccessOverlay } from "@/components/common/GenerationSuccessOverlay";
import { GuestSaveToLibraryPrompt } from "@/components/common/GuestSaveToLibraryPrompt";
import { Stage4Hero } from "@/components/common/Stage4Hero";
import { StageWorkspace } from "@/components/common/StageWorkspace";
import { WorksheetContentView } from "@/components/common/WorksheetContentView";
import { MarkdownEditPreviewDialog } from "@/components/common/MarkdownEditPreviewDialog";
import { useGuestGeneration } from "@/features/generation/useGuestGeneration";
import { useGenerationConfirm } from "@/features/generation/useGenerationConfirm";
import { Stage4AssessmentInbox } from "@/features/stage4/Stage4AssessmentInbox";
import { Stage4AssessmentReviewWall } from "@/features/stage4/Stage4AssessmentReviewWall";
import { Stage4FinalPaperWorkshop } from "@/features/stage4/Stage4FinalPaperWorkshop";
import { mapFunctionsError } from "@/lib/auth-errors";
import { sortActionsByExportPreference } from "@/lib/export-format-prefs";
import { ROUTES } from "@/lib/urls";
import { notifyStage4GenerationComplete } from "@/lib/guest-generation-notify";
import { pickAndParseStageSource } from "@/services/stage-source-parser.service";
import {
  recordStageGenerated,
} from "@/services/notification-lifecycle.service";
import {
  runStage4DownloadAction,
  shareStage4QuizZip,
  STAGE4_DOWNLOAD_ACTIONS,
  type Stage4DownloadActionId,
  type Stage4ExportInput,
} from "@/services/stage4-export.service";
import { resolveExportPersonalization } from "@/services/export-personalization.service";
import {
  syncAccountSubscription,
  useAccountStore,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import {
  syncLibraryCatalogSubscription,
  useLibraryCatalogStore,
} from "@/store/library-catalog-store";
import { useStage3DraftStore } from "@/store/stage3-draft-store";
import { useStage4DraftStore } from "@/store/stage4-draft-store";
import { toast } from "@/store/toast-store";
import {
  STAGE4_MIN_SOURCE_CHARS,
  stage4MarksBoundsForMinutes,
} from "@/types/stage4";

export function Stage4View() {
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
  } = useGuestGeneration(ROUTES.stage4, 4);
  const { confirmGeneration, dialog: confirmDialog } = useGenerationConfirm();

  const libraryItems = useLibraryCatalogStore((s) => s.items);
  const activities = useMemo(
    () => libraryItems.filter((i) => i.kind === "activity"),
    [libraryItems],
  );

  const stage3 = useStage3DraftStore();
  const draft = useStage4DraftStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [successFlash, setSuccessFlash] = useState(0);
  const [exporting, setExporting] = useState(false);

  const sourceLen = draft.sourceAssessmentText.trim().length;
  const durationMin = draft.durationMinutes();
  const marksBounds = stage4MarksBoundsForMinutes(durationMin);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscription(user?.uid ?? null);
    if (user?.uid) syncLibraryCatalogSubscription(user.uid);
  }, [authReady, user?.uid]);

  useEffect(() => {
    const text =
      stage3.result?.studentActivityText?.trim() ||
      stage3.result?.teacherAnswerKeyText?.trim() ||
      "";
    if (!text) return;
    draft.seedFromStage3Session({
      libraryItemId: stage3.linkedActivityLibraryItemId,
      assessmentText: text,
      topic: stage3.topic,
      curriculumRoute:
        stage3.mappedCurriculumName ?? stage3.curriculumLabel,
      grade: stage3.grade,
      subject: stage3.subject,
      planBundleId: stage3.planBundleId,
      topLevelId: stage3.topLevelId,
      pathwayId: stage3.pathwayId,
      pathwayDisplayName: stage3.pathwayDisplayName,
      method: stage3.method,
      mappedCurriculumId: stage3.mappedCurriculumId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stage3.result,
    stage3.linkedActivityLibraryItemId,
    stage3.planBundleId,
  ]);

  async function onGenerate() {
    if (!authReady) return;
    if (!draft.canGenerate()) {
      toast.info(
        `Add a source (≥${STAGE4_MIN_SOURCE_CHARS} chars), choose a paper type, and select at least one question type.`,
      );
      return;
    }

    if (!(await prepareGeneration())) return;
    const clarified = await confirmGeneration(4, {
      grade: draft.grade,
      pathway: draft.pathwayDisplayName,
      topic: draft.topic,
      subject: draft.subject,
      isUploadSource: draft.sourceMode === "upload",
      sourceText: draft.sourceAssessmentText,
      sourceFileName: draft.sourceFileName,
    });
    if (!clarified) return;

    if (!(await consumeTrialCreditBeforeGenerate())) return;

    try {
      const result = await draft.generate(clarified.answers);
      await completeGeneration();
      setSuccessFlash((n) => n + 1);
      void recordStageGenerated(4).catch(() => null);
      notifyStage4GenerationComplete(isGuest, result, Boolean(draft.result));
    } catch (e) {
      toast.error(mapFunctionsError(e));
    }
  }

  async function onSaveLibrary() {
    if (requireSignInToSaveLibrary()) return;
    if (!draft.result) {
      toast.info("Generate assessment first.");
      return;
    }
    try {
      await draft.saveCurrentToLibrary();
      toast.success("Assessment saved to library.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function exportInput(): Promise<Stage4ExportInput> {
    const personalization = await resolveExportPersonalization(account);
    return {
      topic: draft.topic,
      curriculumRoute:
        draft.mappedCurriculumName ?? draft.curriculumLabel,
      grade: draft.grade,
      subject: draft.subject,
      assessmentTitle:
        draft.result?.assessmentTitle ||
        draft.result?.paperTitle ||
        draft.topic,
      studentPaperText: draft.result?.studentAssessmentText ?? "",
      markSchemeText: draft.result?.teacherMarkSchemeText ?? "",
      schoolName: personalization.schoolName,
      preparedBy: personalization.teacherName,
      personalization,
    };
  }

  async function onExport(action: Stage4DownloadActionId) {
    if (!draft.result) {
      toast.info("Generate assessment first.");
      return;
    }
    setExportMenuOpen(false);
    setExporting(true);
    try {
      await runStage4DownloadAction(action, await exportInput());
      toast.success(
        `${STAGE4_DOWNLOAD_ACTIONS.find((a) => a.id === action)?.label ?? "Export"} ready.`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export.");
    } finally {
      setExporting(false);
    }
  }

  async function onShare() {
    if (!draft.result) {
      toast.info("Generate assessment first.");
      return;
    }
    setExporting(true);
    try {
      const result = await shareStage4QuizZip(await exportInput());
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
        assessmentText: parsed.text,
      });
      toast.success(`Loaded “${parsed.fileName}”`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read file.");
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <GenerationBusyOverlay
        active={draft.isGenerating}
        stage={4}
        progress={draft.progress}
        guestMode={isGuest}
        autoDismissWhenReady={isGuest}
        status={draft.status || draft.phase || undefined}
        tags={[draft.topic].filter(Boolean)}
      />
      <Stage4Hero />
      <StageProgressNav currentStage={4} />

      <StageWorkspace context="stage4">
    <div className="flex w-full min-w-0 flex-col gap-4 pb-8">
      <Stage4AssessmentInbox
        sourceMode={draft.sourceMode}
        sourceLen={sourceLen}
        topic={draft.topic}
        sourceFileName={draft.sourceFileName}
        activities={activities}
        pickerOpen={pickerOpen}
        isGenerating={draft.isGenerating}
        onSelectUpload={() => {
          setPickerOpen(false);
          draft.setSourceMode("upload");
        }}
        onSelectStage3={() => {
          setPickerOpen(false);
          draft.setSourceMode("stage3Library");
          const text = stage3.result?.studentActivityText?.trim() || "";
          if (text) {
            draft.setLibrarySource({
              libraryItemId: stage3.linkedActivityLibraryItemId ?? "",
              assessmentText: text,
              topic: stage3.topic,
              curriculumRoute:
                stage3.mappedCurriculumName ?? stage3.curriculumLabel,
              grade: stage3.grade,
              subject: stage3.subject,
              planBundleId: stage3.planBundleId,
              topLevelId: stage3.topLevelId,
              pathwayId: stage3.pathwayId,
              pathwayDisplayName: stage3.pathwayDisplayName,
              method: stage3.method,
              mappedCurriculumId: stage3.mappedCurriculumId,
            });
          } else {
            setPickerOpen(true);
            toast.info(
              "No Stage 3 activity in this session — pick one from your library.",
            );
          }
        }}
        onTogglePicker={() => {
          draft.setSourceMode("stage3Library");
          setPickerOpen((v) => !v);
        }}
        onPickLibraryItem={(item) => {
          draft.setLibrarySource({
            libraryItemId: item.id,
            assessmentText: item.reviewBody,
            topic: item.topic,
            curriculumRoute: item.curriculumRoute,
            grade: item.grade,
            subject: item.subject,
            planBundleId: item.planBundleId,
          });
          setPickerOpen(false);
          toast.info(`Using “${item.topic || "Activity"}”`);
        }}
        onUploadFile={() => void onUploadFile()}
        onClearUpload={() => draft.clearUploadedSource()}
      />

      <Stage4FinalPaperWorkshop
        quizKind={draft.quizKind}
        questionCount={draft.questionCount}
        quizDurationIndex={draft.quizDurationIndex}
        totalMarks={draft.totalMarks}
        marksMin={marksBounds.min}
        marksMax={marksBounds.max}
        quizMultipleChoice={draft.quizMultipleChoice}
        quizTrueFalse={draft.quizTrueFalse}
        quizFillBlanks={draft.quizFillBlanks}
        quizShortAnswer={draft.quizShortAnswer}
        isGenerating={draft.isGenerating}
        onSelectKind={(kind) => draft.setQuizKind(kind)}
        onQuestionCount={(count) => draft.setQuestionCount(count)}
        onDurationIndex={(index) => draft.setQuizDurationIndex(index)}
        onTotalMarks={(marks) => draft.setTotalMarks(marks)}
        onToggleType={(key, value) => draft.setQuestionType(key, value)}
        onBuild={() => void onGenerate()}
      />

      <GenerationSuccessOverlay trigger={successFlash}>
        <Stage4AssessmentReviewWall
          quizKind={draft.quizKind}
          questionCount={draft.questionCount}
          durationMinutes={durationMin}
          totalMarks={draft.totalMarks}
          result={draft.result}
          isGenerating={draft.isGenerating}
          isSavingLibrary={draft.isSavingLibrary}
          exporting={exporting}
          exportMenuOpen={exportMenuOpen}
          exportActions={sortActionsByExportPreference(STAGE4_DOWNLOAD_ACTIONS)}
          linkedLibraryItemId={draft.linkedAssessmentLibraryItemId}
          onEditStudent={() => {
            if (!draft.result) {
              toast.info("Generate an assessment to edit.");
              return;
            }
            setShowMarkScheme(false);
            setEditDraft(draft.result.studentAssessmentText ?? "");
            setEditOpen(true);
          }}
          onEditMarkScheme={() => {
            if (!draft.result) {
              toast.info("Generate an assessment to edit.");
              return;
            }
            setShowMarkScheme(true);
            setEditDraft(draft.result.teacherMarkSchemeText ?? "");
            setEditOpen(true);
          }}
          onToggleExport={() => {
            if (!draft.result) {
              toast.info("Generate assessment first.");
              return;
            }
            setExportMenuOpen((o) => !o);
          }}
          onExport={(id) => void onExport(id as Stage4DownloadActionId)}
          onShare={() => void onShare()}
          onSaveLibrary={() => void onSaveLibrary()}
        />
      </GenerationSuccessOverlay>

      <GuestSaveToLibraryPrompt
        visible={isGuest && Boolean(draft.result)}
        onSave={() => requireSignInToSaveLibrary()}
      />

      {draft.isGenerating || draft.error ? (
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[#1A1C30]">
              {draft.isGenerating ? "Generating…" : "Status"}
            </span>
            <span className="text-[#666666]">
              {draft.status || "—"}
              {draft.phase ? ` · ${draft.phase}` : ""} ·{" "}
              {Math.min(draft.progress, 100)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E8F8F7]">
            <div
              className="h-full rounded-full bg-[#28C2C0] transition-all"
              style={{ width: `${Math.min(draft.progress, 100)}%` }}
            />
          </div>
          {draft.error ? (
            <p className="text-sm text-red-600">{draft.error}</p>
          ) : null}
          {draft.isGenerating ? (
            <div className="flex items-center gap-2 text-xs text-[#666666]">
              <Spinner className="size-4" />
              Building your summative assessment…
            </div>
          ) : null}
        </Card>
      ) : null}

      {draft.result ? (
        <GenerationSuccessOverlay trigger={successFlash}>
          <div className="sr-only">Assessment generated successfully</div>
        </GenerationSuccessOverlay>
      ) : null}

      <MarkdownEditPreviewDialog
        open={editOpen}
        title={showMarkScheme ? "Edit mark scheme" : "Edit student paper"}
        initialValue={editDraft}
        placeholder="Edit the assessment markdown…"
        onClose={() => setEditOpen(false)}
        onSave={(value) => {
          if (showMarkScheme) {
            draft.setTeacherMarkSchemeText(value);
          } else {
            draft.setStudentAssessmentText(value);
          }
          void draft
            .saveCurrentToLibrary()
            .then(() => toast.success("Saved."))
            .catch(() => toast.info("Updated locally."));
        }}
        renderPreview={(value) => (
          <WorksheetContentView
            content={value}
            emptyPlaceholder="Nothing to preview yet."
          />
        )}
      />
      {signInDialog}
      {upgradeDialog}
      {confirmDialog}
    </div>
      </StageWorkspace>
    </div>
  );
}
