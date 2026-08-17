"use client";

import type { ComponentProps, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import {
  marketingHomeUrl,
  openInSystemBrowser,
  openMarketingHome,
} from "@/lib/open-pricing";
import { isStandaloneDisplay } from "@/lib/pwa-install";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href?: string;
};

/**
 * Brand / home CTA → marketing landing (`/`).
 * In an installed PWA, opens the landing page in the device browser.
 */
export function MarketingHomeLink({
  href,
  onClick,
  className,
  children,
  ...rest
}: Props) {
  const router = useRouter();
  const homeUrl = href ?? marketingHomeUrl();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (isStandaloneDisplay()) {
      e.preventDefault();
      openInSystemBrowser(homeUrl);
      return;
    }

    // Same-origin landing: prefer in-app navigation (same tab).
    e.preventDefault();
    openMarketingHome((path) => router.push(path));
  }

  return (
    <a
      href={homeUrl}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
