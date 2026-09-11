import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { Spinner } from "@/components/ui/Spinner";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}


