"use client";

import { cn } from "@/lib/utils";

type Props = {
  fileName?: string | null;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
};

/** Small chosen-file line shown above a device uploader, with a deselect ×. */
export function ChosenDeviceFileChip({
  fileName,
  onClear,
  disabled,
  className,
}: Props) {
  const name = fileName?.trim();
  if (!name) return null;

  return (
    <div
      className={cn(
        "mb-1.5 flex min-w-0 items-center gap-1",
        className,
      )}
    >
      <p className="min-w-0 truncate text-[11px] font-medium leading-tight text-red-600">
        {name}
      </p>
      <button
        type="button"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
        aria-label={`Remove ${name}`}
        className="flex size-4 shrink-0 items-center justify-center rounded-full text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        <svg
          viewBox="0 0 12 12"
          className="size-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M3 3l6 6M9 3L3 9" />
        </svg>
      </button>
    </div>
  );
}


