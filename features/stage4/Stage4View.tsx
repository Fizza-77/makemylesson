"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { StageProgressNav } from "@/components/common/StageProgressNav";
import { GenerationSuccessOverlay } from "@/components/common/GenerationSuccessOverlay";
import { Stage4Hero } from "@/components/common/Stage4Hero";
import { StageWorkspace } from "@/components/common/StageWorkspace";
import { useUpgradeGate } from "@/features/billing/useUpgradeGate";
import { Stage4AssessmentInbox } from "@/features/stage4/Stage4AssessmentInbox";
import { Stage4AssessmentReviewWall } from "@/features/stage4/Stage4AssessmentReviewWall";
import { Stage4FinalPaperWorkshop } from "@/features/stage4/Stage4FinalPaperWorkshop";
import { mapFunctionsError } from "@/lib/auth-errors";
import { sortActionsByExportPreference } from "@/lib/export-format-prefs";
import { ROUTES } from "@/lib/urls";
import { pickAndParseStageSource } from "@/services/stage-source-parser.service";
import {
  recordLibrarySaved,
  recordStageGenerated,
} from "@/services/notification-lifecycle.service";
import {
  runStage4DownloadAction,
  shareStage4QuizZip,
  STAGE4_DOWNLOAD_ACTIONS,
  type Stage4DownloadActionId,
  type Stage4ExportInput,
} from "@/services/stage4-export.service";
import {
  refreshAccountFromServer,
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
  const { blockIfNoCredits, dialog: upgradeDialog, credits } = useUpgradeGate();

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
  const [previewLocked, setPreviewLocked] = useState(false);
  const [lockReason, setLockReason] = useState<"auth" | "credits" | null>(
    null,
  );

  const sourceLen = draft.sourceAssessmentText.trim().length;
  const durationMin = draft.durationMinutes();
  const marksBounds = stage4MarksBoundsForMinutes(durationMin);
  const contentBlocked =
    previewLocked ||
    !user ||
    (credits !== null && credits <= 0);

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscription(user?.uid ?? null);
    if (user?.uid) syncLibraryCatalogSubscription(user.uid);
  }, [authReady, user?.uid]);

  useEffect(() => {
    if (user && credits !== null && credits > 0) {
      setPreviewLocked(false);
      setLockReason(null);
    }
  }, [user, credits]);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      setPreviewLocked(true);
      setLockReason("auth");
      return;
    }
    if (credits !== null && credits <= 0) {
      setPreviewLocked(true);
      setLockReason("credits");
    }
  }, [authReady, user, credits]);

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
    if (!user) {
      setPreviewLocked(true);
      setLockReason("auth");
      toast.info("Sign in to generate an assessment.");
      return;
    }
    if (!draft.canGenerate()) {
      toast.info(
        `Add a source (≥${STAGE4_MIN_SOURCE_CHARS} chars), choose a paper type, and select at least one question type.`,
      );
      return;
    }

    // Out of credits: lock preview + upgrade dialog (no API generate).
    if (credits !== null && credits <= 0) {
      setPreviewLocked(true);
      setLockReason("credits");
      blockIfNoCredits();
      return;
    }

    setPreviewLocked(false);
    setLockReason(null);

    try {
      const result = await draft.generate();
      if (user?.uid) {
        await refreshAccountFromServer(user.uid).catch(() => null);
      }
      setSuccessFlash((n) => n + 1);
      void recordStageGenerated(4).catch(() => null);
      if (result.savedToLibrary) {
        void recordLibrarySaved().catch(() => null);
        toast.success("Assessment generated and saved to library.");
      } else if (result.saveError) {
        toast.info(result.saveError);
      } else if (draft.result) {
        toast.success("Assessment ready.");
      }
    } catch (e) {
      toast.error(mapFunctionsError(e));
    }
  }

  async function onSaveLibrary() {
    if (contentBlocked || !draft.result) {
      toast.info(
        contentBlocked
          ? !user
            ? "Sign in to save assessments."
            : "Upgrade to save assessments."
          : "Generate assessment first.",
      );
      return;
    }
    try {
      await draft.saveCurrentToLibrary();
      toast.success("Assessment saved to library.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    }
  }

  function exportInput(): Stage4ExportInput {
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
      schoolName:
        account?.useSchoolNameInAi && account.schoolName?.trim()
          ? account.schoolName.trim()
          : null,
    };
  }

  async function onExport(action: Stage4DownloadActionId) {
    if (contentBlocked || !draft.result) {
      toast.info(
        contentBlocked
          ? !user
            ? "Sign in to export assessments."
            : "Upgrade to export assessments."
          : "Generate assessment first.",
      );
      return;
    }
    setExportMenuOpen(false);
    setExporting(true);
    try {
      await runStage4DownloadAction(action, exportInput());
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
    if (contentBlocked || !draft.result) {
      toast.info(
        contentBlocked
          ? !user
            ? "Sign in to share assessments."
            : "Upgrade to share assessments."
          : "Generate assessment first.",
      );
      return;
    }
    setExporting(true);
    try {
      const result = await shareStage4QuizZip(exportInput());
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
      <Stage4Hero />
      <StageProgressNav currentStage={4} />

      <StageWorkspace context="stage4">
    <div className="flex w-full min-w-0 flex-col gap-4 pb-8">
      <Stage4AssessmentInbox
        sourceMode={draft.sourceMode}
        sourceLen={sourceLen}
        topic={draft.topic}
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
        onPasteText={(text) =>
          draft.setUploadedSource({
            fileName: "pasted.txt",
            assessmentText: text,
          })
        }
        sourceText={draft.sourceAssessmentText}
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

      <Stage4AssessmentReviewWall
        quizKind={draft.quizKind}
        questionCount={draft.questionCount}
        durationMinutes={durationMin}
        totalMarks={draft.totalMarks}
        result={contentBlocked ? null : draft.result}
        isGenerating={draft.isGenerating}
        isSavingLibrary={draft.isSavingLibrary}
        exporting={exporting}
        exportMenuOpen={exportMenuOpen}
        exportActions={sortActionsByExportPreference(STAGE4_DOWNLOAD_ACTIONS)}
        linkedLibraryItemId={draft.linkedAssessmentLibraryItemId}
        previewLocked={contentBlocked}
        lockReason={
          !user
            ? "auth"
            : credits !== null && credits <= 0
              ? "credits"
              : lockReason
        }
        onUnlock={() => {
          if (!user) {
            router.push(
              `${ROUTES.signIn}?reason=${encodeURIComponent("Sign in to generate assessments.")}&next=${encodeURIComponent(ROUTES.stage4)}`,
            );
            return;
          }
          blockIfNoCredits();
        }}
        onPreview={() => {
          if (contentBlocked) {
            if (!user) {
              router.push(
                `${ROUTES.signIn}?reason=${encodeURIComponent("Sign in to generate assessments.")}&next=${encodeURIComponent(ROUTES.stage4)}`,
              );
              return;
            }
            blockIfNoCredits();
            return;
          }
          if (!draft.result) {
            toast.info("Generate an assessment to preview.");
            return;
          }
          setShowMarkScheme((v) => !v);
          toast.info(
            showMarkScheme
              ? "Showing student paper in preview."
              : "Showing mark scheme in preview.",
          );
        }}
        onToggleExport={() => {
          if (contentBlocked || !draft.result) {
            toast.info(
              contentBlocked
                ? !user
                  ? "Sign in to export assessments."
                  : "Upgrade to export assessments."
                : "Generate assessment first.",
            );
            if (contentBlocked && !user) {
              router.push(
                `${ROUTES.signIn}?reason=${encodeURIComponent("Sign in to generate assessments.")}&next=${encodeURIComponent(ROUTES.stage4)}`,
              );
            } else if (contentBlocked) {
              blockIfNoCredits();
            }
            return;
          }
          setExportMenuOpen((o) => !o);
        }}
        onExport={(id) => void onExport(id as Stage4DownloadActionId)}
        onShare={() => void onShare()}
        onSaveLibrary={() => void onSaveLibrary()}
      />

      {draft.isGenerating || draft.status ? (
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

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-[#1A1C30]">
              {showMarkScheme ? "Edit mark scheme" : "Edit student paper"}
            </h2>
            <textarea
              className="mt-3 min-h-[200px] w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#28C2C0]"
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (showMarkScheme) {
                    draft.setTeacherMarkSchemeText(editDraft);
                  } else {
                    draft.setStudentAssessmentText(editDraft);
                  }
                  setEditOpen(false);
                  void draft
                    .saveCurrentToLibrary()
                    .then(() => toast.success("Saved."))
                    .catch(() => toast.info("Updated locally."));
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {upgradeDialog}
    </div>
      </StageWorkspace>
    </div>
  );
}
