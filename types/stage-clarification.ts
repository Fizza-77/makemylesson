/**
 * Pre-generation clarification shapes — mirrors MakeMyLesson Flutter
 * `stage_clarification.dart` so Cloud Function payloads stay compatible.
 */

export const OTHER_OPTION_ID = "other";

export type ClarificationOption = {
  id: string;
  label: string;
  recommended?: boolean;
};

export type ClarificationQuestion = {
  id: string;
  prompt: string;
  options: ClarificationOption[];
  allowOther?: boolean;
};

export type ClarificationAnswer = {
  questionId: string;
  questionPrompt: string;
  optionId: string;
  label: string;
  customText: string;
};

export type ClarificationSessionResult = {
  answers: ClarificationAnswer[];
  documentSummary: string;
  documentReadable: boolean;
  skipped: boolean;
  usedRecommended: boolean;
};

export type ClarifyStageSourceRequest = {
  stage: 1 | 2 | 3 | 4;
  topic: string;
  grade: string;
  subject: string;
  fileName: string;
  sourceExcerpt: string;
};

export type ClarifyStageSourceResult = {
  readOk: boolean;
  documentKindOk: boolean;
  documentKindLabel: string;
  mismatchMessage: string;
  summary: string;
  questions: ClarificationQuestion[];
};

export function clarificationAnswerToJson(
  answer: ClarificationAnswer,
): Record<string, string> {
  return {
    questionId: answer.questionId,
    questionPrompt: answer.questionPrompt,
    optionId: answer.optionId,
    label: answer.label,
    customText: answer.customText,
  };
}

export function difficultyFromAnswers(
  answers: ClarificationAnswer[],
): "easy" | "medium" | "hard" {
  for (const answer of answers) {
    if (answer.questionId === "difficulty") {
      const id = answer.optionId.trim().toLowerCase();
      if (id === "easy" || id === "medium" || id === "hard") return id;
    }
  }
  return "medium";
}

export function parseClarificationQuestion(
  raw: unknown,
): ClarificationQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const json = raw as Record<string, unknown>;
  const id = String(json.id ?? "").trim();
  const prompt = String(json.prompt ?? "").trim();
  if (!id || !prompt) return null;

  const options: ClarificationOption[] = [];
  const rawOptions = json.options;
  if (Array.isArray(rawOptions)) {
    for (const item of rawOptions) {
      if (!item || typeof item !== "object") continue;
      const opt = item as Record<string, unknown>;
      const optId = String(opt.id ?? "").trim();
      const label = String(opt.label ?? "").trim();
      if (!optId || !label) continue;
      options.push({
        id: optId,
        label,
        recommended: opt.recommended === true || opt.isRecommended === true,
      });
    }
  }

  return {
    id,
    prompt,
    options,
    allowOther: json.allowOther !== false,
  };
}
