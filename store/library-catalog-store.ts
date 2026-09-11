"use client";

import { create } from "zustand";

import { toUserMessage } from "@/lib/user-facing-error";
import {
  removeLibraryItem,
  resolvePlanBundleMembers,
  subscribeLibraryItems,
  toggleLibraryFavourite,
  type PlanBundleMembers,
} from "@/services/library-catalog.service";
import type { LibraryItem, LibraryItemKind } from "@/types/library-item";

export type LibraryTabId =
  | "lessonPlan"
  | "presentation"
  | "activity"
  | "assessment"
  | "completePack"
  | "favourites";

export const LIBRARY_TABS: { id: LibraryTabId; label: string }[] = [
  { id: "lessonPlan", label: "Lesson plans" },
  { id: "presentation", label: "Presentations" },
  { id: "activity", label: "Formative" },
  { id: "assessment", label: "Quiz and Test" },
  { id: "completePack", label: "Complete Plan" },
  { id: "favourites", label: "Favourites" },
];

type LibraryCatalogStore = {
  items: LibraryItem[];
  loading: boolean;
  error: string | null;
  subscribedUid: string | null;
  setItems: (items: LibraryItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
  getById: (id: string) => LibraryItem | undefined;
  filterTab: (tab: LibraryTabId, query?: string) => LibraryItem[];
  planBundleMembers: (planBundleId: string | null | undefined) => PlanBundleMembers;
  toggleFavourite: (id: string) => Promise<void>;
  removeById: (id: string) => Promise<void>;
};

function matchesSearch(item: LibraryItem, query: string): boolean {
  const s = query.trim().toLowerCase();
  if (!s) return true;
  return (
    item.topic.toLowerCase().includes(s) ||
    item.subject.toLowerCase().includes(s) ||
    item.curriculumRoute.toLowerCase().includes(s)
  );
}

function filterByTab(items: LibraryItem[], tab: LibraryTabId): LibraryItem[] {
  switch (tab) {
    case "lessonPlan":
      return items.filter((e) => e.kind === "lessonPlan");
    case "presentation":
      return items.filter((e) => e.kind === "presentation");
    case "activity":
      return items.filter((e) => e.kind === "activity");
    case "assessment":
      return items.filter((e) => e.kind === "assessment");
    case "completePack":
      return items.filter(
        (e) => e.kind === "completePack" && e.completePackStages === 15,
      );
    case "favourites":
      return items.filter((e) => e.isFavourite);
    default:
      return items;
  }
}

let unsubscribe: (() => void) | null = null;

export const useLibraryCatalogStore = create<LibraryCatalogStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  subscribedUid: null,

  setItems: (items) => set({ items, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clear: () => set({ items: [], loading: false, error: null, subscribedUid: null }),

  getById: (id) => get().items.find((i) => i.id === id),

  filterTab: (tab, query = "") =>
    filterByTab(get().items, tab).filter((i) => matchesSearch(i, query)),

  planBundleMembers: (planBundleId) =>
    resolvePlanBundleMembers(get().items, planBundleId),

  toggleFavourite: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const nextFavourite = !item.isFavourite;
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, isFavourite: nextFavourite } : i,
      ),
    });
    try {
      await toggleLibraryFavourite({ id, isFavourite: nextFavourite });
    } catch (e) {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, isFavourite: item.isFavourite } : i,
        ),
      });
      throw e;
    }
  },

  removeById: async (id) => {
    const prev = get().items;
    set({ items: prev.filter((i) => i.id !== id) });
    try {
      await removeLibraryItem(id);
    } catch (e) {
      set({ items: prev });
      throw e;
    }
  },
}));

/** Attach / detach realtime library listener for the signed-in uid. */
export function syncLibraryCatalogSubscription(
  uid: string | null,
  opts?: { force?: boolean },
) {
  const store = useLibraryCatalogStore.getState();
  if (!opts?.force && store.subscribedUid === uid && unsubscribe) return;

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (!uid) {
    useLibraryCatalogStore.setState({
      items: [],
      loading: false,
      error: null,
      subscribedUid: null,
    });
    return;
  }

  useLibraryCatalogStore.setState({
    subscribedUid: uid,
    loading: true,
    error: null,
  });

  unsubscribe = subscribeLibraryItems(
    uid,
    (items) => {
      useLibraryCatalogStore.getState().setItems(items);
    },
    (error) => {
      console.error("[Library] snapshot failed", error);
      useLibraryCatalogStore.getState().setError(
        toUserMessage(error, "Could not load library."),
      );
    },
  );
}

/** One-shot pull used by Library refresh button. */
export async function refreshLibraryCatalog(uid: string): Promise<void> {
  const { fetchLibraryItemsForUser } = await import(
    "@/services/library-catalog.service"
  );
  const items = await fetchLibraryItemsForUser(uid);
  useLibraryCatalogStore.getState().setItems(items);
  syncLibraryCatalogSubscription(uid, { force: true });
}

export function kindTitle(kind: LibraryItemKind): string {
  switch (kind) {
    case "lessonPlan":
      return "Stage 1 — Lesson Plan";
    case "presentation":
      return "Stage 2 — Presentation";
    case "activity":
      return "Stage 3 — Activity";
    case "assessment":
      return "Stage 4 — Assessment";
    case "completePack":
      return "Complete pack";
  }
}

export function stripeColor(item: LibraryItem): string {
  if (item.kind === "completePack") return "#1A1C30";
  switch (item.stage) {
    case 1:
      return "#28C2C0";
    case 2:
      return "#4AA8E0";
    case 3:
      return "#E0A84A";
    case 4:
      return "#1A1C30";
    default:
      return "#28C2C0";
  }
}

export function formatLibraryDate(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}


