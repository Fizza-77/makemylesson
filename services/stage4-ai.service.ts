import { callFunction } from "@/firebase/functions";
import {
  parseStage4Status,
  type Stage4GenerateRequest,
  type Stage4GenerationStatus,
} from "@/types/stage4";
import {
  clarificationAnswerToJson,
  difficultyFromAnswers,
  type ClarificationAnswer,
} from "@/types/stage-clarification";

const GENERATE_TIMEOUT_MS = 5 * 60 * 1000;
const STATUS_TIMEOUT_MS = 25_000;

export async function generateStage4Assessment(
  request: Stage4GenerateRequest,
  jobId: string,
  clarificationAnswers: ClarificationAnswer[] = [],
): Promise<Stage4GenerationStatus> {
  const payload: Record<string, unknown> = {
    curriculumFamily: request.curriculumFamily,
    routeId: request.routeId,
    pathwayProgram: request.pathwayProgram ?? null,
    stateOrProvince: request.stateOrProvince ?? null,
    gradeOrYear: request.gradeOrYear,
    subject: request.subject,
    topic: request.topic,
    teachingMethod: request.teachingMethod,
    assessmentDurationMinutes: request.assessmentDurationMinutes,
    assessmentType: request.assessmentType,
    selectedQuestionTypes: request.selectedQuestionTypes,
    sourceMode: request.sourceMode,
    sourceStage3Activity: request.sourceStage3Activity,
    teacherUploadedContextText: request.teacherUploadedContextText,
    stage1RouteId: request.stage1RouteId ?? null,
    stage3LibraryItemId: request.stage3LibraryItemId ?? null,
    totalMarks: request.totalMarks ?? null,
    numberOfItems: request.numberOfItems,
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
  >("generateStage4Assessment", payload, { timeout: GENERATE_TIMEOUT_MS });
  return parseStage4Status(data);
}

export async function getStage4GenerationStatus(
  jobId: string,
): Promise<Stage4GenerationStatus> {
  const data = await callFunction<{ jobId: string }, Record<string, unknown>>(
    "getStage4GenerationStatus",
    { jobId },
    { timeout: STATUS_TIMEOUT_MS },
  );
  return parseStage4Status(data);
}


