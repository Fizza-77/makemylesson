import { Suspense } from "react";

import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { Spinner } from "@/components/ui/Spinner";

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
