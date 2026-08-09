import {
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";

import { libraryItemsRef } from "@/firebase/firestore";
import { getFirebaseAuth } from "@/firebase/config";
import {
  libraryItemFromFirestore,
  libraryItemToFirestore,
  type LibraryItem,
} from "@/types/library-item";

export type PlanBundleMembers = {
  lessonPlan: LibraryItem | null;
  presentation: LibraryItem | null;
  activity: LibraryItem | null;
  assessment: LibraryItem | null;
};

/** Mirrors Flutter `resolvePlanBundleMembers`. */
export function resolvePlanBundleMembers(
  catalog: LibraryItem[],
  planBundleId: string | null | undefined,
): PlanBundleMembers {
  const id = planBundleId?.trim() ?? "";
  const empty: PlanBundleMembers = {
    lessonPlan: null,
    presentation: null,
    activity: null,
    assessment: null,
  };
  if (!id) return empty;

  const out = { ...empty };
  for (const item of catalog) {
    if (item.kind === "completePack") continue;
    if ((item.planBundleId?.trim() ?? "") !== id) continue;
    if (item.kind === "lessonPlan" && !out.lessonPlan) out.lessonPlan = item;
    else if (item.kind === "presentation" && !out.presentation)
      out.presentation = item;
    else if (item.kind === "activity" && !out.activity) out.activity = item;
    else if (item.kind === "assessment" && !out.assessment)
      out.assessment = item;
  }
  return out;
}

function requireUid(): string {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) throw new Error("Sign in to save to your library.");
  return uid;
}

function stageMaskForKind(kind: LibraryItem["kind"]): number {
  switch (kind) {
    case "lessonPlan":
      return 1 << 0;
    case "presentation":
      return 1 << 1;
    case "activity":
      return 1 << 2;
    case "assessment":
      return 1 << 3;
    default:
      return 0;
  }
}

function sortLibraryItems(items: LibraryItem[]): LibraryItem[] {
  return [...items].sort(
    (a, b) => b.generatedAt.getTime() - a.generatedAt.getTime(),
  );
}

/**
 * Mirrors Flutter `LibraryCatalogService.createItem`:
 * `ref.set({ ...item.toFirestore(), createdAt: serverTimestamp() })`
 */
export async function createLibraryItem(
  item: Omit<LibraryItem, "id">,
): Promise<LibraryItem> {
  const uid = requireUid();
  const ref = doc(libraryItemsRef(uid));
  const next: LibraryItem = {
    ...item,
    id: ref.id,
    generatedAt: new Date(),
  };
  await setDoc(ref, {
    ...libraryItemToFirestore(next),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return next;
}

/** Mirrors Flutter `LibraryCatalogService.updateItem` (merge set of toFirestore). */
export async function updateLibraryItem(item: LibraryItem): Promise<void> {
  const uid = requireUid();
  const ref = doc(libraryItemsRef(uid), item.id);
  await setDoc(
    ref,
    {
      ...libraryItemToFirestore(item),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Mirrors Flutter `LibraryCatalogNotifier.addLessonPlanFromStage1`. */
export async function addLessonPlanFromStage1(params: {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  reviewBody: string;
  planBundleId?: string | null;
}): Promise<LibraryItem> {
  const bundle = params.planBundleId?.trim() || null;
  const saved = await createLibraryItem({
    stage: 1,
    kind: "lessonPlan",
    topic: params.topic,
    curriculumRoute: params.curriculumRoute,
    grade: params.grade,
    subject: params.subject,
    generatedAt: new Date(),
    reviewBody: params.reviewBody,
    isFavourite: false,
    completePackStages: 0,
    planBundleId: bundle,
  });
  if (bundle) {
    try {
      await syncPlanBundlePack(bundle);
    } catch (e) {
      console.warn("[Library] syncPlanBundlePack failed", e);
    }
  }
  return saved;
}

/** Mirrors Flutter `LibraryCatalogNotifier.addPresentationFromStage2`. */
export async function addPresentationFromStage2(params: {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  reviewBody: string;
  speakerNotes: string;
  presentationSlidesJson: Record<string, unknown>[];
  presentationStyle?: string | null;
  planBundleId?: string | null;
  stage2JobId?: string | null;
}): Promise<LibraryItem> {
  const bundle = params.planBundleId?.trim() || null;
  const job = params.stage2JobId?.trim() || null;
  const saved = await createLibraryItem({
    stage: 2,
    kind: "presentation",
    topic: params.topic,
    curriculumRoute: params.curriculumRoute,
    grade: params.grade,
    subject: params.subject,
    generatedAt: new Date(),
    reviewBody: params.reviewBody,
    isFavourite: false,
    completePackStages: 0,
    speakerNotes: params.speakerNotes,
    presentationSlidesJson: params.presentationSlidesJson,
    presentationStyle: params.presentationStyle?.trim() || "classic_navy",
    planBundleId: bundle,
    stage2JobId: job,
  });
  if (bundle) {
    try {
      await syncPlanBundlePack(bundle);
    } catch (e) {
      console.warn("[Library] syncPlanBundlePack failed", e);
    }
  }
  return saved;
}

/** Mirrors Flutter `LibraryCatalogNotifier.updatePresentationBody`. */
export async function updatePresentationBody(params: {
  id: string;
  reviewBody: string;
  speakerNotes: string;
  presentationSlidesJson?: Record<string, unknown>[] | null;
  topic?: string;
  curriculumRoute?: string;
  grade?: string;
  subject?: string;
  presentationStyle?: string | null;
  stage2JobId?: string | null;
}): Promise<void> {
  const uid = requireUid();
  const items = await fetchLibraryItemsForUser(uid);
  const existing = items.find((i) => i.id === params.id);
  if (!existing) {
    throw new Error("Library item not found.");
  }
  const updated: LibraryItem = {
    ...existing,
    reviewBody: params.reviewBody,
    speakerNotes: params.speakerNotes,
    presentationSlidesJson:
      params.presentationSlidesJson ?? existing.presentationSlidesJson,
    topic: params.topic ?? existing.topic,
    curriculumRoute: params.curriculumRoute ?? existing.curriculumRoute,
    grade: params.grade ?? existing.grade,
    subject: params.subject ?? existing.subject,
    presentationStyle:
      params.presentationStyle ?? existing.presentationStyle,
    stage2JobId: params.stage2JobId?.trim() || existing.stage2JobId,
    generatedAt: new Date(),
  };
  await updateLibraryItem(updated);
}

/** Mirrors Flutter `LibraryCatalogNotifier.updateLessonPlanBody`. */
export async function updateLessonPlanBody(params: {
  id: string;
  reviewBody: string;
  topic?: string;
  curriculumRoute?: string;
  grade?: string;
  subject?: string;
  planBundleId?: string | null;
}): Promise<void> {
  const uid = requireUid();
  const items = await fetchLibraryItemsForUser(uid);
  const existing = items.find((i) => i.id === params.id);
  if (!existing) {
    throw new Error("Library item not found.");
  }
  const bundle =
    params.planBundleId?.trim() || existing.planBundleId?.trim() || null;
  const updated: LibraryItem = {
    ...existing,
    reviewBody: params.reviewBody,
    topic: params.topic ?? existing.topic,
    curriculumRoute: params.curriculumRoute ?? existing.curriculumRoute,
    grade: params.grade ?? existing.grade,
    subject: params.subject ?? existing.subject,
    generatedAt: new Date(),
    planBundleId: bundle,
  };
  await updateLibraryItem(updated);
  if (bundle) {
    try {
      await syncPlanBundlePack(bundle);
    } catch (e) {
      console.warn("[Library] syncPlanBundlePack failed", e);
    }
  }
}

/**
 * Mirrors Flutter `LibraryCatalogService.fetchItems`
 * (`orderBy('generatedAt', descending: true)`).
 */
export async function fetchLibraryItemsForUser(
  uid: string,
): Promise<LibraryItem[]> {
  try {
    const q = query(libraryItemsRef(uid), orderBy("generatedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) =>
      libraryItemFromFirestore(d.id, d.data() as DocumentData),
    );
  } catch (e) {
    // Client-only fallback if ordered query fails locally — no backend change.
    console.warn("[Library] ordered fetch failed, sorting client-side", e);
    const snap = await getDocs(libraryItemsRef(uid));
    return sortLibraryItems(
      snap.docs.map((d) =>
        libraryItemFromFirestore(d.id, d.data() as DocumentData),
      ),
    );
  }
}

/**
 * Live catalog — same collection Flutter reads (`users/{uid}/libraryItems`).
 * Ordered query matches Flutter fetch; falls back to unordered + client sort.
 */
export function subscribeLibraryItems(
  uid: string,
  onChange: (items: LibraryItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ordered = query(libraryItemsRef(uid), orderBy("generatedAt", "desc"));
  let unsubFallback: Unsubscribe | null = null;

  const unsubOrdered = onSnapshot(
    ordered,
    (snap) => {
      onChange(
        snap.docs.map((d) =>
          libraryItemFromFirestore(d.id, d.data() as DocumentData),
        ),
      );
    },
    (err) => {
      console.warn("[Library] ordered snapshot failed, using unordered", err);
      unsubFallback = onSnapshot(
        libraryItemsRef(uid),
        (snap) => {
          onChange(
            sortLibraryItems(
              snap.docs.map((d) =>
                libraryItemFromFirestore(d.id, d.data() as DocumentData),
              ),
            ),
          );
        },
        (e2) => onError?.(e2),
      );
    },
  );

  return () => {
    unsubOrdered();
    unsubFallback?.();
  };
}

/** Mirrors Flutter `LibraryCatalogService.toggleFavourite`. */
export async function toggleLibraryFavourite(params: {
  id: string;
  isFavourite: boolean;
}): Promise<void> {
  const uid = requireUid();
  const ref = doc(libraryItemsRef(uid), params.id);
  await setDoc(
    ref,
    {
      isFavourite: params.isFavourite,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Mirrors Flutter `LibraryCatalogService.removeItem`. */
export async function removeLibraryItem(id: string): Promise<void> {
  const uid = requireUid();
  await deleteDoc(doc(libraryItemsRef(uid), id));
}

/** Mirrors Flutter `LibraryCatalogNotifier.addActivityFromStage3`. */
export async function addActivityFromStage3(params: {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  studentReviewBody: string;
  teacherReviewBody: string;
  stage3Json: Record<string, unknown>;
  planBundleId?: string | null;
  activityLabel?: string | null;
}): Promise<LibraryItem> {
  const bundle = params.planBundleId?.trim() || null;
  const saved = await createLibraryItem({
    stage: 3,
    kind: "activity",
    topic: params.topic,
    curriculumRoute: params.curriculumRoute,
    grade: params.grade,
    subject: params.subject,
    generatedAt: new Date(),
    reviewBody: params.studentReviewBody,
    isFavourite: false,
    completePackStages: 0,
    teacherReviewBody: params.teacherReviewBody,
    stage3Json: params.stage3Json,
    activityOrAssessmentLabel:
      params.activityLabel?.trim() || "Activity",
    planBundleId: bundle,
  });
  if (bundle) {
    try {
      await syncPlanBundlePack(bundle);
    } catch (e) {
      console.warn("[Library] syncPlanBundlePack failed", e);
    }
  }
  return saved;
}

/** Mirrors Flutter `LibraryCatalogNotifier.updateActivityFromStage3`. */
export async function updateActivityFromStage3(params: {
  id: string;
  studentReviewBody: string;
  teacherReviewBody: string;
  stage3Json: Record<string, unknown>;
  topic?: string;
  curriculumRoute?: string;
  grade?: string;
  subject?: string;
}): Promise<void> {
  const uid = requireUid();
  const items = await fetchLibraryItemsForUser(uid);
  const existing = items.find((i) => i.id === params.id);
  if (!existing) {
    throw new Error("Library item not found.");
  }
  const updated: LibraryItem = {
    ...existing,
    reviewBody: params.studentReviewBody,
    teacherReviewBody: params.teacherReviewBody,
    stage3Json: params.stage3Json,
    topic: params.topic ?? existing.topic,
    curriculumRoute: params.curriculumRoute ?? existing.curriculumRoute,
    grade: params.grade ?? existing.grade,
    subject: params.subject ?? existing.subject,
    generatedAt: new Date(),
  };
  await updateLibraryItem(updated);
}

/** Mirrors Flutter `LibraryCatalogNotifier.addAssessmentFromStage4`. */
export async function addAssessmentFromStage4(params: {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  studentReviewBody: string;
  teacherReviewBody: string;
  stage4Json: Record<string, unknown>;
  planBundleId?: string | null;
}): Promise<LibraryItem> {
  const bundle = params.planBundleId?.trim() || null;
  const saved = await createLibraryItem({
    stage: 4,
    kind: "assessment",
    topic: params.topic,
    curriculumRoute: params.curriculumRoute,
    grade: params.grade,
    subject: params.subject,
    generatedAt: new Date(),
    reviewBody: params.studentReviewBody,
    isFavourite: false,
    completePackStages: 0,
    teacherReviewBody: params.teacherReviewBody,
    stage4Json: params.stage4Json,
    activityOrAssessmentLabel: "Assessment",
    planBundleId: bundle,
  });
  if (bundle) {
    try {
      await syncPlanBundlePack(bundle);
    } catch (e) {
      console.warn("[Library] syncPlanBundlePack failed", e);
    }
  }
  return saved;
}

/** Mirrors Flutter `LibraryCatalogNotifier.updateAssessmentFromStage4`. */
export async function updateAssessmentFromStage4(params: {
  id: string;
  studentReviewBody: string;
  teacherReviewBody: string;
  stage4Json: Record<string, unknown>;
  topic?: string;
  curriculumRoute?: string;
  grade?: string;
  subject?: string;
}): Promise<void> {
  const uid = requireUid();
  const items = await fetchLibraryItemsForUser(uid);
  const existing = items.find((i) => i.id === params.id);
  if (!existing) {
    throw new Error("Library item not found.");
  }
  const updated: LibraryItem = {
    ...existing,
    reviewBody: params.studentReviewBody,
    teacherReviewBody: params.teacherReviewBody,
    stage4Json: params.stage4Json,
    topic: params.topic ?? existing.topic,
    curriculumRoute: params.curriculumRoute ?? existing.curriculumRoute,
    grade: params.grade ?? existing.grade,
    subject: params.subject ?? existing.subject,
    generatedAt: new Date(),
  };
  await updateLibraryItem(updated);
}

/**
 * Mirrors Flutter `LibraryCatalogNotifier.syncPlanBundlePack`.
 * Uses the full catalog (client filter) — same as Flutter in-memory `state`.
 */
export async function syncPlanBundlePack(rawPlanBundleId: string): Promise<void> {
  const planBundleId = rawPlanBundleId.trim();
  if (!planBundleId) return;
  const uid = requireUid();

  const all = await fetchLibraryItemsForUser(uid);
  const members = all.filter(
    (i) =>
      i.kind !== "completePack" &&
      (i.planBundleId?.trim() ?? "") === planBundleId,
  );
  if (members.length === 0) return;

  let mask = 0;
  for (const i of members) {
    mask |= stageMaskForKind(i.kind);
  }

  const representative =
    members.find((i) => i.kind === "lessonPlan") ?? members[0]!;
  const existingPack = all.find(
    (i) =>
      i.kind === "completePack" &&
      (i.planBundleId?.trim() ?? "") === planBundleId,
  );

  let stagesDone = 0;
  for (let bi = 0; bi < 4; bi++) {
    if ((mask >> bi) & 1) stagesDone++;
  }
  const summaryLabel =
    mask === 15
      ? "Complete lesson pack (4/4 stages)"
      : `Lesson pack in progress (${stagesDone}/4 stages)`;

  const packDraft: Omit<LibraryItem, "id"> = {
    stage: 1,
    kind: "completePack",
    topic: representative.topic,
    curriculumRoute: representative.curriculumRoute,
    grade: representative.grade,
    subject: representative.subject,
    generatedAt: existingPack?.generatedAt ?? new Date(),
    reviewBody: summaryLabel,
    isFavourite: existingPack?.isFavourite ?? false,
    completePackStages: mask,
    planBundleId,
  };

  if (existingPack) {
    await updateLibraryItem({ ...packDraft, id: existingPack.id });
  } else {
    await createLibraryItem(packDraft);
  }
}
