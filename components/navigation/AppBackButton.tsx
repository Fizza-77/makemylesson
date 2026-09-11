"use client";

import { useRouter } from "next/navigation";

import { logicalBackPath } from "@/lib/app-back-navigation";

type Props = {
  pathname: string;
  className?: string;
};

/**
 * Flutter `AppBackIconButton` — pop history when possible, else logical parent.
 */
export function AppBackButton({ pathname, className }: Props) {
  const router = useRouter();

  function onBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(logicalBackPath(pathname));
  }

  return (
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      title="Back"
      className={
        className ??
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#1A1C30] hover:bg-[#F5F6FA]"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden
      >
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" />
      </svg>
    </button>
  );
}


