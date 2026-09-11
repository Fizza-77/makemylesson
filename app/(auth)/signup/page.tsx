import type { Metadata } from "next";
import { Suspense } from "react";

import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}


