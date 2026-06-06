"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

type ChoiceGroup = {
  label: string;
  options: string[];
};

const SERVICE_OPTIONS = [
  "Web Solutions",
  "Mobile Applications",
  "AI Automation",
  "Data Analytics",
  "Social Media Marketing",
];

const COMPETITOR_OUTPUT_OPTIONS = [
  "Feature gaps",
  "Pricing changes",
  "Content/SEO moves",
  "Automation opportunities",
  "Dashboard with alerts",
];

const AUTOMATION_PROCESS_OPTIONS = [
  "Lead qualification",
  "Support triage",
  "Reporting",
  "Document processing",
  "Approvals",
  "Follow-ups",
];

const PROJECT_OUTCOME_OPTIONS = [
  "Reduce manual work",
  "Find market gaps",
  "Monitor competitors",
  "Improve reporting",
  "Speed up decisions",
];

const DATA_SOURCE_OPTIONS = [
  "Competitor websites",
  "Social channels",
  "Search results",
  "Public pricing pages",
  "Internal spreadsheets",
  "CRM data",
];

const BUDGET_OPTIONS = [
  "Under $1,500",
  "$1,500 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $30,000",
  "$30,000 - $60,000",
  "$60,000+",
  "Let's discuss",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "Just exploring",
];

type StoredChatSession = {
  conversationId: string;
  messages: ChatMessage[];
  leadDraft: LeadDraft;
  leadSubmitted: boolean;
};

function shouldHide(pathname: string) {
  return (
    pathname === "/start" ||
    pathname.startsWith("/newsletter") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/no-access")
  );
}

function createConversationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getLatestAssistantMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "assistant");
}

function getChoiceGroup(messages: ChatMessage[]): ChoiceGroup | null {
  const latestAssistant = getLatestAssistantMessage(messages);
  if (!latestAssistant) return null;

  const content = latestAssistant.content.toLowerCase();

  if (
    content.includes("choose a service") ||
    content.includes("which one best matches") ||
    content.includes("which service are you interested") ||
    content.includes("core services")
  ) {
    return { label: "Select one or more services", options: SERVICE_OPTIONS };
  }

  if (content.includes("what output matters most first")) {
    return {
      label: "Select one or more outputs",
      options: COMPETITOR_OUTPUT_OPTIONS,
    };
  }

  if (
    content.includes("what process should") ||
    content.includes("main process you want automated")
  ) {
    return {
      label: "Select one or more processes",
      options: AUTOMATION_PROCESS_OPTIONS,
    };
  }

  if (content.includes("main outcome") || content.includes("primary outcome")) {
    return {
      label: "Select one or more outcomes",
      options: PROJECT_OUTCOME_OPTIONS,
    };
  }

  if (content.includes("data sources")) {
    return {
      label: "Select one or more data sources",
      options: DATA_SOURCE_OPTIONS,
    };
  }

  if (content.includes("budget")) {
    return { label: "Select a budget range", options: BUDGET_OPTIONS };
  }

  if (content.includes("timeline")) {
    return { label: "Select a timeline", options: TIMELINE_OPTIONS };
  }

  return null;
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

export function ChatbotWidget() {
  const pathname = usePathname();
  const initialSession = useMemo(() => getInitialSession(), []);
  const [open, setOpen] = useState(false);
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

  const hidden = shouldHide(pathname);
  const choiceGroup = useMemo(() => getChoiceGroup(messages), [messages]);

  useEffect(() => {
    if (hidden || !conversationId) return;

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ conversationId, messages, leadDraft, leadSubmitted }),
    );
  }, [conversationId, hidden, leadDraft, leadSubmitted, messages]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
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

  if (hidden) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-h-[calc(100dvh-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6 sm:max-h-[calc(100dvh-3rem)]">
      {open && (
        <section
          aria-label="VeilCode project assistant"
          className="flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-2xl border border-line bg-page/95 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:max-h-[calc(100dvh-7rem)]"
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
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="grid size-8 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-hi hover:bg-surface-hi hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[86%] rounded-2xl px-3.5 py-2.5 font-sans text-sm leading-relaxed",
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
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand text-brand transition-colors hover:bg-brand hover:text-page disabled:cursor-not-allowed disabled:opacity-50"
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

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Hide VeilCode assistant" : "Open VeilCode assistant"}
        className="inline-flex items-center gap-2 rounded-full border border-brand bg-page px-4 py-3 font-sans text-sm font-medium text-brand shadow-[0_0_30px_var(--color-brand-dim)] transition-all hover:bg-brand hover:text-page"
      >
        <MessageCircle className="size-4" />
        <span className="hidden sm:inline">Ask VeilCode</span>
      </button>
    </div>
  );
}
