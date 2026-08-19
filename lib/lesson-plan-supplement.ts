/**
 * Standard lesson-plan sections the Flutter app appends to every Stage 1 plan.
 *
 * These are template boilerplate, not AI output — the model never returns them.
 * They are built at render/export time from the lesson's curriculum metadata so
 * they must never be written into `generatedSummary` / `reviewBody`, otherwise
 * they would be persisted to the library and duplicated on the next render.
 */

export type LessonPlanRubric = {
  heading: string;
  note: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
};

export type LessonPlanSupplement = {
  successCriteria: { heading: string; items: readonly string[] };
  curriculumAlignment: { heading: string; body: string };
  learningResources: { heading: string; items: readonly string[] };
  rubric: LessonPlanRubric;
  teacherReflection: {
    heading: string;
    note: string;
    questions: readonly string[];
  };
};

const LEARNING_RESOURCES = [
  "Whiteboard / projector or display screen",
  "Printed copies of this lesson plan and any worksheets",
  "Student notebooks or exercise books",
  "Topic-relevant visual aids (images, diagrams, or maps as applicable)",
  "Basic stationery (pencils, colored markers, paper)",
] as const;

const SUCCESS_CRITERIA = [
  "Students can: engage actively with the lesson content",
  "Students can: explain the key ideas covered in this lesson in their own words",
  "Students can: complete the assigned task or activity successfully",
] as const;

const REFLECTION_QUESTIONS = [
  "What worked well?",
  "What could be improved next time?",
  "Which students need additional support?",
] as const;

const RUBRIC: LessonPlanRubric = {
  heading: "Assessment Rubric (Informal Observation)",
  note: "For quick in-class observation during the lesson; not a formal graded assessment.",
  columns: ["Criteria", "Excellent", "Good", "Needs Support"],
  rows: [
    ["Participation", "Active", "Moderate", "Limited"],
    ["Understanding", "Accurate", "Mostly accurate", "Developing"],
    ["Collaboration", "Strong teamwork", "Some teamwork", "Works mostly alone"],
  ],
};

function dashIfBlank(value: string | null | undefined): string {
  const trimmed = (value ?? "").trim();
  return trimmed || "-";
}

export function buildLessonPlanSupplement(meta: {
  curriculumRoute: string;
  grade: string;
  subject: string;
}): LessonPlanSupplement {
  const curriculum = dashIfBlank(meta.curriculumRoute);
  const grade = dashIfBlank(meta.grade);
  const subject = dashIfBlank(meta.subject);

  return {
    successCriteria: { heading: "Success Criteria", items: SUCCESS_CRITERIA },
    curriculumAlignment: {
      heading: "Curriculum Alignment",
      body:
        `This lesson is designed to align with the ${curriculum} framework for ` +
        `${grade}, ${subject}. Teachers should cross-reference the activities and ` +
        `objectives above with their official syllabus documentation to confirm ` +
        `specific outcome codes for reporting.`,
    },
    learningResources: {
      heading: "Learning Resources",
      items: LEARNING_RESOURCES,
    },
    rubric: RUBRIC,
    teacherReflection: {
      heading: "Teacher Reflection",
      note: "To be completed after the lesson.",
      questions: REFLECTION_QUESTIONS,
    },
  };
}
