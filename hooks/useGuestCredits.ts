"use client";

import { useSyncExternalStore } from "react";

import {
  getGuestCreditsRemaining,
  subscribeGuestCredits,
} from "@/lib/guest-credits";

export function useGuestCreditsRemaining(): number {
  return useSyncExternalStore(
    subscribeGuestCredits,
    getGuestCreditsRemaining,
    () => 0,
  );
}
