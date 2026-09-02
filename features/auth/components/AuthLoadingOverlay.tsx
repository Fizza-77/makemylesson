"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function useRotatingMessage(messages: readonly string[], active: boolean, intervalMs = 2400) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [active, intervalMs, messages]);

  return messages[index] ?? messages[0];
}

function AuthLoaderRing() {
  return (
    <div className="relative size-[4.5rem]" aria-hidden>
      <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#28C2C0]/20 border-t-[#28C2C0]" />
      <div
        className="absolute inset-1.5 animate-spin rounded-full border-[3px] border-[#1A1C30]/10 border-b-[#1A1C30]/35"
        style={{ animationDirection: "reverse", animationDuration: "1.15s" }}
      />
      <div className="absolute inset-3 overflow-hidden rounded-lg shadow-sm">
        <Image src="/logo.png" alt="" width={40} height={40} className="size-full object-cover" />
      </div>
    </div>
  );
}

type AuthLoadingOverlayProps = {
  active: boolean;
  messages: readonly string[];
  className?: string;
};

export function AuthLoadingOverlay({ active, messages, className }: AuthLoadingOverlayProps) {
  const message = useRotatingMessage(messages, active);

  if (!active) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center bg-white px-6 py-10 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <AuthLoaderRing />
      <p
        key={message}
        className="mt-5 max-w-[20ch] rounded-full bg-[#E8F8F7] px-4 py-2 text-[15px] font-semibold leading-snug text-[#1A1C30] sm:text-base"
      >
        {message}
      </p>
      <p className="mt-2 text-xs text-[#666666] sm:text-sm">This usually takes just a few seconds</p>
    </div>
  );
}
