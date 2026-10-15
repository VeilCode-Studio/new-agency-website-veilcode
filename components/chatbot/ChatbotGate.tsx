"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const ChatbotPanel = dynamic(() => import("./ChatbotWidget").then((module) => module.ChatbotWidget), {
  ssr: false,
  loading: () => <p role="status" className="rounded-xl border border-line bg-page p-4 text-sm text-ink">Loading assistant…</p>,
});

class PanelBoundary extends Component<{ children: ReactNode; open: boolean }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed && !this.props.open) return null;
    return this.state.failed ? <p role="alert" className="max-w-80 rounded-xl border border-line bg-page p-4 text-sm text-ink">The assistant could not load. <a href="/start" className="text-brand underline">Use the project form</a> or reload the page to try again.</p> : this.props.children;
  }
}

type ChatbotVisibilityResponse = {
  enabled?: boolean;
};

export function ChatbotGate() {
  const pathname = usePathname();
  const hidden = ["/start", "/newsletter", "/admin", "/sign-in", "/sign-up", "/no-access"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const [enabled, setEnabled] = useState(false);
  const [activated, setActivated] = useState(false);
  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hidden) return;
    let cancelled = false;

    async function loadVisibility() {
      try {
        const response = await fetch("/api/chatbot/settings", {
          cache: "no-store",
        });
        const data = (await response.json()) as ChatbotVisibilityResponse;

        if (!cancelled) {
          setEnabled(data.enabled !== false);
        }
      } catch {
        if (!cancelled) {
          setEnabled(true);
        }
      }
    }

    loadVisibility();

    return () => {
      cancelled = true;
    };
  }, [hidden]);

  const close = useCallback(() => {
    setOpen(false);
    launcher.current?.focus();
  }, []);

  if (!enabled) return null;

  // Keep an activated conversation mounted on routes that hide the launcher,
  // so navigating to the project form cannot discard a draft or pending reply.
  return (
    <div className={hidden ? "hidden" : "fixed bottom-4 right-4 z-50 flex max-h-[calc(100dvh-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6 sm:max-h-[calc(100dvh-3rem)]"}>
      {activated && <PanelBoundary open={open}><ChatbotPanel open={open} onClose={close} /></PanelBoundary>}
      <button
        ref={launcher}
        type="button"
        aria-label={open ? "Hide VeilCode assistant" : "Open VeilCode assistant"}
        aria-expanded={open}
        aria-controls={open ? "veilcode-assistant" : undefined}
        onClick={() => { setActivated(true); setOpen((value) => !value); }}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-brand bg-page px-4 py-3 font-sans text-sm font-medium text-brand shadow-[0_0_30px_var(--color-brand-dim)] transition-colors hover:bg-brand hover:text-page focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Ask VeilCode</span>
      </button>
    </div>
  );
}
