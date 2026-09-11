export type AppNotification = {
  id: string;
  title: string;
  body: string;
  eventName: string;
  deepLink: string;
  channel: string;
  createdAt: Date;
  readAt: Date | null;
};

export function isNotificationRead(n: AppNotification): boolean {
  return n.readAt != null;
}

export function normalizeDeepLink(deepLink: string): string {
  const raw = deepLink.trim() || "/notifications";
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const u = new URL(raw);
      return `${u.pathname}${u.search}` || "/";
    }
  } catch {
    /* fall through */
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
}


