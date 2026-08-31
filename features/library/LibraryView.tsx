"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AppSidebarColumn } from "@/components/common/AppSidebarColumn";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import {
  archiveShelfCopy,
  LibraryBrowseCard,
  LibraryMapCard,
  LibraryTipsCard,
} from "@/features/library/LibraryBrowsePanel";
import { LibraryHero } from "@/features/library/LibraryHero";
import { AylaChatPanel } from "@/features/ayla/AylaChatPanel";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";
import { recordLibraryOpened } from "@/services/notification-lifecycle.service";
import { useAuthStore } from "@/store/auth-store";
import {
  LIBRARY_TABS,
  formatLibraryDate,
  kindTitle,
  refreshLibraryCatalog,
  syncLibraryCatalogSubscription,
  useLibraryCatalogStore,
  type LibraryTabId,
} from "@/store/library-catalog-store";
import { toast } from "@/store/toast-store";
import { useStage1DraftStore } from "@/store/stage1-draft-store";
import { useStage2DraftStore } from "@/store/stage2-draft-store";
import { useStage3DraftStore } from "@/store/stage3-draft-store";
import { useStage4DraftStore } from "@/store/stage4-draft-store";
import type { LibraryItem } from "@/types/library-item";

function libraryReviewHref(id: string) {
  return `${ROUTES.libraryReview}?id=${encodeURIComponent(id)}`;
}

function stageBadgeLabel(item: LibraryItem): string {
  switch (item.kind) {
    case "lessonPlan":
      return "Stage 1 - Lesson Plan";
    case "presentation":
      return "Stage 2 - Presentation";
    case "activity":
      return "Stage 3 - Formative";
    case "assessment":
      return "Stage 4 - Quiz & Test";
    case "completePack":
      return "Complete Pack";
  }
}

function DocMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill={filled ? "currentColor" : "none"} aria-hidden>
      <path
        d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4-3.9-3.8 5.4-.8L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 4h4a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7h11l-.7 11.2A2 2 0 0 1 14.8 20H9.2a2 2 0 0 1-2-1.8L6.5 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v5M14 11v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LibraryItemCard({
  item,
  onToggleFavourite,
  onDelete,
  onOpen,
}: {
  item: LibraryItem;
  onToggleFavourite: () => void;
  onDelete: () => void;
  onOpen: () => void;
}) {
  const meta = [
    item.curriculumRoute,
    item.grade,
    item.subject,
  ]
    .filter(Boolean)
    .join(" · ");

  const tags = [
    item.subject,
    item.grade,
    item.curriculumRoute.split("(")[0]?.trim() || item.curriculumRoute,
  ].filter(Boolean);

  return (
    <article className="relative w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lib-resources.svg"
        alt=""
        width={410}
        height={321}
        className="pointer-events-none block h-auto w-full select-none"
      />

      <div className="absolute inset-0 grid grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-2 px-[5%] pt-[16%] pb-[11%]">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#20AAA7] px-2.5 py-1 text-[10px] font-bold tracking-wide text-black uppercase">
            {stageBadgeLabel(item)}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              title="Favourite"
              aria-label="Favourite"
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border border-[#D5DCE3] bg-white transition hover:bg-[#F5F6FA]",
                item.isFavourite ? "text-[#E0A84A]" : "text-[#5B647E]",
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavourite();
              }}
            >
              <StarIcon filled={item.isFavourite} />
            </button>
            <button
              type="button"
              title="Delete"
              aria-label="Delete"
              className="flex size-8 items-center justify-center rounded-lg border border-[#D5DCE3] bg-white text-[#5B647E] transition hover:bg-[#FFF5F5] hover:text-[#C84747]"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <TrashMiniIcon />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-0 w-full min-w-0 items-center gap-3 self-stretch overflow-hidden rounded-2xl border border-[#E5EBEF] bg-white px-3 py-3 text-left shadow-[0_6px_16px_-12px_rgba(13,20,48,0.25)] transition hover:border-[#CFE6E4]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F6F5] text-[#128C89]">
            <DocMiniIcon />
          </span>
          <span className="min-w-0 flex-1 overflow-hidden">
            <span className="block truncate text-sm font-bold text-[#0D1430]">
              {item.topic || "Untitled"}
            </span>
            <span className="mt-0.5 block line-clamp-2 text-[11px] leading-snug text-[#8A93A3]">
              {meta || kindTitle(item.kind)}
              {item.kind === "presentation" && item.presentationStyle
                ? ` · Theme: ${item.presentationStyle}`
                : null}
              {(item.kind === "activity" || item.kind === "assessment") &&
              item.activityOrAssessmentLabel
                ? ` · ${item.activityOrAssessmentLabel}`
                : null}
            </span>
          </span>
        </button>

        <div className="flex min-w-0 gap-1.5 overflow-hidden">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="max-w-[9rem] shrink truncate rounded-full border border-[#D5DCE3] bg-white px-2.5 py-1 text-[10px] font-medium text-[#0D1430]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 pt-0.5">
          <p className="shrink-0 text-[11px] text-[#8A93A3]">
            {formatLibraryDate(item.generatedAt)}
          </p>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-gradient-to-r from-[#20AAA7] to-[#68D3D0] px-3.5 py-2 text-xs font-semibold text-black shadow-[0_8px_16px_-10px_rgba(32,170,167,0.8)] transition hover:opacity-95"
          >
            Open
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function LibraryView() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const items = useLibraryCatalogStore((s) => s.items);
  const loading = useLibraryCatalogStore((s) => s.loading);
  const error = useLibraryCatalogStore((s) => s.error);
  const filterTab = useLibraryCatalogStore((s) => s.filterTab);
  const toggleFavourite = useLibraryCatalogStore((s) => s.toggleFavourite);
  const removeById = useLibraryCatalogStore((s) => s.removeById);
  const loadLessonPlanFromLibrary = useStage1DraftStore(
    (s) => s.loadLessonPlanFromLibrary,
  );
  const loadPresentationFromLibrary = useStage2DraftStore(
    (s) => s.loadPresentationFromLibrary,
  );
  const loadActivityFromLibrary = useStage3DraftStore(
    (s) => s.loadActivityFromLibrary,
  );
  const loadAssessmentFromLibrary = useStage4DraftStore(
    (s) => s.loadAssessmentFromLibrary,
  );

  const [tab, setTab] = useState<LibraryTabId>("lessonPlan");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshing, setRefreshing] = useState(false);
  const [confirm, setConfirm] = useState<
    | { type: "favourite"; item: LibraryItem }
    | { type: "delete"; item: LibraryItem }
    | null
  >(null);

  useEffect(() => {
    // Force re-attach so HMR / remount never leaves an empty catalog stuck.
    syncLibraryCatalogSubscription(user?.uid ?? null, { force: true });
    if (user?.uid) {
      void recordLibraryOpened().catch(() => null);
    }
  }, [user?.uid]);

  const tabItems = useMemo(
    () => filterTab(tab, query),
    [filterTab, tab, query, items],
  );

  const counts = useMemo(() => {
    const next = {} as Record<LibraryTabId, number>;
    for (const t of LIBRARY_TABS) {
      next[t.id] = filterTab(t.id, "").length;
    }
    return next;
  }, [filterTab, items]);

  const shelf = archiveShelfCopy(tab);

  async function onRefresh() {
    if (!user) return;
    setRefreshing(true);
    try {
      await refreshLibraryCatalog(user.uid);
      toast.success("Library updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not refresh library.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleConfirm() {
    if (!confirm) return;
    const { type, item } = confirm;
    setConfirm(null);
    try {
      if (type === "favourite") {
        await toggleFavourite(item.id);
        toast.success(
          item.isFavourite ? "Removed from favourites." : "Added to favourites.",
        );
      } else {
        await removeById(item.id);
        toast.success("Deleted from library.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    }
  }

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1A1C30]">My Library</h1>
        <p className="text-sm text-[#666666]">
          Sign in to see lesson plans, presentations, and assessments you&apos;ve
          saved.
        </p>
        <div className="flex gap-2">
          <Link href={ROUTES.signIn}>
            <Button>Sign in</Button>
          </Link>
          <Link href={ROUTES.signUp}>
            <Button variant="outline">Create account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 pb-8">
      <LibraryHero />

      <div className="flex w-full min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <LibraryBrowseCard
            query={query}
            onQueryChange={setQuery}
            tab={tab}
            onTabChange={setTab}
            counts={counts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#128C89] uppercase">
                Current Archive Shelf
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0D1430]">
                {shelf.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="shrink-0 text-xs"
                isLoading={refreshing}
                onClick={() => void onRefresh()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          {loading && items.length === 0 ? (
            <div className="flex min-h-[30vh] items-center justify-center">
              <Spinner />
            </div>
          ) : tabItems.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 px-4 text-center">
              <p className="text-sm text-[#666666]">
                No items match your filters yet.
                <br />
                Try another tab or clear the search.
              </p>
              <Link href={ROUTES.stage1}>
                <Button variant="outline" className="mt-2">
                  Create a lesson plan
                </Button>
              </Link>
            </div>
          ) : (
            <ul
              className={cn(
                "grid min-h-[min(320px,38dvh)] gap-4 content-start",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {tabItems.map((item) => (
                <li key={item.id}>
                  <LibraryItemCard
                    item={item}
                    onOpen={() => {
                      if (item.kind === "lessonPlan") {
                        loadLessonPlanFromLibrary({
                          id: item.id,
                          topic: item.topic,
                          subject: item.subject,
                          grade: item.grade,
                          curriculumRoute: item.curriculumRoute,
                          reviewBody: item.reviewBody,
                          planBundleId: item.planBundleId,
                        });
                        router.push(ROUTES.stage1);
                        return;
                      }
                      if (item.kind === "presentation") {
                        void loadPresentationFromLibrary({
                          id: item.id,
                          topic: item.topic,
                          subject: item.subject,
                          grade: item.grade,
                          curriculumRoute: item.curriculumRoute,
                          reviewBody: item.reviewBody,
                          speakerNotes: item.speakerNotes,
                          presentationSlidesJson: item.presentationSlidesJson,
                          presentationStyle: item.presentationStyle,
                          planBundleId: item.planBundleId,
                          stage2JobId: item.stage2JobId,
                        }).then(() => {
                          router.push(ROUTES.stage2);
                        });
                        return;
                      }
                      if (item.kind === "activity") {
                        loadActivityFromLibrary({
                          id: item.id,
                          topic: item.topic,
                          subject: item.subject,
                          grade: item.grade,
                          curriculumRoute: item.curriculumRoute,
                          reviewBody: item.reviewBody,
                          teacherReviewBody: item.teacherReviewBody,
                          stage3Json: item.stage3Json,
                          planBundleId: item.planBundleId,
                          activityOrAssessmentLabel:
                            item.activityOrAssessmentLabel,
                        });
                        router.push(ROUTES.stage3);
                        return;
                      }
                      if (item.kind === "assessment") {
                        const bundle = item.planBundleId?.trim() || "";
                        const relatedActivity = bundle
                          ? items.find(
                              (i) =>
                                i.kind === "activity" &&
                                i.planBundleId?.trim() === bundle,
                            )
                          : undefined;
                        loadAssessmentFromLibrary({
                          id: item.id,
                          topic: item.topic,
                          subject: item.subject,
                          grade: item.grade,
                          curriculumRoute: item.curriculumRoute,
                          reviewBody: item.reviewBody,
                          teacherReviewBody: item.teacherReviewBody,
                          stage4Json: item.stage4Json,
                          planBundleId: item.planBundleId,
                          sourceLibraryItemId: relatedActivity?.id ?? null,
                          sourceAssessmentText:
                            relatedActivity?.reviewBody?.trim() ||
                            relatedActivity?.teacherReviewBody?.trim() ||
                            null,
                        });
                        router.push(ROUTES.stage4);
                        return;
                      }
                      router.push(libraryReviewHref(item.id));
                    }}
                    onToggleFavourite={() =>
                      setConfirm({ type: "favourite", item })
                    }
                    onDelete={() => setConfirm({ type: "delete", item })}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <AppSidebarColumn className="lg:w-72 xl:w-[21rem]">
          <LibraryTipsCard />
          <LibraryMapCard counts={counts} onSelect={setTab} />
          <AylaChatPanel
            context="library"
            className="rounded-[28px] border-[#E5EBEF] shadow-[0_16px_36px_-18px_rgba(13,20,48,0.14)]"
          />
        </AppSidebarColumn>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm?.type === "delete"
            ? `Delete ${confirm.item.topic}?`
            : confirm?.item.isFavourite
              ? "Remove from Favorites?"
              : "Add to Favorites?"
        }
        message={
          confirm?.type === "delete"
            ? `Are you sure you want to delete\n${confirm.item.topic}?`
            : `Are you sure you want to ${
                confirm?.item.isFavourite ? "remove" : "add"
              } "${confirm?.item.topic ?? ""}" ${
                confirm?.item.isFavourite ? "from" : "to"
              } favorites?`
        }
        danger={confirm?.type === "delete"}
        onCancel={() => setConfirm(null)}
        onConfirm={() => void handleConfirm()}
      />
    </div>
  );
}
