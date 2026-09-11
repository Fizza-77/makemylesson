import { SignJWT, importPKCS8 } from "jose";

import { parseFirebaseServiceAccount } from "@/lib/firebase-service-account.server";
import {
  WEB_TRIAL_GENERATION_CAP,
  WEB_TRIAL_IP_COLLECTION,
} from "@/lib/trial-constants";

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null };

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

const DATASTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.value;
  }

  const account = parseFirebaseServiceAccount();
  if (!account) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_NOT_CONFIGURED");
  }

  const privateKey = await importPKCS8(account.privateKey, "RS256");
  const assertion = await new SignJWT({ scope: DATASTORE_SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(account.clientEmail)
    .setSubject(account.clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`OAUTH_TOKEN_${response.status}:${body.slice(0, 200)}`);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  const value = payload.access_token?.trim();
  if (!value) {
    throw new Error("OAUTH_TOKEN_MISSING");
  }

  cachedToken = {
    value,
    expiresAt: now + (payload.expires_in ?? 3600),
  };
  return value;
}

function documentsBaseUrl(projectId: string): string {
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

function readIntField(
  fields: Record<string, FirestoreValue> | undefined,
  key: string,
): number | null {
  const raw = fields?.[key];
  if (!raw || !("integerValue" in raw)) return null;
  const n = Number.parseInt(raw.integerValue, 10);
  return Number.isFinite(n) ? n : null;
}

async function firestoreRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const account = parseFirebaseServiceAccount();
  if (!account) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_NOT_CONFIGURED");
  }
  const accessToken = await getAccessToken();
  const url = path.startsWith("http")
    ? path
    : `${documentsBaseUrl(account.projectId)}/${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 404) {
    throw new FirestoreNotFoundError();
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`FIRESTORE_${response.status}:${body.slice(0, 200)}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export class FirestoreNotFoundError extends Error {
  constructor() {
    super("FIRESTORE_NOT_FOUND");
    this.name = "FirestoreNotFoundError";
  }
}

export async function getWebTrialIpUsage(
  ipHash: string,
): Promise<{ totalUsed: number }> {
  try {
    const doc = await firestoreRequest<FirestoreDocument>(
      `${WEB_TRIAL_IP_COLLECTION}/${encodeURIComponent(ipHash)}`,
    );
    return {
      totalUsed: Math.min(
        WEB_TRIAL_GENERATION_CAP,
        Math.max(0, readIntField(doc.fields, "totalUsed") ?? 0),
      ),
    };
  } catch (error) {
    if (error instanceof FirestoreNotFoundError) {
      return { totalUsed: 0 };
    }
    throw error;
  }
}

export async function incrementWebTrialIpUsage(
  ipHash: string,
): Promise<{ totalUsed: number }> {
  const current = await getWebTrialIpUsage(ipHash);
  if (current.totalUsed >= WEB_TRIAL_GENERATION_CAP) {
    return current;
  }

  const nextUsed = current.totalUsed + 1;
  const now = new Date().toISOString();
  const fields = {
    totalUsed: { integerValue: String(nextUsed) },
    updatedAt: { timestampValue: now },
  };

  try {
    await firestoreRequest(
      `${WEB_TRIAL_IP_COLLECTION}/${encodeURIComponent(ipHash)}?updateMask.fieldPaths=totalUsed&updateMask.fieldPaths=updatedAt`,
      {
        method: "PATCH",
        body: JSON.stringify({ fields }),
      },
    );
  } catch (error) {
    if (error instanceof FirestoreNotFoundError) {
      await firestoreRequest(
        `${WEB_TRIAL_IP_COLLECTION}?documentId=${encodeURIComponent(ipHash)}`,
        {
          method: "POST",
          body: JSON.stringify({ fields }),
        },
      );
    } else {
      throw error;
    }
  }

  return { totalUsed: nextUsed };
}

export async function setGuestUserGenerationCredits(
  uid: string,
  remaining: number,
): Promise<void> {
  const clamped = Math.max(
    0,
    Math.min(WEB_TRIAL_GENERATION_CAP, Math.trunc(remaining)),
  );
  const now = new Date().toISOString();
  const fields = {
    planTier: { stringValue: "free" },
    subscriptionPlan: { stringValue: "free" },
    generationCredits: { integerValue: String(clamped) },
    generationCreditCap: { integerValue: String(WEB_TRIAL_GENERATION_CAP) },
    creditsUsed: {
      integerValue: String(WEB_TRIAL_GENERATION_CAP - clamped),
    },
    updatedAt: { timestampValue: now },
  };

  const updateMask = [
    "planTier",
    "subscriptionPlan",
    "generationCredits",
    "generationCreditCap",
    "creditsUsed",
    "updatedAt",
  ]
    .map((field) => `updateMask.fieldPaths=${field}`)
    .join("&");

  await firestoreRequest(`users/${encodeURIComponent(uid)}?${updateMask}`, {
    method: "PATCH",
    body: JSON.stringify({ fields }),
  });
}

export function remainingFromIpUsage(totalUsed: number): number {
  return Math.max(0, WEB_TRIAL_GENERATION_CAP - totalUsed);
}


