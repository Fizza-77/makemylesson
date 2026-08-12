"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  requestScrollToAyla,
  scrollToAylaPanel,
} from "@/lib/ayla-scroll";
import { ROUTES } from "@/lib/urls";

function isLibraryOrProfile(pathname: string): boolean {
  return (
    pathname.startsWith(ROUTES.library) || pathname.startsWith(ROUTES.profile)
  );
}

/**
 * Mobile-web FAB (matches marketing Ayla character button).
 * Scrolls to the stage Ayla panel, or Stage 1 Ayla from Library / Profile.
 * Does not use hash URLs.
 */
export function AylaMobileFab() {
  const pathname = usePathname() || "";
  const router = useRouter();

  function onClick() {
    if (isLibraryOrProfile(pathname)) {
      requestScrollToAyla();
      router.push(ROUTES.stage1);
      return;
    }
    if (scrollToAylaPanel()) return;
    requestScrollToAyla();
    router.push(ROUTES.stage1);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="mml-app-ayla-fab fixed right-3 bottom-[5.5rem] z-[45] flex size-[4.75rem] items-center justify-center border-0 bg-transparent p-0 lg:hidden"
      aria-label="Chat with Ayla"
    >
      <Image
        src="/ayla.svg"
        alt=""
        width={96}
        height={96}
        className="pointer-events-none h-full w-full object-contain object-bottom drop-shadow-[0_8px_16px_rgba(26,30,58,0.22)]"
        unoptimized
        priority={false}
      />
      <span
        className="absolute right-0.5 bottom-0.5 inline-flex size-[1.45rem] items-center justify-center rounded-full border-2 border-white bg-[#35BEBC] text-[#1A1E3A] shadow-[0_2px_8px_rgba(26,30,58,0.2)]"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </span>
    </button>
  );
}
