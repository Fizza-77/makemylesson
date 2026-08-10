"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { mapFunctionsError } from "@/lib/auth-errors";
import { ROUTES } from "@/lib/urls";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationsPanelStore } from "@/store/notifications-panel-store";
import { useNotificationsStore } from "@/store/notifications-store";
import { toast } from "@/store/toast-store";
import {
  isNotificationRead,
  normalizeDeepLink,
  type AppNotification,
} from "@/types/notification";
import { cn } from "@/lib/utils";

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

/** Inbox popover — same Firestore/callables as before; UI only. */
export function NotificationsPanel() {
  const router = useRouter();
  const open = useNotificationsPanelStore((s) => s.open);
  const closePanel = useNotificationsPanelStore((s) => s.closePanel);
  const panelRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const items = useNotificationsStore((s) => s.items);
  const loading = useNotificationsStore((s) => s.loading);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const remove = useNotificationsStore((s) => s.remove);
  const clearAll = useNotificationsStore((s) => s.clearAll);

  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      const el = panelRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        const bell = document.getElementById("nav-alerts-bell");
        if (bell?.contains(e.target as Node)) return;
        closePanel();
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, closePanel]);

  // Opening the bell marks everything as seen.
  useEffect(() => {
    if (!open || !user) return;
    void markAllRead().catch(() => null);
  }, [open, user, markAllRead]);

  function onOpen(n: AppNotification) {
    closePanel();
    const href = normalizeDeepLink(n.deepLink);
    if (href === ROUTES.notifications || href.startsWith("/notifications")) {
      return;
    }
    router.push(href);
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
        aria-hidden
        onClick={closePanel}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl",
          "inset-x-3 top-[4.75rem] max-h-[min(70vh,32rem)]",
          "md:inset-x-auto md:right-4 md:top-[4.75rem] md:w-[380px] lg:right-8",
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-slate-900">Notifications</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up."}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            onClick={closePanel}
          >
            Close
          </button>
        </div>

        {user && items.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-2">
            <button
              type="button"
              disabled={busy}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
              onClick={() => setConfirmClear(true)}
            >
              Clear all
            </button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {!authReady || (loading && user && items.length === 0) ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : !user ? (
            <div className="px-2 py-8 text-center text-sm text-slate-500">
              <p>Sign in to see your notifications.</p>
              <button
                type="button"
                className="mt-3 rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-600"
                onClick={() => {
                  closePanel();
                  router.push(
                    `${ROUTES.signIn}?next=${encodeURIComponent("/")}`,
                  );
                }}
              >
                Sign in
              </button>
            </div>
          ) : items.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-slate-500">
              No notifications yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((n) => {
                const read = isNotificationRead(n);
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "rounded-xl border p-3",
                      read
                        ? "border-slate-200 bg-white"
                        : "border-teal-200 bg-teal-50/50",
                    )}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => onOpen(n)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {!read ? (
                            <span className="mr-1.5 inline-block size-2 rounded-full bg-teal-500" />
                          ) : null}
                          {n.title || "Notification"}
                        </p>
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {formatWhen(n.createdAt)}
                        </span>
                      </div>
                      {n.body ? (
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {n.body}
                        </p>
                      ) : null}
                    </button>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-red-700 hover:underline"
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
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

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
    </>
  );
}
