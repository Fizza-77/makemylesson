/**
 * Convert thrown errors / raw strings into short messages safe to show teachers.
 * Never surface stack traces, Firebase codes, or exception class names.
 */

const FALLBACK =
  "Something went wrong. Please try again in a moment.";

const TECHNICAL_PATTERNS: RegExp[] = [
  /\bFirebaseError\b/i,
  /\bFirebase:\b/i,
  /\bFirestoreError\b/i,
  /\bFunctionsError\b/i,
  /\bTypeError\b/i,
  /\bReferenceError\b/i,
  /\bSyntaxError\b/i,
  /\bRangeError\b/i,
  /\bAggregateError\b/i,
  /\bauth\/[a-z0-9-]+/i,
  /\bfunctions\/[a-z0-9-]+/i,
  /\bfirestore\/[a-z0-9-]+/i,
  /\bstorage\/[a-z0-9-]+/i,
  /\bmessaging\/[a-z0-9-]+/i,
  /\bhttps?:\/\/\S+/i,
  /\bECONNREFUSED\b/i,
  /\bETIMEDOUT\b/i,
  /\bENOTFOUND\b/i,
  /\bEPERM\b/i,
  /\bstatus(Code)?\s*[:=]\s*\d+/i,
  /\bCannot read propert/i,
  /\bis not a function\b/i,
  /\bundefined is not\b/i,
  /\bnull is not\b/i,
  /\bUnexpected token\b/i,
  /\bJSON\.parse\b/i,
  /\bat\s+\S+\s+\(/, // stack frame
  /^\s*at\s+/m,
  /\bstack trace\b/i,
  /\btraceback\b/i,
  /\{[\s\S]*"code"[\s\S]*\}/,
  /\bORG_[A-Z0-9_]+:/,
  // gRPC / Functions status names shown alone or as the lead token
  /^(INTERNAL|UNAUTHENTICATED|PERMISSION_DENIED|FAILED_PRECONDITION|DEADLINE_EXCEEDED|RESOURCE_EXHAUSTED|INVALID_ARGUMENT|ALREADY_EXISTS|NOT_FOUND|UNAVAILABLE|ABORTED|DATA_LOSS|OUT_OF_RANGE|UNIMPLEMENTED|UNKNOWN)\b/,
];

function stripNoise(raw: string): string {
  let text = raw.replace(/\r\n/g, "\n").trim();

  // Drop stack frames and anything after the first "at foo (" line.
  const stackIdx = text.search(/\n\s*at\s+/);
  if (stackIdx >= 0) text = text.slice(0, stackIdx).trim();

  // Firebase sometimes prefixes: "Firebase: Error (auth/…)." or "FirebaseError: …"
  text = text
    .replace(/^FirebaseError:\s*/i, "")
    .replace(/^Firebase:\s*/i, "")
    .replace(/^Error:\s*/i, "")
    .replace(/\s*\((?:auth|functions|firestore|storage)\/[a-z0-9-]+\)\.?$/i, "")
    .replace(/^(?:auth|functions|firestore|storage)\/[a-z0-9-]+\s*/i, "")
    .replace(/^ORG_[A-Z0-9_]+:\s*/i, "")
    .trim();

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

export function looksTechnical(message: string): boolean {
  const text = message.trim();
  if (!text) return true;
  if (text.length > 220) return true;
  if (/^[\w./:-]+$/.test(text) && text.includes("/")) return true;
  if (/^[A-Z][A-Z0-9_]{2,}$/.test(text)) return true;
  return TECHNICAL_PATTERNS.some((re) => re.test(text));
}

/** Sanitize a string already intended for the UI. */
export function sanitizeUserMessage(
  message: unknown,
  fallback: string = FALLBACK,
): string {
  if (typeof message !== "string") return fallback;
  const cleaned = stripNoise(message);
  if (!cleaned) return fallback;
  if (looksTechnical(cleaned)) return fallback;
  // Keep human sentences; trim trailing junk punctuation from codes
  return cleaned.replace(/[.]+$/g, (m) => (m.length > 1 ? "." : m)).trim();
}

/**
 * Map any thrown value to a short user-facing sentence.
 * Prefer known mappers (auth/functions) before calling this.
 */
export function toUserMessage(
  error: unknown,
  fallback: string = FALLBACK,
): string {
  if (error == null) return fallback;

  if (typeof error === "string") {
    return sanitizeUserMessage(error, fallback);
  }

  if (typeof error === "object" && error !== null) {
    const record = error as {
      code?: unknown;
      message?: unknown;
      details?: unknown;
    };

    // Prefer message over code; never show code alone.
    if (typeof record.message === "string" && record.message.trim()) {
      const fromMessage = sanitizeUserMessage(record.message, "");
      if (fromMessage) return fromMessage;
    }

    if (error instanceof Error && error.message) {
      const fromError = sanitizeUserMessage(error.message, "");
      if (fromError) return fromError;
    }
  }

  return fallback;
}


