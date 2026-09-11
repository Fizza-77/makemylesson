import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase/config";
import { callFunction } from "@/lib/firebase/functions";

function userRef(uid: string) {
  return doc(getFirestoreDb(), "users", uid);
}

async function sendEvent(uid: string, eventName: string) {
  try {
    await callFunction("sendUserNotification", { uid, eventName });
  } catch {
    /* lifecycle signals still update even if push fails */
  }
}

/** In-flight / session guards — React Strict Mode mounts effects twice in dev. */
const appOpenedInFlight = new Map<string, Promise<void>>();
const claimedEvents = new Set<string>();

function eventClaimKey(uid: string, eventName: string) {
  return `${uid}:${eventName}`;
}

/**
 * Atomically claim a once-per-user lifecycle flag.
 * Returns true only for the first claimant (avoids duplicate inbox rows).
 */
async function claimLifecycleFlag(
  uid: string,
  flagField: string,
): Promise<boolean> {
  const key = eventClaimKey(uid, flagField);
  if (claimedEvents.has(key)) return false;

  const ref = userRef(uid);
  const claimed = await runTransaction(getFirestoreDb(), async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() ?? {};
    const signals =
      (data.notificationSignals as Record<string, unknown> | undefined) ?? {};
    if (signals[flagField] != null) return false;
    tx.set(
      ref,
      {
        notificationSignals: {
          [flagField]: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  });

  if (claimed) claimedEvents.add(key);
  return claimed;
}

export async function recordAppOpened(): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return;

  const existing = appOpenedInFlight.get(uid);
  if (existing) return existing;

  const work = (async () => {
    const ref = userRef(uid);
    const snap = await getDoc(ref);
    const data = snap.data() ?? {};
    const signals =
      (data.notificationSignals as Record<string, unknown> | undefined) ?? {};
    const totalGenerationCount = Number(signals.totalGenerationCount ?? 0) || 0;

    await setDoc(
      ref,
      {
        notificationSignals: { lastActiveAt: serverTimestamp() },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (totalGenerationCount > 0) return;
    // Claim flag first, then notify — prevents Strict Mode double-send.
    const shouldSend = await claimLifecycleFlag(
      uid,
      "firstSessionNoActionSentAt",
    );
    if (shouldSend) {
      await sendEvent(uid, "first_session_no_action");
    }
  })().finally(() => {
    appOpenedInFlight.delete(uid);
  });

  appOpenedInFlight.set(uid, work);
  await work;
}

export async function recordLibraryOpened(): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return;
  await setDoc(
    userRef(uid),
    {
      notificationSignals: {
        lastLibraryOpenedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function recordLibrarySaved(): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return;
  await setDoc(
    userRef(uid),
    {
      notificationSignals: {
        lastLibrarySavedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function recordStageGenerated(stage: 1 | 2 | 3 | 4): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return;
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  const data = snap.data() ?? {};
  const signals =
    (data.notificationSignals as Record<string, unknown> | undefined) ?? {};

  const totalGenerationCount = Number(signals.totalGenerationCount ?? 0) || 0;
  const stage1Count = Number(signals.stage1Count ?? 0) || 0;
  const nextTotal = totalGenerationCount + 1;
  const nextStage1Count = stage === 1 ? stage1Count + 1 : stage1Count;
  const hasUsedStage2 = signals.hasUsedStage2 === true || stage === 2;
  const hasUsedStage3 = signals.hasUsedStage3 === true || stage === 3;
  const hasUsedStage4 = signals.hasUsedStage4 === true || stage === 4;

  await setDoc(
    ref,
    {
      notificationSignals: {
        lastActiveAt: serverTimestamp(),
        totalGenerationCount: nextTotal,
        stage1Count: nextStage1Count,
        hasUsedStage2,
        hasUsedStage3,
        hasUsedStage4,
        [`lastStage${stage}At`]: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (nextTotal === 1) {
    const shouldSend = await claimLifecycleFlag(
      uid,
      "firstGenerationSuccessSentAt",
    );
    if (shouldSend) await sendEvent(uid, "first_generation_success");
  }

  if (hasUsedStage2 && hasUsedStage3 && hasUsedStage4) {
    const shouldSend = await claimLifecycleFlag(
      uid,
      "completePackFirstTimeSentAt",
    );
    if (shouldSend) await sendEvent(uid, "complete_pack_first_time");
  }
}


