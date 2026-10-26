"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { asset } from "@/lib/site";
import { IconSearch } from "./Icons";

export interface PaletteItem {
  id: string;
  group: "Sections" | "Projects" | "CV & links";
  label: string;
  /** Extra words to match on (tags, tools), not shown. */
  keywords?: string;
  hint?: string;
  href: string;
  /** "page" uses the router, "file" opens a public file, "external" opens a new tab. */
  kind: "page" | "file" | "external";
}

/** Event other components dispatch to open the palette. */
export const OPEN_PALETTE_EVENT = "palette:open";
/** Event the palette dispatches to hand a question to the AI chat (Phase 3). */
export const ASK_AI_EVENT = "ai:ask";

/**
 * Subsequence fuzzy match. Higher is better; -1 means no match. Rewards
 * consecutive characters and matches at word starts.
 */
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  const direct = t.indexOf(q);
  if (direct >= 0) return 100 - direct + (direct === 0 || t[direct - 1] === " " ? 20 : 0);
  let score = 0;
  let ti = 0;
  let streak = 0;
  for (const ch of q) {
    if (ch === " ") continue;
    const found = t.indexOf(ch, ti);
    if (found < 0) return -1;
    streak = found === ti ? streak + 1 : 0;
    score += 1 + streak * 2 + (found === 0 || t[found - 1] === " " ? 3 : 0);
    ti = found + 1;
  }
  return score;
}

export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [aiReady, setAiReady] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useFocusTrap(dialogRef, open, close);

  useEffect(() => {
    // The chat widget (Phase 3) marks itself ready on <html data-ai="ready">.
    const syncAi = () => setAiReady(document.documentElement.dataset.ai === "ready");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        syncAi();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => {
      syncAi();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((item) => ({ item, score: Math.max(fuzzyScore(query, item.label) * 2, fuzzyScore(query, item.keywords ?? "")) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [items, query]);

  const askAi = aiReady && query.trim().length > 1;
  const total = results.length + (askAi ? 1 : 0);

  const run = (index: number) => {
    if (askAi && index === results.length) {
      window.dispatchEvent(new CustomEvent(ASK_AI_EVENT, { detail: query.trim() }));
      close();
      return;
    }
    const item = results[index];
    if (!item) return;
    close();
    if (item.kind === "page") router.push(item.href);
    else window.open(item.kind === "file" ? asset(item.href) : item.href, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (total ? (a + 1) % total : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (total ? (a - 1 + total) % total : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(active);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm animate-fade-in" onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-lift animate-scale-up"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <IconSearch className="h-5 w-5 shrink-0 text-subtle" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={total ? `palette-opt-${active}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search projects, sections, CV…"
            className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-subtle"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-subtle sm:block">Esc</kbd>
        </div>

        <ul ref={listRef} id="palette-results" role="listbox" aria-label="Results" className="max-h-[55vh] overflow-y-auto p-2">
          {results.map((item, i) => {
            const header = i === 0 || results[i - 1].group !== item.group ? item.group : null;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-eyebrow text-subtle">{header}</p>}
                <div
                  id={`palette-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm ${
                    i === active ? "bg-accent-soft text-ink" : "text-muted"
                  }`}
                >
                  <span className="line-clamp-1">{item.label}</span>
                  {item.hint && <span className="shrink-0 font-mono text-[11px] text-subtle">{item.hint}</span>}
                </div>
              </li>
            );
          })}
          {askAi && (
            <li role="presentation">
              <p className="px-3 pb-1 pt-3 text-eyebrow text-subtle">AI</p>
              <div
                id={`palette-opt-${results.length}`}
                data-index={results.length}
                role="option"
                aria-selected={active === results.length}
                onMouseMove={() => setActive(results.length)}
                onClick={() => run(results.length)}
                className={`cursor-pointer rounded-md px-3 py-2.5 text-sm ${active === results.length ? "bg-accent-soft text-ink" : "text-muted"}`}
              >
                Ask AI about “{query.trim()}”
              </div>
            </li>
          )}
          {total === 0 && <li className="px-3 py-8 text-center text-sm text-subtle">No results for “{query}”.</li>}
        </ul>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2 font-mono text-[11px] text-subtle sm:flex">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
          <span>Ctrl/⌘ K to toggle</span>
        </div>
      </div>
    </div>
  );
}
