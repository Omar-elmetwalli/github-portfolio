"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, type Category, type Project } from "../../data/projects";
import ProjectModal from "./ProjectModal";
import ProjectCover from "./ProjectCover";
import { asset } from "@/lib/site";

type Filter = "All" | Category;

/** Receives public (already redacted) projects from the server page. */
export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setActiveProject(null), []);

  const filters = useMemo(
    () => (["All", ...CATEGORIES] as Filter[]).filter((f) => f === "All" || projects.some((p) => p.categories.includes(f))),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== "All" && !p.categories.includes(filter)) return false;
      if (!q) return true;
      return [p.title, p.summary, ...p.tags, ...p.tools, ...p.categories].some((t) => t.toLowerCase().includes(q));
    });
  }, [projects, filter, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative md:min-w-[240px]">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by keyword…"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <svg aria-hidden="true" className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <li
            key={project.slug}
            className="glass-panel rounded-2xl p-5 glow-card flex flex-col border border-gray-200 dark:border-gray-800"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <ProjectCover project={project} />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[11px] font-medium text-white">
                {project.date}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              {project.categories.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-cyan-200 rounded"
                >
                  {c}
                </span>
              ))}
              {project.confidential && (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded">
                  In progress
                </span>
              )}
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white leading-snug font-display">
              <Link href={`/projects/${project.slug}/`} className="hover:text-blue-700 dark:hover:text-cyan-300">
                {project.title}
              </Link>
            </h3>

            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">{project.summary}</p>

            <ul aria-label="Tools" className="flex flex-wrap gap-1.5 pt-3">
              {project.tools.slice(0, 4).map((tool) => (
                <li key={tool} className="text-[11px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium">
                  {tool}
                </li>
              ))}
              {project.tools.length > 4 && (
                <li className="text-[11px] text-gray-600 dark:text-gray-400 self-center">+{project.tools.length - 4} more</li>
              )}
            </ul>

            <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setActiveProject(project)}
                className="text-xs font-bold text-blue-700 dark:text-cyan-300 hover:underline"
                aria-haspopup="dialog"
              >
                Quick view<span className="sr-only">: {project.title}</span>
              </button>
              <div className="flex items-center gap-2">
                {project.links.paper && (
                  <a
                    href={asset(project.links.paper)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  >
                    Paper<span className="sr-only"> for {project.title}</span>
                  </a>
                )}
                {project.links.report && (
                  <a
                    href={asset(project.links.report)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300"
                  >
                    Report<span className="sr-only"> for {project.title}</span>
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <p className="text-base text-gray-700 dark:text-gray-300">
            No projects match. Try another category or clear the search.
          </p>
        </div>
      )}

      <ProjectModal project={activeProject} onClose={closeModal} />
    </div>
  );
}
