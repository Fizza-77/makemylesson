import { openInSystemBrowser } from "@/lib/open-pricing";
import { isStandaloneDisplay } from "@/lib/pwa-install";
import { AppUrls } from "@/lib/urls";

function isAndroidUa(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function isIosUa(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

function isMobileUa(): boolean {
  return isAndroidUa() || isIosUa();
}

function gmailWebComposeUrl(to: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
}

function gmailAppComposeUrl(to: string): string {
  const encoded = encodeURIComponent(to);
  return isIosUa()
    ? `googlegmail:///co?to=${encoded}`
    : `googlegmail://co?to=${encoded}`;
}

function mailtoUrl(to: string): string {
  return `mailto:${to}`;
}

/** Desktop / laptop — Gmail compose in the device browser. */
function openGmailInBrowser(to: string): void {
  const url = gmailWebComposeUrl(to);

  if (isStandaloneDisplay()) {
    openInSystemBrowser(url);
    return;
  }

  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.assign(url);
  }
}

/** Phone / tablet — prefer the Gmail app, then the system mail handler. */
function openGmailOnMobile(to: string): void {
  const appUrl = gmailAppComposeUrl(to);
  const fallback = mailtoUrl(to);

  if (isStandaloneDisplay() && isAndroidUa()) {
    openInSystemBrowser(appUrl);
    window.setTimeout(() => {
      openInSystemBrowser(fallback);
    }, 600);
    return;
  }

  window.location.href = appUrl;
  window.setTimeout(() => {
    if (document.visibilityState === "visible") {
      window.location.href = fallback;
    }
  }, 600);
}

/**
 * Help Centre → email support.
 * Desktop: Gmail compose in the browser. Mobile: Gmail app when available.
 */
export function openHelpCentreEmail(): void {
  if (typeof window === "undefined") return;

  const to = AppUrls.supportEmail;

  if (isMobileUa()) {
    openGmailOnMobile(to);
    return;
  }

  openGmailInBrowser(to);
}
