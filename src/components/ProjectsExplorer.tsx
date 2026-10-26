"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, type Category } from "../../data/projects";
import type { ProjectCard } from "@/lib/projects";
import ProjectModal from "./ProjectModal";
import ProjectCover from "./ProjectCover";
import { IconCode, IconFile, IconSearch } from "./Icons";
import { asset } from "@/lib/site";

type Filter = "All" | Category;

/** Filterable grid of all projects. Receives card data (no section text) from the server page. */
export default function ProjectsExplorer({ projects }: { projects: ProjectCard[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ProjectCard | null>(null);
  const close = useCallback(() => setActive(null), []);

  const counts = useMemo(() => {
    const c = new Map<Filter, number>([["All", projects.length]]);
    for (const cat of CATEGORIES) c.set(cat, projects.filter((p) => p.categories.includes(cat)).length);
    return c;
  }, [projects]);

  const filters = (["All", ...CATEGORIES] as Filter[]).filter((f) => (counts.get(f) ?? 0) > 0);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== "All" && !p.categories.includes(filter)) return false;
      if (!q) return true;
      return [p.title, p.summary, ...p.tags, ...p.tools, ...p.categories].some((t) => t.toLowerCase().includes(q));
    });
  }, [projects, filter, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter projects by category" className="-mx-1 flex flex-wrap gap-2 px-1">
          {filters.map((f) => (
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
              <span className={`font-mono text-[11px] ${filter === f ? "opacity-80" : "text-subtle"}`}>{counts.get(f)}</span>
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
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => {
          const pdf = p.links.paper ?? p.links.report;
          return (
            <li key={p.slug} className="card card-hover group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
                <ProjectCover project={p} />
                {p.confidential && (
                  <span className="absolute right-2 top-2 rounded-sm bg-warm-soft px-1.5 py-0.5 font-mono text-[11px] text-warm backdrop-blur">
                    In progress
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex flex-wrap gap-x-2 font-mono text-[11px] text-subtle">
                  <span>{p.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.categories.join(" / ")}</span>
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                  <Link href={`/projects/${p.slug}/`} className="hover:text-accent">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.summary}</p>
                <ul aria-label="Tools" className="mt-3 flex flex-wrap gap-1.5">
                  {p.tools.slice(0, 4).map((t) => (
                    <li key={t} className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                      {t}
                    </li>
                  ))}
                  {p.tools.length > 4 && <li className="self-center font-mono text-[11px] text-subtle">+{p.tools.length - 4}</li>}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setActive(p)}
                    aria-haspopup="dialog"
                    className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-line-strong"
                  >
                    Quick view<span className="sr-only">: {p.title}</span>
                  </button>
                  {pdf && (
                    <a
                      href={asset(pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-accent hover:bg-accent-soft"
                    >
                      <IconFile className="h-3.5 w-3.5" /> Report PDF<span className="sr-only"> for {p.title}</span>
                    </a>
                  )}
                  {p.links.github && (
                    <a
                      href={p.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-accent hover:bg-accent-soft"
                    >
                      <IconCode className="h-3.5 w-3.5" /> Code<span className="sr-only"> for {p.title}</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {shown.length === 0 && (
        <div className="card py-14 text-center">
          <p className="text-muted">No projects match. Try another category or clear the search.</p>
        </div>
      )}

      <ProjectModal project={active} onClose={close} />
    </div>
  );
}
