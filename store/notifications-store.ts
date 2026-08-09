import { create } from "zustand";

import {
  clearAllNotifications,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
  watchNotifications,
  watchUnreadCount,
} from "@/services/notification-inbox.service";
import type { AppNotification } from "@/types/notification";

type NotificationsState = {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  syncedUid: string | null;
  setItems: (items: AppNotification[]) => void;
  setUnread: (n: number) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

let unsubList: (() => void) | null = null;
let unsubUnread: (() => void) | null = null;

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  syncedUid: null,
  setItems: (items) => set({ items, loading: false }),
  setUnread: (unreadCount) => set({ unreadCount }),
  markRead: async (id) => {
    await markNotificationRead(id);
  },
  markAllRead: async () => {
    await markAllNotificationsRead();
  },
  remove: async (id) => {
    await deleteNotification(id);
  },
  clearAll: async () => {
    await clearAllNotifications();
  },
}));

export function syncNotificationsSubscription(uid: string | null) {
  if (unsubList) {
    unsubList();
    unsubList = null;
  }
  if (unsubUnread) {
    unsubUnread();
    unsubUnread = null;
  }
  if (!uid) {
    useNotificationsStore.setState({
      items: [],
      unreadCount: 0,
      loading: false,
      syncedUid: null,
    });
    return;
  }
  useNotificationsStore.setState({ loading: true, syncedUid: uid });
  unsubList = watchNotifications((items) => {
    useNotificationsStore.getState().setItems(items);
  });
  unsubUnread = watchUnreadCount((n) => {
    useNotificationsStore.getState().setUnread(n);
  });
}
