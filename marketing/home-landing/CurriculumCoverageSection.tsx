"use client";

import { useState } from "react";

import { responsiveWebpSrcSet } from "@marketing/home-landing/responsiveWebp";
import { CURRICULUM_ROUTE_COUNT } from "@/data/curriculum-route-count";

function RoutesUnderline() {
  return (
    <svg
      className="mml-cc-underline"
      viewBox="0 0 200 10"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M4 5h192"
        stroke="var(--mml-cyan)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ListItem =
  | string
  | {
      title: string;
      detail: string;
    };

type CurriculumCard = {
  id: string;
  title: string;
  range: string;
  tone: "navy" | "white" | "cyan";
  flag: string;
  flagAlt: string;
  structure: string;
  structureClass: string;
  items: ListItem[];
  previewCount?: number;
  more?: "navy" | "cyan";
  numTone?: "cyan" | "navy";
};

const CARDS: CurriculumCard[] = [
  {
    id: "uk",
    title: "United Kingdom",
    range: "Primary to Pre-University",
    tone: "navy",
    flag: "/UK.png",
    flagAlt: "United Kingdom flag",
    structure: "/svgs/UK.webp",
    structureClass: "mml-cc-structure--uk",
    items: [
      "UK National Curriculum",
      "Cambridge IGCSE, AS & A Level",
      "Pearson Edexcel IGCSE, AS & A Level",
    ],
  },
  {
    id: "us",
    title: "United States",
    range: "Kindergarten to College Admissions",
    tone: "white",
    flag: "/Flags/us-flag.webp",
    flagAlt: "United States flag",
    structure: "/svgs/US.webp",
    structureClass: "mml-cc-structure--us",
    items: [
      { title: "Foundational", detail: "Common Core State Standards" },
      { title: "Advanced", detail: "Advanced Placement (AP)" },
      { title: "Admissions", detail: "Digital SAT" },
    ],
  },
  {
    id: "ib",
    title: "International Baccalaureate",
    range: "Primary to Diploma Programme",
    tone: "white",
    flag: "/IB.svg",
    flagAlt: "International Baccalaureate logo",
    structure: "/svgs/IB.webp",
    structureClass: "mml-cc-structure--ib",
    items: [
      "Primary Years Programme (PYP)",
      "Middle Years Programme (MYP)",
      "Diploma Programme (DP)",
    ],
  },
  {
    id: "au",
    title: "Australia",
    range: "Primary to Senior Secondary",
    tone: "white",
    flag: "/Flags/aus-flag.webp",
    flagAlt: "Australia flag",
    structure: "/svgs/Australia.webp",
    structureClass: "mml-cc-structure--au",
    previewCount: 3,
    items: [
      "New South Wales – Higher School Certificate (HSC)",
      "Victoria – Victorian Certificate of Education (VCE)",
      "Queensland – Queensland Certificate of Education (QCE)",
      "Western Australia – Western Australian Certificate of Education (WACE)",
      "South Australia – South Australian Certificate of Education (SACE)",
      "Tasmania – Tasmanian Certificate of Education (TCE)",
      "Australian Capital Territory – ACT Senior Secondary Certificate (ACT SSC)",
      "Northern Territory – Northern Territory Certificate of Education and Training (NTCET)",
      { title: "National Assessments", detail: "NAPLAN" },
    ],
    more: "cyan",
  },
  {
    id: "ca",
    title: "Canada",
    range: "Primary to High School Graduation",
    tone: "white",
    flag: "/Flags/canada-flag.webp",
    flagAlt: "Canada flag",
    structure: "/svgs/Canada.webp",
    structureClass: "mml-cc-structure--ca",
    previewCount: 3,
    items: [
      "Ontario – Ontario Secondary School Diploma (OSSD)",
      "British Columbia – Dogwood Diploma",
      "Alberta – Alberta High School Diploma",
      "Québec – Diplôme d'études secondaires (DES)",
      "Manitoba – Manitoba High School Diploma",
      "Saskatchewan – Saskatchewan Grade 12 Diploma",
      "Atlantic Provinces",
      "Northern Territories",
    ],
    more: "cyan",
  },
];

function CardList({
  items,
  numTone = "cyan",
  startIndex = 0,
  className = "",
}: {
  items: ListItem[];
  numTone?: "cyan" | "navy";
  startIndex?: number;
  className?: string;
}) {
  return (
    <ol className={`mml-cc-list mml-cc-list--${numTone}${className ? ` ${className}` : ""}`}>
      {items.map((item, i) => {
        const isObj = typeof item === "object";
        return (
          <li key={startIndex + i} className="mml-cc-list-item">
            <span className="mml-cc-num" aria-hidden>
              {startIndex + i + 1}
            </span>
            <span className="mml-cc-list-body">
              {isObj ? (
                <>
                  <span className="mml-cc-list-title">{item.title}</span>
                  <span className="mml-cc-list-detail">{item.detail}</span>
                </>
              ) : (
                item
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function CurriculumCoverageSection() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="mml-cc" id="curriculum" aria-labelledby="mml-cc-heading">
      <div className="mml-cc-inner">
        <p className="mml-cc-eyebrow">CURRICULUM COVERAGE</p>

        <h2 id="mml-cc-heading" className="mml-cc-title">
          Five systems.{" "}
          <span className="mml-cc-title-accent">
            {CURRICULUM_ROUTE_COUNT} routes.
            <RoutesUnderline />
          </span>{" "}
          Yours is here.
        </h2>

        <p className="mml-cc-sub">
          Dedicated routes reflect curriculum language, exam systems and
          progression instead of generic labels on basic templates.
        </p>

        <ul className="mml-cc-grid">
          {CARDS.map((card) => {
            const previewCount = card.previewCount ?? card.items.length;
            const isExpanded = Boolean(expanded[card.id]);
            const canExpand = Boolean(card.more) && card.items.length > previewCount;
            const previewItems = canExpand
              ? card.items.slice(0, previewCount)
              : card.items;
            const extraItems = canExpand ? card.items.slice(previewCount) : [];

            return (
              <li
                key={card.id}
                className={`mml-cc-card mml-cc-card--${card.id} mml-cc-card--${card.tone}${
                  isExpanded ? " mml-cc-card--expanded" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.structure}
                  srcSet={responsiveWebpSrcSet(card.structure, 340, 680)}
                  alt={`${card.title} curriculum routes illustration`}
                  width={298}
                  height={199}
                  sizes="(max-width: 767px) 48vw, 18vw"
                  className={`mml-cc-structure ${card.structureClass}`}
                  loading="lazy"
                  decoding="async"
                />

                <div className="mml-cc-card-top">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.flag}
                    alt={card.flagAlt}
                    className={
                      card.id === "ib" ? "mml-cc-flag mml-cc-flag--ib" : "mml-cc-flag"
                    }
                    width={48}
                    height={32}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="mml-cc-card-body">
                  <h3 className="mml-cc-card-title">{card.title}</h3>
                  <p className="mml-cc-card-range">{card.range}</p>
                  <CardList items={previewItems} numTone={card.numTone ?? "cyan"} />
                  {extraItems.length > 0 ? (
                    <div
                      className={`mml-cc-more-panel${isExpanded ? " mml-cc-more-panel--open" : ""}`}
                      aria-hidden={!isExpanded}
                    >
                      <div className="mml-cc-more-panel-inner">
                        <CardList
                          items={extraItems}
                          numTone={card.numTone ?? "cyan"}
                          startIndex={previewCount}
                          className="mml-cc-list--extra"
                        />
                      </div>
                    </div>
                  ) : null}
                  {canExpand ? (
                    <button
                      type="button"
                      className={`mml-cc-more mml-cc-more--${card.more}`}
                      aria-expanded={isExpanded}
                      onClick={() => toggleCard(card.id)}
                    >
                      {isExpanded ? "Show less" : "Read more...."}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}


