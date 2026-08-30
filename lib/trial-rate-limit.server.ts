const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || now >= entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}
