import { AppProviders } from "@/components/providers/AppProviders";

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}


