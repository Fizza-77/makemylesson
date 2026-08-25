"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  assessStageUploadDocumentKind,
  expectedDocLabel,
  isHighConfidenceMismatch,
} from "@/lib/stage-upload-document-kind";
import { clarifyUploadedSource } from "@/services/stage-clarification-ai.service";
import {
  OTHER_OPTION_ID,
  type ClarificationAnswer,
  type ClarificationSessionResult,
} from "@/types/stage-clarification";

import { GenerationChoiceDialog } from "./GenerationChoiceDialog";
import {
  GENERATION_QUESTIONS,
  toGenerationQuestion,
  type GenerationQuestion,
  type GenerationStage,
  recommendedChoiceId,
} from "./generation-questions";

export type { GenerationStage } from "./generation-questions";
export type { ClarificationSessionResult } from "@/types/stage-clarification";

/** Drives the "Stage N · grade — pathway · topic" line under the title. */
export type GenerationConfirmContext = {
  grade?: string | null;
  pathway?: string | null;
  topic?: string | null;
  subject?: string | null;
  /** Stages 2–4 upload path: call clarifyStageSource and may append 1 AI Q. */
  isUploadSource?: boolean;
  sourceText?: string | null;
  sourceFileName?: string | null;
};

type Pending = {
  stage: GenerationStage;
  questions: GenerationQuestion[];
  context: string;
  index: number;
  /** questionId -> choiceId */
  answers: Record<string, string>;
  /** questionId -> free text for the "Other" choice. */
  otherText: Record<string, string>;
  loadingAi: boolean;
  documentReadable: boolean;
  documentKindOk: boolean;
  documentSummary: string;
  mismatchMessage: string;
  documentKindLabel: string;
  isUploadSource: boolean;
  sourceFileName: string;
  errorMessage: string | null;
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

function buildAnswers(
  pending: Pending,
  forceRecommended: boolean,
): ClarificationAnswer[] {
  const out: ClarificationAnswer[] = [];
  for (const q of pending.questions) {
    const choiceId = forceRecommended
      ? recommendedChoiceId(q)
      : (pending.answers[q.id] ?? recommendedChoiceId(q));
    const choice =
      q.choices.find((c) => c.id === choiceId) ??
      q.choices.find((c) => c.id === recommendedChoiceId(q)) ??
      q.choices[0];
    if (!choice) continue;
    out.push({
      questionId: q.id,
      questionPrompt: q.question,
      optionId: choice.id,
      label: choice.label,
      customText:
        choice.id === OTHER_OPTION_ID
          ? (pending.otherText[q.id] ?? "").trim()
          : "",
    });
  }
  return out;
}

function validateCurrent(pending: Pending): string | null {
  if (pending.isUploadSource && !pending.documentReadable) {
    return "Upload a readable document before generating.";
  }
  if (pending.questions.length === 0) return null;
  const q = pending.questions[pending.index];
  if (!q) return null;
  const id = pending.answers[q.id];
  if (!id) return "Please choose an option to continue.";
  if (id === OTHER_OPTION_ID && !(pending.otherText[q.id] ?? "").trim()) {
    return "Please type your answer for Other.";
  }
  return null;
}

/**
 * Sequential pre-generation choice dialogs. Resolves with clarification
 * answers for Cloud Functions, or null when dismissed (aborts generation).
 */
export function useGenerationConfirm() {
  const [pending, setPending] = useState<Pending | null>(null);
  const resolverRef = useRef<
    ((result: ClarificationSessionResult | null) => void) | null
  >(null);
  const uploadRequestRef = useRef<GenerationConfirmContext | null>(null);

  const settle = useCallback((result: ClarificationSessionResult | null) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    uploadRequestRef.current = null;
    setPending(null);
    resolve?.(result);
  }, []);

  const confirmGeneration = useCallback(
    (stage: GenerationStage, context?: GenerationConfirmContext) => {
      return new Promise<ClarificationSessionResult | null>((resolve) => {
        resolverRef.current?.(null);
        const templates = GENERATION_QUESTIONS[stage].map((q) => ({
          ...q,
          choices: [...q.choices],
        }));
        const isUpload =
          Boolean(context?.isUploadSource) &&
          (stage === 2 || stage === 3 || stage === 4);

        uploadRequestRef.current = isUpload ? (context ?? null) : null;

        resolverRef.current = resolve;
        setPending({
          stage,
          questions: templates,
          context: buildContextLine(stage, context),
          index: 0,
          answers: defaultAnswers(templates),
          otherText: {},
          loadingAi: isUpload,
          documentReadable: true,
          documentKindOk: true,
          documentSummary: "",
          mismatchMessage: "",
          documentKindLabel: "",
          isUploadSource: isUpload,
          sourceFileName: (context?.sourceFileName ?? "").trim() || "upload",
          errorMessage: null,
        });
      });
    },
    [],
  );

  // Upload-only: call clarifyStageSource (plus local kind heuristics).
  useEffect(() => {
    if (!pending?.loadingAi || !pending.isUploadSource) return;
    const req = uploadRequestRef.current;
    const stage = pending.stage;
    if (stage === 1 || !req) return;

    let cancelled = false;
    const text = (req.sourceText ?? "").trim();
    const fileName = (req.sourceFileName ?? "").trim() || "upload";

    void (async () => {
      if (text.length < 30) {
        if (cancelled) return;
        setPending((prev) =>
          prev
            ? {
                ...prev,
                loadingAi: false,
                documentReadable: false,
                documentKindOk: false,
                documentSummary: "",
                mismatchMessage: "",
                errorMessage:
                  "We could not read usable text from your upload. Please upload a clearer file with selectable text.",
              }
            : prev,
        );
        return;
      }

      const local = assessStageUploadDocumentKind({
        stage,
        fileName,
        excerpt: text,
      });

      if (isHighConfidenceMismatch(local) && !cancelled) {
        setPending((prev) =>
          prev
            ? {
                ...prev,
                documentKindOk: false,
                documentKindLabel: local.documentKindLabel,
                mismatchMessage: local.mismatchMessage,
              }
            : prev,
        );
      }

      const result = await clarifyUploadedSource({
        stage,
        topic: (req.topic ?? "").trim(),
        grade: (req.grade ?? "").trim(),
        subject: (req.subject ?? "").trim(),
        fileName,
        sourceExcerpt: text,
      });

      if (cancelled) return;

      if (result === null) {
        setPending((prev) => {
          if (!prev) return prev;
          if (isHighConfidenceMismatch(local)) {
            return {
              ...prev,
              loadingAi: false,
              documentKindOk: false,
              documentKindLabel: local.documentKindLabel,
              mismatchMessage: local.mismatchMessage,
              documentSummary: "",
            };
          }
          return {
            ...prev,
            loadingAi: false,
            documentKindOk: true,
            documentKindLabel: "",
            mismatchMessage: "",
            documentSummary:
              "We extracted text from your file. Continuing with a couple of quick choices.",
          };
        });
        return;
      }

      setPending((prev) => {
        if (!prev) return prev;
        const kindOk =
          result.readOk &&
          result.documentKindOk &&
          !isHighConfidenceMismatch(local);
        const kindLabel = !kindOk
          ? isHighConfidenceMismatch(local)
            ? local.documentKindLabel
            : result.documentKindLabel
          : result.documentKindLabel;

        let mismatch = "";
        let errorMessage: string | null = null;
        if (!result.readOk) {
          errorMessage =
            "We could not reliably understand your document. Please upload another file with clear selectable text.";
        } else if (!kindOk) {
          mismatch = isHighConfidenceMismatch(local)
            ? local.mismatchMessage
            : result.mismatchMessage ||
              `This file looks like ${kindLabel || "the wrong document type"}, not ${expectedDocLabel(stage)}. Replace it for best results — you can still continue.`;
        }

        const questions = [...prev.questions];
        if (kindOk && result.questions.length > 0) {
          const existingIds = new Set(questions.map((q) => q.id));
          for (const raw of result.questions.slice(0, 1)) {
            if (existingIds.has(raw.id) || questions.length >= 3) break;
            const uiQ = toGenerationQuestion(raw);
            questions.push(uiQ);
            existingIds.add(uiQ.id);
          }
        }

        return {
          ...prev,
          loadingAi: false,
          documentReadable: result.readOk,
          documentKindOk: kindOk,
          documentKindLabel: kindLabel,
          mismatchMessage: mismatch,
          documentSummary: kindOk ? result.summary : result.summary,
          errorMessage,
          questions,
          answers: {
            ...defaultAnswers(questions),
            ...prev.answers,
          },
        };
      });
    })();

    return () => {
      cancelled = true;
    };
    // Only re-run when an upload clarification session starts loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: keyed off loadingAi flip
  }, [pending?.loadingAi, pending?.isUploadSource, pending?.stage]);

  const finish = useCallback(
    (opts: { forceRecommended: boolean; skipped: boolean }) => {
      setPending((prev) => {
        if (!prev) return prev;
        if (prev.isUploadSource && !prev.documentReadable) {
          return {
            ...prev,
            errorMessage: "Upload a readable document before generating.",
          };
        }
        if (!opts.forceRecommended) {
          const err = validateCurrent(prev);
          if (err) return { ...prev, errorMessage: err };
        }
        const answers = buildAnswers(prev, opts.forceRecommended);
        queueMicrotask(() =>
          settle({
            answers,
            documentSummary: prev.documentSummary,
            documentReadable: prev.documentReadable,
            skipped: opts.skipped,
            usedRecommended: opts.forceRecommended && !opts.skipped,
          }),
        );
        return prev;
      });
    },
    [settle],
  );

  if (!pending) {
    return { confirmGeneration, dialog: null as ReactNode };
  }

  const question = pending.loadingAi
    ? null
    : (pending.questions[pending.index] ?? null);
  const continueDisabled =
    pending.isUploadSource && !pending.documentReadable;

  const dialog = (
    <GenerationChoiceDialog
      question={question}
      index={pending.index}
      total={pending.questions.length}
      context={pending.context}
      selectedChoiceId={
        question ? (pending.answers[question.id] ?? "") : ""
      }
      otherText={question ? (pending.otherText[question.id] ?? "") : ""}
      loadingAi={pending.loadingAi}
      uploadBanner={
        pending.isUploadSource
          ? {
              fileName: pending.sourceFileName,
              readable: pending.documentReadable,
              summary: pending.documentSummary,
              mismatchMessage: pending.mismatchMessage,
              kindMismatch:
                pending.documentReadable && !pending.documentKindOk,
            }
          : null
      }
      errorMessage={pending.errorMessage}
      continueDisabled={continueDisabled}
      onSelectChoice={(choiceId) =>
        setPending((prev) =>
          prev && question
            ? {
                ...prev,
                answers: { ...prev.answers, [question.id]: choiceId },
                errorMessage: null,
              }
            : prev,
        )
      }
      onOtherTextChange={(text) =>
        setPending((prev) =>
          prev && question
            ? {
                ...prev,
                otherText: { ...prev.otherText, [question.id]: text },
                errorMessage: null,
              }
            : prev,
        )
      }
      onNext={() => {
        setPending((prev) => {
          if (!prev) return prev;
          const err = validateCurrent(prev);
          if (err) return { ...prev, errorMessage: err };
          if (prev.index < prev.questions.length - 1) {
            return { ...prev, index: prev.index + 1, errorMessage: null };
          }
          const answers = buildAnswers(prev, false);
          queueMicrotask(() =>
            settle({
              answers,
              documentSummary: prev.documentSummary,
              documentReadable: prev.documentReadable,
              skipped: false,
              usedRecommended: false,
            }),
          );
          return prev;
        });
      }}
      onUseRecommended={() =>
        finish({ forceRecommended: true, skipped: false })
      }
      onSkipAll={() => finish({ forceRecommended: true, skipped: true })}
      onDismiss={() => settle(null)}
    />
  );

  return { confirmGeneration, dialog };
}
