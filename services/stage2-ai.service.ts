import { callFunction } from "@/firebase/functions";
import {
  parseStage2Status,
  type Stage2GenerateRequest,
  type Stage2GenerationStatus,
} from "@/types/stage2";

const GENERATE_TIMEOUT_MS = 4 * 60 * 1000;
const IMAGE_BATCH_TIMEOUT_MS = 5 * 60 * 1000;
const STATUS_TIMEOUT_MS = 25_000;
const RETRY_IMAGE_TIMEOUT_MS = 2 * 60 * 1000;

export async function generateStage2Presentation(
  request: Stage2GenerateRequest,
  jobId: string,
): Promise<Stage2GenerationStatus> {
  const data = await callFunction<
    Record<string, unknown>,
    Record<string, unknown>
  >(
    "generateStage2Presentation",
    {
      curriculumFamily: request.curriculumFamily,
      routeId: request.routeId,
      pathwayProgram: request.pathwayProgram ?? null,
      stateOrProvince: request.stateOrProvince ?? null,
      gradeOrYear: request.gradeOrYear,
      subject: request.subject,
      topic: request.topic,
      teachingMethod: request.teachingMethod,
      lessonDuration: request.lessonDuration,
      presentationStyle: request.presentationStyle,
      sourceType: request.sourceType,
      sourceLessonText: request.sourceLessonText,
      stage1LibraryItemId: request.stage1LibraryItemId ?? null,
      jobId,
    },
    { timeout: GENERATE_TIMEOUT_MS },
  );
  return parseStage2Status(data);
}

export async function getStage2GenerationStatus(
  jobId: string,
): Promise<Stage2GenerationStatus> {
  const data = await callFunction<{ jobId: string }, Record<string, unknown>>(
    "getStage2GenerationStatus",
    { jobId },
    { timeout: STATUS_TIMEOUT_MS },
  );
  return parseStage2Status(data);
}

export async function startStage2ImageJobs(
  jobId: string,
): Promise<Record<string, unknown>> {
  return callFunction<{ jobId: string }, Record<string, unknown>>(
    "startStage2ImageJobs",
    { jobId },
    { timeout: IMAGE_BATCH_TIMEOUT_MS },
  );
}

export async function retryStage2Image(params: {
  jobId: string;
  slideNumber: number;
}): Promise<Record<string, unknown>> {
  return callFunction<
    { jobId: string; slideNumber: number },
    Record<string, unknown>
  >("retryStage2Image", params, { timeout: RETRY_IMAGE_TIMEOUT_MS });
}
