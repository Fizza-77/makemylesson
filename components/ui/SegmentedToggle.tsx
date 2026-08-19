"use client";

import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  id: T;
  label: string;
};

export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (id: T) => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl bg-[#F1F3F7] p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-[10px] px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-white text-[#1A1C30] shadow-sm"
                : "text-[#6B7280] hover:text-[#1A1C30]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
