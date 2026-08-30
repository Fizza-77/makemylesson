import { SignJWT, importPKCS8 } from "jose";

import { isValidGuestWebUid, newGuestWebUid } from "@/lib/guest-auth-id";

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function parseServiceAccount(): ServiceAccount | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
      if (
        parsed.project_id &&
        parsed.client_email &&
        parsed.private_key
      ) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key.replace(/\\n/g, "\n"),
        };
      }
    } catch {
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    };
  }

  return null;
}

export function isGuestAuthServerConfigured(): boolean {
  return parseServiceAccount() != null;
}

export async function mintGuestCustomToken(
  guestUid?: string | null,
): Promise<{ guestUid: string; customToken: string }> {
  const serviceAccount = parseServiceAccount();
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
