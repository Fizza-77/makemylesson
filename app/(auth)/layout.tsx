import { AppProviders } from "@/components/providers/AppProviders";

import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
