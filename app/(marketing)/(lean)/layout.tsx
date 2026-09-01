import type { ReactNode } from "react";

import "../../marketing-lean.css";
import LeanMarketingShell from "@marketing/components/LeanMarketingShell";

export default function LeanMarketingLayout({ children }: { children: ReactNode }) {
  return (
    <LeanMarketingShell siteClassName="flex min-h-screen flex-col bg-white font-sans text-[#1a1e3a] antialiased">
      {children}
    </LeanMarketingShell>
  );
}
