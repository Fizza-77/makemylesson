import { Suspense } from "react";

import { SignInForm } from "@/features/auth/components/SignInForm";
import { Spinner } from "@/components/ui/Spinner";

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
