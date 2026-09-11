"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CookieConsent = dynamic(() => import("@marketing/components/CookieConsent"), {
  ssr: false,
  loading: () => null,
});

/** Loads cookie banner after idle — keeps lean pages free of footer/nav client bundles. */
export default function DeferredCookieConsent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback?.(() => setReady(true), { timeout: 2500 });
    const fallback = window.setTimeout(() => setReady(true), 2500);
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!ready) return null;

  return <CookieConsent />;
}


