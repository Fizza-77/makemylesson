import { SignJWT, importPKCS8 } from "jose";

import { isValidGuestWebUid, newGuestWebUid } from "@/lib/guest-auth-id";
import {
  isFirebaseServiceAccountConfigured,
  parseFirebaseServiceAccount,
} from "@/lib/firebase-service-account.server";

export function isGuestAuthServerConfigured(): boolean {
  return isFirebaseServiceAccountConfigured();
}

export async function mintGuestCustomToken(
  guestUid?: string | null,
): Promise<{ guestUid: string; customToken: string }> {
  const serviceAccount = parseFirebaseServiceAccount();
  if (!serviceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_NOT_CONFIGURED");
  }

  const uid =
    guestUid && isValidGuestWebUid(guestUid) ? guestUid : newGuestWebUid();
  const privateKey = await importPKCS8(serviceAccount.privateKey, "RS256");
  const now = Math.floor(Date.now() / 1000);

  const customToken = await new SignJWT({
    uid,
    claims: {
      guest: true,
      webGuest: true,
    },
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(serviceAccount.clientEmail)
    .setSubject(serviceAccount.clientEmail)
    .setAudience(
      "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    )
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(privateKey);

  return { guestUid: uid, customToken };
}


