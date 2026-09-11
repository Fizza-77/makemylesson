import type { FieldErrors, FieldValues } from "react-hook-form";

import { toast } from "@/store/toast-store";

/** Surface the first RHF/Zod validation message as a bottom toast. */
export function toastFirstFormError(errors: FieldErrors<FieldValues>) {
  const walk = (node: unknown): string | null => {
    if (!node || typeof node !== "object") return null;
    const record = node as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message.trim();
    }
    for (const value of Object.values(record)) {
      const found = walk(value);
      if (found) return found;
    }
    return null;
  };

  const message = walk(errors);
  if (message) toast.error(message);
}


