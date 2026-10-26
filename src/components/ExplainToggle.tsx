"use client";

import { useEffect, useState, type ReactNode } from "react";

type Level = "overview" | "technical";
const KEY = "explain-level";

/**
 * "Overview / Technical" switch on project pages. Technical is the default
 * (and what crawlers and no-JS visitors get); the choice is remembered.
 */
export default function ExplainToggle({ overview, children }: { overview: ReactNode; children: ReactNode }) {
  const [level, setLevel] = useState<Level>("technical");

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(KEY) === "overview") setLevel("overview");
    } catch {}
  }, []);

  const choose = (l: Level) => {
    setLevel(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div role="radiogroup" aria-label="Explanation level" className="inline-flex rounded-md border border-line bg-surface p-1">
        {(["overview", "technical"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={level === l}
            onClick={() => choose(l)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              level === l ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            {l === "overview" ? "Overview" : "Technical"}
          </button>
        ))}
      </div>
      {level === "overview" ? overview : children}
    </div>
  );
}
