"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Lightbulb, X } from "lucide-react";
import { Lottie } from "lottie-react";

import { cn } from "@/lib/utils";

export type GenerationStage = 1 | 2 | 3 | 4;

const STAGE_LOTTIE: Record<
  GenerationStage,
  { src: string; assetsPath?: string }
> = {
  1: { src: "/animations/notes/12345.json" },
  2: { src: "/animations/ppt/12345.json" },
  3: {
    src: "/animations/quiz/12345.json",
    assetsPath: "/animations/quiz-images/",
  },
  4: {
    src: "/animations/check/f8d2fdbf-a0dd-43b1-a412-10a77ed8b152.json",
  },
};

type ChecklistItem = {
  id: string;
  label: string;
  /** Progress % at which this step completes */
  at: number;
};

const STAGE_COPY: Record<
  GenerationStage,
  {
    product: string;
    productTag: string;
    generatingTitle: string;
    generatingLead: string;
    readyTitle: string;
    guestReadyTitle: string;
    readyLead: string;
    readyPanelLead: string;
    openLabel: string;
    progressLabel: string;
    completeLabel: string;
    checklist: ChecklistItem[];
  }
> = {
  1: {
    product: "lesson plan",
    productTag: "Lesson Plan",
    generatingTitle: "Your lesson plan is being generated",
    generatingLead:
      "Your curriculum, year level and topic become a structured, classroom-ready plan.",
    readyTitle: "Your lesson plan is ready!",
    guestReadyTitle: "Lesson plan generated!",
    readyLead:
      "Everything is connected, generated and ready for you to review, edit or export.",
    readyPanelLead:
      "Your lesson plan has been generated and checked for curriculum alignment.",
    openLabel: "Open lesson plan",
    progressLabel: "Building lesson plan",
    completeLabel: "Lesson plan complete",
    checklist: [
      {
        id: "read",
        label: "Reading your curriculum, year level and topic",
        at: 20,
      },
      {
        id: "structure",
        label: "Structuring objectives, timing and lesson sequence",
        at: 45,
      },
      {
        id: "draft",
        label: "Drafting teaching activities and materials",
        at: 75,
      },
      {
        id: "check",
        label: "Final quality check — keeping the plan aligned",
        at: 95,
      },
    ],
  },
  2: {
    product: "presentation",
    productTag: "Presentation",
    generatingTitle: "Your presentation is being generated",
    generatingLead:
      "Slide-by-slide content and speaker notes from your lesson context.",
    readyTitle: "Your presentation is ready!",
    guestReadyTitle: "Presentation generated!",
    readyLead:
      "Your slides are connected to the lesson and ready for you to review, edit or export.",
    readyPanelLead:
      "Your presentation slides and speaker notes have been generated and checked for alignment.",
    openLabel: "Open presentation",
    progressLabel: "Building presentation",
    completeLabel: "Presentation complete",
    checklist: [
      {
        id: "read",
        label: "Reading your lesson plan and teaching context",
        at: 20,
      },
      {
        id: "structure",
        label: "Structuring slide sequence and learning flow",
        at: 45,
      },
      {
        id: "slides",
        label: "Creating presentation slides and speaker notes",
        at: 75,
      },
      {
        id: "check",
        label: "Final quality check — keeping slides aligned",
        at: 95,
      },
    ],
  },
  3: {
    product: "classroom activity",
    productTag: "Classroom Activity",
    generatingTitle: "Your classroom activity is being generated",
    generatingLead:
      "A ready-to-use activity with tasks and an answer key for your lesson.",
    readyTitle: "Your classroom activity is ready!",
    guestReadyTitle: "Activity generated!",
    readyLead:
      "Your activity is connected to the lesson and ready for you to review, edit or export.",
    readyPanelLead:
      "Your classroom activity and answer key have been generated and checked for alignment.",
    openLabel: "Open classroom activity",
    progressLabel: "Building classroom activity",
    completeLabel: "Classroom activity complete",
    checklist: [
      {
        id: "read",
        label: "Reading your lesson and presentation context",
        at: 20,
      },
      {
        id: "design",
        label: "Designing the classroom activity structure",
        at: 45,
      },
      {
        id: "build",
        label: "Building tasks, questions and answer key",
        at: 75,
      },
      {
        id: "check",
        label: "Final quality check — aligning activity with the lesson",
        at: 95,
      },
    ],
  },
  4: {
    product: "assessment",
    productTag: "Assessment",
    generatingTitle: "Your assessment is being generated",
    generatingLead:
      "An assessment with answer key and mark scheme from your teaching pack.",
    readyTitle: "Your assessment is ready!",
    guestReadyTitle: "Assessment generated!",
    readyLead:
      "Your assessment is connected to the pack and ready for you to review, edit or export.",
    readyPanelLead:
      "Your assessment and mark scheme have been generated and checked for alignment.",
    openLabel: "Open assessment",
    progressLabel: "Building assessment",
    completeLabel: "Assessment complete",
    checklist: [
      {
        id: "read",
        label: "Reading your teaching pack context",
        at: 20,
      },
      {
        id: "structure",
        label: "Structuring assessment objectives and marks",
        at: 45,
      },
      {
        id: "generate",
        label: "Generating the assessment and mark scheme",
        at: 75,
      },
      {
        id: "check",
        label: "Final quality check — keeping assessment aligned",
        at: 95,
      },
    ],
  },
};

function CheckIcon({ done, active }: { done: boolean; active: boolean }) {
  if (done) {
    return (
      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#28C2C0] text-white">
        <Check className="size-3" strokeWidth={3} aria-hidden />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2",
        active
          ? "border-[#28C2C0] bg-[#E8F8F7]"
          : "border-[#D7DEE8] bg-white",
      )}
      aria-hidden
    >
      {active ? (
        <span className="size-1.5 rounded-full bg-[#28C2C0]" />
      ) : null}
    </span>
  );
}

export function GenerationBusyOverlay({
  active,
  stage = 1,
  title,
  progress,
  status,
  tags = [],
  onDismiss,
  guestMode = false,
  autoDismissWhenReady = false,
  autoDismissDelayMs = 2200,
}: {
  active: boolean;
  stage?: GenerationStage;
  /** @deprecated Prefer stage-driven copy; kept for call-site compatibility */
  title?: string;
  progress?: number;
  status?: string;
  tags?: string[];
  /** Called when user opens the ready result or dismisses the ready screen */
  onDismiss?: () => void;
  /** Trial / guest mode — simpler “generated” copy and no library hints in status */
  guestMode?: boolean;
  /** When true, closes automatically after the ready state is shown */
  autoDismissWhenReady?: boolean;
  autoDismissDelayMs?: number;
}) {
  const copy = STAGE_COPY[stage];
  const [holdReady, setHoldReady] = useState(false);
  const sessionRef = useRef(false);

  useEffect(() => {
    if (active) {
      sessionRef.current = true;
      setHoldReady(true);
    }
  }, [active]);

  const visible = active || holdReady;
  const pct = Math.min(
    100,
    Math.max(0, Math.round(typeof progress === "number" ? progress : active ? 8 : 100)),
  );
  // Ready as soon as generation stops — no artificial hold after the cloud function.
  const isReady = !active && holdReady ? true : pct >= 100;

  const checklist = useMemo(() => {
    const items = copy.checklist;
    return items.map((item, i) => {
      const done = isReady || pct >= item.at;
      const prevDone = i === 0 ? true : isReady || pct >= items[i - 1].at;
      const current = !done && prevDone;
      return { ...item, done, current };
    });
  }, [copy.checklist, isReady, pct]);

  function dismiss() {
    sessionRef.current = false;
    setHoldReady(false);
    onDismiss?.();
  }

  useEffect(() => {
    if (!autoDismissWhenReady || !isReady || active) return;
    const id = window.setTimeout(() => dismiss(), autoDismissDelayMs);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dismiss on ready edge only
  }, [autoDismissWhenReady, autoDismissDelayMs, isReady, active]);

  if (!visible) return null;

  const heading = isReady
    ? guestMode
      ? copy.guestReadyTitle
      : copy.readyTitle
    : title?.trim() || copy.generatingTitle;
  const lead = isReady
    ? guestMode
      ? `Your ${copy.product} is ready to review, edit, or export.`
      : copy.readyLead
    : copy.generatingLead;
  const progressLabel = isReady
    ? guestMode
      ? copy.guestReadyTitle.replace(/!$/, "")
      : copy.completeLabel
    : copy.progressLabel;
  const displayPct = isReady ? 100 : Math.max(6, pct);
  const visibleTags = [
    copy.productTag,
    ...tags.map((t) => t.trim()).filter(Boolean),
  ].slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-[80] flex h-dvh flex-col overflow-hidden bg-white [font-family:'Nimbus_Sans',Helvetica,Arial,sans-serif]"
      role="status"
      aria-live="polite"
      aria-busy={active}
    >
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-[#E6EAF0] bg-white px-4 sm:px-6">
        <p className="text-[14px] font-bold tracking-tight text-[#1A1C30]">
          Make My Lesson
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#D7DEE8] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#1A1C30] transition hover:bg-[#F4F6FA]"
        >
          <X className="size-3.5" strokeWidth={2.25} aria-hidden />
          Cancel
        </button>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-5xl flex-1 items-center gap-4 overflow-y-auto px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-6 lg:overflow-hidden lg:py-4">
        <section className="flex min-h-0 min-w-0 flex-col justify-center bg-white py-1">
          <div className="mx-auto mb-2.5 size-12 overflow-hidden rounded-full bg-[#E8F8F7] ring-2 ring-[#28C2C0]/30 sm:size-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Group 7.svg"
              alt=""
              width={56}
              height={56}
              className="size-full object-cover"
              aria-hidden
            />
          </div>

          <h2 className="text-center text-[clamp(1.15rem,2vw,1.5rem)] font-bold leading-snug tracking-tight text-[#1A1C30]">
            {heading}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] leading-snug text-[#5D6B84]">
            {lead}
          </p>

          <div className="mt-3.5">
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] font-bold text-[#14807e]">
              <span>{progressLabel}</span>
              <span>{displayPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E8F8F7]">
              <div
                className="h-full rounded-full bg-[#28C2C0]"
                style={{ width: `${displayPct}%` }}
              />
            </div>
          </div>

          <ul className="mt-3.5 flex flex-col gap-2">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <CheckIcon done={item.done} active={item.current && !item.done} />
                <span
                  className={cn(
                    "pt-0.5 text-[13px] leading-snug",
                    item.done
                      ? "font-bold text-[#1A1C30]"
                      : item.current
                        ? "font-bold text-[#1A1C30]"
                        : "text-[#7A8699]",
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {!isReady ? (
            <div className="mt-3.5 flex gap-2.5 rounded-xl border border-[#F0E2B8] bg-[#FFF8E8] px-3 py-2">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F5D56E] text-[#1A1C30]">
                <Lightbulb className="size-3.5" strokeWidth={2.25} aria-hidden />
              </span>
              <p className="text-[12px] leading-snug text-[#5C4E2A]">
                <span className="font-bold">While Ayla works:</span> your{" "}
                {copy.product} stays aligned as one connected workflow.
                {status?.trim() ? (
                  <>
                    {" "}
                    <span className="text-[#7A6A3C]">({status.trim()})</span>
                  </>
                ) : null}
              </p>
            </div>
          ) : autoDismissWhenReady ? null : (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#1A1E3A] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#242845]"
              >
                {copy.openLabel}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[#D7DEE8] bg-white px-4 py-2.5 text-[13px] font-bold text-[#1A1C30] transition hover:bg-[#F4F6FA]"
              >
                Close preview
              </button>
            </div>
          )}
        </section>

        <section className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-3 py-1">
          <div className="flex w-full max-w-[20rem] flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A8699]">
              {isReady ? "Ready" : "Building"}
            </span>
            {visibleTags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                  i === 0
                    ? "bg-[#28C2C0] text-white"
                    : "border border-[#D7DEE8] bg-white text-[#1A1C30]",
                )}
              >
                {i === 0 ? (
                  <span
                    className="size-1.5 rounded-full bg-white"
                    aria-hidden
                  />
                ) : null}
                {tag}
              </span>
            ))}
          </div>

          {isReady ? (
            <div className="w-full max-w-[18rem] rounded-2xl border border-[#E6EAF0] bg-white px-5 py-5 text-center shadow-[0_14px_40px_rgba(26,28,48,0.1)] sm:max-w-[20rem]">
              <div className="mx-auto mb-3 inline-flex size-12 items-center justify-center rounded-xl bg-[#28C2C0] shadow-sm">
                <Check
                  className="size-6 text-[#1A1C30]"
                  strokeWidth={3}
                  aria-hidden
                />
              </div>
              <h3 className="text-[1.05rem] font-bold tracking-tight text-[#1A1C30]">
                {guestMode ? copy.guestReadyTitle : copy.readyTitle}
              </h3>
              <p className="mt-1.5 text-[12px] leading-snug text-[#5D6B84]">
                {guestMode
                  ? `Your ${copy.product} is ready to review, edit, or export.`
                  : copy.readyPanelLead}
              </p>
              {autoDismissWhenReady ? null : (
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#1A1E3A] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#242845]"
                >
                  {copy.openLabel}
                </button>
              )}
            </div>
          ) : (
            <div className="relative flex size-[min(20rem,48vh)] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E8E4DC] bg-[#FFFDF8] shadow-sm">
              <div className="flex size-[88%] items-center justify-center">
                <Lottie
                  key={stage}
                  src={STAGE_LOTTIE[stage].src}
                  assetsPath={STAGE_LOTTIE[stage].assetsPath}
                  autoplay
                  loop
                  className="h-full w-full"
                  aria-hidden
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
