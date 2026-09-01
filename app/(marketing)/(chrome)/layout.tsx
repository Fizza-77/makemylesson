import type { ReactNode } from "react";

import "../../marketing-base.css";
import "../../marketing-nav-core.css";
import "../../marketing-nav-lean.css";
import "../../marketing-footer.css";
import "../../marketing-mega-menus.css";
import "../../marketing-content.css";
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
