"use client";

import type { User } from "firebase/auth";

import { callFunction } from "@/firebase/functions";
import {
  GUEST_GENERATION_CREDIT_CAP,
  getGuestCreditsRemaining,
  setGuestCreditsFromServer,
} from "@/lib/guest-credits";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type TrialStatusPayload = {
  remaining?: number;
  totalUsed?: number;
  cap?: number;
  configured?: boolean;
  ok?: boolean;
};

function normalizeTrialStatus(payload: TrialStatusPayload | null | undefined): {
  remaining: number;
  totalUsed: number;
  configured: boolean;
} {
  const remaining =
    typeof payload?.remaining === "number"
      ? payload.remaining
      : GUEST_GENERATION_CREDIT_CAP;
  const totalUsed =
    typeof payload?.totalUsed === "number" ? payload.totalUsed : 0;
  return {
    remaining,
    totalUsed,
    configured: payload?.configured !== false,
  };
}

export async function fetchWebTrialStatusFromServer(): Promise<{
  remaining: number;
  totalUsed: number;
  configured: boolean;
}> {
  try {
    const payload = await callFunction<
      Record<string, never>,
      TrialStatusPayload
    >("getWebTrialStatus", {});
    const result = normalizeTrialStatus(payload);
    setGuestCreditsFromServer(result.remaining, result.totalUsed);
    return result;
  } catch (error) {
    console.warn("[Trial] getWebTrialStatus failed", error);
    setGuestCreditsFromServer(0, GUEST_GENERATION_CREDIT_CAP);
    return {
      remaining: 0,
      totalUsed: GUEST_GENERATION_CREDIT_CAP,
      configured: false,
    };
  }
}

export async function bootstrapWebTrialCredits(user: User): Promise<{
  remaining: number;
  totalUsed: number;
  configured: boolean;
}> {
  try {
    await user.getIdToken();
    const payload = await callFunction<Record<string, never>, TrialStatusPayload>(
      "bootstrapWebTrial",
      {},
    );
    const result = normalizeTrialStatus(payload);
    setGuestCreditsFromServer(result.remaining, result.totalUsed);
    return result;
  } catch (error) {
    console.warn("[Trial] bootstrapWebTrial failed", error);
    return fetchWebTrialStatusFromServer();
  }
}

export async function consumeWebTrialCreditOnServer(user: User): Promise<number> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await user.getIdToken();
      const payload = await callFunction<
        Record<string, never>,
        TrialStatusPayload
      >("consumeWebTrial", {});
      const result = normalizeTrialStatus(payload);
      setGuestCreditsFromServer(result.remaining, result.totalUsed);
      return getGuestCreditsRemaining();
    } catch (error) {
      lastError = error;
      console.warn("[Trial] consumeWebTrial failed", { attempt: attempt + 1, error });
      if (attempt < 2) {
        await sleep(400 * (attempt + 1));
      }
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Could not record web trial usage.");
}
