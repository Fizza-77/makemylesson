import { NextResponse } from "next/server";

import {
  getCheckoutStatusForUser,
  jsonError,
  requireRegisteredUser,
} from "@/lib/stripe/billing.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { uid } = await requireRegisteredUser(request);
    let body: { sessionId?: unknown } = {};
    try {
      body = (await request.json()) as { sessionId?: unknown };
    } catch {
      body = {};
    }
    const result = await getCheckoutStatusForUser({
      uid,
      sessionId: String(body.sessionId ?? ""),
    });
    return NextResponse.json(result);
  } catch (error) {
    const mapped = jsonError(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
