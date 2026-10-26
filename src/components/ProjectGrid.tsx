import Link from "next/link";
import { CATEGORIES, type Category } from "../../data/projects";
import type { ProjectCard } from "@/lib/projects";
import { asset } from "@/lib/site";
import ProjectCover from "./ProjectCover";
import ProjectFilters from "./ProjectFilters";
import { IconCode, IconFile } from "./Icons";

/**
 * All-projects grid. Cards are server-rendered (no hydration cost); the small
 * ProjectFilters client component shows/hides them by category and search.
 */
export default function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  const counts: Record<string, number> = { All: projects.length };
  for (const c of CATEGORIES) counts[c] = projects.filter((p) => p.categories.includes(c as Category)).length;

  return (
    <div className="space-y-8">
      <ProjectFilters counts={counts} />

      <ul id="project-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const pdf = p.links.paper ?? p.links.report;
          // Tags aren't shown on cards, so they ride along for search (visible text is searched too).
          const tags = p.tags.filter((t) => !p.tools.includes(t) && !p.categories.includes(t as Category)).join(" ");
          return (
            <li
              key={p.slug}
              data-categories={p.categories.join("|")}
              data-tags={tags}
              className="card card-hover group flex flex-col overflow-hidden"
            >
              <div className="pc-media">
                <ProjectCover project={p} />
                {p.confidential && (
                  <span className="absolute right-2 top-2 rounded-sm bg-warm-soft px-1.5 py-0.5 font-mono text-[11px] text-warm">
                    In progress
                  </span>
                )}
              </div>
              <div className="pc-body">
                <p className="pc-meta">
                  <span>{p.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.categories.join(" / ")}</span>
                </p>
                <h3 className="pc-title">
                  <Link href={`/projects/${p.slug}/`} className="hover:text-accent">
                    {p.title}
                  </Link>
                </h3>
                <p className="pc-sum">{p.summary}</p>
                <ul aria-label="Tools" className="pc-tools">
                  {p.tools.slice(0, 4).map((t) => (
                    <li key={t} className="pc-tool">
                      {t}
                    </li>
                  ))}
                  {p.tools.length > 4 && <li className="self-center font-mono text-[11px] text-subtle">+{p.tools.length - 4}</li>}
                </ul>
                <div className="pc-actions">
                  <Link
                    href={`/projects/${p.slug}/`}
                    className="pc-more"
                  >
                    Read more<span className="sr-only">: {p.title}</span>
                  </Link>
                  {pdf && (
                    <a
                      href={asset(pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pc-link"
                    >
                      <IconFile className="h-3.5 w-3.5" /> Report PDF<span className="sr-only"> for {p.title}</span>
                    </a>
                  )}
                  {p.links.github && (
                    <a
                      href={p.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pc-link"
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

      <div id="project-grid-empty" hidden className="card py-14 text-center">
        <p className="text-muted">No projects match. Try another category or clear the search.</p>
      </div>
    </div>
  );
}
