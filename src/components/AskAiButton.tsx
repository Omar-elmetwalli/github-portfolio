"use client";

import { ASK_AI_EVENT } from "@/lib/events";

/** Opens the chat panel. Only rendered when the AI endpoint is configured. */
export default function AskAiButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new CustomEvent(ASK_AI_EVENT))} className={className}>
      Ask my AI
    </button>
  );
}
