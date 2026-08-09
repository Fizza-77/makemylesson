"use client";

import { Suspense } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { LibraryReviewView } from "@/features/library/LibraryReviewView";

export default function LibraryReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <LibraryReviewView />
    </Suspense>
  );
}
