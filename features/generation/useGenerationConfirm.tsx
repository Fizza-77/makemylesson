"use client";

import { useCallback, useRef, useState } from "react";

import { GenerationChoiceDialog } from "./GenerationChoiceDialog";
import {
  GENERATION_QUESTIONS,
  type GenerationQuestion,
  type GenerationStage,
  recommendedChoiceId,
} from "./generation-questions";

export type { GenerationStage } from "./generation-questions";

/** Drives the "Stage N · grade — pathway · topic" line under the title. */
export type GenerationConfirmContext = {
  grade?: string | null;
  pathway?: string | null;
  topic?: string | null;
};

type Pending = {
  questions: readonly GenerationQuestion[];
  context: string;
  index: number;
  /** questionId -> choiceId. Display-only; nothing is sent downstream yet. */
  answers: Record<string, string>;
  /** questionId -> free text for the "Other" choice. */
  otherText: Record<string, string>;
};

function buildContextLine(
  stage: GenerationStage,
  context: GenerationConfirmContext | undefined,
): string {
  const grade = (context?.grade ?? "").trim();
  const pathway = (context?.pathway ?? "").trim();
  const topic = (context?.topic ?? "").trim();
  const gradeLabel =
    grade && pathway ? `${grade} — ${pathway}` : grade || pathway;
  return [`Stage ${stage}`, gradeLabel, topic].filter(Boolean).join(" · ");
}

function defaultAnswers(
  questions: readonly GenerationQuestion[],
): Record<string, string> {
  return Object.fromEntries(
    questions.map((question) => [question.id, recommendedChoiceId(question)]),
  );
}

/**
 * Sequential pre-generation choice dialogs, one question per step. Resolves
 * true when the teacher works through them (or takes the recommendations, or
 * skips), and false when they dismiss — which aborts the generation.
 */
export function useGenerationConfirm() {
  const [pending, setPending] = useState<Pending | null>(null);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const confirmGeneration = useCallback(
    (stage: GenerationStage, context?: GenerationConfirmContext) => {
      return new Promise<boolean>((resolve) => {
        resolverRef.current?.(false);
        const questions = GENERATION_QUESTIONS[stage];
        if (questions.length === 0) {
          resolve(true);
          return;
        }
        resolverRef.current = resolve;
        setPending({
          questions,
          context: buildContextLine(stage, context),
          index: 0,
          answers: defaultAnswers(questions),
          otherText: {},
        });
      });
    },
    [],
  );

  const settle = useCallback((confirmed: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setPending(null);
    resolve?.(confirmed);
  }, []);

  if (!pending) {
    return { confirmGeneration, dialog: null };
  }

  const question = pending.questions[pending.index];
  if (!question) {
    return { confirmGeneration, dialog: null };
  }

  const dialog = (
    <GenerationChoiceDialog
      question={question}
      index={pending.index}
      total={pending.questions.length}
      context={pending.context}
      selectedChoiceId={pending.answers[question.id] ?? ""}
      otherText={pending.otherText[question.id] ?? ""}
      onSelectChoice={(choiceId) =>
        setPending((prev) =>
          prev
            ? { ...prev, answers: { ...prev.answers, [question.id]: choiceId } }
            : prev,
        )
      }
      onOtherTextChange={(text) =>
        setPending((prev) =>
          prev
            ? { ...prev, otherText: { ...prev.otherText, [question.id]: text } }
            : prev,
        )
      }
      onNext={() => {
        if (pending.index < pending.questions.length - 1) {
          setPending({ ...pending, index: pending.index + 1 });
        } else {
          settle(true);
        }
      }}
      onUseRecommended={() => settle(true)}
      onSkipAll={() => settle(true)}
      onDismiss={() => settle(false)}
    />
  );

  return { confirmGeneration, dialog };
}
