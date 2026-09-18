"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/urls";

/** Mirrors Flutter Ayla unlock dialog — Not Now / Log In / Sign Up. */
export function AylaUnlockDialog({
  open,
  nextPath,
  onClose,
}: {
  open: boolean;
  nextPath: string;
  onClose: () => void;
}) {
  const router = useRouter();
  if (!open) return null;

  const next = encodeURIComponent(nextPath);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#151B35]/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ayla-unlock-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="ayla-unlock-title"
          className="text-lg font-bold tracking-tight text-[#151B35]"
        >
          Unlock Ayla
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Log in or sign up to chat with Ayla, your AI teaching assistant.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <Button
            className="w-full rounded-full py-3"
            onClick={() => {
              onClose();
              router.push(`${ROUTES.signUp}?next=${next}`);
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full py-3"
            onClick={() => {
              onClose();
              router.push(`${ROUTES.signIn}?next=${next}`);
            }}
          >
            Log In
          </Button>
          <button
            type="button"
            className="w-full py-1 text-center text-sm font-bold text-[#151B35] transition hover:text-[#28C2C0]"
            onClick={onClose}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
