"use client";

import type { User } from "firebase/auth";

import { callFunction } from "@/firebase/functions";
import {
  consumeGuestCreditLocal,
  GUEST_GENERATION_CREDIT_CAP,
  getGuestCreditsRemaining,
  setGuestCreditsFromServer,
} from "@/lib/guest-credits";

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
    return {
      remaining: GUEST_GENERATION_CREDIT_CAP,
      totalUsed: 0,
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
  const before = getGuestCreditsRemaining();
  try {
    await user.getIdToken();
    const payload = await callFunction<Record<string, never>, TrialStatusPayload>(
      "consumeWebTrial",
      {},
    );
    const result = normalizeTrialStatus(payload);
    setGuestCreditsFromServer(result.remaining, result.totalUsed);
    const after = getGuestCreditsRemaining();
    if (after >= before && before > 0) {
      return consumeGuestCreditLocal();
    }
    return after;
  } catch (error) {
    console.warn("[Trial] consumeWebTrial failed", error);
    if (before > 0) {
      return consumeGuestCreditLocal();
    }
    return before;
  }
}
