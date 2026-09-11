import { Suspense } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { OrganizationDashboardView } from "@/features/organization/OrganizationDashboardView";

export default function OrganizationDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <OrganizationDashboardView />
    </Suspense>
  );
}


