import { FirebaseError } from "firebase/app";

import {
  AYLA_FAQ_ENTRIES,
  buildAylaFaqTextFromEntries,
  findBestFaqMatch,
} from "@/data/ayla-faq";
import { AYLA_FAQ_PROMPT_TEXT } from "@/data/ayla-faq-prompt";

export type AylaChatMessage = {
  role: "user" | "model";
  text: string;
};

export type AylaChatReply = {
  text: string;
  aylaCredits?: number | null;
  aylaPaidCredits?: number | null;
  aylaFairUsageResumeAtMs?: number | null;
  aylaPeriodMonth?: string | null;
};

const SYSTEM_PROMPT = `You are Ayla, the Make My Lesson teaching assistant.

Primary rules:
1) Use the provided FAQ text as the source of truth.
2) Answer in a practical, teacher-friendly way.
3) Keep each response concise, ideally between 200 and 250 words.
4) Never invent pricing, credit policy, or curriculum coverage.
5) If a detail is uncertain, state what is known and suggest a safe next step.

Style:
- Warm, professional, and direct.
- Prefer short paragraphs or bullets where useful.
- Focus on actionable classroom relevance.
`;

function faqTextForPrompt(): string {
  const fromAsset = AYLA_FAQ_PROMPT_TEXT.trim();
  return fromAsset || buildAylaFaqTextFromEntries();
}

function toOptionalInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  return null;
}

export function isAylaResourceExhaustedError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  const code = error.code.replace(/^functions\//, "");
  return code === "resource-exhausted";
}

export function isAylaUnauthenticatedError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  const code = error.code.replace(/^functions\//, "");
  return code === "unauthenticated";
}

/**
 * Mirrors Flutter `AylaChatService.sendMessage` → `callAylaSupport`,
 * with FAQ token-match fallback when the callable fails (except quota/auth).
 */
export async function sendAylaMessage(params: {
  history: AylaChatMessage[];
  userMessage: string;
  context?: Record<string, string>;
}): Promise<AylaChatReply> {
  const trimmed = params.userMessage.trim();
  if (!trimmed) {
    return {
      text: "Please type your question and I will help using Make My Lesson FAQ guidance.",
    };
  }

  try {
    const faqText = faqTextForPrompt();
    const meta = Object.entries(params.context ?? {})
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    let systemInstruction = `${SYSTEM_PROMPT}\n\nOFFICIAL FAQ TEXT (source of truth):\n${faqText}`;
    if (meta) {
      systemInstruction += `\n\nCurrent user context:\n${meta}`;
    }

    const recent =
      params.history.length > 10
        ? params.history.slice(-10)
        : params.history;
    const history = recent.map((message) => ({
      role: message.role === "user" ? "user" : "model",
      text: message.text,
    }));

    const { callFunction } = await import("@/lib/firebase/functions");
    const data = await callFunction<
      {
        systemInstruction: string;
        message: string;
        history: { role: string; text: string }[];
      },
      Record<string, unknown>
    >("callAylaSupport", {
      systemInstruction,
      message: trimmed,
      history,
    });

    const text = String(data.text ?? "").trim();
    if (text) {
      const period =
        typeof data.aylaPeriodMonth === "string"
          ? data.aylaPeriodMonth.trim()
          : "";
      return {
        text,
        aylaCredits: toOptionalInt(data.aylaCredits),
        aylaPaidCredits: toOptionalInt(data.aylaPaidCredits),
        aylaFairUsageResumeAtMs: toOptionalInt(data.aylaFairUsageResumeAtMs),
        aylaPeriodMonth: period || null,
      };
    }
  } catch (error) {
    if (
      isAylaResourceExhaustedError(error) ||
      isAylaUnauthenticatedError(error)
    ) {
      throw error;
    }
    console.warn("[Ayla] callAylaSupport failed, using FAQ fallback", error);
  }

  const fallback = findBestFaqMatch(trimmed, AYLA_FAQ_ENTRIES);
  return {
    text: fallback?.answer ?? AYLA_FAQ_ENTRIES[0]!.answer,
  };
}
