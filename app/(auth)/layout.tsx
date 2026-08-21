import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
