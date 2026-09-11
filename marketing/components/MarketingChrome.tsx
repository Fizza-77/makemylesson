"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import LandingScrollHandler from "@marketing/components/LandingScrollHandler";
import Navbar from "@marketing/components/Navbar";

const Footer = dynamic(() => import("@marketing/components/Footer"), {
  ssr: false,
  loading: () => null,
});

const CookieConsent = dynamic(() => import("@marketing/components/CookieConsent"), {
  ssr: false,
  loading: () => null,
});

const AylaMarketingChat = dynamic(() => import("@marketing/components/AylaMarketingChat"), {
  ssr: false,
  loading: () => null,
});

function DeferredFooter() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback?.(() => setReady(true), { timeout: 2000 });
    const fallback = window.setTimeout(() => setReady(true), 2000);
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!ready) return null;

  return <Footer />;
}

function DeferredChromeWidgets({ includeAyla }: { includeAyla: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback?.(() => setReady(true), { timeout: 3500 });
    const fallback = window.setTimeout(() => setReady(true), 3500);
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <CookieConsent />
      {includeAyla ? <AylaMarketingChat /> : null}
    </>
  );
}

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
  const includeAyla =
    isHome ||
    pathname.startsWith("/pricing") ||
    pathname === "/contact";

  if (isHome) {
    return (
      <div
        className={`mml-chrome mml-chrome--home ${homeClassName}`}
        style={{ background: "#e6ecee", minHeight: "100vh" }}
      >
        <Navbar theme="home" />
        <LandingScrollHandler />
        <div>{children}</div>
        <DeferredFooter />
        <DeferredChromeWidgets includeAyla />
      </div>
    );
  }

  return (
    <div className={`mml-chrome mml-chrome--site ${siteClassName}`}>
      <Navbar theme="site" />
      <main className="main-content flex min-h-0 flex-1 flex-col pt-16">{children}</main>
      <DeferredFooter />
      <DeferredChromeWidgets includeAyla={includeAyla} />
    </div>
  );
}


