import type { ReactNode } from "react";

import DeferredCookieConsent from "@marketing/components/DeferredCookieConsent";
import StaticSiteFooterServer from "@marketing/components/StaticSiteFooter.server";
import StaticSiteNavbarServer from "@marketing/components/StaticSiteNavbar.server";

type HomeMarketingShellProps = {
  children: ReactNode;
};

/** Server shell for the homepage — no MarketingChrome client bundle. */
export default function HomeMarketingShell({ children }: HomeMarketingShellProps) {
  return (
    <div
      className="mml-chrome mml-chrome--home mml-marketing-page"
      style={{ background: "#e6ecee", minHeight: "100vh" }}
    >
      <StaticSiteNavbarServer theme="home" />
      <div>{children}</div>
      <StaticSiteFooterServer />
      <DeferredCookieConsent />
    </div>
  );
}
