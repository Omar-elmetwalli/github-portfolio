"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "./Icons";

/**
 * Category + keyword filter for the server-rendered #project-grid. Works on
 * data-categories / data-search attributes, so no project data is shipped
 * to the browser twice.
 */
export default function ProjectFilters({ counts }: { counts: Record<string, number> }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(counts.All);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll<HTMLElement>("#project-grid > li").forEach((li) => {
      const inCategory = filter === "All" || (li.dataset.categories ?? "").split("|").includes(filter);
      const match = inCategory && (!q || `${li.textContent} ${li.dataset.tags ?? ""}`.toLowerCase().includes(q));
      li.hidden = !match;
      if (match) visible++;
    });
    const empty = document.getElementById("project-grid-empty");
    if (empty) empty.hidden = visible > 0;
    setShown(visible);
  }, [filter, query]);

  const filters = Object.entries(counts).filter(([, n]) => n > 0);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {filters.map(([f, n]) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {f}
            <span className={`font-mono text-[11px] ${filter === f ? "opacity-80" : "text-subtle"}`}>{n}</span>
          </button>
        ))}
      </div>

      <div className="relative lg:w-72">
        <label htmlFor="project-search" className="sr-only">
          Search projects
        </label>
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by tool, method, topic…"
          className="w-full rounded-md border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-subtle"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {shown} {shown === 1 ? "project" : "projects"} shown
      </p>
    </div>
  );
}
