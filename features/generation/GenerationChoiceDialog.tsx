"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import type { GenerationQuestion } from "./generation-questions";

type Props = {
  question: GenerationQuestion;
  /** Zero-based position, rendered as "Question {index + 1} of {total}". */
  index: number;
  total: number;
  /** e.g. "Stage 3 · Year 3 — Primary · Running" */
  context: string;
  selectedChoiceId: string;
  otherText: string;
  onSelectChoice: (choiceId: string) => void;
  onOtherTextChange: (text: string) => void;
  onNext: () => void;
  onUseRecommended: () => void;
  onSkipAll: () => void;
  onDismiss: () => void;
};

export function GenerationChoiceDialog({
  question,
  index,
  total,
  context,
  selectedChoiceId,
  otherText,
  onSelectChoice,
  onOtherTextChange,
  onNext,
  onUseRecommended,
  onSkipAll,
  onDismiss,
}: Props) {
  const isLast = index >= total - 1;
  const freeTextSelected = question.choices.some(
    (choice) => choice.freeText && choice.id === selectedChoiceId,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generation-choice-title"
      onClick={onDismiss}
    >
      <div
        className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="generation-choice-title"
            className="text-lg font-bold text-[#1A1C30]"
          >
            A few choices so we get this right
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onDismiss}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-[#666666] transition-colors hover:bg-[#F5F6FA] hover:text-[#1A1C30]"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="size-4"
              aria-hidden
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-xs font-semibold text-[#28C2C0]">
          Question {index + 1} of {total}
        </p>
        {context ? (
          <p className="mt-0.5 text-xs text-[#666666]">{context}</p>
        ) : null}

        <div className="mt-4 rounded-xl bg-[#F5F6FA] p-3.5">
          <p className="text-sm font-semibold leading-snug text-[#1A1C30]">
            {question.question}
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {question.choices.map((choice) => {
              const selected = choice.id === selectedChoiceId;
              return (
                <label
                  key={choice.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-xl border bg-white px-3 py-2.5 transition-colors",
                    selected
                      ? "border-[#28C2C0] ring-1 ring-[#28C2C0]/30"
                      : "border-[#E5E7EB] hover:border-[#28C2C0]/50",
                  )}
                >
                  <input
                    type="radio"
                    name={`generation-choice-${question.id}`}
                    value={choice.id}
                    checked={selected}
                    onChange={() => onSelectChoice(choice.id)}
                    className="mt-0.5 size-4 shrink-0 accent-[#28C2C0]"
                  />
                  <span className="min-w-0 flex-1 text-[13px] leading-snug text-[#1A1C30]">
                    {choice.label}
                  </span>
                  {choice.recommended ? (
                    <span className="shrink-0 rounded-full bg-[#E8F8F8] px-2 py-0.5 text-[10px] font-semibold text-[#1A9E9C]">
                      Recommended
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>

          {freeTextSelected ? (
            <input
              type="text"
              value={otherText}
              onChange={(event) => onOtherTextChange(event.target.value)}
              placeholder="Type your own"
              aria-label="Your own answer"
              autoFocus
              className="mt-2.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#1A1C30] placeholder:text-[#9CA3AF] focus:border-[#28C2C0] focus:outline-none"
            />
          ) : null}
        </div>

        <Button className="mt-4 w-full" onClick={onNext}>
          {isLast ? "Continue to generate" : "Next"}
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={onUseRecommended}>
          Use Recommended
        </Button>
        <button
          type="button"
          onClick={onSkipAll}
          className="mt-2.5 w-full text-center text-xs font-semibold text-[#28C2C0] hover:underline"
        >
          Skip all
        </button>
      </div>
    </div>
  );
}
