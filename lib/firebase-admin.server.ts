import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

import { parseFirebaseServiceAccount } from "@/lib/firebase-service-account.server";

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const account = parseFirebaseServiceAccount();
  if (!account) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_NOT_CONFIGURED");
  }
  return initializeApp({
    credential: cert({
      projectId: account.projectId,
      clientEmail: account.clientEmail,
      privateKey: account.privateKey,
    }),
    projectId: account.projectId,
  });
}

export function isFirebaseAdminConfigured(): boolean {
  return parseFirebaseServiceAccount() != null;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
