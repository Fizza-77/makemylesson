import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { AppProviders } from "@/components/providers/AppProviders";
import { ProfileRouteGuard } from "@/components/auth/ProfileRouteGuard";
import { APP_ORIGIN } from "@/lib/urls";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_ORIGIN),
  title: {
    default: "Make My Lesson",
    template: "%s | Make My Lesson",
  },
  description:
    "AI-powered lesson planning, presentations, activities, and assessments for teachers.",
  applicationName: "Make My Lesson",
  openGraph: {
    type: "website",
    siteName: "Make My Lesson",
    title: "Make My Lesson",
    description:
      "Build complete lesson packs from plan to assessment with curriculum-aligned AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make My Lesson",
    description:
      "Build complete lesson packs from plan to assessment with curriculum-aligned AI.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Make My Lesson",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${manrope.className} min-h-full bg-[#F5F6FA] text-[#1A1C30] antialiased`}
      >
        <AppProviders>
          <ProfileRouteGuard>{children}</ProfileRouteGuard>
        </AppProviders>
      </body>
    </html>
  );
}
