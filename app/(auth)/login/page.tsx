import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/features/auth/components/SignInForm";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}


