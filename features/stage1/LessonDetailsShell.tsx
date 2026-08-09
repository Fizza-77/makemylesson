"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function SparkleIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0 fill-current"
    >
      <path d="M10 1.5l1.2 4.2a2 2 0 001.3 1.3L16.7 8.2l-4.2 1.2a2 2 0 00-1.3 1.3L10 15l-1.2-4.3a2 2 0 00-1.3-1.3L3.3 8.2l4.2-1.2a2 2 0 001.3-1.3L10 1.5zM15.5 12.2l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4z" />
    </svg>
  );
}

export function LessonDetailsShell({
  children,
  footer,
  className,
}: {
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 bg-white px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
            <Image
              src="/icons/lesson-plan.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
              unoptimized
            />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[#151B35] sm:text-2xl">
              Lesson Details
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Choose the curriculum, class details, teaching method and lesson
              duration.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-600">
          Uses 1 credit
        </span>
      </header>

      <div className="border-t border-slate-200 bg-[#EEF1F4] px-3 pb-2 pt-4 sm:px-5 sm:pb-3 sm:pt-5">
        {children}
      </div>

      <footer className="border-t border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
        {footer}
      </footer>
    </section>
  );
}

export function CreateLessonPlanButton({
  onClick,
  disabled,
  isLoading,
}: {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-full bg-[#151B35] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1E2548] disabled:opacity-60"
    >
      <span className="text-cyan-300">
        <SparkleIcon />
      </span>
      {isLoading ? "Creating…" : "Create My Lesson Plan"}
    </button>
  );
}
