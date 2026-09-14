import { NextResponse } from "next/server";

import { handleStripeWebhook } from "@/lib/stripe/billing.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const result = await handleStripeWebhook(request);
  if (typeof result.body === "string") {
    return new NextResponse(result.body, { status: result.status });
  }
  return NextResponse.json(result.body, { status: result.status });
}
