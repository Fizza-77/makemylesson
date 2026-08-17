import { isStandaloneDisplay } from "@/lib/pwa-install";
import { MARKETING_ORIGIN, ROUTES } from "@/lib/urls";

function pricingPath(search = ""): string {
  if (!search) return ROUTES.pricing;
  return `${ROUTES.pricing}${search.startsWith("?") ? search : `?${search}`}`;
}

function marketingOrigin(): string {
  if (typeof window !== "undefined") {
    return (MARKETING_ORIGIN || window.location.origin).replace(/\/$/, "");
  }
  return MARKETING_ORIGIN.replace(/\/$/, "");
}

/** Absolute marketing landing URL (`/`). */
export function marketingHomeUrl(): string {
  return `${marketingOrigin()}/`;
}

/** Absolute marketing pricing URL (always the marketing site origin). */
export function marketingPricingUrl(search = ""): string {
  return `${marketingOrigin()}${pricingPath(search)}`;
}

function isAndroidUa(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

/**
 * Open a URL in the device browser, escaping an installed PWA when needed.
 * Chrome captures same-origin in-scope links back into the PWA — on Android we
 * use an intent:// VIEW URL so Chrome/Browser handles it instead.
 */
export function openInSystemBrowser(url: string): void {
  if (typeof window === "undefined") return;

  if (isAndroidUa()) {
    try {
      const parsed = new URL(url, window.location.href);
      const hostAndPath = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
      const scheme = parsed.protocol.replace(":", "") || "https";
      const intentUrl =
        `intent://${hostAndPath}` +
        `#Intent;scheme=${scheme}` +
        `;action=android.intent.action.VIEW` +
        `;category=android.intent.category.BROWSABLE` +
        `;S.browser_fallback_url=${encodeURIComponent(parsed.href)}` +
        `;end`;

      // Keep the PWA on its current page when possible.
      const win = window.open(intentUrl, "_blank");
      if (!win) {
        window.location.href = intentUrl;
      }
      return;
    } catch {
      // fall through
    }
  }

  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) return;

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Open marketing pricing / checkout.
 * In an installed PWA, force the system browser so PayPal is not trapped in-app.
 */
export function openPricingPage(
  navigateInApp?: (href: string) => void,
  search = "",
): void {
  const path = pricingPath(search);
  const url = marketingPricingUrl(search);

  if (typeof window !== "undefined" && isStandaloneDisplay()) {
    openInSystemBrowser(url);
    return;
  }

  if (navigateInApp) {
    navigateInApp(path);
    return;
  }

  if (typeof window !== "undefined") {
    window.location.assign(url);
  }
}

/**
 * Open the marketing landing page.
 * In an installed PWA, force the system browser (marketing routes redirect in-app).
 */
export function openMarketingHome(
  navigateInApp?: (href: string) => void,
): void {
  const url = marketingHomeUrl();

  if (typeof window !== "undefined" && isStandaloneDisplay()) {
    openInSystemBrowser(url);
    return;
  }

  if (navigateInApp) {
    navigateInApp("/");
    return;
  }

  if (typeof window !== "undefined") {
    window.location.assign(url);
  }
}
