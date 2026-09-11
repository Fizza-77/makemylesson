"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { ToastHost } from "@/components/ui/ToastHost";
import { wirePwaInstallListeners } from "@/lib/pwa-install";

import { AuthProvider } from "./AuthProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    wirePwaInstallListeners();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <ToastHost />
      </AuthProvider>
    </QueryClientProvider>
  );
}


