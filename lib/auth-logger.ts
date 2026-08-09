type AuthLogLevel = "info" | "success" | "error" | "warn";

type AuthLogPayload = Record<string, unknown>;

function redactEmail(email?: string | null): string | undefined {
  if (!email) return undefined;
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at <= 1) return "***";
  return `${trimmed[0]}***${trimmed.slice(at)}`;
}

function formatPayload(payload?: AuthLogPayload): string {
  if (!payload || Object.keys(payload).length === 0) return "";
  try {
    return ` ${JSON.stringify(payload)}`;
  } catch {
    return "";
  }
}

/**
 * Client-side auth diagnostics (browser console).
 * Never logs passwords, OTP codes, or full tokens.
 */
export const authLog = {
  info(event: string, payload?: AuthLogPayload) {
    console.info(`[Auth] ${event}${formatPayload(payload)}`);
  },
  success(event: string, payload?: AuthLogPayload) {
    console.info(`[Auth] ✓ ${event}${formatPayload(payload)}`);
  },
  warn(event: string, payload?: AuthLogPayload) {
    console.warn(`[Auth] ⚠ ${event}${formatPayload(payload)}`);
  },
  error(event: string, error: unknown, payload?: AuthLogPayload) {
    const detail =
      error instanceof Error
        ? { message: error.message, name: error.name, ...(error as { code?: string }) }
        : { error: String(error) };
    console.error(`[Auth] ✗ ${event}${formatPayload({ ...payload, ...detail })}`);
  },
  email: redactEmail,
};

export type { AuthLogLevel };
