import type { Metadata } from "next";
import type { ReactNode } from "react";

import { APP_ORIGIN } from "@/lib/urls";

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo.png", sizes: "512x512", type: "image/png" }],
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
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
