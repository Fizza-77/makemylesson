import { NextResponse } from "next/server";

import {
  createCheckoutSessionForUser,
  jsonError,
  requireRegisteredUser,
} from "@/lib/stripe/billing.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { uid } = await requireRegisteredUser(request);
    let body: { planKey?: unknown; origin?: unknown } = {};
    try {
      body = (await request.json()) as { planKey?: unknown; origin?: unknown };
    } catch {
      body = {};
    }
    const result = await createCheckoutSessionForUser({
      uid,
      planKey: body.planKey,
      origin: body.origin,
    });
    return NextResponse.json(result);
  } catch (error) {
    const mapped = jsonError(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
