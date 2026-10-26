"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "./Markdown";
import { AiError, streamAi, type AiMessage } from "@/lib/ai";

const STARTERS = [
  "What is Omar's research focus?",
  "Show me his CFD + ML work",
  "What did he do with OpenFOAM?",
  "Is he available for a PhD in Fall 2027?",
];
const MAX_CHARS = 1500;

export default function ChatPanel({
  open,
  onClose,
  initialQuestion,
  onQuestionUsed,
}: {
  open: boolean;
  onClose: () => void;
  initialQuestion: string | null;
  onQuestionUsed: () => void;
}) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      if (q.length > MAX_CHARS) {
        setError(`Please keep questions under ${MAX_CHARS} characters.`);
        return;
      }
      setError(null);
      setInput("");
      // Starter buttons disappear once a message exists; keep focus in the panel.
      inputRef.current?.focus();
      const history: AiMessage[] = [...messages, { role: "user", content: q }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await streamAi({
          mode: "chat",
          messages: history,
          signal: controller.signal,
          turnstileContainer: turnstileRef.current,
          onText: (chunk) =>
            setMessages((m) => {
              const next = [...m];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: last.content + chunk };
              return next;
            }),
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err instanceof AiError || err instanceof Error ? err.message : "Something went wrong.");
        }
        // Drop the empty placeholder reply.
        setMessages((m) => (m[m.length - 1]?.role === "assistant" && !m[m.length - 1].content ? m.slice(0, -1) : m));
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages]
  );

  // A question handed over from the command palette.
  useEffect(() => {
    if (open && initialQuestion) {
      onQuestionUsed();
      void send(initialQuestion);
    }
  }, [open, initialQuestion, onQuestionUsed, send]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    // Esc closes the panel even if focus has left it (e.g. a clicked starter button was removed).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const copy = async (i: number) => {
    try {
      await navigator.clipboard.writeText(messages[i].content);
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="chat-title"
      className="fixed inset-x-2 bottom-2 z-50 flex h-[min(620px,calc(100dvh-5rem))] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-lift animate-scale-up sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
    >
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <h2 id="chat-title" className="font-display text-base font-semibold text-ink">
            Ask Omar&apos;s AI
          </h2>
          <p className="text-xs text-subtle">Answers come only from this site&apos;s content.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="rounded-md p-1.5 text-subtle hover:bg-surface-2 hover:text-ink">
          <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={logRef} role="log" aria-live="polite" aria-busy={busy} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm leading-relaxed">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-muted">
              Ask about Omar&apos;s research, projects, or experience. Answers link to the pages they come from.
            </p>
            <ul className="space-y-2">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="w-full rounded-md border border-line px-3 py-2 text-left text-sm text-ink hover:border-accent hover:bg-accent-soft"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="ml-8 rounded-lg bg-accent px-3 py-2 text-on-accent" dir="auto">
              <span className="sr-only">You: </span>
              {m.content}
            </div>
          ) : (
            <div key={i} className="group mr-4 space-y-1.5">
              <span className="sr-only">Assistant: </span>
              <div className="text-ink">
                {m.content ? <Markdown text={m.content} /> : <span className="inline-block animate-pulse text-subtle">Thinking…</span>}
              </div>
              {m.content && !(busy && i === messages.length - 1) && (
                <button
                  type="button"
                  onClick={() => copy(i)}
                  className="font-mono text-[11px] text-subtle hover:text-ink"
                >
                  {copied === i ? "Copied ✓" : "Copy"}
                </button>
              )}
            </div>
          )
        )}

        {error && (
          <p role="alert" className="rounded-md border border-red-600/40 bg-red-500/10 px-3 py-2 text-sm text-ink">
            {error}
          </p>
        )}
        <div ref={turnstileRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-line p-3"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Your question
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={MAX_CHARS}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask a question… (English or العربية)"
            dir="auto"
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-md border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-subtle"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="rounded-md border border-line-strong px-3 py-2.5 text-sm font-semibold text-ink"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-md bg-accent px-3 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent-strong disabled:opacity-50"
            >
              Send
            </button>
          )}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-subtle">
          AI-generated, based on site content. It can make mistakes, so check the linked pages.
        </p>
      </form>
    </div>
  );
}
