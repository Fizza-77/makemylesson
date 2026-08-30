"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { StageProgressNav } from "@/components/common/StageProgressNav";
import { GenerationBusyOverlay } from "@/components/common/GenerationBusyOverlay";
import { GenerationSuccessOverlay } from "@/components/common/GenerationSuccessOverlay";
import { GuestSaveToLibraryPrompt } from "@/components/common/GuestSaveToLibraryPrompt";
import { Stage3Hero } from "@/components/common/Stage3Hero";
import { StageWorkspace } from "@/components/common/StageWorkspace";
import { WorksheetContentView } from "@/components/common/WorksheetContentView";
import { MarkdownEditPreviewDialog } from "@/components/common/MarkdownEditPreviewDialog";
import { useGuestGeneration } from "@/features/generation/useGuestGeneration";
import { useGenerationConfirm } from "@/features/generation/useGenerationConfirm";
import { Stage3AssessmentBuilder } from "@/features/stage3/Stage3AssessmentBuilder";
import { Stage3WorksheetPreview } from "@/features/stage3/Stage3WorksheetPreview";
import { mapFunctionsError } from "@/lib/auth-errors";
import { sortActionsByExportPreference } from "@/lib/export-format-prefs";
import { ROUTES } from "@/lib/urls";
import { notifyStage3GenerationComplete } from "@/lib/guest-generation-notify";
import { pickAndParseStageSource } from "@/services/stage-source-parser.service";
import {
  recordStageGenerated,
} from "@/services/notification-lifecycle.service";
import {
  runStage3DownloadAction,
  shareStage3WorksheetZip,
  STAGE3_DOWNLOAD_ACTIONS,
  type Stage3DownloadActionId,
  type Stage3ExportInput,
} from "@/services/stage3-export.service";
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
import { useStage2DraftStore } from "@/store/stage2-draft-store";
import { useStage3DraftStore } from "@/store/stage3-draft-store";
import { toast } from "@/store/toast-store";
import { slidesToReviewBody } from "@/types/stage2";
import {
  formativeQuestionBounds,
  STAGE3_MIN_SOURCE_CHARS,
} from "@/types/stage3";

export function Stage3View() {
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
  } = useGuestGeneration(ROUTES.stage3, 3);
  const { confirmGeneration, dialog: confirmDialog } = useGenerationConfirm();

  const libraryItems = useLibraryCatalogStore((s) => s.items);
  const presentations = useMemo(
    () => libraryItems.filter((i) => i.kind === "presentation"),
    [libraryItems],
  );

  const stage2 = useStage2DraftStore();
  const draft = useStage3DraftStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [editTeacherOpen, setEditTeacherOpen] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [successFlash, setSuccessFlash] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [libraryDirty, setLibraryDirty] = useState(false);
  const resultBaselineRef = useRef("");

  const sourceLen = draft.sourcePresentationText.trim().length;
  const hasResult = !!draft.result;
  const displayResult = draft.result;
  const resultFingerprint = useMemo(
    () =>
      JSON.stringify({
        student: draft.result?.studentActivityText ?? "",
        teacher: draft.result?.teacherAnswerKeyText ?? "",
      }),
    [draft.result?.studentActivityText, draft.result?.teacherAnswerKeyText],
  );
  const linkedActivityId = draft.linkedActivityLibraryItemId;
  const prevLinkedActivityId = useRef(linkedActivityId);

  useEffect(() => {
    if (prevLinkedActivityId.current !== linkedActivityId) {
      prevLinkedActivityId.current = linkedActivityId;
      resultBaselineRef.current = resultFingerprint;
      setLibraryDirty(false);
      return;
    }
    if (!linkedActivityId) {
      setLibraryDirty(false);
      return;
    }
    if (!resultBaselineRef.current) {
      resultBaselineRef.current = resultFingerprint;
      setLibraryDirty(false);
      return;
    }
    setLibraryDirty(resultFingerprint !== resultBaselineRef.current);
  }, [resultFingerprint, linkedActivityId]);
  const [qMin, qMax] = formativeQuestionBounds(draft.formativeKind);
  const mixSelectedCount = [
    draft.multipleChoice,
    draft.trueFalse,
    draft.fillBlanks,
    draft.shortAnswer,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscription(user?.uid ?? null);
    if (user?.uid) syncLibraryCatalogSubscription(user.uid);
  }, [authReady, user?.uid]);

  useEffect(() => {
    const text =
      stage2.slides.length > 0
        ? slidesToReviewBody(stage2.slides)
        : stage2.presentationTitle.trim();
    if (!text.trim()) return;
    draft.seedFromStage2Session({
      libraryItemId: stage2.linkedPresentationLibraryItemId,
      presentationText: text,
      topic: stage2.topic,
      curriculumRoute:
        stage2.mappedCurriculumName ?? stage2.curriculumLabel,
      grade: stage2.grade,
      subject: stage2.subject,
      planBundleId: stage2.planBundleId,
      topLevelId: stage2.topLevelId,
      pathwayId: stage2.pathwayId,
      pathwayDisplayName: stage2.pathwayDisplayName,
      method: stage2.method,
      duration: stage2.duration,
      mappedCurriculumId: stage2.mappedCurriculumId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stage2.slides,
    stage2.linkedPresentationLibraryItemId,
    stage2.planBundleId,
    stage2.presentationTitle,
  ]);

  async function onGenerate() {
    if (!authReady) return;
    if (!draft.canGenerate()) {
      toast.info(
        `Add a presentation source (≥${STAGE3_MIN_SOURCE_CHARS} chars) and at least one question type.`,
      );
      return;
    }

    if (!(await prepareGeneration())) return;
    const clarified = await confirmGeneration(3, {
      grade: draft.grade,
      pathway: draft.pathwayDisplayName,
      topic: draft.topic,
      subject: draft.subject,
      isUploadSource: draft.sourceMode === "upload",
      sourceText: draft.sourcePresentationText,
      sourceFileName: draft.sourceFileName,
    });
    if (!clarified) return;

    if (!(await consumeTrialCreditBeforeGenerate())) return;

    try {
      const result = await draft.generate(clarified.answers);
      await completeGeneration();
      setSuccessFlash((n) => n + 1);
      void recordStageGenerated(3).catch(() => null);
      notifyStage3GenerationComplete(isGuest, result, Boolean(draft.result));
    } catch (e) {
      toast.error(mapFunctionsError(e));
    }
  }

  async function onSaveLibrary() {
    if (requireSignInToSaveLibrary()) return;
    try {
      await draft.saveCurrentToLibrary();
      resultBaselineRef.current = JSON.stringify({
        student: useStage3DraftStore.getState().result?.studentActivityText ?? "",
        teacher:
          useStage3DraftStore.getState().result?.teacherAnswerKeyText ?? "",
      });
      setLibraryDirty(false);
      toast.success("Activity saved to library.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function exportInput(): Promise<Stage3ExportInput> {
    const personalization = await resolveExportPersonalization(account);
    return {
      topic: draft.topic,
      curriculumRoute:
        draft.mappedCurriculumName ?? draft.curriculumLabel,
      grade: draft.grade,
      subject: draft.subject,
      activityTitle: draft.result?.activityTitle ?? draft.topic,
      studentActivityText: draft.result?.studentActivityText ?? "",
      teacherAnswerKeyText: draft.result?.teacherAnswerKeyText ?? "",
      schoolName: personalization.schoolName,
      preparedBy: personalization.teacherName,
      personalization,
    };
  }

  async function onExport(action: Stage3DownloadActionId) {
    if (!draft.result) {
      toast.info("Generate worksheet first.");
      return;
    }
    setExportMenuOpen(false);
    setExporting(true);
    try {
      await runStage3DownloadAction(action, await exportInput());
      toast.success(
        `${STAGE3_DOWNLOAD_ACTIONS.find((a) => a.id === action)?.label ?? "Export"} ready.`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export.");
    } finally {
      setExporting(false);
    }
  }

  async function onShare() {
    if (!draft.result) {
      toast.info("Generate worksheet first.");
      return;
    }
    setExporting(true);
    try {
      const result = await shareStage3WorksheetZip(await exportInput());
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
      const parsed = await pickAndParseStageSource("presentation");
      if (!parsed) return;
      draft.setUploadedSource({
        fileName: parsed.fileName,
        presentationText: parsed.text,
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
        stage={3}
        progress={draft.progress}
        guestMode={isGuest}
        autoDismissWhenReady={isGuest}
        status={draft.status || undefined}
        tags={[draft.topic].filter(Boolean)}
      />
      <Stage3Hero />
      <StageProgressNav currentStage={3} />

      <StageWorkspace context="stage3">
        <div className="flex w-full min-w-0 flex-col gap-4 pb-8">
      <Stage3AssessmentBuilder
        sourceMode={draft.sourceMode}
        sourceLen={sourceLen}
        topic={draft.topic}
        sourceFileName={draft.sourceFileName}
        formativeKind={draft.formativeKind}
        questionCount={draft.questionCount}
        qMin={qMin}
        qMax={qMax}
        multipleChoice={draft.multipleChoice}
        trueFalse={draft.trueFalse}
        fillBlanks={draft.fillBlanks}
        shortAnswer={draft.shortAnswer}
        presentations={presentations}
        pickerOpen={pickerOpen}
        isGenerating={draft.isGenerating}
        canGenerate={draft.canGenerate()}
        onTogglePicker={() => {
          draft.setSourceMode("stage2Library");
          setPickerOpen((v) => !v);
        }}
        onSelectUpload={() => {
          setPickerOpen(false);
          draft.setSourceMode("upload");
        }}
        onSelectStage2={() => {
          setPickerOpen(false);
          draft.setSourceMode("stage2Library");
          const text =
            stage2.slides.length > 0
              ? slidesToReviewBody(stage2.slides)
              : "";
          if (text.trim()) {
            draft.setLibrarySource({
              libraryItemId: stage2.linkedPresentationLibraryItemId ?? "",
              presentationText: text,
              topic: stage2.topic,
              curriculumRoute:
                stage2.mappedCurriculumName ?? stage2.curriculumLabel,
              grade: stage2.grade,
              subject: stage2.subject,
              planBundleId: stage2.planBundleId,
              topLevelId: stage2.topLevelId,
              pathwayId: stage2.pathwayId,
              pathwayDisplayName: stage2.pathwayDisplayName,
              method: stage2.method,
              duration: stage2.duration,
              mappedCurriculumId: stage2.mappedCurriculumId,
            });
          } else {
            setPickerOpen(true);
            toast.info(
              "No Stage 2 deck in this session — pick one from your library.",
            );
          }
        }}
        onPickLibraryItem={(item) => {
          draft.setLibrarySource({
            libraryItemId: item.id,
            presentationText: item.reviewBody,
            topic: item.topic,
            curriculumRoute: item.curriculumRoute,
            grade: item.grade,
            subject: item.subject,
            planBundleId: item.planBundleId,
          });
          setPickerOpen(false);
          toast.info(`Using “${item.topic || "Presentation"}”`);
        }}
        onUploadFile={() => void onUploadFile()}
        onClearUpload={() => draft.clearUploadedSource()}
        onFormativeKind={(kind) => draft.setFormativeKind(kind)}
        onQuestionCount={(n) => draft.setQuestionCount(n)}
        onQuestionType={(key, value) => draft.setQuestionType(key, value)}
        onGenerate={() => void onGenerate()}
      />

      {draft.isGenerating || draft.error ? (
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[#1A1C30]">
              {draft.isGenerating ? "Generating…" : "Status"}
            </span>
            <span className="text-[#666666]">
              {draft.status || "—"} · {Math.min(draft.progress, 100)}%
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
              Building your formative activity…
            </div>
          ) : null}
        </Card>
      ) : null}

      <GenerationSuccessOverlay trigger={successFlash}>
        <Stage3WorksheetPreview
          hasResult={hasResult}
          isGenerating={draft.isGenerating}
          formativeKind={draft.formativeKind}
          questionCount={draft.questionCount}
          mixSelectedCount={mixSelectedCount}
          result={displayResult}
          showAnswerKey={showAnswerKey}
          exportMenuOpen={exportMenuOpen}
          exporting={exporting}
          exportActions={sortActionsByExportPreference(
            STAGE3_DOWNLOAD_ACTIONS,
          )}
          onToggleView={(answerKey) => setShowAnswerKey(answerKey)}
          onEdit={() => {
            if (!displayResult) return;
            setEditDraft(
              showAnswerKey
                ? displayResult.teacherAnswerKeyText
                : displayResult.studentActivityText,
            );
            if (showAnswerKey) setEditTeacherOpen(true);
            else setEditStudentOpen(true);
          }}
          showSave={
            Boolean(draft.linkedActivityLibraryItemId) && libraryDirty
          }
          onSave={() => void onSaveLibrary()}
          isSavingLibrary={draft.isSavingLibrary}
          onToggleExport={() => setExportMenuOpen((o) => !o)}
          onExport={(id) => void onExport(id as Stage3DownloadActionId)}
          onShare={() => void onShare()}
        />
      </GenerationSuccessOverlay>

      <GuestSaveToLibraryPrompt
        visible={isGuest && hasResult}
        onSave={() => requireSignInToSaveLibrary()}
      />

      <MarkdownEditPreviewDialog
        open={editStudentOpen || editTeacherOpen}
        title={editTeacherOpen ? "Edit answer key" : "Edit student activity"}
        initialValue={editDraft}
        placeholder="Edit the worksheet markdown…"
        onClose={() => {
          setEditStudentOpen(false);
          setEditTeacherOpen(false);
        }}
        onSave={(value) => {
          if (editTeacherOpen) {
            draft.setTeacherAnswerKeyText(value);
          } else {
            draft.setStudentActivityText(value);
          }
          if (draft.linkedActivityLibraryItemId) {
            setLibraryDirty(true);
          } else if (!requireSignInToSaveLibrary()) {
            void draft
              .saveCurrentToLibrary()
              .then(() => toast.success("Saved."))
              .catch(() => toast.info("Updated locally."));
          }
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
