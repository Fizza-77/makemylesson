"use client";

import { useStage4DraftStore } from "@/store/stage4-draft-store";
import { cn } from "@/lib/utils";
import {
  STAGE4_MIN_SOURCE_CHARS,
  SUMMATIVE_KINDS,
} from "@/types/stage4";

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 fill-current" aria-hidden>
      <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
    </svg>
  );
}

/** Stage 4 sidebar — Final Checklist (replaces Tips & Resources). */
export function Stage4FinalChecklist({ className }: { className?: string }) {
  const sourceAssessmentText = useStage4DraftStore(
    (s) => s.sourceAssessmentText,
  );
  const sourceMode = useStage4DraftStore((s) => s.sourceMode);
  const sourceFileName = useStage4DraftStore((s) => s.sourceFileName);
  const quizKind = useStage4DraftStore((s) => s.quizKind);
  const quizMultipleChoice = useStage4DraftStore((s) => s.quizMultipleChoice);
  const quizTrueFalse = useStage4DraftStore((s) => s.quizTrueFalse);
  const quizFillBlanks = useStage4DraftStore((s) => s.quizFillBlanks);
  const quizShortAnswer = useStage4DraftStore((s) => s.quizShortAnswer);
  const result = useStage4DraftStore((s) => s.result);

  const sourceReady =
    sourceAssessmentText.trim().length >= STAGE4_MIN_SOURCE_CHARS;
  const paperReady = quizKind != null;
  const typeCount = [
    quizMultipleChoice,
    quizTrueFalse,
    quizFillBlanks,
    quizShortAnswer,
  ].filter(Boolean).length;
  const blueprintReady = typeCount > 0;
  const packReady = !!result;

  const paperLabel =
    SUMMATIVE_KINDS.find((k) => k.id === quizKind)?.label ?? "Quiz";

  const sourceSubtitle = !sourceReady
    ? "Add a source"
    : sourceMode === "stage3Library"
      ? "Stage 3 imported"
      : sourceFileName
        ? `Uploaded · ${sourceFileName}`
        : "Upload ready";

  const items = [
    {
      title: "Source selected",
      subtitle: sourceSubtitle,
      ready: sourceReady,
      step: 1,
    },
    {
      title: "Paper type",
      subtitle: paperReady ? paperLabel : "Choose quiz or test",
      ready: paperReady,
      step: 2,
    },
    {
      title: "Question blueprint",
      subtitle: blueprintReady
        ? `${typeCount} type${typeCount === 1 ? "" : "s"} selected`
        : "Select question types",
      ready: blueprintReady,
      step: 3,
    },
    {
      title: "Assessment pack",
      subtitle: packReady ? "Generated" : "Waiting…",
      ready: packReady,
      step: 4,
    },
  ] as const;

  const readyCount = items.filter((i) => i.ready).length;
  const progressPct = Math.round((readyCount / items.length) * 100);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
      aria-label="Final checklist"
    >
      <div className="bg-[#151B35] px-4 pb-4 pt-4 sm:px-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
            Exam readiness
          </p>
          <span className="shrink-0 rotate-6 rounded-md border border-[#28C2C0] px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#28C2C0] uppercase">
            Final stage
          </span>
        </div>
        <h2 className="mt-2 text-xl font-bold text-white">Final Checklist</h2>
        <p className="mt-1 text-xs text-white/70">
          {readyCount === 0
            ? "Complete setup before generating the pack."
            : readyCount === items.length
              ? "All set — your pack is ready."
              : `${readyCount} of ${items.length} complete.`}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              backgroundImage:
                "linear-gradient(90deg, #28C2C0 0%, #FFFFFF 100%)",
            }}
          />
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
          >
            {item.ready ? (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#28C2C0] text-white">
                <CheckIcon />
              </span>
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#28C2C0] text-sm font-bold text-[#28C2C0]">
                {item.step}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#151B35]">{item.title}</p>
              <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
            </div>
            <span
              className={cn(
                "shrink-0 text-xs font-semibold",
                item.ready ? "text-[#28C2C0]" : "text-slate-400",
              )}
            >
              {item.ready ? "Ready" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
