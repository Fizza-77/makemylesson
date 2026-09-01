import type { ReactNode } from "react";

import "../../marketing-globals.css";
import MarketingChrome from "@marketing/components/MarketingChrome";

export default function MarketingChromeLayout({ children }: { children: ReactNode }) {
  return (
    <MarketingChrome
      siteClassName="flex min-h-screen flex-col bg-white font-sans text-[#1a1e3a] antialiased"
      homeClassName="mml-marketing-page"
    >
      {children}
    </MarketingChrome>
  );
}
