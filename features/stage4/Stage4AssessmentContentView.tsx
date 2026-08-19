"use client";

import { MarkdownContentView } from "@/components/common/MarkdownContentView";
import { WorksheetContentView } from "@/components/common/WorksheetContentView";
import { worksheetQuestionMarkdown } from "@/lib/format-worksheet-markdown";
import {
  parseStage4QuestionsFromRawJson,
  type Stage4AssessmentResult,
} from "@/types/stage4";

export function Stage4AssessmentContentView({
  result,
  emptyPlaceholder = "Generate an assessment to preview content.",
}: {
  result: Stage4AssessmentResult | null;
  emptyPlaceholder?: string;
}) {
  if (!result) {
    return (
      <p className="text-sm leading-relaxed text-[#666666]">{emptyPlaceholder}</p>
    );
  }

  const questions = parseStage4QuestionsFromRawJson(result.rawJson);
  const body = result.studentAssessmentText.trim();

  if (questions.length === 0 && !body) {
    return (
      <p className="text-sm leading-relaxed text-[#666666]">{emptyPlaceholder}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {(result.paperTitle || result.assessmentTitle) && (
        <div>
          <h3 className="text-base font-semibold text-[#1A1C30]">
            {result.paperTitle || result.assessmentTitle}
          </h3>
          <p className="mt-1 text-xs text-[#666666]">
            {result.assessmentDurationMinutes} min · {result.totalMarks} marks
          </p>
        </div>
      )}

      {questions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div
              key={q.number}
              className="rounded-xl border border-[#E8F8F7] bg-[#FAFCFC] px-3 py-3"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#28C2C0]">
                Q{q.number}
                {q.marks ? ` · ${q.marks} mark${q.marks === 1 ? "" : "s"}` : ""}
                {q.questionType ? ` · ${q.questionType}` : ""}
              </p>
              <div className="mt-2">
                <MarkdownContentView
                  content={worksheetQuestionMarkdown({
                    prompt: q.questionText,
                    questionType: q.questionType,
                  })}
                  className="prose-p:my-0 prose-p:text-sm prose-p:font-medium"
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-[#F5F6FA] p-4">
          <WorksheetContentView content={body} />
        </div>
      )}
    </div>
  );
}
