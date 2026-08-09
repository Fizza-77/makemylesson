import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type DocumentReference,
} from "firebase/firestore";

import { getFirestoreDb } from "./config";
import { UserFirestoreProfile } from "@/types/user-profile";

export function userDocRef(uid: string): DocumentReference {
  return doc(getFirestoreDb(), "users", uid);
}

export function libraryItemsRef(uid: string) {
  return collection(getFirestoreDb(), "users", uid, "libraryItems");
}

export async function fetchUserProfile(uid: string): Promise<UserFirestoreProfile | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  return UserFirestoreProfile.fromFirestore(snap.id, snap.data());
}

export async function ensureUserDocument(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<boolean> {
  const ref = userDocRef(user.uid);
  const snap = await getDoc(ref);
  const payload = {
    email: user.email,
    displayName: user.displayName,
    updatedAt: serverTimestamp(),
  };
  if (snap.exists()) {
    await setDoc(ref, payload, { merge: true });
    return false;
  }
  await setDoc(ref, {
    ...payload,
    profileComplete: false,
    createdAt: serverTimestamp(),
  });
  return true;
}
