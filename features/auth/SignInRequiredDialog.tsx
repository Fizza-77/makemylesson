"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/urls";

export function SignInRequiredDialog({
  open,
  message,
  nextPath,
  onClose,
}: {
  open: boolean;
  message: string;
  nextPath: string;
  onClose: () => void;
}) {
  const router = useRouter();
  if (!open) return null;

  const next = encodeURIComponent(nextPath);
  const reason = encodeURIComponent(message);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#151B35]/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-required-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#F5F6FA] hover:text-[#0F172A]"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2
          id="sign-in-required-title"
          className="pr-10 text-lg font-bold tracking-tight text-[#151B35]"
        >
          Sign in first
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>

        <div className="mt-5 flex flex-col gap-2.5">
          <Button
            className="w-full rounded-full py-3"
            onClick={() => {
              onClose();
              router.push(
                `${ROUTES.signIn}?reason=${reason}&next=${next}`,
              );
            }}
          >
            Sign in
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full py-3"
            onClick={() => {
              onClose();
              router.push(`${ROUTES.signUp}?next=${next}`);
            }}
          >
            Create free account
          </Button>
        </div>
      </div>
    </div>
  );
}
