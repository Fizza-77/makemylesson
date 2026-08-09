import {
  getMessaging,
  getToken,
  isSupported,
  type Messaging,
} from "firebase/messaging";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { getFirebaseApp, getFirestoreDb } from "@/firebase/config";

/** Same VAPID key as Flutter `kMmlWebVapidKey` (shared FCM web sender). */
export const MML_WEB_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ??
  "BJAHaXZA6BKoF9TclolIHEZ7SI-8Be4hADUi1zj4ELrYROQyNTfpt28mYgMn9zRdTgn5XxjuWHAikcjXtIbU";

let messagingSingleton: Messaging | null = null;

async function getWebMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  if (!messagingSingleton) {
    messagingSingleton = getMessaging(getFirebaseApp());
  }
  return messagingSingleton;
}

function stableDeviceId(uid: string, token: string): string {
  const input = `${uid}:web:${token}`;
  // base64url without padding (matches Flutter `_stableDeviceId`)
  const b64 = btoa(unescape(encodeURIComponent(input)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Request permission (if needed), fetch FCM token, upsert `users/{uid}/devices/{id}`.
 * Safe to call repeatedly; no-ops when unsupported or denied.
 */
export async function upsertCurrentDeviceToken(uid: string): Promise<void> {
  if (typeof window === "undefined" || !uid) return;

  try {
    const messaging = await getWebMessaging();
    if (!messaging) return;

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return;

    let swReg: ServiceWorkerRegistration | undefined;
    try {
      swReg = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
    } catch {
      /* PWA SW may already own the page; getToken can still succeed */
    }

    const token = await getToken(
      messaging,
      swReg
        ? { vapidKey: MML_WEB_VAPID_KEY, serviceWorkerRegistration: swReg }
        : { vapidKey: MML_WEB_VAPID_KEY },
    );
    if (!token) return;

    const deviceId = stableDeviceId(uid, token);
    const ref = doc(getFirestoreDb(), "users", uid, "devices", deviceId);
    await setDoc(
      ref,
      {
        token,
        platform: "web",
        deviceId,
        appVersion: "0.1.0+web",
        permissionStatus: "granted",
        isActive: true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    // Optional path — inbox still works without push.
  }
}
