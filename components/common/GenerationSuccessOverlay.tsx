"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** One-shot success flash over content when `trigger` bumps (~1.7s). */
export function GenerationSuccessOverlay({
  children,
  trigger,
  className,
}: {
  children: ReactNode;
  /** Boolean edge or incrementing nonce when generation succeeds. */
  trigger: boolean | number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const prev = useRef(trigger);

  useEffect(() => {
    const fired =
      typeof trigger === "number"
        ? trigger > 0 && trigger !== prev.current
        : Boolean(trigger) && !prev.current;
    prev.current = trigger;
    if (!fired) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1700);
    return () => window.clearTimeout(t);
  }, [trigger]);

  return (
    <div className={cn("relative", className)}>
      {children}
      {visible ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end overflow-hidden rounded-2xl bg-[#28C2C0]/10 p-3"
          aria-hidden
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-white text-2xl text-[#28C2C0] shadow-md">
            ✓
          </div>
        </div>
      ) : null}
    </div>
  );
}


