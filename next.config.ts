import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Default: off in `next dev` (HMR cache issues). Set PWA_DEV=1 to test SW locally.
  // Installability always works with `npm run build && npm run start` on localhost.
  disable:
    process.env.NODE_ENV === "development" && process.env.PWA_DEV !== "1",
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const appOrigin =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/$/, "") ??
  "https://makemylesson.app";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "makemylesson-44088.firebasestorage.app",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy Flutter web path prefix
      { source: "/app", destination: "/", permanent: true },
      { source: "/app/:path*", destination: "/:path*", permanent: true },
      // Flutter auth paths → web-friendly URLs (Firebase unchanged)
      { source: "/auth/sign-in", destination: "/login", permanent: true },
      { source: "/auth/sign-up", destination: "/signup", permanent: true },
      {
        source: "/auth/forgot-password",
        destination: "/forgot-password",
        permanent: true,
      },
      { source: "/auth/verify-otp", destination: "/verify-email", permanent: true },
      {
        source: "/auth/reset-password",
        destination: "/reset-password",
        permanent: true,
      },
      {
        source: "/auth/complete-profile",
        destination: "/complete-profile",
        permanent: true,
      },
      { source: "/subscription", destination: "/pricing", permanent: false },
      { source: "/home", destination: "/stage1", permanent: false },
      { source: "/ayla", destination: "/stage1", permanent: false },
      { source: "/ayla-chat", destination: "/stage1", permanent: false },
      { source: "/onboarding", destination: "/stage1", permanent: false },
      { source: "/marketing", destination: "/", permanent: true },
      // Keep /pricing as marketing + PayPal checkout surface
    ];
  },
  env: {
    NEXT_PUBLIC_APP_ORIGIN: appOrigin,
  },
};

export default withPWA(nextConfig);
