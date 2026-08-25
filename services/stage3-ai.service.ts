import { callFunction } from "@/firebase/functions";
import {
  parseStage3Status,
  type Stage3GenerateRequest,
  type Stage3GenerationStatus,
} from "@/types/stage3";
import {
  clarificationAnswerToJson,
  difficultyFromAnswers,
  type ClarificationAnswer,
} from "@/types/stage-clarification";

const GENERATE_TIMEOUT_MS = 5 * 60 * 1000;
const STATUS_TIMEOUT_MS = 25_000;

export async function generateStage3Assessment(
  request: Stage3GenerateRequest,
  jobId: string,
  clarificationAnswers: ClarificationAnswer[] = [],
): Promise<Stage3GenerationStatus> {
  const payload: Record<string, unknown> = {
    curriculumFamily: request.curriculumFamily,
    routeId: request.routeId,
    pathwayProgram: request.pathwayProgram ?? null,
    stateOrProvince: request.stateOrProvince ?? null,
    gradeOrYear: request.gradeOrYear,
    subject: request.subject,
    topic: request.topic,
    teachingMethod: request.teachingMethod,
    lessonDuration: request.lessonDuration,
    activityFormat: request.activityFormat,
    selectedQuestionTypes: request.selectedQuestionTypes,
    numberOfItems: request.numberOfItems,
    sourceMode: request.sourceMode,
    sourceLessonPlanText: request.sourceLessonPlanText,
    sourcePresentationText: request.sourcePresentationText,
    teacherUploadedContextText: request.teacherUploadedContextText,
    stage1RouteId: request.stage1RouteId ?? null,
    stage2LibraryItemId: request.stage2LibraryItemId ?? null,
    difficulty: request.difficulty ?? difficultyFromAnswers(clarificationAnswers),
    jobId,
  };
  if (clarificationAnswers.length > 0) {
    payload.clarificationAnswers = clarificationAnswers.map(
      clarificationAnswerToJson,
    );
  }

  const data = await callFunction<
    Record<string, unknown>,
    Record<string, unknown>
  >("generateStage3Assessment", payload, { timeout: GENERATE_TIMEOUT_MS });
  return parseStage3Status(data);
}

export async function getStage3GenerationStatus(
  jobId: string,
): Promise<Stage3GenerationStatus> {
  const data = await callFunction<{ jobId: string }, Record<string, unknown>>(
    "getStage3GenerationStatus",
    { jobId },
    { timeout: STATUS_TIMEOUT_MS },
  );
  return parseStage3Status(data);
}
