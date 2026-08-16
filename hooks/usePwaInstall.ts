import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  acquirePwaInstallCapture,
  detectPlatform,
  getDeferredPrompt,
  getPwaInstalled,
  promptPwaInstall,
  releasePwaInstallCapture,
  subscribePwaInstall,
  wirePwaInstallListeners,
} from "@/lib/pwa-install";

/**
 * React bindings for the module-level PWA install store.
 * Enables deferred prompt capture only while a consumer is mounted.
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
  const platform = useSyncExternalStore(
    () => () => {},
    () => detectPlatform(),
    () => "desktop" as const,
  );

  useEffect(() => {
    wirePwaInstallListeners();
    acquirePwaInstallCapture();
    return () => releasePwaInstallCapture();
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
