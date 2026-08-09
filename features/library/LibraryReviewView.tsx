"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { LessonPlanContentView } from "@/features/stage1/LessonPlanContentView";
import { LessonPlanEditDialog } from "@/features/stage1/LessonPlanEditDialog";
import { Stage2SlideCanvas } from "@/features/stage2/Stage2SlideCanvas";
import { Stage3WorksheetContentView } from "@/features/stage3/Stage3WorksheetContentView";
import { Stage4AssessmentContentView } from "@/features/stage4/Stage4AssessmentContentView";
import { sortActionsByExportPreference } from "@/lib/export-format-prefs";
import { ROUTES } from "@/lib/urls";
import {
  downloadCompletePackZip,
  shareCompletePackZip,
} from "@/services/complete-pack-export.service";
import {
  downloadLessonPlanPdf,
  printLessonPlanPdf,
  shareLessonPlanPdf,
} from "@/services/lesson-plan-pdf.service";
import {
  updateActivityFromStage3,
  updateAssessmentFromStage4,
  updateLessonPlanBody,
} from "@/services/library-catalog.service";
import {
  runStage2DownloadAction,
  shareStage2Zip,
  STAGE2_DOWNLOAD_ACTIONS,
  type Stage2DownloadActionId,
} from "@/services/stage2-export.service";
import { hydrateSlidesForLibrary } from "@/services/stage2-slide-storage.service";
import {
  runStage3DownloadAction,
  shareStage3WorksheetZip,
  STAGE3_DOWNLOAD_ACTIONS,
  type Stage3DownloadActionId,
} from "@/services/stage3-export.service";
import {
  runStage4DownloadAction,
  shareStage4QuizZip,
  STAGE4_DOWNLOAD_ACTIONS,
  type Stage4DownloadActionId,
} from "@/services/stage4-export.service";
import { useAccountStore } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import {
  formatLibraryDate,
  kindTitle,
  useLibraryCatalogStore,
} from "@/store/library-catalog-store";
import { useStage1DraftStore } from "@/store/stage1-draft-store";
import { useStage2DraftStore } from "@/store/stage2-draft-store";
import { useStage3DraftStore } from "@/store/stage3-draft-store";
import { useStage4DraftStore } from "@/store/stage4-draft-store";
import { toast } from "@/store/toast-store";
import type { LibraryItem } from "@/types/library-item";
import { stage2SlideFromJson, type Stage2Slide } from "@/types/stage2";
import {
  stage3JsonFromResult,
  stage3ResultFromLibraryJson,
} from "@/types/stage3";
import {
  stage4ResultFromLibraryJson,
  stage4ResultToJson,
} from "@/types/stage4";

function stageRouteForKind(kind: LibraryItem["kind"]): string | null {
  switch (kind) {
    case "lessonPlan":
      return ROUTES.stage1;
    case "presentation":
      return ROUTES.stage2;
    case "activity":
      return ROUTES.stage3;
    case "assessment":
      return ROUTES.stage4;
    default:
      return null;
  }
}

function schoolNameFromAccount(
  account: { useSchoolNameInAi?: boolean; schoolName?: string | null } | null,
): string | null {
  return account?.useSchoolNameInAi && account.schoolName?.trim()
    ? account.schoolName.trim()
    : null;
}

export function LibraryReviewView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";

  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const items = useLibraryCatalogStore((s) => s.items);
  const loading = useLibraryCatalogStore((s) => s.loading);
  const getById = useLibraryCatalogStore((s) => s.getById);
  const planBundleMembers = useLibraryCatalogStore((s) => s.planBundleMembers);
  const toggleFavourite = useLibraryCatalogStore((s) => s.toggleFavourite);
  const removeById = useLibraryCatalogStore((s) => s.removeById);
  const loadLessonPlanFromLibrary = useStage1DraftStore(
    (s) => s.loadLessonPlanFromLibrary,
  );
  const prefillFromLibraryItem = useStage1DraftStore(
    (s) => s.prefillFromLibraryItem,
  );
  const loadPresentationFromLibrary = useStage2DraftStore(
    (s) => s.loadPresentationFromLibrary,
  );
  const loadActivityFromLibrary = useStage3DraftStore(
    (s) => s.loadActivityFromLibrary,
  );
  const loadAssessmentFromLibrary = useStage4DraftStore(
    (s) => s.loadAssessmentFromLibrary,
  );

  const item = useMemo(
    () => (id ? getById(id) : undefined),
    [getById, id, items],
  );

  const members = useMemo(
    () =>
      item?.kind === "completePack"
        ? planBundleMembers(item.planBundleId)
        : null,
    [item, planBundleMembers],
  );

  const presentationSlidesRaw = useMemo(() => {
    if (!item || item.kind !== "presentation") return [] as Stage2Slide[];
    return (item.presentationSlidesJson ?? []).map((raw) =>
      stage2SlideFromJson(raw),
    );
  }, [item]);

  const [presentationSlides, setPresentationSlides] = useState<Stage2Slide[]>(
    [],
  );
  const [hydratingSlides, setHydratingSlides] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!presentationSlidesRaw.length) {
      setPresentationSlides([]);
      return;
    }
    setHydratingSlides(true);
    void hydrateSlidesForLibrary(
      presentationSlidesRaw,
      item?.stage2JobId,
    )
      .then((slides) => {
        if (!cancelled) setPresentationSlides(slides);
      })
      .catch(() => {
        if (!cancelled) setPresentationSlides(presentationSlidesRaw);
      })
      .finally(() => {
        if (!cancelled) setHydratingSlides(false);
      });
    return () => {
      cancelled = true;
    };
  }, [presentationSlidesRaw, item?.stage2JobId]);

  const activityResult = useMemo(() => {
    if (!item || item.kind !== "activity") return null;
    return stage3ResultFromLibraryJson(
      item.stage3Json,
      item.reviewBody,
      item.teacherReviewBody ?? "",
    );
  }, [item]);

  const assessmentResult = useMemo(() => {
    if (!item || item.kind !== "assessment") return null;
    return stage4ResultFromLibraryJson(
      item.stage4Json,
      item.reviewBody,
      item.teacherReviewBody ?? "",
    );
  }, [item]);

  const [editOpen, setEditOpen] = useState(false);
  const [editTeacherMode, setEditTeacherMode] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showTeacherView, setShowTeacherView] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const account = useAccountStore((s) => s.account);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmFav, setConfirmFav] = useState(false);

  if (!authReady || (loading && !item && user)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center text-sm text-[#666666]">
        <p>Sign in to review library items.</p>
        <Link
          href={ROUTES.signIn}
          className="mt-3 inline-block font-semibold text-[#28C2C0]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!id || !item) {
    return (
      <div className="py-12 text-center text-sm text-[#666666]">
        <p>Library item not found.</p>
        <Link
          href={ROUTES.library}
          className="mt-3 inline-block font-semibold text-[#28C2C0]"
        >
          Back to library
        </Link>
      </div>
    );
  }

  const schoolName = schoolNameFromAccount(account);
  const activeSlide = presentationSlides[slideIndex] ?? null;

  async function onSaveEdit(value: string) {
    if (!item) return;
    if (item.kind === "lessonPlan") {
      await updateLessonPlanBody({
        id: item.id,
        reviewBody: value,
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        planBundleId: item.planBundleId,
      });
      toast.success("Lesson plan saved.");
      return;
    }
    if (item.kind === "activity") {
      const student = editTeacherMode ? item.reviewBody : value;
      const teacher = editTeacherMode
        ? value
        : (item.teacherReviewBody ?? "");
      const base =
        activityResult ??
        stage3ResultFromLibraryJson(null, student, teacher)!;
      const next = {
        ...base,
        studentActivityText: student,
        teacherAnswerKeyText: teacher,
      };
      await updateActivityFromStage3({
        id: item.id,
        studentReviewBody: student,
        teacherReviewBody: teacher,
        stage3Json: stage3JsonFromResult(next),
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
      });
      toast.success("Activity saved.");
      return;
    }
    if (item.kind === "assessment") {
      const student = editTeacherMode ? item.reviewBody : value;
      const teacher = editTeacherMode
        ? value
        : (item.teacherReviewBody ?? "");
      const base =
        assessmentResult ??
        stage4ResultFromLibraryJson(null, student, teacher)!;
      const next = {
        ...base,
        studentAssessmentText: student,
        teacherMarkSchemeText: teacher,
      };
      await updateAssessmentFromStage4({
        id: item.id,
        studentReviewBody: student,
        teacherReviewBody: teacher,
        stage4Json: stage4ResultToJson(next),
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
      });
      toast.success("Assessment saved.");
    }
  }

  function onDownloadPdf() {
    if (!item || item.kind !== "lessonPlan") return;
    try {
      downloadLessonPlanPdf({
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        content: item.reviewBody,
      });
      toast.success("PDF download started.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export PDF.");
    } finally {
      setExportOpen(false);
    }
  }

  function onPrintPdf() {
    if (!item || item.kind !== "lessonPlan") return;
    try {
      printLessonPlanPdf({
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        content: item.reviewBody,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not print.");
    } finally {
      setExportOpen(false);
    }
  }

  async function onShareLessonPlan() {
    if (!item || item.kind !== "lessonPlan") return;
    try {
      const result = await shareLessonPlanPdf({
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        content: item.reviewBody,
      });
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    }
  }

  async function onPresentationExport(action: Stage2DownloadActionId) {
    if (!item || item.kind !== "presentation") return;
    if (!presentationSlides.length) {
      toast.info("No slides saved for this presentation yet.");
      setExportOpen(false);
      return;
    }
    setExportOpen(false);
    setExporting(true);
    try {
      await runStage2DownloadAction(action, {
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        slides: presentationSlides,
        themeId: item.presentationStyle || "classic_navy",
        schoolName,
      });
      toast.success("Export ready.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export slides.");
    } finally {
      setExporting(false);
    }
  }

  async function onSharePresentation() {
    if (!item || item.kind !== "presentation") return;
    if (!presentationSlides.length) {
      toast.info("No slides saved for this presentation yet.");
      return;
    }
    setExporting(true);
    try {
      const result = await shareStage2Zip({
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        slides: presentationSlides,
        themeId: item.presentationStyle || "classic_navy",
        schoolName,
      });
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    } finally {
      setExporting(false);
    }
  }

  async function onActivityExport(action: Stage3DownloadActionId) {
    if (!item || item.kind !== "activity") return;
    setExportOpen(false);
    setExporting(true);
    try {
      await runStage3DownloadAction(action, {
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        activityTitle: activityResult?.activityTitle || item.topic,
        studentActivityText: item.reviewBody,
        teacherAnswerKeyText: item.teacherReviewBody ?? "",
        schoolName,
      });
      toast.success("Export ready.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export.");
    } finally {
      setExporting(false);
    }
  }

  async function onShareActivity() {
    if (!item || item.kind !== "activity") return;
    setExporting(true);
    try {
      const result = await shareStage3WorksheetZip({
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        activityTitle: activityResult?.activityTitle || item.topic,
        studentActivityText: item.reviewBody,
        teacherAnswerKeyText: item.teacherReviewBody ?? "",
        schoolName,
      });
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    } finally {
      setExporting(false);
    }
  }

  async function onAssessmentExport(action: Stage4DownloadActionId) {
    if (!item || item.kind !== "assessment") return;
    setExportOpen(false);
    setExporting(true);
    try {
      await runStage4DownloadAction(action, {
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        assessmentTitle:
          assessmentResult?.assessmentTitle ||
          assessmentResult?.paperTitle ||
          item.topic,
        studentPaperText: item.reviewBody,
        markSchemeText: item.teacherReviewBody ?? "",
        schoolName,
      });
      toast.success("Export ready.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export.");
    } finally {
      setExporting(false);
    }
  }

  async function onShareAssessment() {
    if (!item || item.kind !== "assessment") return;
    setExporting(true);
    try {
      const result = await shareStage4QuizZip({
        topic: item.topic,
        curriculumRoute: item.curriculumRoute,
        grade: item.grade,
        subject: item.subject,
        assessmentTitle:
          assessmentResult?.assessmentTitle ||
          assessmentResult?.paperTitle ||
          item.topic,
        studentPaperText: item.reviewBody,
        markSchemeText: item.teacherReviewBody ?? "",
        schoolName,
      });
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    } finally {
      setExporting(false);
    }
  }

  async function onCompletePackZip() {
    if (!item || item.kind !== "completePack" || !members) return;
    setExportOpen(false);
    setExporting(true);
    try {
      await downloadCompletePackZip({
        pack: item,
        members,
        schoolName,
      });
      toast.success("Complete plan ZIP download started.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export ZIP.");
    } finally {
      setExporting(false);
    }
  }

  async function onShareCompletePack() {
    if (!item || item.kind !== "completePack" || !members) return;
    setExporting(true);
    try {
      const result = await shareCompletePackZip({
        pack: item,
        members,
        schoolName,
      });
      if (result.success) toast.success(result.message);
      else toast.info(result.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not share.");
    } finally {
      setExporting(false);
    }
  }

  function onOpenInStage() {
    if (!item) return;
    if (item.kind === "lessonPlan") {
      loadLessonPlanFromLibrary({
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        grade: item.grade,
        curriculumRoute: item.curriculumRoute,
        reviewBody: item.reviewBody,
        planBundleId: item.planBundleId,
      });
      router.push(ROUTES.stage1);
      return;
    }
    if (item.kind === "presentation") {
      void loadPresentationFromLibrary({
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        grade: item.grade,
        curriculumRoute: item.curriculumRoute,
        reviewBody: item.reviewBody,
        speakerNotes: item.speakerNotes,
        presentationSlidesJson: item.presentationSlidesJson,
        presentationStyle: item.presentationStyle,
        planBundleId: item.planBundleId,
        stage2JobId: item.stage2JobId,
      }).then(() => {
        router.push(ROUTES.stage2);
      });
      return;
    }
    if (item.kind === "activity") {
      loadActivityFromLibrary({
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        grade: item.grade,
        curriculumRoute: item.curriculumRoute,
        reviewBody: item.reviewBody,
        teacherReviewBody: item.teacherReviewBody,
        stage3Json: item.stage3Json,
        planBundleId: item.planBundleId,
        activityOrAssessmentLabel: item.activityOrAssessmentLabel,
      });
      router.push(ROUTES.stage3);
      return;
    }
    if (item.kind === "assessment") {
      const bundle = item.planBundleId?.trim() || "";
      const relatedActivity = bundle
        ? useLibraryCatalogStore
            .getState()
            .items.find(
              (i) =>
                i.kind === "activity" && i.planBundleId?.trim() === bundle,
            )
        : undefined;
      loadAssessmentFromLibrary({
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        grade: item.grade,
        curriculumRoute: item.curriculumRoute,
        reviewBody: item.reviewBody,
        teacherReviewBody: item.teacherReviewBody,
        stage4Json: item.stage4Json,
        planBundleId: item.planBundleId,
        sourceLibraryItemId: relatedActivity?.id ?? null,
        sourceAssessmentText:
          relatedActivity?.reviewBody?.trim() ||
          relatedActivity?.teacherReviewBody?.trim() ||
          null,
      });
      router.push(ROUTES.stage4);
      return;
    }
    const route = stageRouteForKind(item.kind);
    if (route) {
      toast.info("Stage editor for this type is coming next.");
      router.push(route);
    }
  }

  function onRegenerate() {
    if (!item) return;
    if (item.kind === "lessonPlan") {
      prefillFromLibraryItem({
        topic: item.topic,
        subject: item.subject,
        grade: item.grade,
        curriculumRoute: item.curriculumRoute,
        planBundleId: item.planBundleId,
      });
      router.push(ROUTES.stage1);
      return;
    }
    onOpenInStage();
  }

  function openEdit() {
    if (!item) return;
    if (item.kind === "activity" || item.kind === "assessment") {
      setEditTeacherMode(showTeacherView);
    } else {
      setEditTeacherMode(false);
    }
    setEditOpen(true);
  }

  const editInitialValue =
    item.kind === "activity" || item.kind === "assessment"
      ? editTeacherMode
        ? (item.teacherReviewBody ?? "")
        : item.reviewBody
      : item.reviewBody;

  const canEdit =
    item.kind === "lessonPlan" ||
    item.kind === "activity" ||
    item.kind === "assessment";

  const showExportBar =
    item.kind === "lessonPlan" ||
    item.kind === "presentation" ||
    item.kind === "activity" ||
    item.kind === "assessment" ||
    item.kind === "completePack";

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={ROUTES.library}
            className="text-xs font-semibold text-[#28C2C0] hover:underline"
          >
            ← Library
          </Link>
          <p className="mt-2 text-xs font-semibold text-[#666666]">
            {kindTitle(item.kind)}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#1A1C30]">{item.topic}</h1>
          <p className="mt-1 text-sm text-[#666666]">
            {item.curriculumRoute} · {item.grade} · {item.subject}
          </p>
          <p className="mt-1 text-xs text-[#999999]">
            {formatLibraryDate(item.generatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="px-3 py-2 text-sm"
            onClick={() => setConfirmFav(true)}
          >
            {item.isFavourite ? "★ Favourited" : "☆ Favourite"}
          </Button>
          {item.kind !== "completePack" ? (
            <>
              <Button
                variant="outline"
                className="text-xs"
                onClick={onRegenerate}
              >
                Regenerate
              </Button>
              {canEdit ? (
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={openEdit}
                >
                  Edit
                </Button>
              ) : null}
              <Button
                variant="outline"
                className="text-xs"
                onClick={onOpenInStage}
              >
                Open in stage
              </Button>
            </>
          ) : null}
          <Button
            variant="outline"
            className="text-xs text-red-700"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {showExportBar ? (
        <div className="relative flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="text-xs"
            disabled={exporting}
            isLoading={exporting}
            onClick={() => setExportOpen((o) => !o)}
          >
            Download / Print
          </Button>
          <Button
            variant="outline"
            className="text-xs"
            disabled={exporting}
            onClick={() => {
              if (item.kind === "lessonPlan") void onShareLessonPlan();
              else if (item.kind === "presentation") void onSharePresentation();
              else if (item.kind === "activity") void onShareActivity();
              else if (item.kind === "assessment") void onShareAssessment();
              else if (item.kind === "completePack") void onShareCompletePack();
            }}
          >
            Share
          </Button>
          {exportOpen ? (
            <div className="absolute top-full left-0 z-10 mt-1 min-w-[16rem] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
              {item.kind === "lessonPlan" ? (
                <>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                    onClick={onDownloadPdf}
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                    onClick={onPrintPdf}
                  >
                    Print
                  </button>
                </>
              ) : null}
              {item.kind === "presentation"
                ? sortActionsByExportPreference(STAGE2_DOWNLOAD_ACTIONS).map(
                    (action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                      onClick={() => void onPresentationExport(action.id)}
                    >
                      {action.label}
                    </button>
                  ),
                  )
                : null}
              {item.kind === "activity"
                ? sortActionsByExportPreference(STAGE3_DOWNLOAD_ACTIONS).map(
                    (action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                      onClick={() => void onActivityExport(action.id)}
                    >
                      {action.label}
                    </button>
                  ),
                  )
                : null}
              {item.kind === "assessment"
                ? sortActionsByExportPreference(STAGE4_DOWNLOAD_ACTIONS).map(
                    (action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                      onClick={() => void onAssessmentExport(action.id)}
                    >
                      {action.label}
                    </button>
                  ),
                  )
                : null}
              {item.kind === "completePack" ? (
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                  onClick={() => void onCompletePackZip()}
                >
                  ZIP (all stages)
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <Card className="p-4 sm:p-5">
        {item.kind === "completePack" && members ? (
          <div className="space-y-4">
            <p className="text-sm text-[#666666]">
              <LessonPlanContentView
                content={item.reviewBody}
                emptyPlaceholder="Complete pack overview."
                className="prose prose-sm max-w-none text-[#666666] prose-p:my-0"
              />
            </p>
            <ul className="space-y-2">
              {(
                [
                  ["Lesson plan", members.lessonPlan],
                  ["Presentation", members.presentation],
                  ["Activity", members.activity],
                  ["Assessment", members.assessment],
                ] as const
              ).map(([label, member]) => (
                <li key={label}>
                  {member ? (
                    <Link
                      href={`${ROUTES.libraryReview}?id=${encodeURIComponent(member.id)}`}
                      className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm hover:border-[#28C2C0]/50"
                    >
                      <span>
                        <span className="font-semibold text-[#1A1C30]">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-xs text-[#666666]">
                          {member.topic}
                        </span>
                      </span>
                      <span className="text-[#28C2C0]">→</span>
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#E5E7EB] px-3 py-2 text-sm text-[#999999]">
                      {label} — not generated yet
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {members.lessonPlan?.reviewBody?.trim() ? (
              <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                <h3 className="text-sm font-bold text-[#1A1C30]">
                  Lesson plan preview
                </h3>
                <LessonPlanContentView content={members.lessonPlan.reviewBody} />
              </div>
            ) : null}
            {members.activity?.reviewBody?.trim() ? (
              <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                <h3 className="text-sm font-bold text-[#1A1C30]">
                  Activity preview
                </h3>
                <LessonPlanContentView content={members.activity.reviewBody} />
              </div>
            ) : null}
            {members.assessment?.reviewBody?.trim() ? (
              <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                <h3 className="text-sm font-bold text-[#1A1C30]">
                  Assessment preview
                </h3>
                <LessonPlanContentView
                  content={members.assessment.reviewBody}
                />
              </div>
            ) : null}
          </div>
        ) : item.kind === "lessonPlan" ? (
          <LessonPlanContentView content={item.reviewBody} />
        ) : item.kind === "presentation" ? (
          <div className="space-y-4">
            {hydratingSlides && !activeSlide ? (
              <div className="flex items-center gap-2 py-8 text-sm text-[#666666]">
                <Spinner className="size-5" />
                Loading slides…
              </div>
            ) : null}
            {presentationSlides.length && activeSlide ? (
              <>
                <Stage2SlideCanvas
                  slide={activeSlide}
                  themeId={item.presentationStyle || "classic_navy"}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    disabled={slideIndex <= 0}
                    onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                  >
                    Previous
                  </Button>
                  <p className="text-xs text-[#666666]">
                    Slide {slideIndex + 1} of {presentationSlides.length}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    disabled={slideIndex >= presentationSlides.length - 1}
                    onClick={() =>
                      setSlideIndex((i) =>
                        Math.min(presentationSlides.length - 1, i + 1),
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {presentationSlides.map((slide, i) => (
                    <button
                      key={`${slide.slideNumber}-${i}`}
                      type="button"
                      className={`shrink-0 rounded-lg border px-2 py-1 text-xs ${
                        i === slideIndex
                          ? "border-[#28C2C0] bg-[#E8F8F7] font-semibold text-[#1A1C30]"
                          : "border-[#E5E7EB] text-[#666666]"
                      }`}
                      onClick={() => setSlideIndex(i)}
                    >
                      {slide.slideTitle.trim() || `Slide ${i + 1}`}
                    </button>
                  ))}
                </div>
                {activeSlide.speakerNotes?.trim() ? (
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1C30]">
                      Speaker notes
                    </h3>
                    <LessonPlanContentView content={activeSlide.speakerNotes} />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="space-y-3">
                <LessonPlanContentView
                  content={item.reviewBody}
                  emptyPlaceholder="No slides saved for this presentation yet."
                />
                {item.speakerNotes?.trim() ? (
                  <>
                    <h3 className="pt-2 text-sm font-bold text-[#1A1C30]">
                      Speaker notes
                    </h3>
                    <LessonPlanContentView content={item.speakerNotes} />
                  </>
                ) : null}
              </div>
            )}
          </div>
        ) : item.kind === "activity" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={!showTeacherView ? "primary" : "outline"}
                className="text-xs"
                onClick={() => setShowTeacherView(false)}
              >
                Student activity
              </Button>
              <Button
                type="button"
                variant={showTeacherView ? "primary" : "outline"}
                className="text-xs"
                onClick={() => setShowTeacherView(true)}
              >
                Answer key
              </Button>
            </div>
            {showTeacherView ? (
              <LessonPlanContentView
                content={item.teacherReviewBody ?? ""}
                emptyPlaceholder="No answer key saved."
              />
            ) : activityResult?.items?.length ? (
              <Stage3WorksheetContentView
                items={activityResult.items}
                instructions={activityResult.studentInstructions}
              />
            ) : (
              <LessonPlanContentView
                content={item.reviewBody}
                emptyPlaceholder="No activity content saved."
              />
            )}
          </div>
        ) : item.kind === "assessment" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={!showTeacherView ? "primary" : "outline"}
                className="text-xs"
                onClick={() => setShowTeacherView(false)}
              >
                Student paper
              </Button>
              <Button
                type="button"
                variant={showTeacherView ? "primary" : "outline"}
                className="text-xs"
                onClick={() => setShowTeacherView(true)}
              >
                Mark scheme
              </Button>
            </div>
            {showTeacherView ? (
              <LessonPlanContentView
                content={item.teacherReviewBody ?? ""}
                emptyPlaceholder="No mark scheme saved."
              />
            ) : (
              <Stage4AssessmentContentView
                result={assessmentResult}
                emptyPlaceholder="No assessment content saved."
              />
            )}
          </div>
        ) : (
          <LessonPlanContentView
            content={item.reviewBody}
            emptyPlaceholder="No content saved for this item yet."
          />
        )}
      </Card>

      <LessonPlanEditDialog
        open={editOpen}
        initialValue={editInitialValue}
        onClose={() => setEditOpen(false)}
        onSave={onSaveEdit}
      />

      <ConfirmDialog
        open={confirmFav}
        title={
          item.isFavourite ? "Remove from Favorites?" : "Add to Favorites?"
        }
        message={`Are you sure you want to ${
          item.isFavourite ? "remove" : "add"
        } "${item.topic}" ${item.isFavourite ? "from" : "to"} favorites?`}
        onCancel={() => setConfirmFav(false)}
        onConfirm={() => {
          setConfirmFav(false);
          void toggleFavourite(item.id)
            .then(() =>
              toast.success(
                item.isFavourite
                  ? "Removed from favourites."
                  : "Added to favourites.",
              ),
            )
            .catch((e) =>
              toast.error(e instanceof Error ? e.message : "Action failed."),
            );
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${item.topic}?`}
        message={`Are you sure you want to delete\n${item.topic}?`}
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          void removeById(item.id)
            .then(() => {
              toast.success("Deleted from library.");
              router.replace(ROUTES.library);
            })
            .catch((e) =>
              toast.error(e instanceof Error ? e.message : "Delete failed."),
            );
        }}
      />
    </div>
  );
}
