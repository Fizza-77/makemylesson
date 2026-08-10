"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import CookieConsent from "@marketing/components/CookieConsent";
import Footer from "@marketing/components/Footer";
import Navbar from "@marketing/components/Navbar";

type MarketingChromeProps = {
  children: ReactNode;
  siteClassName: string;
  homeClassName: string;
};

export default function MarketingChrome({
  children,
  siteClassName,
  homeClassName,
}: MarketingChromeProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <div
        className={`mml-chrome mml-chrome--home ${homeClassName}`}
        style={{ background: "#1a1e3a", minHeight: "100vh" }}
      >
        <Navbar theme="home" />
        <div className="pt-16">{children}</div>
        <Footer />
        <CookieConsent />
      </div>
    );
  }

  return (
    <div className={`mml-chrome mml-chrome--site ${siteClassName}`}>
      <Navbar theme="site" />
      <main className="main-content flex min-h-0 flex-1 flex-col pt-16">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
