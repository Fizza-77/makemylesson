import type { ReactNode } from "react";

import DeferredCookieConsent from "@marketing/components/DeferredCookieConsent";
import StaticSiteFooterServer from "@marketing/components/StaticSiteFooter.server";
import StaticSiteNavbarServer from "@marketing/components/StaticSiteNavbar.server";

type LeanMarketingShellProps = {
  children: ReactNode;
  siteClassName: string;
};

/** Server shell for teaching-method / feature detail pages — avoids MarketingChrome client bundle. */
export default function LeanMarketingShell({ children, siteClassName }: LeanMarketingShellProps) {
  return (
    <div className={`mml-chrome mml-chrome--site ${siteClassName}`}>
      <StaticSiteNavbarServer />
      <main className="main-content flex min-h-0 flex-1 flex-col pt-16">{children}</main>
      <StaticSiteFooterServer />
      <DeferredCookieConsent />
    </div>
  );
}
