/**
 * Copy for the pre-generation choice dialogs shown before every stage CTA.
 *
 * Wording is verbatim from the app, so treat it as content rather than code —
 * the recommended option is flagged per choice because it is not always first
 * (Stage 3 Q1 and Stage 4 Q2 recommend "Medium").
 *
 * Answers are display-only today: they gate generation but are not sent to the
 * Cloud Functions, so nothing downstream reads them yet.
 */

export type GenerationStage = 1 | 2 | 3 | 4;

export type GenerationChoice = {
  id: string;
  label: string;
  recommended?: boolean;
  /** Reveals a free-text field when picked. */
  freeText?: boolean;
};

export type GenerationQuestion = {
  id: string;
  question: string;
  choices: readonly GenerationChoice[];
};

const OTHER: GenerationChoice = {
  id: "other",
  label: "Other (type your own)",
  freeText: true,
};

const DIFFICULTY_CHOICES: readonly GenerationChoice[] = [
  { id: "easy", label: "Easy — gentler entry items for this grade" },
  { id: "medium", label: "Medium — on-level for this grade", recommended: true },
  { id: "hard", label: "Hard — more stretch and challenge" },
  OTHER,
];

// TODO: Stage 1 Question 1 is still missing its wording, so Stage 1 asks one
// question for now. Adding it here is all that's needed — the dialog counts
// questions per stage, so "Question 1 of 2" and the Next button follow.
const STAGE_1: readonly GenerationQuestion[] = [
  {
    id: "emphasis",
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
        id: "age_appropriate",
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
      "Based on your selected slides/source, how difficult should this formative check be?",
    choices: DIFFICULTY_CHOICES,
  },
  {
    id: "item_feel",
    question: "How should worksheet items feel for students?",
    choices: [
      {
        id: "quick_checks",
        label: "Quick checks with clear right answers",
        recommended: true,
      },
      {
        id: "explain",
        label: "Short thinking / explain-your-choice items",
      },
      { id: "scenarios", label: "Real-world classroom scenarios" },
      OTHER,
    ],
  },
];

const STAGE_4: readonly GenerationQuestion[] = [
  {
    id: "formality",
    question:
      "Based on your selected formative source, how formal should this summative paper feel?",
    choices: [
      {
        id: "classroom",
        label: "Classroom learning check (clear and friendly)",
        recommended: true,
      },
      { id: "exam_like", label: "More exam-like / formal tone" },
      {
        id: "mixed",
        label: "Mix of friendly stems with formal marking",
      },
      OTHER,
    ],
  },
  {
    id: "difficulty",
    question: "How difficult should this summative paper be?",
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
