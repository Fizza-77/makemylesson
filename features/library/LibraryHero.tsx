"use client";

import { useMemo } from "react";

import { useLibraryCatalogStore } from "@/store/library-catalog-store";

export function LibraryHero() {
  const items = useLibraryCatalogStore((s) => s.items);

  const stats = useMemo(() => {
    const resources = items.length;
    const stageKinds = new Set(
      items
        .filter((i) => i.kind !== "completePack")
        .map((i) => i.kind),
    );
    const packs = items.filter((i) => i.kind === "completePack").length;
    const favourites = items.filter((i) => i.isFavourite).length;
    return {
      resources,
      stages: stageKinds.size,
      packs,
      favourites,
    };
  }, [items]);

  return (
    <section
      className="relative overflow-hidden rounded-[28px] shadow-[0_24px_48px_-20px_rgba(13,20,48,0.35)]"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 65% 90% at 88% 42%, rgba(104, 211, 208, 0.32) 0%, rgba(104, 211, 208, 0) 62%)",
          "linear-gradient(90deg, #0D1430 0%, #202B52 48%, #30416F 100%)",
        ].join(", "),
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-9">
        <div className="w-full min-w-0 max-w-xl flex-1">
          <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-[#68D3D0] uppercase">
            <span className="inline-block h-0.5 w-7 rounded-full bg-[#35BEBC]" />
            Teacher Resource Archive
          </p>

          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
            My <span className="text-[#68D3D0]">Library</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-[15px]">
            Everything you have generated, organised into a visual teaching
            archive for fast searching, favouriting, reusing, and adapting.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <HeroStat value={stats.resources} label="Resources" />
            <HeroStat value={stats.stages} label="Stages" />
            <HeroStat value={stats.packs} label="Packs" />
            <HeroStat value={stats.favourites} label="Favourites" />
          </div>
        </div>

        <div className="relative w-full max-w-[480px] shrink-0 lg:max-w-[520px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/library-hero.svg"
            alt="Library archive illustration"
            width={538}
            height={301}
            className="h-auto w-full select-none"
          />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase">
      <span className="text-[#68D3D0]">{value}</span> {label}
    </span>
  );
}
