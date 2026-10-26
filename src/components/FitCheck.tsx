"use client";

import { useRef, useState } from "react";
import Markdown from "./Markdown";

const MAX = 6000;

/**
 * Visitors paste a lab description or job posting; the assistant lists the
 * most relevant projects/experience with links. No scores, no predictions.
 */
export default function FitCheck() {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = text.trim();
    if (input.length < 40) {
      setError("Paste a bit more of the description (at least a few sentences).");
      return;
    }
    setError(null);
    setAnswer("");
    setBusy(true);
    try {
      // Loaded on demand to keep the home page light.
      const { streamAi } = await import("@/lib/ai");
      await streamAi({
        mode: "fit",
        messages: [{ role: "user", content: input }],
        turnstileContainer: turnstileRef.current,
        onText: (chunk) => setAnswer((a) => a + chunk),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={run} className="card space-y-3 p-5 sm:p-6">
        <label htmlFor="fit-input" className="block text-sm font-semibold text-ink">
          Lab description or job posting
        </label>
        <textarea
          id="fit-input"
          rows={9}
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Our group develops data-driven turbulence closures for wall-bounded flows using LES and machine learning…"
          className="w-full resize-y rounded-md border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-subtle"
          aria-describedby="fit-help"
          dir="auto"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p id="fit-help" className="font-mono text-[11px] text-subtle">
            {text.length}/{MAX} · not stored
          </p>
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-strong disabled:opacity-60"
          >
            {busy ? "Matching…" : "Find relevant work"}
          </button>
        </div>
        <div ref={turnstileRef} />
      </form>

      <div className="card min-h-[220px] p-5 sm:p-6" aria-live="polite" aria-busy={busy}>
        <p className="text-eyebrow text-subtle">Most relevant work</p>
        <div className="mt-3 text-sm leading-relaxed text-ink">
          {error ? (
            <p role="alert" className="text-red-700 dark:text-red-300">
              {error}
            </p>
          ) : answer ? (
            <Markdown text={answer} />
          ) : (
            <p className="text-subtle">
              {busy ? "Reading the description…" : "The three closest projects or roles will appear here, each with a link and a short note on the overlap."}
            </p>
          )}
        </div>
        {answer && !busy && (
          <p className="mt-4 border-t border-line pt-3 text-[11px] text-subtle">
            AI-generated from this site&apos;s content. It shows overlap only and doesn&apos;t assess suitability.
          </p>
        )}
      </div>
    </div>
  );
}
