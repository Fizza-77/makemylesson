import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-8 animate-spin rounded-full border-2 border-[#28C2C0]/25 border-t-[#28C2C0]",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}


