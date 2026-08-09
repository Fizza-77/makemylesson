import type { ReactNode } from "react";

import { MainAppNavShell } from "@/components/navigation/MainAppNavShell";

export function AppShell({ children }: { children: ReactNode }) {
  return <MainAppNavShell>{children}</MainAppNavShell>;
}
