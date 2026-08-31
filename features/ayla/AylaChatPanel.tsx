"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Spinner } from "@/components/ui/Spinner";
import {
  AYLA_PANEL_ID,
  consumeScrollToAylaRequest,
  scrollToAylaPanel,
} from "@/lib/ayla-scroll";
import type { StageSidebarContext } from "@/data/stage-tips";
import { cn } from "@/lib/utils";
import { useAylaChatStore } from "@/store/ayla-chat-store";

type AylaIntent = { label: string; prompt: string };

type AylaStageCopy = {
  welcome: string;
  placeholder: string;
  intents: readonly AylaIntent[];
  showOnlineBadge?: boolean;
  /** Centered empty-state hero (full Ayla tab). */
  helloTitle?: string;
  helloBody?: string;
};

export type AylaPanelContext = StageSidebarContext | "library" | "ayla";

const STAGE_AYLA: Record<AylaPanelContext, AylaStageCopy> = {
  stage1: {
    welcome:
      "Hello! I'm Ayla. I can help with lesson plans, activities and assessments. What are we teaching today?",
    placeholder: "Ask Ayla about your lesson",
    intents: [
      {
        label: "Improve my topic",
        prompt: "Help me improve and sharpen my lesson topic.",
      },
      {
        label: "Suggest an activity",
        prompt: "Suggest a classroom activity for this lesson.",
      },
      {
        label: "Add differentiation",
        prompt: "Suggest differentiation ideas for this lesson.",
      },
    ],
    showOnlineBadge: true,
  },
  stage2: {
    welcome:
      "Hello! I can help refine your presentation, improve slide flow, or strengthen your speaker notes. What would you like to work on?",
    placeholder: "Ask Ayla about your presentation",
    intents: [
      {
        label: "Improve slide flow",
        prompt: "Help me improve the flow and sequence of my slides.",
      },
      {
        label: "Strengthen speaker notes",
        prompt: "Help me strengthen and expand my speaker notes.",
      },
      {
        label: "Make slides more engaging",
        prompt: "Suggest ways to make my slides more engaging for students.",
      },
    ],
  },
  stage3: {
    welcome:
      "I can help choose the right assessment type, improve your questions, or make the worksheet more challenging. What do you need?",
    placeholder: "Ask Ayla about your assessment",
    intents: [
      {
        label: "Suggest question types",
        prompt:
          "Suggest the best question types for this formative assessment.",
      },
      {
        label: "Make it more challenging",
        prompt:
          "Help me make this worksheet more challenging while staying on the learning objective.",
      },
    ],
  },
  stage4: {
    welcome:
      "I can balance the paper blueprint, adjust difficulty, improve mark allocation, or review the final mark scheme.",
    placeholder: "Ask Ayla about your assessment",
    intents: [
      {
        label: "Balance question mix",
        prompt: "Help me balance the question mix across this assessment paper.",
      },
      {
        label: "Increase difficulty",
        prompt:
          "Suggest ways to increase difficulty while keeping the paper fair.",
      },
      {
        label: "Review marks",
        prompt: "Review mark allocation and the teacher mark scheme.",
      },
    ],
  },
  library: {
    welcome:
      "Looking for something? I can help find a lesson, presentation, assessment, or complete pack in your library.",
    placeholder: "Ask Ayla about your library",
    intents: [
      {
        label: "Find science resources",
        prompt: "Find science resources in my library.",
      },
      {
        label: "Show complete packs",
        prompt: "Show complete packs in my library.",
      },
      {
        label: "Find Year 2 lessons",
        prompt: "Find Year 2 lessons in my library.",
      },
    ],
    showOnlineBadge: true,
  },
  ayla: {
    welcome:
      "I'm ready to help with lesson plans, activities and assessments. What are we teaching today?",
    helloTitle: "Hi, I'm Ayla",
    helloBody:
      "I'm ready to help with lesson plans, activities and assessments. What are we teaching today?",
    placeholder: "Ask Ayla anything…",
    intents: [
      {
        label: "Generate lesson plan",
        prompt: "Generate a lesson plan",
      },
      {
        label: "Create classroom activity",
        prompt: "Create a classroom activity",
      },
      {
        label: "Build quick assessment",
        prompt: "Build a quick assessment",
      },
    ],
    showOnlineBadge: true,
  },
};

function AylaAvatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src="/ayla.svg"
        alt=""
        width={size}
        height={size}
        className="absolute left-1/2 top-[42%] h-[210%] w-[210%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        unoptimized
      />
    </span>
  );
}

function SendIcon({ light = false }: { light?: boolean }) {
  if (light) {
    return (
      <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="white" aria-hidden>
        <path d="M3.4 20.6 21.2 12 3.4 3.4l.1 6.5L14 12 3.5 14.1l-.1 6.5Z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] shrink-0"
      fill="#000000"
      aria-hidden
    >
      <path d="M3.4 20.6 21.2 12 3.4 3.4l.1 6.5L14 12 3.5 14.1l-.1 6.5Z" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M4 20l4.5-1L20 7.5a2.1 2.1 0 0 0-3-3L5.5 16z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AylaChatPanel({
  compact = false,
  context = "stage1",
  className,
}: {
  compact?: boolean;
  context?: AylaPanelContext;
  className?: string;
}) {
  const copy = STAGE_AYLA[context] ?? STAGE_AYLA.stage1;
  const messages = useAylaChatStore((s) => s.messages);
  const isSending = useAylaChatStore((s) => s.isSending);
  const send = useAylaChatStore((s) => s.send);
  const clear = useAylaChatStore((s) => s.clear);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const isAylaPage = context === "ayla";
  /** Sidebar embed (stages / library) — inner chat scrolls first, then the column. */
  const isSidebarEmbed = !isAylaPage && !compact;
  const isStage2 = context === "stage2";
  const isStage3 = context === "stage3";
  const isStage4 = context === "stage4";
  const isLibrary = context === "library";
  const useSolidHeader = isStage2 || isStage3 || isStage4;
  const useMintChips = isStage2 || isAylaPage;
  const useOutlineChips = isStage3 || isStage4;
  const useLibraryChips = isLibrary;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  useEffect(() => {
    if (!consumeScrollToAylaRequest()) return;
    const id = window.setTimeout(() => {
      scrollToAylaPanel();
    }, 80);
    return () => window.clearTimeout(id);
  }, [context]);

  async function onSend(text?: string) {
    const prompt = (text ?? draft).trim();
    if (!prompt) return;
    if (!text) setDraft("");
    await send(prompt);
  }

  /** Scroll Ayla messages first; pass overflow to the sticky sidebar column. */
  function onSidebarEmbedWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!isSidebarEmbed) return;
    const el = e.currentTarget;
    const column = el.closest(".app-sidebar-column");
    if (!(column instanceof HTMLElement)) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const scrollingUp = e.deltaY < 0;
    const scrollingDown = e.deltaY > 0;
    const hasInnerScroll = scrollHeight > clientHeight + 1;

    if (
      hasInnerScroll &&
      ((scrollingUp && !atTop) || (scrollingDown && !atBottom))
    ) {
      return;
    }

    e.preventDefault();
    column.scrollTop += e.deltaY;
  }

  return (
    <div
      id={AYLA_PANEL_ID}
      className={cn(
        "flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_-18px_rgba(13,20,48,0.18)]",
        className,
      )}
      aria-label="Chat with Ayla"
    >
      <header
        className={cn(
          "flex shrink-0 items-center gap-2.5",
          compact ? "px-3 py-2.5" : "px-3 py-3 sm:px-4",
        )}
        style={{
          backgroundImage: useSolidHeader
            ? undefined
            : "linear-gradient(100deg, #0D1430 0%, #202B52 55%, #30416F 100%)",
          backgroundColor: useSolidHeader ? "#151B35" : undefined,
        }}
      >
        <span className="relative shrink-0">
          <AylaAvatar size={compact ? 36 : isAylaPage ? 44 : 48} />
          {copy.showOnlineBadge ? (
            <span
              className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#0D1430] bg-[#28C2C0]"
              aria-hidden
            />
          ) : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">Ayla</p>
          {isAylaPage && copy.showOnlineBadge ? (
            <p className="truncate text-[11px] text-white/70">Online</p>
          ) : null}
        </div>
        {isAylaPage ? (
          <button
            type="button"
            onClick={() => clear()}
            aria-label="Start a new chat"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/12 hover:text-white"
          >
            <NewChatIcon />
          </button>
        ) : copy.showOnlineBadge && !isAylaPage ? (
          <span className="shrink-0 rounded-full bg-teal-500/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-teal-300 uppercase ring-1 ring-teal-400/30">
            Online
          </span>
        ) : null}
      </header>

      <div
        ref={messagesRef}
        onWheel={isSidebarEmbed ? onSidebarEmbedWheel : undefined}
        className={cn(
          "flex flex-col gap-3 overflow-y-auto",
          isSidebarEmbed
            ? "theme-scroll-inner overscroll-y-auto"
            : "theme-scroll-hover overscroll-contain",
          isLibrary || isAylaPage ? "bg-[#F5F6FA]" : "bg-[#F4F6F8]",
          compact
            ? "h-[14rem] px-3 py-2.5"
            : isAylaPage
              ? "h-[min(52vh,430px)] px-4 py-4 sm:px-5"
              : isLibrary
                ? "h-[13rem] px-3 py-2.5 sm:h-[15rem] sm:px-4"
                : "h-[15rem] px-3 py-3 sm:h-[17rem] sm:px-4",
        )}
      >
        {messages.length === 0 ? (
          isAylaPage && copy.helloTitle ? (
            <div className="flex flex-col items-center px-2 py-6 text-center sm:py-8">
              <span className="mb-3 flex size-16 items-center justify-center rounded-full border-2 border-[#28C2C0] bg-[#E8F8F8]">
                <AylaAvatar size={52} />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-[#151B35]">
                {copy.helloTitle}
              </h1>
              <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-slate-500">
                {copy.helloBody}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "max-w-[95%] rounded-2xl border border-slate-200/80 bg-white text-slate-700 shadow-sm",
                compact
                  ? "px-2.5 py-2 text-xs leading-relaxed"
                  : isLibrary
                    ? "px-3 py-2 text-xs leading-relaxed"
                    : "px-3 py-2.5 text-sm leading-relaxed",
              )}
            >
              {copy.welcome}
            </div>
          )
        ) : (
          <>
            {messages.map((message, i) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${i}`}
                  className={cn(
                    "flex gap-2",
                    isUser ? "justify-end" : "justify-start",
                  )}
                >
                  {!isUser ? <AylaAvatar size={28} /> : null}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      isUser
                        ? isAylaPage
                          ? "rounded-br-md bg-[#28C2C0] font-medium text-[#151B35]"
                          : "bg-[#151B35] text-white"
                        : "rounded-bl-md border border-slate-200/80 bg-white text-slate-700 shadow-sm",
                    )}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isSending ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <AylaAvatar size={28} />
                <Spinner className="size-4" />
                Ayla is thinking…
              </div>
            ) : null}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-slate-100 bg-white",
          compact ? "px-3 py-2.5" : isAylaPage ? "px-4 py-3 sm:px-5" : "px-3 py-3 sm:px-4",
        )}
      >
        {messages.length === 0 ? (
          <div
            className={cn(
              "flex flex-wrap gap-1",
              isAylaPage ? "mb-3 justify-center gap-2" : compact ? "mb-2" : "mb-2",
            )}
          >
            {copy.intents.map((intent) => (
              <button
                key={intent.label}
                type="button"
                disabled={isSending}
                onClick={() => void onSend(intent.prompt)}
                className={cn(
                  "rounded-full font-medium transition disabled:opacity-50",
                  useLibraryChips
                    ? "border border-[#E5E7EB] bg-white px-2.5 py-1 text-[10px] leading-tight text-[#065F46] hover:border-[#CFE6E4] hover:bg-white"
                    : useMintChips
                      ? "border border-[#28C2C0]/40 bg-[#E8F8F8] px-2.5 py-1 text-[11px] font-semibold text-[#128C89] hover:border-[#28C2C0] hover:bg-[#D5F3F2]"
                      : useOutlineChips
                        ? "border border-[#28C2C0]/60 bg-white px-2.5 py-1 text-[11px] text-[#28C2C0] hover:border-[#28C2C0] hover:bg-[#E8F8F8]"
                        : "border border-teal-200 bg-white px-2.5 py-1 text-[11px] text-teal-600 hover:border-teal-400 hover:bg-teal-50",
                  isAylaPage && "px-3.5 py-1.5 text-xs",
                )}
              >
                {intent.label}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void onSend();
          }}
        >
          <input
            className={cn(
              "min-w-0 flex-1 border border-slate-200 bg-white text-sm text-[#151B35] outline-none placeholder:text-slate-400 focus:border-[#28C2C0] focus:ring-2 focus:ring-[#28C2C0]/20 disabled:opacity-50",
              isAylaPage
                ? "h-11 rounded-full px-4"
                : compact
                  ? "rounded-xl px-3 py-2"
                  : "rounded-xl px-3 py-2.5",
            )}
            placeholder={copy.placeholder}
            value={draft}
            disabled={isSending}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message Ayla"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            aria-label="Send"
            className={cn(
              "flex shrink-0 items-center justify-center bg-[#28C2C0] transition hover:bg-[#22B0AE] disabled:cursor-not-allowed disabled:opacity-50",
              isAylaPage
                ? "size-11 rounded-full text-white"
                : compact
                  ? "size-10 rounded-[12px] text-black"
                  : "size-11 rounded-[12px] text-black",
            )}
          >
            <SendIcon light={isStage3 || isStage4 || isAylaPage} />
          </button>
        </form>
      </div>
    </div>
  );
}
