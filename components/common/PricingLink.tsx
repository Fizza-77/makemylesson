"use client";

import type { ComponentProps, MouseEvent } from "react";

import {
  marketingPricingUrl,
  openInSystemBrowser,
} from "@/lib/open-pricing";
import { isStandaloneDisplay } from "@/lib/pwa-install";
import { ROUTES } from "@/lib/urls";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href?: string;
};

function searchFromHref(href: string): string {
  return href.includes("?") ? (href.split("?")[1] ?? "") : "";
}

/**
 * App → marketing pricing CTA.
 * Opens `/pricing` in the device browser (not inside the installed PWA).
 */
export function PricingLink({
  href = ROUTES.pricing,
  onClick,
  className,
  children,
  ...rest
}: Props) {
  const search = searchFromHref(href);
  const pricingUrl = marketingPricingUrl(search);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Android PWAs capture same-origin `_blank` back into the app — use intent://.
    // iOS / desktop: let native target="_blank" open Safari / a browser tab.
    const android =
      typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
    if (isStandaloneDisplay() && android) {
      e.preventDefault();
      openInSystemBrowser(pricingUrl);
    }
  }

  return (
    <a
      href={pricingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}


