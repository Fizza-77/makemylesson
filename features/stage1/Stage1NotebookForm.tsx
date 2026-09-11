"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

/**
 * Positions as % of selection-stage1.svg viewBox (866×717).
 * Blank notebook — all labels and fields are overlays.
 */
const FIELD = {
  leftEyebrow: { left: "9.5%", top: "10.2%", width: "36%" },
  leftTitle: { left: "9.5%", top: "12.4%", width: "36%" },
  curriculum: {
    left: "9.5%",
    top: "17.0%",
    width: "36%",
    height: "7.6%",
  },
  programLabel: { left: "9.5%", top: "26.0%", width: "36%" },
  program: { left: "9.5%", top: "28.6%", width: "36%", height: "5.6%" },
  gradeLabel: { left: "9.5%", top: "36.0%", width: "17%" },
  grade: { left: "9.5%", top: "38.6%", width: "17%", height: "5.6%" },
  subjectLabel: { left: "28.5%", top: "36.0%", width: "17%" },
  subject: { left: "28.5%", top: "38.6%", width: "17%", height: "5.6%" },
  topicLabel: { left: "9.5%", top: "46.0%", width: "36%" },
  topic: { left: "9.5%", top: "48.6%", width: "36%", height: "5.6%" },
  tipLeft: { left: "7.5%", top: "60%", width: "42%" },

  rightEyebrow: { left: "53.5%", top: "10.2%", width: "35%" },
  rightTitle: { left: "53.5%", top: "12.4%", width: "35%" },
  methodLabel: { left: "53.5%", top: "17.8%", width: "35%" },
  method: { left: "53.5%", top: "20.4%", width: "35%", height: "5.6%" },
  includeHeading: { left: "53.5%", top: "28.0%", width: "22%" },
  includeAi: { left: "75%", top: "28.4%", width: "13%" },
  include1: { left: "53.5%", top: "31.8%", width: "35%", height: "6.2%" },
  include2: { left: "53.5%", top: "39.0%", width: "35%", height: "6.2%" },
  durationLabel: { left: "53.5%", top: "47.2%", width: "35%" },
  duration: { left: "53.5%", top: "49.8%", width: "35%", height: "5.6%" },
  tipRight: { left: "51.5%", top: "60%", width: "42%" },

  tabPlan: { left: "90.4%", top: "19.1%", width: "5.8%", height: "4.3%" },
  tabTeach: { left: "90.4%", top: "24.5%", width: "5.8%", height: "4.3%" },
  tabAssess: { left: "90.4%", top: "30.0%", width: "5.8%", height: "4.3%" },

  page01: { left: "10%", top: "81%", width: "10%" },
  page02: { left: "78%", top: "81%", width: "10%" },
} as const;

type SelectOption = { value: string; label: string };

function slotStyle(
  slot: { left: string; top: string; width: string; height?: string },
): CSSProperties {
  return {
    left: slot.left,
    top: slot.top,
    width: slot.width,
    ...(slot.height ? { height: slot.height } : null),
  };
}

function FieldLabel({
  style,
  children,
}: {
  style: CSSProperties;
  children: string;
}) {
  return (
    <p
      style={style}
      className="pointer-events-none absolute z-10 text-[8px] font-bold tracking-[0.12em] text-[#128C89] uppercase sm:text-[10px]"
    >
      {children}
    </p>
  );
}

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 shrink-0 text-[#28C2C0] transition-transform",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function PlanIncludeCard({
  title,
  style,
}: {
  title: string;
  style: CSSProperties;
}) {
  return (
    <div
      style={style}
      className="absolute z-10 flex items-center gap-2.5 overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white px-2.5 shadow-sm sm:px-3"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#20AAA7] text-white sm:size-8">
        <svg viewBox="0 0 12 12" className="size-3 fill-current" aria-hidden>
          <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
        </svg>
      </span>
      <p className="min-w-0 truncate text-[10px] font-bold text-[#151B35] sm:text-xs">
        {title}
      </p>
    </div>
  );
}

function TipBox({
  style,
  eyebrow,
  title,
  body,
}: {
  style: CSSProperties;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div style={style} className="absolute z-[6]">
      <div className="relative w-full">
        <Image
          src="/selectiontipbox.svg"
          alt=""
          width={420}
          height={204}
          className="pointer-events-none h-auto w-full select-none"
          unoptimized
        />
        {/* Text sits inside the teal tip shape (not the folded corner) */}
        <div
          className="absolute z-[1] flex flex-col overflow-hidden"
          style={{
            left: "16%",
            right: "12%",
            top: "22%",
            bottom: "22%",
          }}
        >
          <p className="text-[9px] font-bold tracking-wide text-[#1A6B69] uppercase sm:text-[10px]">
            {eyebrow}
          </p>
          <p className="mt-0.5 text-xs font-bold leading-tight text-[#151B35] sm:text-[13px]">
            {title}
          </p>
          <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-[#30416F]/85 sm:text-[11px]">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Themed custom dropdown — rounded, teal accents, Stage 1 fonts. */
function NotebookSelect({
  value,
  onChange,
  disabled,
  options,
  style,
  ariaLabel,
  placeholder = "Select…",
  stacked = false,
  /** Center a wide menu on screen (escapes notebook overflow clipping). */
  menuCenter = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  options: SelectOption[];
  style?: CSSProperties;
  ariaLabel: string;
  placeholder?: string;
  stacked?: boolean;
  menuCenter?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const label = selected?.label || placeholder;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const optionButtons = options.map((opt) => {
    const isActive = opt.value === value;
    return (
      <li key={opt.value || "__empty"} role="option" aria-selected={isActive}>
        <button
          type="button"
          className={cn(
            "flex w-full px-3 py-2.5 text-left font-semibold transition",
            stacked || menuCenter ? "text-sm" : "text-[10px] sm:text-xs",
            isActive
              ? "bg-[#E8F8F7] text-[#151B35]"
              : "text-[#151B35] hover:bg-[#F0FBFA]",
          )}
          onClick={() => {
            onChange(opt.value);
            setOpen(false);
          }}
        >
          {opt.label}
        </button>
      </li>
    );
  });

  const centeredMenu =
    open && menuCenter && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            role="presentation"
          >
            <button
              type="button"
              aria-label="Close method list"
              className="absolute inset-0 bg-[#0F172A]/35"
              onClick={() => setOpen(false)}
            />
            <div
              ref={menuRef}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl ring-1 ring-[#28C2C0]/15"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-[#151B35]">{ariaLabel}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#151B35]"
                >
                  Close
                </button>
              </div>
              <ul
                id={listId}
                role="listbox"
                aria-label={ariaLabel}
                className="theme-scroll max-h-[min(60vh,22rem)] overflow-y-auto py-1"
              >
                {optionButtons}
              </ul>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={rootRef}
      style={stacked ? undefined : style}
      className={cn(
        stacked ? "relative z-10 w-full" : "absolute z-10",
        open && "z-40",
      )}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-[10px] border bg-white text-left shadow-sm transition",
          stacked ? "min-h-11 px-3" : "h-full px-2.5 sm:px-3",
          "border-[#E5E7EB] hover:border-[#28C2C0]/60 hover:shadow-md",
          open && "border-[#28C2C0] shadow-md ring-2 ring-[#28C2C0]/25",
          disabled &&
            "cursor-not-allowed opacity-50 hover:border-[#E5E7EB] hover:shadow-sm",
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-semibold",
            stacked ? "text-sm" : "text-[10px] sm:text-xs",
            selected ? "text-[#151B35]" : "font-medium text-slate-400",
          )}
        >
          {label}
        </span>
        <ChevronIcon open={open} />
      </button>

      {centeredMenu}

      {open && !menuCenter ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-[calc(100%+4px)] right-0 left-0 z-50 max-h-40 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg ring-1 ring-[#28C2C0]/10"
        >
          {optionButtons}
        </ul>
      ) : null}
    </div>
  );
}

function DurationField({
  style,
  value,
  options,
  onChange,
  stacked = false,
}: {
  style?: CSSProperties;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  stacked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      style={stacked ? undefined : style}
      className={cn(
        stacked ? "relative z-10 w-full" : "absolute z-10",
        open && "z-40",
      )}
    >
      <button
        type="button"
        aria-label="Duration"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-[10px] border bg-white text-left shadow-sm transition",
          stacked ? "min-h-11 px-3" : "h-full px-2.5 sm:px-3",
          "border-[#E5E7EB] hover:border-[#28C2C0]/60 hover:shadow-md",
          open && "border-[#28C2C0] shadow-md ring-2 ring-[#28C2C0]/25",
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-semibold text-[#151B35]",
            stacked ? "text-sm" : "text-[10px] sm:text-xs",
          )}
        >
          {value}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Duration"
          className="absolute top-[calc(100%+4px)] right-0 left-0 z-50 max-h-40 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg ring-1 ring-[#28C2C0]/10"
        >
          {options.map((d) => {
            const isActive = d === value;
            return (
              <li key={d} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full px-3 py-2.5 text-left font-semibold transition",
                    stacked ? "text-sm" : "text-[10px] sm:text-xs",
                    isActive
                      ? "bg-[#E8F8F7] text-[#151B35]"
                      : "text-[#151B35] hover:bg-[#F0FBFA]",
                  )}
                  onClick={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                >
                  {d}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/** Matches selection-stage1 curriculum bar gradient (#35BEBC → #A7E7E4). */
function CurriculumChangeField({
  style,
  value,
  options,
  onChange,
  stacked = false,
}: {
  style?: CSSProperties;
  value: string;
  options: { id: string; name: string }[];
  onChange: (v: string) => void;
  stacked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      style={{
        ...(stacked ? null : style),
        backgroundImage: "linear-gradient(90deg, #35BEBC 0%, #A7E7E4 100%)",
      }}
      className={cn(
        "z-10 flex items-center gap-2 rounded-[12px] px-3 shadow-sm",
        stacked ? "relative min-h-12 w-full" : "absolute px-2.5 sm:gap-2.5 sm:px-3",
        open && "z-40 ring-2 ring-[#28C2C0]/30",
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-[#151B35] text-white",
          stacked ? "size-8" : "size-7 sm:size-8",
        )}
        aria-hidden
      >
        <svg viewBox="0 0 16 16" className="size-3.5 fill-current sm:size-4">
          <path d="M6.5 11.5 3 8l1.2-1.2 2.3 2.3 5.3-5.3L13 5.2l-6.5 6.3Z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-bold tracking-[0.12em] text-[#0D6B69] uppercase",
            stacked ? "text-[10px]" : "text-[8px] sm:text-[10px]",
          )}
        >
          Curriculum
        </p>
        <p
          className={cn(
            "truncate font-bold text-[#151B35]",
            stacked ? "text-sm" : "text-[10px] sm:text-xs",
          )}
        >
          {selected?.name ?? "Select…"}
        </p>
      </div>
      <button
        type="button"
        aria-label="Change curriculum"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "shrink-0 rounded-lg bg-white/70 px-2.5 py-1.5 font-semibold text-[#151B35] transition hover:bg-white",
          stacked ? "text-xs" : "text-[10px] sm:text-xs",
        )}
        onClick={() => setOpen((o) => !o)}
      >
        Change
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Curriculum"
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-50 max-h-48 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg ring-1 ring-[#28C2C0]/10"
        >
          {options.map((t) => {
            const isActive = t.id === value;
            return (
              <li key={t.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full px-3 py-2.5 text-left font-semibold transition",
                    stacked ? "text-sm" : "text-[10px] sm:text-xs",
                    isActive
                      ? "bg-[#E8F8F7] text-[#151B35]"
                      : "text-[#151B35] hover:bg-[#F0FBFA]",
                  )}
                  onClick={() => {
                    onChange(t.id);
                    setOpen(false);
                  }}
                >
                  {t.name}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export type Stage1NotebookFormProps = {
  topLevelId: string;
  pathwayId: string;
  gradeInternalId: string;
  subject: string;
  topic: string;
  method: string;
  duration: string;
  topLevels: { id: string; name: string }[];
  pathways: { id: string; name: string }[];
  grades: { gradeId: string; displayName: string }[];
  subjects: { displayName: string }[];
  methods: readonly string[];
  durations: readonly string[];
  pathwayDisabled?: boolean;
  gradeDisabled?: boolean;
  subjectDisabled?: boolean;
  unsupported?: boolean;
  onTopLevel: (v: string) => void;
  onPathway: (v: string) => void;
  onGrade: (v: string) => void;
  onSubject: (v: string) => void;
  onTopic: (v: string) => void;
  onMethod: (v: string) => void;
  onDuration: (v: string) => void;
};

function StackLabel({ children }: { children: string }) {
  return (
    <p className="mb-1.5 text-[11px] font-bold tracking-[0.12em] text-[#128C89] uppercase">
      {children}
    </p>
  );
}

function MobileLessonFieldsCard(props: Stage1NotebookFormProps) {
  return (
    <div className="rounded-[22px] border-[5px] border-[#35BEBC] bg-[#EAF5F6] p-4 md:hidden">
      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#128C89] uppercase">
            Teacher Planner
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#151B35]">Lesson Setup</h3>
        </div>

        <CurriculumChangeField
          stacked
          value={props.topLevelId}
          options={props.topLevels}
          onChange={props.onTopLevel}
        />

        <div>
          <StackLabel>Program</StackLabel>
          <NotebookSelect
            stacked
            ariaLabel="Program"
            value={props.pathwayId}
            onChange={props.onPathway}
            disabled={props.pathwayDisabled}
            options={[
              { value: "", label: "Select…" },
              ...props.pathways.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <StackLabel>Grade</StackLabel>
            <NotebookSelect
              stacked
              ariaLabel="Grade"
              value={props.gradeInternalId}
              onChange={props.onGrade}
              disabled={props.gradeDisabled}
              options={[
                { value: "", label: "Select…" },
                ...props.grades.map((g) => ({
                  value: g.gradeId,
                  label: g.displayName,
                })),
              ]}
            />
          </div>
          <div>
            <StackLabel>Subject</StackLabel>
            <NotebookSelect
              stacked
              ariaLabel="Subject"
              value={props.subject}
              onChange={props.onSubject}
              disabled={props.subjectDisabled}
              options={[
                { value: "", label: "Select…" },
                ...props.subjects.map((s) => ({
                  value: s.displayName,
                  label: s.displayName,
                })),
              ]}
            />
          </div>
        </div>

        <div>
          <StackLabel>Topic</StackLabel>
          <label className="flex min-h-11 items-center overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white px-3 shadow-sm transition focus-within:border-[#28C2C0] focus-within:ring-2 focus-within:ring-[#28C2C0]/25">
            <input
              aria-label="Topic"
              className="h-full w-full bg-transparent text-sm font-semibold text-[#151B35] outline-none placeholder:font-medium placeholder:text-slate-400"
              value={props.topic}
              onChange={(e) => props.onTopic(e.target.value)}
              placeholder="e.g. Photosynthesis"
            />
          </label>
        </div>

        <div className="border-t border-[#35BEBC]/35 pt-5">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#128C89] uppercase">
            Teaching Approach
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#151B35]">
            Lesson Structure
          </h3>
        </div>

        <div>
          <StackLabel>Method</StackLabel>
          <NotebookSelect
            stacked
            menuCenter
            ariaLabel="Method"
            value={props.method}
            onChange={props.onMethod}
            options={props.methods.map((m) => ({ value: m, label: m }))}
          />
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between gap-2">
            <p className="text-base font-bold text-[#151B35]">
              Your Plan Will Include
            </p>
            <p className="text-[10px] font-semibold text-[#128C89]">
              Generated
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 rounded-[12px] border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#20AAA7] text-white">
                <svg
                  viewBox="0 0 12 12"
                  className="size-3 fill-current"
                  aria-hidden
                >
                  <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
                </svg>
              </span>
              <p className="min-w-0 text-sm font-bold text-[#151B35]">
                Learning objectives
              </p>
            </div>
            <div className="flex items-center gap-2.5 rounded-[12px] border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#20AAA7] text-white">
                <svg
                  viewBox="0 0 12 12"
                  className="size-3 fill-current"
                  aria-hidden
                >
                  <path d="M4.8 8.6 2.4 6.2l.9-.9 1.5 1.5 3.6-3.6.9.9-4.5 4.5Z" />
                </svg>
              </span>
              <p className="min-w-0 text-sm font-bold text-[#151B35]">
                Timed teaching steps
              </p>
            </div>
          </div>
        </div>

        <div>
          <StackLabel>Duration</StackLabel>
          <DurationField
            stacked
            value={props.duration}
            options={props.durations}
            onChange={props.onDuration}
          />
        </div>

        {props.unsupported ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            This grade is not supported for the selected pathway.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Blank notebook SVG with labels + live fields overlaid (desktop). Mobile uses a cyan card. */
export function Stage1NotebookForm(props: Stage1NotebookFormProps) {
  return (
    <>
      <MobileLessonFieldsCard {...props} />

      <div className="relative hidden w-full md:block">
      <Image
        src="/selection-stage1.svg?v=3"
        alt=""
        width={866}
        height={717}
        className="pointer-events-none h-auto w-full select-none"
        priority
        unoptimized
        key="selection-stage1-v3"
      />

      {/* —— Left page —— */}
      <p
        style={slotStyle(FIELD.leftEyebrow)}
        className="pointer-events-none absolute z-10 text-[8px] font-bold tracking-[0.14em] text-[#128C89] uppercase sm:text-[10px]"
      >
        Teacher Planner
      </p>
      <p
        style={slotStyle(FIELD.leftTitle)}
        className="pointer-events-none absolute z-10 text-sm font-bold text-[#151B35] sm:text-lg"
      >
        Lesson Setup
      </p>

      <CurriculumChangeField
        style={slotStyle(FIELD.curriculum)}
        value={props.topLevelId}
        options={props.topLevels}
        onChange={props.onTopLevel}
      />

      <FieldLabel style={slotStyle(FIELD.programLabel)}>Program</FieldLabel>
      <NotebookSelect
        ariaLabel="Program"
        style={slotStyle(FIELD.program)}
        value={props.pathwayId}
        onChange={props.onPathway}
        disabled={props.pathwayDisabled}
        options={[
          { value: "", label: "Select…" },
          ...props.pathways.map((p) => ({ value: p.id, label: p.name })),
        ]}
      />

      <FieldLabel style={slotStyle(FIELD.gradeLabel)}>Grade</FieldLabel>
      <NotebookSelect
        ariaLabel="Grade"
        style={slotStyle(FIELD.grade)}
        value={props.gradeInternalId}
        onChange={props.onGrade}
        disabled={props.gradeDisabled}
        options={[
          { value: "", label: "Select…" },
          ...props.grades.map((g) => ({
            value: g.gradeId,
            label: g.displayName,
          })),
        ]}
      />

      <FieldLabel style={slotStyle(FIELD.subjectLabel)}>Subject</FieldLabel>
      <NotebookSelect
        ariaLabel="Subject"
        style={slotStyle(FIELD.subject)}
        value={props.subject}
        onChange={props.onSubject}
        disabled={props.subjectDisabled}
        options={[
          { value: "", label: "Select…" },
          ...props.subjects.map((s) => ({
            value: s.displayName,
            label: s.displayName,
          })),
        ]}
      />

      <FieldLabel style={slotStyle(FIELD.topicLabel)}>Topic</FieldLabel>
      <label
        style={slotStyle(FIELD.topic)}
        className="absolute z-10 flex items-center overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white px-2.5 shadow-sm transition focus-within:border-[#28C2C0] focus-within:ring-2 focus-within:ring-[#28C2C0]/25 sm:px-3"
      >
        <input
          aria-label="Topic"
          className="h-full w-full bg-transparent text-[10px] font-semibold text-[#151B35] outline-none placeholder:font-medium placeholder:text-slate-400 sm:text-xs"
          value={props.topic}
          onChange={(e) => props.onTopic(e.target.value)}
          placeholder="e.g. Photosynthesis"
        />
      </label>

      <TipBox
        style={slotStyle(FIELD.tipLeft)}
        eyebrow="Teacher reminder"
        title="Choose a focused topic"
        body="Specific topics help Ayla create stronger learning objectives and activities."
      />

      {/* —— Right page —— */}
      <p
        style={slotStyle(FIELD.rightEyebrow)}
        className="pointer-events-none absolute z-10 text-[8px] font-bold tracking-[0.14em] text-[#128C89] uppercase sm:text-[10px]"
      >
        Teaching Approach
      </p>
      <p
        style={slotStyle(FIELD.rightTitle)}
        className="pointer-events-none absolute z-10 text-sm font-bold text-[#151B35] sm:text-lg"
      >
        Lesson Structure
      </p>

      <FieldLabel style={slotStyle(FIELD.methodLabel)}>Method</FieldLabel>
      <NotebookSelect
        ariaLabel="Method"
        style={slotStyle(FIELD.method)}
        value={props.method}
        onChange={props.onMethod}
        options={props.methods.map((m) => ({ value: m, label: m }))}
        menuCenter
      />

      <p
        style={slotStyle(FIELD.includeHeading)}
        className="pointer-events-none absolute z-10 text-sm font-bold text-[#151B35] sm:text-base"
      >
        Your Plan Will Include
      </p>
      <p
        style={slotStyle(FIELD.includeAi)}
        className="pointer-events-none absolute z-10 text-right text-[9px] font-semibold text-[#128C89] sm:text-[10px]"
      >
        Generated
      </p>

      <PlanIncludeCard
        title="Learning objectives"
        style={slotStyle(FIELD.include1)}
      />
      <PlanIncludeCard
        title="Timed teaching steps"
        style={slotStyle(FIELD.include2)}
      />

      <FieldLabel style={slotStyle(FIELD.durationLabel)}>Duration</FieldLabel>
      <DurationField
        style={slotStyle(FIELD.duration)}
        value={props.duration}
        options={props.durations}
        onChange={props.onDuration}
      />

      <TipBox
        style={slotStyle(FIELD.tipRight)}
        eyebrow="Tip"
        title="Review before generating"
        body="Check the grade, subject and method so the lesson matches your classroom."
      />

      <span
        style={slotStyle(FIELD.tabPlan)}
        className="pointer-events-none absolute z-10 flex items-center justify-center text-[8px] font-bold tracking-wide text-[#0D1430] uppercase sm:text-[9px]"
      >
        plan
      </span>
      <span
        style={slotStyle(FIELD.tabTeach)}
        className="pointer-events-none absolute z-10 flex items-center justify-center text-[8px] font-bold tracking-wide text-[#0D1430] uppercase sm:text-[9px]"
      >
        teach
      </span>
      <span
        style={slotStyle(FIELD.tabAssess)}
        className="pointer-events-none absolute z-10 flex items-center justify-center text-[8px] font-bold tracking-wide text-white uppercase sm:text-[9px]"
      >
        access
      </span>

      <span
        style={slotStyle(FIELD.page01)}
        className="pointer-events-none absolute z-10 text-sm font-bold tracking-wide text-black sm:text-base"
      >
        01
      </span>
      <span
        style={slotStyle(FIELD.page02)}
        className="pointer-events-none absolute z-10 text-right text-sm font-bold tracking-wide text-black sm:text-base"
      >
        02
      </span>

      {props.unsupported ? (
        <p className="absolute bottom-[8%] left-[10%] z-10 max-w-[35%] rounded-lg bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 sm:text-xs">
          This grade is not supported for the selected pathway.
        </p>
      ) : null}
      </div>
    </>
  );
}


