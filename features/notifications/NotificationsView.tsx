"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { mapFunctionsError } from "@/lib/auth-errors";
import { ROUTES } from "@/lib/urls";
import { useAuthStore } from "@/store/auth-store";
import {
  syncNotificationsSubscription,
  useNotificationsStore,
} from "@/store/notifications-store";
import { toast } from "@/store/toast-store";
import {
  isNotificationRead,
  normalizeDeepLink,
  type AppNotification,
} from "@/types/notification";

function formatWhen(d: Date): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

export function NotificationsView() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const items = useNotificationsStore((s) => s.items);
  const loading = useNotificationsStore((s) => s.loading);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const remove = useNotificationsStore((s) => s.remove);
  const clearAll = useNotificationsStore((s) => s.clearAll);

  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    syncNotificationsSubscription(user?.uid ?? null);
  }, [authReady, user?.uid]);

  async function onOpen(n: AppNotification) {
    try {
      if (!isNotificationRead(n)) await markRead(n.id);
    } catch {
      /* still navigate */
    }
    router.push(normalizeDeepLink(n.deepLink));
  }

  if (!authReady || (loading && user && items.length === 0)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center text-sm text-[#666666]">
        <p>Sign in to see your notifications.</p>
        <Button
          type="button"
          className="mt-3"
          onClick={() =>
            router.push(
              `${ROUTES.signIn}?next=${encodeURIComponent(ROUTES.notifications)}`,
            )
          }
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1C30]">Notifications</h1>
          <p className="mt-1 text-sm text-[#666666]">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-xs"
            disabled={busy || unreadCount === 0}
            onClick={() => {
              setBusy(true);
              void markAllRead()
                .then(() => toast.success("All marked as read."))
                .catch((e) =>
                  toast.error(mapFunctionsError(e) || "Could not update."),
                )
                .finally(() => setBusy(false));
            }}
          >
            Mark all read
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-xs text-red-700"
            disabled={busy || items.length === 0}
            onClick={() => setConfirmClear(true)}
          >
            Clear all
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-[#666666]">No notifications yet.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const read = isNotificationRead(n);
            return (
              <li key={n.id}>
                <Card
                  className={`p-4 ${read ? "" : "border-[#28C2C0]/40 bg-[#F5FBFB]"}`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => void onOpen(n)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#1A1C30]">
                        {!read ? (
                          <span className="mr-1.5 inline-block size-2 rounded-full bg-[#28C2C0]" />
                        ) : null}
                        {n.title || "Notification"}
                      </p>
                      <span className="shrink-0 text-[10px] text-[#999999]">
                        {formatWhen(n.createdAt)}
                      </span>
                    </div>
                    {n.body ? (
                      <p className="mt-1 text-sm leading-relaxed text-[#666666]">
                        {n.body}
                      </p>
                    ) : null}
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!read ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs"
                        onClick={() =>
                          void markRead(n.id).catch((e) =>
                            toast.error(
                              mapFunctionsError(e) || "Could not mark read.",
                            ),
                          )
                        }
                      >
                        Mark read
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs text-red-700"
                      onClick={() =>
                        void remove(n.id)
                          .then(() => toast.success("Deleted."))
                          .catch((e) =>
                            toast.error(
                              mapFunctionsError(e) || "Could not delete.",
                            ),
                          )
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear all notifications?"
        message="This permanently removes every notification in your inbox."
        danger
        confirmLabel="Clear all"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          setBusy(true);
          void clearAll()
            .then(() => toast.success("Inbox cleared."))
            .catch((e) =>
              toast.error(mapFunctionsError(e) || "Could not clear."),
            )
            .finally(() => setBusy(false));
        }}
      />
    </div>
  );
}
