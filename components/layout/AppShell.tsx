import type { ReactNode } from "react";

import { DesktopLogoSplash } from "@/components/common/DesktopLogoSplash";
import { MainAppNavShell } from "@/components/navigation/MainAppNavShell";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DesktopLogoSplash />
      <MainAppNavShell>{children}</MainAppNavShell>
    </>
  );
}


