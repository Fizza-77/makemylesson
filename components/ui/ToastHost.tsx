"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useToastStore, type ToastVariant } from "@/store/toast-store";

const AUTO_DISMISS_MS = 5000;

const variantStyles: Record<ToastVariant, string> = {
  info: "border-amber-200 bg-[#FFF4D3] text-[#D97706]",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-800",
};

function ToastCard({
  id,
  message,
  variant,
}: {
  id: string;
  message: string;
  variant: ToastVariant;
}) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [dismiss, id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg",
        variantStyles[variant],
      )}
    >
      <p className="min-w-0 flex-1 font-medium leading-snug">{message}</p>
      <button
        type="button"
        onClick={() => dismiss(id)}
        className="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
          aria-hidden
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </motion.div>
  );
}

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:pb-6"
    >
      {/* Sit above mobile bottom nav */}
      <div className="mb-16 flex w-full max-w-md flex-col items-stretch gap-2 md:mb-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastCard
              key={t.id}
              id={t.id}
              message={t.message}
              variant={t.variant}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
