"use client";

import { useEffect, useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";

type ChatbotVisibilityResponse = {
  enabled?: boolean;
};

export function ChatbotGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
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
  }, []);

  if (!enabled) return null;

  return <ChatbotWidget />;
}
