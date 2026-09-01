import type { Metadata } from "next";

import "../globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileRouteGuard } from "@/components/auth/ProfileRouteGuard";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <ProfileRouteGuard>
        <AppShell>{children}</AppShell>
      </ProfileRouteGuard>
    </AppProviders>
  );
}
