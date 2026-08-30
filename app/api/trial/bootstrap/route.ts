import { NextResponse } from "next/server";

import { isFirebaseServiceAccountConfigured } from "@/lib/firebase-service-account.server";
import {
  getWebTrialIpUsage,
  remainingFromIpUsage,
  setGuestUserGenerationCredits,
} from "@/lib/firestore-admin.server";
import { WEB_TRIAL_GENERATION_CAP } from "@/lib/trial-constants";
import { checkRateLimit } from "@/lib/trial-rate-limit.server";
import { clientIp, hashClientIp } from "@/lib/trial-ip.server";
import {
  readBearerToken,
  verifyGuestFirebaseIdToken,
} from "@/lib/verify-firebase-token.server";

export const runtime = "nodejs";

const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function trialNotConfiguredResponse() {
  return NextResponse.json(
    {
      error:
        "Web trial enforcement is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON.",
    },
    { status: 503 },
  );
}

/** Set guest Firestore credits from IP trial pool; return remaining balance. */
export async function POST(request: Request) {
  if (!isFirebaseServiceAccountConfigured()) {
    return trialNotConfiguredResponse();
  }

  const ip = clientIp(request);
  if (!checkRateLimit(`trial-bootstrap:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const idToken = readBearerToken(request);
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const guest = await verifyGuestFirebaseIdToken(idToken);
  if (!guest) {
    return NextResponse.json({ error: "Guest session required." }, { status: 403 });
  }

  try {
    const ipHash = hashClientIp(ip);
    const { totalUsed } = await getWebTrialIpUsage(ipHash);
    const remaining = remainingFromIpUsage(totalUsed);
    await setGuestUserGenerationCredits(guest.uid, remaining);

    return NextResponse.json({
      remaining,
      totalUsed,
      cap: WEB_TRIAL_GENERATION_CAP,
    });
  } catch (error) {
    console.error("[api/trial/bootstrap]", error);
    return NextResponse.json(
      { error: "Could not load trial credits." },
      { status: 500 },
    );
  }
}

/** IP trial usage for current request (no auth) — used for UI + sign-in merge. */
export async function GET(request: Request) {
  if (!isFirebaseServiceAccountConfigured()) {
    return NextResponse.json(
      {
        remaining: WEB_TRIAL_GENERATION_CAP,
        totalUsed: 0,
        cap: WEB_TRIAL_GENERATION_CAP,
        configured: false,
      },
    );
  }

  const ip = clientIp(request);
  if (!checkRateLimit(`trial-status:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const ipHash = hashClientIp(ip);
    const { totalUsed } = await getWebTrialIpUsage(ipHash);
    const remaining = remainingFromIpUsage(totalUsed);
    return NextResponse.json({
      remaining,
      totalUsed,
      cap: WEB_TRIAL_GENERATION_CAP,
      configured: true,
    });
  } catch (error) {
    console.error("[api/trial/bootstrap GET]", error);
    return NextResponse.json(
      { error: "Could not load trial status." },
      { status: 500 },
    );
  }
}
