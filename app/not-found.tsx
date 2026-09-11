import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found.",
  robots: { index: false, follow: false },
};

/** Global unmatched routes — root layout only, no marketing JSON-LD. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-sm font-medium tracking-wide text-[#35BEBC]">404</p>
      <h1 className="text-2xl font-semibold text-[#1a1e3a]">Page not found</h1>
      <p className="text-[#5a607a]">
        This URL does not exist or is no longer available.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-[#35BEBC] px-4 py-2 text-sm font-semibold text-white no-underline hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}


