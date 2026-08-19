"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import generatingLottie from "@/data/generating-lottie.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const TIPS = [
  "Ayla is drafting the details…",
  "Lining up objectives and activities…",
  "Checking curriculum fit…",
  "Almost there — hang tight.",
];

export function GenerationBusyOverlay({
  active,
  title = "Generating your lesson",
  progress,
  status,
}: {
  active: boolean;
  title?: string;
  progress?: number;
  status?: string;
}) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setTipIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [active]);

  if (!active) return null;

  const pct =
    typeof progress === "number"
      ? Math.min(100, Math.max(0, Math.round(progress)))
      : null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0D1430]/55 px-4 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white px-6 py-7 text-center shadow-2xl">
        <Lottie
          animationData={generatingLottie}
          loop
          className="h-40 w-40"
          aria-hidden
        />
        <p className="mt-1 text-lg font-extrabold tracking-tight text-[#1A1C30]">
          {title}
        </p>
        <p className="mt-1.5 min-h-[1.35rem] text-sm text-[#5D6B84]">
          {status?.trim() || TIPS[tipIndex]}
        </p>
        {pct != null ? (
          <div className="mt-4 w-full">
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-[#14807e]">
              <span>Working</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E8F8F7]">
              <div
                className="h-full rounded-full bg-[#28C2C0] transition-[width] duration-300"
                style={{ width: `${Math.max(6, pct)}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
