"use client";

import { cn } from "@/lib/utils";
import {
  STAGE4_DURATION_MINUTES,
  SUMMATIVE_KINDS,
  summativeQuestionBounds,
  type SummativeKind,
} from "@/types/stage4";

const KIND_META: Record<
  SummativeKind,
  { index: string; description: string }
> = {
  quiz: {
    index: "01",
    description: "Up to 10 quick questions. Short formative quiz.",
  },
  fullTest: {
    index: "02",
    description: "Up to 40 questions. Comprehensive summative test.",
  },
  exitTicket: {
    index: "03",
    description: "Up to 6 targeted questions. Set custom time limits.",
  },
};

const COMPOSER_TYPES = [
  {
    id: "multiple_choice" as const,
    key: "quizMultipleChoice" as const,
    abbr: "MCQ",
    label: "Multiple Choice",
  },
  {
    id: "true_false" as const,
    key: "quizTrueFalse" as const,
    abbr: "T/F",
    label: "True / False",
  },
  {
    id: "short_answer" as const,
    key: "quizShortAnswer" as const,
    abbr: "SA",
    label: "Short Answer",
  },
  {
    id: "fill_in_the_blanks" as const,
    key: "quizFillBlanks" as const,
    abbr: "—",
    label: "Fill Blanks",
  },
];

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 3v5h5M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 fill-current" aria-hidden>
      <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
    </svg>
  );
}

function BinderRings() {
  return (
    <div
      className="absolute top-3 bottom-3 left-0 z-10 flex w-3.5 flex-col justify-around"
      aria-hidden
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="ml-[-3px] size-2.5 rounded-full border-2 border-slate-300 bg-white shadow-sm"
        />
      ))}
    </div>
  );
}

function kindLabel(id: SummativeKind, fallback: string): string {
  if (id === "fullTest") return "Full Test";
  if (id === "exitTicket") return "Exit Ticket";
  return fallback;
}

const MARKS_TICK_LABELS = [5, 10, 15, 20, 30, 40] as const;

function RingGauge({
  label,
  progress,
}: {
  label: string;
  progress: number;
}) {
  const pct = Math.min(1, Math.max(0, progress));
  const r = 20;
  const c = 2 * Math.PI * r;
  const dash = pct * c;
  return (
    <div className="relative size-[5.25rem] shrink-0">
      <svg viewBox="0 0 52 52" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#DCEEEC"
          strokeWidth="4.5"
        />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#28C2C0"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#28C2C0]">
        {label}
      </span>
    </div>
  );
}

function ConditionSlider({
  labels,
  min,
  max,
  value,
  disabled,
  onChange,
  ariaLabel,
  className,
}: {
  labels: readonly number[];
  min: number;
  max: number;
  value: number;
  disabled?: boolean;
  onChange: (next: number) => void;
  ariaLabel: string;
  className?: string;
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const visibleLabels = labels.filter((n) => n >= min && n <= max);
  return (
    <div className={cn("pt-3", className)}>
      <div className="mb-1.5 flex justify-between px-0.5 text-[10px] font-medium text-slate-400">
        {visibleLabels.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div className="relative h-2.5">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#2A3348]" />
        <div
          className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-[#28C2C0]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={ariaLabel}
          className={cn(
            "absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:size-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-[#28C2C0] [&::-webkit-slider-thumb]:shadow",
            "[&::-moz-range-thumb]:size-[15px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#28C2C0] [&::-moz-range-thumb]:shadow",
            disabled && "opacity-50",
          )}
        />
      </div>
    </div>
  );
}

export function Stage4FinalPaperWorkshop({
  quizKind,
  questionCount,
  quizDurationIndex,
  totalMarks,
  marksMin,
  marksMax,
  quizMultipleChoice,
  quizTrueFalse,
  quizFillBlanks,
  quizShortAnswer,
  isGenerating,
  onSelectKind,
  onQuestionCount,
  onDurationIndex,
  onTotalMarks,
  onToggleType,
  onBuild,
}: {
  quizKind: SummativeKind | null;
  questionCount: number;
  quizDurationIndex: number;
  totalMarks: number;
  marksMin: number;
  marksMax: number;
  quizMultipleChoice: boolean;
  quizTrueFalse: boolean;
  quizFillBlanks: boolean;
  quizShortAnswer: boolean;
  isGenerating?: boolean;
  onSelectKind: (kind: SummativeKind) => void;
  onQuestionCount: (count: number) => void;
  onDurationIndex: (index: number) => void;
  onTotalMarks: (marks: number) => void;
  onToggleType: (
    key:
      | "quizMultipleChoice"
      | "quizTrueFalse"
      | "quizFillBlanks"
      | "quizShortAnswer",
    value: boolean,
  ) => void;
  onBuild: () => void;
}) {
  const typeFlags = {
    quizMultipleChoice,
    quizTrueFalse,
    quizFillBlanks,
    quizShortAnswer,
  };
  const enabledTypes = COMPOSER_TYPES.filter((t) => typeFlags[t.key]);
  const typeCount = enabledTypes.length;
  const [qMin, qMax] = summativeQuestionBounds(quizKind ?? "quiz");
  const durationMinutes =
    STAGE4_DURATION_MINUTES[quizDurationIndex] ??
    STAGE4_DURATION_MINUTES[0]!;
  const durationProgress =
    (quizDurationIndex + 1) / STAGE4_DURATION_MINUTES.length;
  const marksProgress =
    marksMax === marksMin
      ? 0
      : (totalMarks - marksMin) / (marksMax - marksMin);

  function qsForType(index: number): number {
    if (typeCount === 0) return 0;
    const base = Math.floor(questionCount / typeCount);
    const rem = questionCount % typeCount;
    return base + (index < rem ? 1 : 0);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#151B35]">
            <DocIcon />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Final Paper Workshop
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose an exam folder, compose the question mix and set paper
              conditions.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onBuild}
          className={cn(
            "shrink-0 rounded-full bg-[#E8F8F8] px-4 py-1.5 text-sm font-semibold text-[#1A9E9C] transition hover:bg-[#D5F3F2]",
            isGenerating && "opacity-50",
          )}
        >
          {isGenerating ? "Building…" : "Build"}
        </button>
      </header>

      <div className="border-t border-slate-200 px-4 py-5 sm:px-5 sm:py-6">
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          {/* 1 · Exam folder */}
          <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-[#F0F3F5] p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                  <span className="text-slate-400">1 ·</span> Exam folder
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-[#151B35]">
                  Choose Assessment Type
                </h3>
              </div>
              <p className="text-xs text-[#151B35]">Choose one folder</p>
            </div>

            <div className="flex flex-col gap-3">
              {SUMMATIVE_KINDS.map((kind) => {
                const meta = KIND_META[kind.id];
                const selected = quizKind === kind.id;
                const [, max] = summativeQuestionBounds(kind.id);
                return (
                  <div
                    key={kind.id}
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl border transition",
                      selected
                        ? "border-[#28C2C0] bg-white shadow-sm"
                        : "border-slate-200/90 bg-white",
                      isGenerating && "opacity-50",
                    )}
                  >
                    <BinderRings />
                    <div className="flex">
                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() => onSelectKind(kind.id)}
                        className={cn(
                          "flex w-11 shrink-0 items-center justify-center self-stretch text-xs font-bold tracking-wide text-white",
                          selected ? "bg-[#28C2C0]" : "bg-[#151B35]",
                        )}
                        aria-label={`Select ${kindLabel(kind.id, kind.label)}`}
                      >
                        {meta.index}
                      </button>
                      <div className="min-w-0 flex-1 py-3 pr-3 pl-4 sm:py-3.5 sm:pr-4">
                        <button
                          type="button"
                          disabled={isGenerating}
                          onClick={() => onSelectKind(kind.id)}
                          className="flex w-full items-start justify-between gap-2 text-left"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#151B35]">
                              {kindLabel(kind.id, kind.label)}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-slate-500">
                              {meta.description}
                            </p>
                          </div>
                          {selected ? (
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#28C2C0] text-white">
                              <CheckIcon />
                            </span>
                          ) : (
                            <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-[#28C2C0]/50" />
                          )}
                        </button>

                        {selected ? (
                          <div className="mt-3 rounded-xl border border-[#28C2C0]/50 bg-[#F8FBFC] px-3 py-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                                Number of questions
                              </p>
                              <p className="text-xs font-bold text-[#151B35]">
                                {questionCount} question
                                {questionCount === 1 ? "" : "s"}
                              </p>
                            </div>
                            <input
                              type="range"
                              min={qMin}
                              max={qMax}
                              value={Math.min(
                                qMax,
                                Math.max(qMin, questionCount),
                              )}
                              disabled={isGenerating}
                              onChange={(e) =>
                                onQuestionCount(Number(e.target.value))
                              }
                              className="mt-2 w-full accent-[#28C2C0]"
                              aria-label={`Number of questions, max ${max}`}
                            />
                            <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                              <span>{qMin}</span>
                              <span>{qMax}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2 · Question composer */}
          <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-[#151B35]">
            <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                  2 · Question composer
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-white">
                  Build the Question Mix
                </h3>
              </div>
              <p className="text-xs text-white/45">Toggle question types</p>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 px-4 py-4 sm:px-5">
              {COMPOSER_TYPES.map((opt) => {
                const on = typeFlags[opt.key];
                const enabledIndex = enabledTypes.findIndex(
                  (t) => t.key === opt.key,
                );
                const qs =
                  on && enabledIndex >= 0 ? qsForType(enabledIndex) : 0;
                return (
                  <div
                    key={opt.id}
                    className="flex items-center gap-3 rounded-xl border border-[#28C2C0]/45 bg-[#151B35] px-3 py-2.5"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#28C2C0] text-[10px] font-bold tracking-wide text-[#151B35]">
                      {opt.abbr}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">
                        {opt.label}
                      </p>
                      <p className="text-xs text-white/50">
                        {on ? `${qs} Qs` : "Off"}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={opt.label}
                      disabled={isGenerating}
                      onClick={() => onToggleType(opt.key, !on)}
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full transition",
                        on ? "bg-[#28C2C0]" : "bg-white/20",
                        isGenerating && "opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 size-5 rounded-full bg-white shadow transition",
                          on ? "left-[22px]" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0F1428] px-3 py-2.5 sm:mx-5 sm:mb-5">
              <p className="text-xs text-white/45">Current blueprint</p>
              <p className="text-sm font-semibold text-[#28C2C0]">
                {typeCount} type{typeCount === 1 ? "" : "s"} · {questionCount}{" "}
                question{questionCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        {/* Duration · Marks · Final build */}
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <RingGauge label="TIME" progress={durationProgress} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold tracking-wide text-[#28C2C0] uppercase">
                Duration
              </p>
              <p className="text-lg font-bold tracking-tight text-[#151B35]">
                {durationMinutes} min
              </p>
              <p className="mt-1 w-full text-[11px] leading-snug text-slate-500">
                Time students have to complete the paper.
              </p>
              <ConditionSlider
                labels={STAGE4_DURATION_MINUTES}
                min={0}
                max={STAGE4_DURATION_MINUTES.length - 1}
                value={quizDurationIndex}
                disabled={isGenerating}
                onChange={onDurationIndex}
                ariaLabel="Assessment duration"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <RingGauge label="Marks" progress={marksProgress} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold tracking-wide text-[#28C2C0] uppercase">
                Marks
              </p>
              <p className="text-lg font-bold tracking-tight text-[#151B35]">
                {totalMarks} marks
              </p>
              <p className="mt-1 w-full text-[11px] leading-snug text-slate-500">
                Balance marks with duration / difficulty.
              </p>
              <ConditionSlider
                labels={MARKS_TICK_LABELS}
                min={marksMin}
                max={marksMax}
                value={Math.min(marksMax, Math.max(marksMin, totalMarks))}
                disabled={isGenerating}
                onChange={onTotalMarks}
                ariaLabel="Total marks"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-3xl bg-[#151B35] p-5 shadow-sm">
            <div>
              <p className="text-[10px] font-bold tracking-wide text-[#28C2C0] uppercase">
                Final build
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/70">
                Ayla will generate both a student paper and a matched mark
                scheme.
              </p>
            </div>
            <button
              type="button"
              disabled={isGenerating}
              onClick={onBuild}
              className={cn(
                "w-full rounded-xl bg-gradient-to-r from-[#28C2C0] to-[#7AD9D7] px-4 py-3.5 text-sm font-bold text-[#151B35] shadow-sm transition hover:opacity-95",
                isGenerating && "opacity-50",
              )}
            >
              {isGenerating ? "Building…" : "Create My Quiz Or Test"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
