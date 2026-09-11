import { callFunction } from "@/lib/firebase/functions";
import {
  parseClarificationQuestion,
  type ClarifyStageSourceRequest,
  type ClarifyStageSourceResult,
} from "@/types/stage-clarification";

const CLARIFY_TIMEOUT_MS = 45_000;

/**
 * Cheap upload-only clarifier (`clarifyStageSource`).
 * Returns null on soft failure so template MCQs still work.
 */
export async function clarifyUploadedSource(params: {
  stage: 2 | 3 | 4;
  topic: string;
  grade: string;
  subject: string;
  fileName: string;
  sourceExcerpt: string;
}): Promise<ClarifyStageSourceResult | null> {
  const excerpt = params.sourceExcerpt.trim();
  if (excerpt.length < 30) {
    return {
      readOk: false,
      documentKindOk: false,
      documentKindLabel: "",
      mismatchMessage:
        "We could not read usable text from this file. Please upload a clearer document.",
      summary: "",
      questions: [],
    };
  }

  try {
    const data = await callFunction<
      ClarifyStageSourceRequest,
      Record<string, unknown>
    >(
      "clarifyStageSource",
      {
        stage: params.stage,
        topic: params.topic,
        grade: params.grade,
        subject: params.subject,
        fileName: params.fileName,
        sourceExcerpt: excerpt.length > 2000 ? excerpt.slice(0, 2000) : excerpt,
      },
      { timeout: CLARIFY_TIMEOUT_MS },
    );

    const readOk = data.readOk !== false;
    const documentKindOk = data.documentKindOk !== false && readOk;
    const documentKindLabel = String(data.documentKindLabel ?? "").trim();
    const mismatchMessage = String(data.mismatchMessage ?? "").trim();
    const summary = String(data.summary ?? "").trim();
    const questions: ClarifyStageSourceResult["questions"] = [];

    // At most 1 AI follow-up, and only when document kind matches.
    if (documentKindOk && Array.isArray(data.questions)) {
      for (const item of data.questions.slice(0, 1)) {
        const q = parseClarificationQuestion(item);
        if (q) questions.push(q);
      }
    }

    return {
      readOk,
      documentKindOk,
      documentKindLabel,
      mismatchMessage,
      summary,
      questions,
    };
  } catch {
    return null;
  }
}


