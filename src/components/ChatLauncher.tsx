"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { aiEnabled } from "@/lib/aiConfig";
import { ASK_AI_EVENT } from "@/lib/events";

// The panel (and its markdown/streaming code) loads only when first opened.
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

/** Floating "Ask Omar's AI" button. Renders nothing when no AI endpoint is configured. */
export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!aiEnabled) return;
    document.documentElement.dataset.ai = "ready";
    const onAsk = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      setLoaded(true);
      setOpen(true);
      if (typeof q === "string" && q.trim()) setPending(q.trim());
    };
    window.addEventListener(ASK_AI_EVENT, onAsk);
    return () => window.removeEventListener(ASK_AI_EVENT, onAsk);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);
  const consumed = useCallback(() => setPending(null), []);

  if (!aiEnabled) return null;

  return (
    <>
      {!open && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            setLoaded(true);
            setOpen(true);
          }}
          onMouseEnter={() => setLoaded(true)}
          onFocus={() => setLoaded(true)}
          aria-haspopup="dialog"
          className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-3 text-sm font-semibold text-bg shadow-lift hover:opacity-90 sm:bottom-6 sm:right-6"
        >
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Ask Omar&apos;s AI
        </button>
      )}
      {loaded && <ChatPanel open={open} onClose={close} initialQuestion={pending} onQuestionUsed={consumed} />}
    </>
  );
}
