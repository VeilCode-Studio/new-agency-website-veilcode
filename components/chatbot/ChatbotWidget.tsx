"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Maximize2, Minimize2, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getChoiceGroup } from "@/lib/chatbot/choiceGroups";
import { getChatbotPanelClassName } from "@/lib/chatbot/panelLayout";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type LeadDraft = {
  service?: string;
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  goals?: string[];
};

type ChatbotApiResponse = {
  reply: string;
  leadDraft: LeadDraft;
  readyToSubmit: boolean;
  submitted: boolean;
  submissionMessage: string | null;
};

const STORAGE_KEY = "veilcode-chatbot-session";

const STARTER_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I'm VeilCode's project assistant. I can help you choose a service, estimate fit, or start a project brief.",
  },
];

type StoredChatSession = {
  conversationId: string;
  messages: ChatMessage[];
  leadDraft: LeadDraft;
  leadSubmitted: boolean;
};

function createConversationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getInitialSession(): StoredChatSession {
  const fallback = {
    conversationId: createConversationId(),
    messages: STARTER_MESSAGES,
    leadDraft: {},
    leadSubmitted: false,
  };

  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored) as Partial<StoredChatSession>;
    return {
      conversationId: parsed.conversationId || fallback.conversationId,
      messages: parsed.messages?.length ? parsed.messages : STARTER_MESSAGES,
      leadDraft: parsed.leadDraft ?? {},
      leadSubmitted: Boolean(parsed.leadSubmitted),
    };
  } catch {
    return fallback;
  }
}

export function ChatbotWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const initialSession = useMemo(() => getInitialSession(), []);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialSession.messages,
  );
  const [leadDraft, setLeadDraft] = useState<LeadDraft>(
    initialSession.leadDraft,
  );
  const [leadSubmitted, setLeadSubmitted] = useState(
    initialSession.leadSubmitted,
  );
  const [conversationId] = useState(initialSession.conversationId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const choiceGroup = useMemo(() => getChoiceGroup(messages), [messages]);

  useEffect(() => {
    if (!conversationId) return;

    try { sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ conversationId, messages, leadDraft, leadSubmitted }),
    ); } catch { /* The conversation remains usable when storage is unavailable. */ }
  }, [conversationId, leadDraft, leadSubmitted, messages]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [messages, open]);

  const statusText = useMemo(() => {
    if (leadSubmitted) return "Brief sent";
    if (leadDraft.email) return "Qualifying lead";
    return "Online";
  }, [leadDraft.email, leadSubmitted]);

  function toggleOption(option: string) {
    setSelectedOptions((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function closeChatbot() {
    setExpanded(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const input = document.getElementById("chatbot-message");
    input?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const typedContent = input.trim();
    const selectedContent = selectedOptions.join(", ");
    const content = [selectedContent, typedContent].filter(Boolean).join(". ");
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setInput("");
    setSelectedOptions([]);
    setError(null);
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messages: nextMessages,
          leadDraft,
          leadSubmitted,
        }),
      });

      const data = (await response.json()) as ChatbotApiResponse;
      if (!response.ok) {
        throw new Error(data.reply || "The assistant is unavailable.");
      }

      setLeadDraft(data.leadDraft ?? {});
      setLeadSubmitted((current) => current || data.submitted);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "The assistant is unavailable right now.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not process that message right now. You can still use the project form and we'll respond within one business day.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      {open && (
        <section
          id="veilcode-assistant"
          aria-label="VeilCode project assistant"
          className={getChatbotPanelClassName(expanded)}
        >
          <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-brand-border bg-brand-dim text-brand">
                <Bot className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-display text-sm font-bold text-ink">
                  Ask VeilCode
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  {statusText}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-label={expanded ? "Collapse chatbot" : "Expand chatbot"}
                title={expanded ? "Collapse" : "Expand"}
                className="grid size-11 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-hi hover:bg-surface-hi hover:text-ink"
              >
                {expanded ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
              </button>
              <button
                type="button"
                onClick={closeChatbot}
                aria-label="Close chatbot"
                className="grid size-11 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-hi hover:bg-surface-hi hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 font-sans text-sm leading-relaxed",
                  expanded ? "max-w-[min(42rem,86%)]" : "max-w-[86%]",
                  message.role === "user"
                    ? "ml-auto bg-brand text-page"
                    : "mr-auto border border-line bg-surface text-ink-muted",
                )}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div
                aria-label="Assistant is loading"
                className="mr-auto inline-flex items-center gap-1.5 rounded-2xl border border-line bg-surface px-3.5 py-3"
              >
                <span className="size-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-brand" />
              </div>
            )}
          </div>

          {choiceGroup && !loading && (
            <div className="border-t border-line bg-surface/60 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-ink-muted">
                {choiceGroup.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {choiceGroup.options.map((option) => {
                  const selected = selectedOptions.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleOption(option)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        selected
                          ? "border-brand bg-brand text-page"
                          : "border-line bg-page text-ink-muted hover:border-brand hover:text-ink",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                Select any that apply, or type your own answer below.
              </p>
            </div>
          )}

          {error && (
            <p className="border-t border-line px-4 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          {leadSubmitted && (
            <div className="border-t border-brand-border bg-brand-dim px-4 py-3 text-xs leading-relaxed text-brand">
              Your brief has been sent. For a fuller brief, you can also visit{" "}
              <a href="/start" className="underline underline-offset-2">
                Start a Project
              </a>
              .
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3">
            <input
              id="chatbot-message"
              aria-label="Your message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={loading}
              maxLength={1200}
              placeholder={
                leadSubmitted
                  ? "Ask a follow-up question..."
                  : "Ask about a project or service..."
              }
              className="min-w-0 flex-1 rounded-xl border border-line bg-surface-hi px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand"
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && selectedOptions.length === 0)}
              aria-label="Send message"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand text-brand transition-colors hover:bg-brand hover:text-page disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  <span className="size-1 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                  <span className="size-1 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                  <span className="size-1 animate-bounce rounded-full bg-current" />
                </span>
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </form>
        </section>
      )}

    </>
  );
}
