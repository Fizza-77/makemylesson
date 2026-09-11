import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirebaseAuth, getFirestoreDb } from "@/firebase/config";
import { callFunction } from "@/firebase/functions";
import type { AppNotification } from "@/types/notification";

function uidOrNull(): string | null {
  return getFirebaseAuth().currentUser?.uid ?? null;
}

function notificationsCol(uid: string) {
  return collection(getFirestoreDb(), "users", uid, "notifications");
}

function unreadMetaRef(uid: string) {
  return doc(getFirestoreDb(), "users", uid, "meta", "notificationCounters");
}

function mapNotification(
  id: string,
  data: Record<string, unknown>,
): AppNotification {
  const created = data.createdAt;
  const read = data.readAt;
  return {
    id,
    title: String(data.title ?? ""),
    body: String(data.body ?? ""),
    eventName: String(data.eventName ?? "unknown_event"),
    deepLink: String(data.deepLink ?? "/notifications"),
    channel: String(data.channel ?? "in_app"),
    createdAt:
      created instanceof Timestamp
        ? created.toDate()
        : new Date(0),
    readAt: read instanceof Timestamp ? read.toDate() : null,
  };
}

export function watchNotifications(
  onData: (items: AppNotification[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const uid = uidOrNull();
  if (!uid) {
    onData([]);
    return () => undefined;
  }
  const q = query(notificationsCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) =>
          mapNotification(d.id, d.data() as Record<string, unknown>),
        ),
      );
    },
    (err) => onError?.(err),
  );
}

export function watchUnreadCount(
  onData: (count: number) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const uid = uidOrNull();
  if (!uid) {
    onData(0);
    return () => undefined;
  }
  return onSnapshot(
    unreadMetaRef(uid),
    (snap) => {
      const value = snap.data()?.unreadCount;
      onData(
        typeof value === "number" ? Math.max(0, Math.min(9999, value)) : 0,
      );
    },
    (err) => onError?.(err),
  );
}

export async function markNotificationRead(
  notificationId: string,
): Promise<void> {
  const uid = uidOrNull();
  if (!uid) return;
  try {
    await callFunction("markNotificationRead", { notificationId });
  } catch {
    await setDoc(
      doc(notificationsCol(uid), notificationId),
      { readAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const uid = uidOrNull();
  if (!uid) return;
  try {
    await callFunction("markAllNotificationsRead", {});
  } catch {
    const unread = await getDocs(
      query(notificationsCol(uid), where("readAt", "==", null), limit(300)),
    );
    if (unread.empty) return;
    const batch = writeBatch(getFirestoreDb());
    for (const d of unread.docs) {
      batch.set(
        d.ref,
        { readAt: serverTimestamp(), updatedAt: serverTimestamp() },
        { merge: true },
      );
    }
    batch.set(
      unreadMetaRef(uid),
      { unreadCount: 0, updatedAt: serverTimestamp() },
      { merge: true },
    );
    await batch.commit();
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const uid = uidOrNull();
  if (!uid) return;
  try {
    await callFunction("deleteNotification", { notificationId });
  } catch {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(notificationsCol(uid), notificationId));
  }
}

export async function clearAllNotifications(): Promise<void> {
  const uid = uidOrNull();
  if (!uid) return;
  try {
    await callFunction("clearAllNotifications", {});
  } catch {
    const snap = await getDocs(query(notificationsCol(uid), limit(300)));
    if (snap.empty) return;
    const batch = writeBatch(getFirestoreDb());
    for (const d of snap.docs) batch.delete(d.ref);
    batch.set(
      unreadMetaRef(uid),
      { unreadCount: 0, updatedAt: serverTimestamp() },
      { merge: true },
    );
    await batch.commit();
  }
}


