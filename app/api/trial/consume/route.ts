import { NextResponse } from "next/server";

import { isFirebaseServiceAccountConfigured } from "@/lib/firebase-service-account.server";
import {
  incrementWebTrialIpUsage,
  remainingFromIpUsage,
} from "@/lib/firestore-admin.server";
import { WEB_TRIAL_GENERATION_CAP } from "@/lib/trial-constants";
import { checkRateLimit } from "@/lib/trial-rate-limit.server";
import { clientIp, hashClientIp } from "@/lib/trial-ip.server";
import {
  readBearerToken,
  verifyGuestFirebaseIdToken,
} from "@/lib/verify-firebase-token.server";

export const runtime = "nodejs";

const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/** Record one web trial generation against the IP pool. */
export async function POST(request: Request) {
  if (!isFirebaseServiceAccountConfigured()) {
    return NextResponse.json({ ok: true, configured: false });
  }

  const ip = clientIp(request);
  if (!checkRateLimit(`trial-consume:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
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
    const { totalUsed } = await incrementWebTrialIpUsage(ipHash);
    const remaining = remainingFromIpUsage(totalUsed);

    return NextResponse.json({
      ok: true,
      remaining,
      totalUsed,
      cap: WEB_TRIAL_GENERATION_CAP,
    });
  } catch (error) {
    console.error("[api/trial/consume]", error);
    return NextResponse.json(
      { error: "Could not record trial usage." },
      { status: 500 },
    );
  }
}
