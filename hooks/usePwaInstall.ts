"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import {
  detectPlatform,
  getDeferredPrompt,
  getPwaInstalled,
  promptPwaInstall,
  subscribePwaInstall,
  wirePwaInstallListeners,
} from "@/lib/pwa-install";

/**
 * React bindings for the module-level PWA install store.
 */
export function usePwaInstall() {
  const deferred = useSyncExternalStore(
    subscribePwaInstall,
    () => getDeferredPrompt(),
    () => null,
  );
  const installed = useSyncExternalStore(
    subscribePwaInstall,
    () => getPwaInstalled(),
    () => false,
  );
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    wirePwaInstallListeners();
    setPlatform(detectPlatform());
  }, []);

  const canPromptInstall = Boolean(deferred) && !installed;

  const promptInstall = useCallback(async () => {
    const result = await promptPwaInstall();
    return result === "accepted";
  }, []);

  return {
    installed,
    platform,
    canPromptInstall,
    promptInstall,
    hasDeferredPrompt: Boolean(deferred),
  };
}
