import { createHash } from "node:crypto";

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashClientIp(ip: string): string {
  const salt =
    process.env.WEB_TRIAL_IP_SALT?.trim() ||
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    "mml-web-trial";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}


