/**
 * Local heuristics for Stage 2–4 upload document kind.
 * Mirrors Flutter `stage_upload_document_kind.dart` so CV/invoice mismatches
 * still warn when the cloud clarifier is unavailable or wrongly says OK.
 */

export type StageUploadKindConfidence =
  | "highMismatch"
  | "uncertain"
  | "likelyOk";

export type StageUploadKindResult = {
  documentKindOk: boolean;
  confidence: StageUploadKindConfidence;
  documentKindLabel: string;
  mismatchMessage: string;
};

export function isHighConfidenceMismatch(
  result: StageUploadKindResult,
): boolean {
  return !result.documentKindOk && result.confidence === "highMismatch";
}

function stageExpectedDocumentLabel(stage: number): string {
  switch (stage) {
    case 2:
      return "a lesson plan";
    case 3:
      return "your slides / presentation";
    case 4:
      return "a formative assessment or worksheet";
    default:
      return "the correct teaching document";
  }
}

function stageReplaceDocumentMessage(stage: number): string {
  switch (stage) {
    case 2:
      return "Stage 2 builds slides from a lesson plan. Please replace this file with a lesson plan for accurate results.";
    case 3:
      return "Stage 3 builds a worksheet from your slides. Please replace this file with presentation slides or notes related to your topic.";
    case 4:
      return "Stage 4 builds a summative quiz from a formative assessment. Please replace this file with a worksheet or formative assessment.";
    default:
      return "Please replace this file with the correct teaching document for this stage.";
  }
}

function countHits(blob: string, patterns: RegExp[]): number {
  let n = 0;
  for (const p of patterns) {
    if (p.test(blob)) n += 1;
  }
  return n;
}

export function assessStageUploadDocumentKind(params: {
  stage: number;
  fileName: string;
  excerpt: string;
}): StageUploadKindResult {
  const { stage } = params;
  const name = params.fileName.toLowerCase();
  const text = params.excerpt.toLowerCase();
  const blob = `${name}\n${text}`;

  const cvHits = countHits(blob, [
    /\bcv\b/i,
    /\bresume\b/i,
    /curriculum vitae/i,
    /\blinkedin\b/i,
    /employment history/i,
    /work experience/i,
    /professional experience/i,
    /references available/i,
    /cover letter/i,
  ]);
  const nameLooksCv =
    /(^|[^a-z])(cv|resume)([^a-z]|$)/i.test(name) ||
    name.includes("curriculum_vitae") ||
    name.includes("curriculum-vitae");

  if (nameLooksCv || cvHits >= 2) {
    return {
      documentKindOk: false,
      confidence: "highMismatch",
      documentKindLabel: "resume/CV",
      mismatchMessage: `This looks like a resume/CV, not ${stageExpectedDocumentLabel(stage)}. ${stageReplaceDocumentMessage(stage)}`,
    };
  }

  const invoiceHits = countHits(blob, [
    /\binvoice\b/i,
    /\breceipt\b/i,
    /amount due/i,
    /tax invoice/i,
  ]);
  if (invoiceHits >= 2) {
    return {
      documentKindOk: false,
      confidence: "highMismatch",
      documentKindLabel: "invoice/receipt",
      mismatchMessage: `This looks like an invoice or receipt, not ${stageExpectedDocumentLabel(stage)}. ${stageReplaceDocumentMessage(stage)}`,
    };
  }

  const expectedPatterns: RegExp[] =
    stage === 2
      ? [
          /lesson plan/i,
          /learning objective/i,
          /learning objectives/i,
          /success criteria/i,
          /plenary/i,
          /starter activity/i,
          /teaching method/i,
          /differentiation/i,
          /assessment for learning/i,
          /warm[- ]?up/i,
        ]
      : stage === 3
        ? [
            /\bslide\b/i,
            /presentation/i,
            /speaker notes/i,
            /slide title/i,
            /bullet/i,
            /deck/i,
          ]
        : stage === 4
          ? [
              /worksheet/i,
              /exit ticket/i,
              /formative/i,
              /multiple choice/i,
              /answer key/i,
              /quiz/i,
              /assessment/i,
              /practice questions/i,
            ]
          : [];

  const expectedHits = countHits(blob, expectedPatterns);
  if (expectedHits >= 2) {
    return {
      documentKindOk: true,
      confidence: "likelyOk",
      documentKindLabel: "",
      mismatchMessage: "",
    };
  }

  const nameLooksExpected =
    stage === 2
      ? name.includes("lesson_plan") ||
        name.includes("lesson-plan") ||
        name.includes("lessonplan")
      : stage === 3
        ? name.includes("slide") ||
          name.includes("presentation") ||
          name.includes("deck")
        : stage === 4
          ? name.includes("worksheet") ||
            name.includes("assessment") ||
            name.includes("formative") ||
            name.includes("exit_ticket") ||
            name.includes("exit-ticket")
          : false;

  if (nameLooksExpected) {
    return {
      documentKindOk: true,
      confidence: "likelyOk",
      documentKindLabel: "",
      mismatchMessage: "",
    };
  }

  if (cvHits >= 1 && expectedHits === 0) {
    return {
      documentKindOk: false,
      confidence: "highMismatch",
      documentKindLabel: "resume/CV",
      mismatchMessage: `This does not look like ${stageExpectedDocumentLabel(stage)}. ${stageReplaceDocumentMessage(stage)}`,
    };
  }

  return {
    documentKindOk: true,
    confidence: "uncertain",
    documentKindLabel: "",
    mismatchMessage: "",
  };
}

export function expectedDocLabel(stage: number): string {
  return stageExpectedDocumentLabel(stage);
}


