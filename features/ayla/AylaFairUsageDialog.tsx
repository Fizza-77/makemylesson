"use client";

import { AYLA_FAIR_USAGE_HOURS, AYLA_PAID_CAP } from "@/services/user-account.service";

function waitLabel(resumeAtMs: number): string {
  const remainingMs = Math.max(0, resumeAtMs - Date.now());
  const hours = Math.min(
    AYLA_FAIR_USAGE_HOURS,
    Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000))),
  );
  return hours === 1 ? "about 1 hour" : `about ${hours} hours`;
}

/** Paid Ayla fair-usage cooldown (300 messages / 6h). */
export function AylaFairUsageDialog({
  open,
  resumeAtMs,
  onClose,
}: {
  open: boolean;
  resumeAtMs: number;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#151B35]/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ayla-fair-usage-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(21,27,53,0.12) 0%, #F5E6C8 100%)",
          }}
        >
          <h2
            id="ayla-fair-usage-title"
            className="text-lg font-bold tracking-tight text-[#151B35]"
          >
            Fair usage limit reached
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ayla’s rolling allowance is {AYLA_PAID_CAP} messages.
          </p>
        </div>
        <div className="flex flex-col gap-4 px-5 py-5">
          <p className="text-sm leading-relaxed text-[#151B35]">
            You’ve reached the fair usage limit for Ayla. Please come back in{" "}
            {waitLabel(resumeAtMs)} — your allowance will reset automatically.
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-[#151B35] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1f2748]"
            onClick={onClose}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
