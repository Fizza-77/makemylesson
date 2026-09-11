import { Suspense } from "react";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { Spinner } from "@/components/ui/Spinner";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}


