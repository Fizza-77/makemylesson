/**
 * Template MCQs for the pre-generation clarification dialog.
 * Wording and IDs match Flutter `stage_clarification_catalog.dart` so
 * clarificationAnswers sent to Cloud Functions stay consistent with mobile.
 *
 * Upload sources for stages 2–4 may append at most one AI question from
 * `clarifyStageSource`.
 */

import type {
  ClarificationOption,
  ClarificationQuestion,
} from "@/types/stage-clarification";
import { OTHER_OPTION_ID } from "@/types/stage-clarification";

export type GenerationStage = 1 | 2 | 3 | 4;

/** UI-facing alias — same shape as ClarificationQuestion with freeText flags. */
export type GenerationChoice = ClarificationOption & {
  freeText?: boolean;
};

export type GenerationQuestion = {
  id: string;
  question: string;
  choices: readonly GenerationChoice[];
};

const OTHER: GenerationChoice = {
  id: OTHER_OPTION_ID,
  label: "Other (type your own)",
  freeText: true,
};

const DIFFICULTY_CHOICES: readonly GenerationChoice[] = [
  { id: "easy", label: "Easy - simpler questions for this year level" },
  {
    id: "medium",
    label: "Medium - questions at the expected year level",
    recommended: true,
  },
  {
    id: "hard",
    label: "Hard - challenging questions for deeper thinking",
  },
  OTHER,
];

const STAGE_1: readonly GenerationQuestion[] = [
  {
    id: "grade_fit",
    question: "Does the selected grade/year match the class you are teaching?",
    choices: [
      {
        id: "exact",
        label: "Yes — exact match for this class",
        recommended: true,
      },
      {
        id: "mixed",
        label: "Mostly — mixed ages / mixed ability in one room",
      },
      {
        id: "stretch",
        label: "Close — I need slightly harder or easier stretch",
      },
      OTHER,
    ],
  },
  {
    id: "lesson_focus",
    question: "What should this lesson emphasize most?",
    choices: [
      {
        id: "depth",
        label: "Depth of understanding over covering everything",
        recommended: true,
      },
      { id: "breadth", label: "Breadth — cover the full topic overview" },
      { id: "skills", label: "Skills practice and worked examples" },
      OTHER,
    ],
  },
];

const STAGE_2: readonly GenerationQuestion[] = [
  {
    id: "slide_density",
    question:
      "Based on your selected lesson source, how dense should each slide be?",
    choices: [
      {
        id: "balanced",
        label: "Balanced — short bullets + clear visuals",
        recommended: true,
      },
      {
        id: "text_light",
        label: "Text-light — fewer words, stronger visuals",
      },
      {
        id: "text_rich",
        label: "Text-rich — more detail for teacher projection",
      },
      OTHER,
    ],
  },
  {
    id: "language_level",
    question: "What language level should the slides use for this lesson source?",
    choices: [
      {
        id: "age_fit",
        label: "Age-appropriate for the selected grade",
        recommended: true,
      },
      {
        id: "simpler",
        label: "Simpler wording for EAL / support learners",
      },
      { id: "academic", label: "More academic vocabulary" },
      OTHER,
    ],
  },
];

const STAGE_3: readonly GenerationQuestion[] = [
  {
    id: "difficulty",
    question:
      "Based on your selected content, how difficult should this formative assessment be?",
    choices: DIFFICULTY_CHOICES,
  },
  {
    id: "item_feel",
    question: "What style of questions should the worksheet include?",
    choices: [
      {
        id: "quick",
        label: "Quick checks with clearly correct answers",
        recommended: true,
      },
      {
        id: "thinking",
        label: "Short-response and explain-your-choice questions",
      },
      {
        id: "real_world",
        label: "Questions based on real-world scenarios",
      },
      OTHER,
    ],
  },
];

const STAGE_4: readonly GenerationQuestion[] = [
  {
    id: "formality",
    question: "How formal should your summative assessment be?",
    choices: [
      {
        id: "classroom",
        label: "Classroom check - clear & friendly.",
        recommended: true,
      },
      { id: "exam_like", label: "Exam-style - formal tone." },
      {
        id: "mixed",
        label: "Friendly question wording with formal marking.",
      },
      OTHER,
    ],
  },
  {
    id: "difficulty",
    question: "How difficult should your summative assessment be?",
    choices: DIFFICULTY_CHOICES,
  },
];

export const GENERATION_QUESTIONS: Record<
  GenerationStage,
  readonly GenerationQuestion[]
> = {
  1: STAGE_1,
  2: STAGE_2,
  3: STAGE_3,
  4: STAGE_4,
};

export function recommendedChoiceId(question: GenerationQuestion): string {
  const recommended = question.choices.find((choice) => choice.recommended);
  return recommended?.id ?? question.choices[0]?.id ?? "";
}

/** Convert a cloud / model ClarificationQuestion into dialog UI shape. */
export function toGenerationQuestion(
  question: ClarificationQuestion,
): GenerationQuestion {
  const choices: GenerationChoice[] = question.options.map((opt) => ({
    id: opt.id,
    label: opt.label,
    recommended: opt.recommended,
  }));
  const allowOther = question.allowOther !== false;
  if (
    allowOther &&
    !choices.some((c) => c.id === OTHER_OPTION_ID)
  ) {
    choices.push({ ...OTHER });
  }
  return {
    id: question.id,
    question: question.prompt,
    choices,
  };
}


