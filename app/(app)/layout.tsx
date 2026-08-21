import { AppShell } from "@/components/layout/AppShell";
import { ProfileRouteGuard } from "@/components/auth/ProfileRouteGuard";
import { AppProviders } from "@/components/providers/AppProviders";

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <ProfileRouteGuard>
        <AppShell>{children}</AppShell>
      </ProfileRouteGuard>
    </AppProviders>
  );
}
