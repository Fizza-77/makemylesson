"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  hasAnalyticsConsent,
  type StoredCookieConsent,
} from "@/components/analytics/cookieConsentStorage";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-JQFWEL60WH";

const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-17975031252";

/** Loads GA/Ads only after the user accepts analytics cookies. */
export function ConsentGatedAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (hasAnalyticsConsent()) {
      setEnabled(true);
    }

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<StoredCookieConsent>).detail;
      if (detail?.analytics || detail?.choice === "all") {
        setEnabled(true);
      }
    };

    window.addEventListener("mml-cookie-consent", onConsent);
    return () => window.removeEventListener("mml-cookie-consent", onConsent);
  }, []);

  if (!enabled || (!GA_MEASUREMENT_ID && !GOOGLE_ADS_ID)) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}


