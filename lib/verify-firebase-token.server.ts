import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

import { isGuestWebUid } from "@/lib/guest-auth-id";
import { parseFirebaseServiceAccount } from "@/lib/firebase-service-account.server";

const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

type FirebaseIdTokenPayload = JWTPayload & {
  user_id?: string;
  firebase?: {
    sign_in_provider?: string;
  };
};

export type VerifiedGuestToken = {
  uid: string;
  isAnonymous: boolean;
};

export async function verifyGuestFirebaseIdToken(
  idToken: string,
): Promise<VerifiedGuestToken | null> {
  const serviceAccount = parseFirebaseServiceAccount();
  const projectId =
    serviceAccount?.projectId ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!projectId || !idToken.trim()) return null;

  try {
    const { payload } = await jwtVerify(idToken.trim(), JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    const claims = payload as FirebaseIdTokenPayload;
    const uid = String(claims.sub ?? claims.user_id ?? "").trim();
    if (!uid) return null;

    const provider = claims.firebase?.sign_in_provider ?? "";
    const isAnonymous = provider === "anonymous";
    const isGuestWeb = isGuestWebUid(uid);
    if (!isAnonymous && !isGuestWeb) return null;

    return { uid, isAnonymous };
  } catch {
    return null;
  }
}

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization")?.trim() ?? "";
  if (!header.toLowerCase().startsWith("bearer ")) return null;
  return header.slice(7).trim() || null;
}


