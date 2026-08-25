import { callFunction } from "@/firebase/functions";
import {
  parseStage1Status,
  type LessonPlanSelection,
  type Stage1GenerationStatus,
} from "@/types/stage1";
import {
  clarificationAnswerToJson,
  type ClarificationAnswer,
} from "@/types/stage-clarification";

const GENERATE_TIMEOUT_MS = 5 * 60 * 1000;
const STATUS_TIMEOUT_MS = 25_000;

export async function generateStage1LessonPlan(
  selection: LessonPlanSelection,
  jobId: string,
  clarificationAnswers: ClarificationAnswer[] = [],
): Promise<string> {
  const payload: Record<string, unknown> = {
    topLevelId: selection.topLevelId,
    pathwayId: selection.pathwayId,
    gradeId: selection.gradeId,
    gradeDisplayName: selection.gradeDisplayName,
    subjectDisplayName: selection.subjectDisplayName,
    subjectName: selection.subjectName,
    subjectCode: selection.subjectCode,
    curriculumId: selection.curriculumId,
    curriculumName: selection.curriculumName,
    topic: selection.topic,
    method: selection.method,
    durationMinutes: selection.durationMinutes,
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
  >("generateStage1LessonPlan", payload, { timeout: GENERATE_TIMEOUT_MS });

  const status = parseStage1Status(data);
  const content =
    status.content ||
    String(data.content ?? "").trim();
  if (!content) {
    throw new Error("AI response is empty. Please try again.");
  }
  return content;
}

export async function getStage1GenerationStatus(
  jobId: string,
): Promise<Stage1GenerationStatus> {
  const data = await callFunction<{ jobId: string }, Record<string, unknown>>(
    "getStage1GenerationStatus",
    { jobId },
    { timeout: STATUS_TIMEOUT_MS },
  );
  return parseStage1Status(data);
}
