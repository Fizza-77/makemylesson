"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Shown under generated content in web trial mode — opens sign-in / sign-up on click. */
export function GuestSaveToLibraryPrompt({
  visible,
  onSave,
  className,
}: {
  visible: boolean;
  onSave: () => void;
  className?: string;
}) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between",
        "rounded-xl border border-[#CFE6E4] bg-[#F0FAFA] px-4 py-3",
        className,
      )}
    >
      <p className="text-sm text-[#334155]">
        Sign in to keep this in your library across devices.
      </p>
      <Button
        type="button"
        variant="outline"
        className="shrink-0 border-[#28C2C0] text-[#128C89] hover:bg-white"
        onClick={onSave}
      >
        Save to library
      </Button>
    </div>
  );
}


