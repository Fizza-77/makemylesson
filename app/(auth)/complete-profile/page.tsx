import { Suspense } from "react";

import { CompleteProfileForm } from "@/features/auth/components/CompleteProfileForm";
import { Spinner } from "@/components/ui/Spinner";

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CompleteProfileForm />
    </Suspense>
  );
}


