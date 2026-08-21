import { Suspense } from "react";

import { OtpVerificationForm } from "@/features/auth/components/OtpVerificationForm";
import { Spinner } from "@/components/ui/Spinner";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <OtpVerificationForm />
    </Suspense>
  );
}
