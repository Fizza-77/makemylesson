import { NextResponse } from "next/server";

import {
  isGuestAuthServerConfigured,
  mintGuestCustomToken,
} from "@/lib/guest-token.server";
import { isValidGuestWebUid } from "@/lib/guest-auth-id";

export const runtime = "nodejs";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

/** Mint a Firebase custom token for web trial generation (no email sign-up). */
export async function POST(request: Request) {
  if (!isGuestAuthServerConfigured()) {
    return NextResponse.json(
      {
        error:
          "Trial generation is not configured on the server. Enable Anonymous sign-in in Firebase Console, or set FIREBASE_SERVICE_ACCOUNT_JSON.",
      },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many trial sign-in attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: { guestUid?: unknown } = {};
  try {
    body = (await request.json()) as { guestUid?: unknown };
  } catch {
    body = {};
  }

  const guestUid =
    typeof body.guestUid === "string" && isValidGuestWebUid(body.guestUid)
      ? body.guestUid
      : undefined;

  try {
    const session = await mintGuestCustomToken(guestUid);
    return NextResponse.json(session);
  } catch (error) {
    console.error("[api/auth/guest]", error);
    return NextResponse.json(
      { error: "Could not start a trial session. Please try again." },
      { status: 500 },
    );
  }
}


