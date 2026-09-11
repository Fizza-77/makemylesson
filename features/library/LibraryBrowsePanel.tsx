"use client";

import type { LibraryTabId } from "@/store/library-catalog-store";
import { cn } from "@/lib/utils";

const TAB_CHIPS: {
  id: LibraryTabId;
  label: string;
}[] = [
  { id: "lessonPlan", label: "Lesson Plans" },
  { id: "presentation", label: "Presentations" },
  { id: "activity", label: "Formative" },
  { id: "assessment", label: "Quiz & Test" },
  { id: "completePack", label: "Complete Packs" },
  { id: "favourites", label: "Favourites" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
    </svg>
  );
}

export function LibraryBrowseCard({
  query,
  onQueryChange,
  tab,
  onTabChange,
  counts,
  viewMode,
  onViewModeChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  tab: LibraryTabId;
  onTabChange: (tab: LibraryTabId) => void;
  counts: Record<LibraryTabId, number>;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) {
  return (
    <section className="rounded-[24px] border border-[#E5EBEF] bg-white p-4 shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)] sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8A93A3]">
            <SearchIcon />
          </span>
          <span className="sr-only">Search library</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by topic, subject, curriculum, year, or stage"
            className="w-full rounded-xl border border-[#D5DCE3] bg-white py-3 pr-4 pl-10 text-sm text-[#0D1430] outline-none placeholder:text-[#9AA2A8] focus:border-[#20AAA7]"
          />
        </label>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "flex size-11 items-center justify-center rounded-xl border transition",
              viewMode === "grid"
                ? "border-transparent bg-[#E7F6F5] text-[#128C89]"
                : "border-[#D5DCE3] bg-white text-[#5B647E] hover:bg-[#F5F6FA]",
            )}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={cn(
              "flex size-11 items-center justify-center rounded-xl border transition",
              viewMode === "list"
                ? "border-transparent bg-[#E7F6F5] text-[#128C89]"
                : "border-[#D5DCE3] bg-white text-[#5B647E] hover:bg-[#F5F6FA]",
            )}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        role="tablist"
        aria-label="Library sections"
      >
        {TAB_CHIPS.map((t) => {
          const active = tab === t.id;
          const count = counts[t.id] ?? 0;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(t.id)}
              className={cn(
                "relative flex min-h-[72px] flex-col items-start justify-between overflow-hidden rounded-2xl px-3 py-3 text-left transition",
                active
                  ? "bg-gradient-to-b from-[#35BEBC] to-[#1A9592] text-white shadow-[0_10px_20px_-12px_rgba(32,170,167,0.65)]"
                  : "border border-[#D5DCE3] bg-white text-[#0D1430] hover:border-[#CFE6E4] hover:bg-[#F8FBFC]",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-bold tracking-[0.06em] uppercase sm:text-xs",
                  active ? "text-white" : "text-[#0D1430]",
                )}
              >
                {t.label}
              </span>
              <span
                className={cn(
                  "mt-3 flex size-7 items-center justify-center rounded-full text-[11px] font-bold",
                  active
                    ? "bg-white/25 text-white"
                    : "bg-[#E8F4F8] text-[#128C89]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const MAP_ROWS: {
  id: LibraryTabId;
  badge: string;
  badgeClass: string;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "lessonPlan",
    badge: "S1",
    badgeClass: "bg-[#D7F3F1] text-[#0F766E]",
    title: "Lesson Plans",
    subtitle: "Planning resources",
  },
  {
    id: "presentation",
    badge: "S2",
    badgeClass: "bg-[#E3E7F7] text-[#3B4588]",
    title: "Presentations",
    subtitle: "Slides and notes",
  },
  {
    id: "activity",
    badge: "S3",
    badgeClass: "bg-[#D9F4F5] text-[#0F766E]",
    title: "Assessments",
    subtitle: "Activities and checks",
  },
  {
    id: "assessment",
    badge: "S4",
    badgeClass: "bg-[#161F3D] text-white",
    title: "Quiz & Test",
    subtitle: "Final assessments",
  },
];

export function LibraryMapCard({
  counts,
  onSelect,
}: {
  counts: Record<LibraryTabId, number>;
  onSelect: (tab: LibraryTabId) => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[28px] border border-[#E5EBEF] bg-white shadow-[0_16px_36px_-18px_rgba(13,20,48,0.28)]">
      <div
        className="px-6 py-7"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #202B52 0%, #161F3D 55%, #0D1430 100%)",
        }}
      >
        <p className="text-[11px] font-bold tracking-[0.16em] text-[#68D3D0] uppercase">
          Library Map
        </p>
        <h2 className="mt-3 text-[22px] leading-tight font-bold text-white">
          Your teaching archive.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          A quick overview of everything currently stored in your library.
        </p>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:p-5">
        {MAP_ROWS.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelect(row.id)}
            className="flex w-full items-center gap-3.5 rounded-2xl border border-[#E8EEF0] bg-white px-3.5 py-3.5 text-left transition hover:border-[#CFE6E4] hover:bg-[#F8FBFC]"
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold",
                row.badgeClass,
              )}
            >
              {row.badge}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-[#161F3D]">
                {row.title}
              </span>
              <span className="mt-0.5 block text-sm text-[#6B7288]">
                {row.subtitle}
              </span>
            </span>
            <span className="text-base font-bold text-[#0F766E]">
              {counts[row.id] ?? 0}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function LibraryTipsCard() {
  return (
    <aside className="rounded-[28px] border border-[#E5EBEF] bg-white p-7 shadow-[0_16px_36px_-18px_rgba(13,20,48,0.18)] sm:p-8">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#005F52] uppercase">
        Tips &amp; Resources
      </p>
      <h2 className="mt-3 text-[26px] leading-tight font-bold tracking-tight text-[#333E63] sm:text-[28px]">
        Organise for fast retrieval
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-[#333E63]">
        Favourite the resources you reuse most, then filter by stage or search
        by topic, subject, year, or curriculum.
      </p>
      <ul className="mt-6 flex flex-col gap-4">
        <li className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F4F1] text-[#005F52]">
            <TipsCheckIcon />
          </span>
          <span className="text-[15px] leading-snug text-[#333E63]">
            The star on every folder adds it to your Favourites shelf.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F4F1] text-[#005F52]">
            <TipsCheckIcon />
          </span>
          <span className="text-[15px] leading-snug text-[#333E63]">
            Complete Packs keep all four lesson stages together.
          </span>
        </li>
      </ul>
    </aside>
  );
}

function TipsCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8.5 12.2 2.3 2.3 4.7-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function archiveShelfCopy(tab: LibraryTabId): { title: string } {
  switch (tab) {
    case "lessonPlan":
      return { title: "Lesson Plans" };
    case "presentation":
      return { title: "Presentations" };
    case "activity":
      return { title: "Formative" };
    case "assessment":
      return { title: "Quiz & Test" };
    case "completePack":
      return { title: "Complete Packs" };
    case "favourites":
      return { title: "Favourites" };
  }
}


