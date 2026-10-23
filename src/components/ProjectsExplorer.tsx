"use client";

import { useState, useMemo } from "react";
import { Project, projects } from "../../data/projects";
import ProjectModal from "./ProjectModal";

const categories = [
  "All",
  "Scientific ML & PINN",
  "CFD & Turbulence",
  "Aerodynamics & Propulsion",
  "Flight Dynamics & Controls",
  "Mechanical & CAD",
];

export default function ProjectsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/github-portfolio" : "";
  const prefixPath = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Category filter
      let matchesCategory = true;
      if (selectedCategory === "Scientific ML & PINN") {
        matchesCategory =
          p.tags.some((t) => /Machine Learning|PINN|Scientific|Neural/i.test(t)) ||
          p.tools.some((t) => /PyTorch|Scikit/i.test(t));
      } else if (selectedCategory === "CFD & Turbulence") {
        matchesCategory =
          p.tags.some((t) => /CFD|OpenFOAM|Turbulence|RANS/i.test(t)) ||
          p.tools.some((t) => /OpenFOAM|Fluent/i.test(t));
      } else if (selectedCategory === "Aerodynamics & Propulsion") {
        matchesCategory = p.tags.some((t) => /Aerodynamics|Propulsion|Gas Dynamics|Compressible/i.test(t));
      } else if (selectedCategory === "Flight Dynamics & Controls") {
        matchesCategory = p.tags.some((t) => /Flight Dynamics|Control|State-Space|Autopilot/i.test(t));
      } else if (selectedCategory === "Mechanical & CAD") {
        matchesCategory = p.tags.some((t) => /Mechanical|Robotics|Manufacturing|CAD|SolidWorks/i.test(t));
      }

      // Search query filter
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.tools.some((t) => t.toLowerCase().includes(q));
      }

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const hasPaper = !!project.links?.paper;
          const hasReport = !!project.links?.report;
          const hasGithub = !!project.links?.github;
          const previewImage = project.gallery?.[0];

          return (
            <div
              key={project.slug}
              className="glass-panel rounded-2xl p-6 glow-card flex flex-col justify-between group border border-gray-200 dark:border-gray-800"
            >
              <div className="space-y-4">
                {/* Image Preview if available */}
                {previewImage && (
                  <div
                    className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-950 border border-gray-200 dark:border-gray-800 cursor-pointer"
                    onClick={() => setActiveProject(project)}
                  >
                    {previewImage.endsWith(".mp4") ? (
                      <video
                        src={prefixPath(previewImage)}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={prefixPath(previewImage)}
                        alt={project.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 font-medium">
                      <span>{project.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-600/80 text-[10px] font-bold">
                        Click to Inspect
                      </span>
                    </div>
                  </div>
                )}

                {/* Header row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.confidential && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded">
                      Confidential
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  onClick={() => setActiveProject(project)}
                  className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {project.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>

                {/* Tools pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tools.slice(0, 4).map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                  {project.tools.length > 4 && (
                    <span className="text-[10px] text-gray-400 self-center">
                      +{project.tools.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-5 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveProject(project)}
                  className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                >
                  Quick View & Details →
                </button>

                <div className="flex items-center gap-2">
                  {hasPaper && (
                    <a
                      href={prefixPath(project.links.paper!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-xs font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:scale-105 transition-transform"
                      title="Read Technical Paper (PDF)"
                    >
                      📄 Paper
                    </a>
                  )}
                  {hasReport && (
                    <a
                      href={prefixPath(project.links.report!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-xs font-bold rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 hover:scale-105 transition-transform"
                      title="Read Research Report (PDF)"
                    >
                      ⚡ PINN
                    </a>
                  )}
                  {hasGithub && (
                    <a
                      href={project.links.github!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:scale-105 transition-transform"
                      title="View GitHub Repository"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <p className="text-base text-gray-500 dark:text-gray-400">
            No projects matched your filter. Try another category or clear the search query.
          </p>
        </div>
      )}

      {/* Project Quick View Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
}
