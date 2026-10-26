import Link from "next/link";
import { getPublicProjects } from "../../data/projects";
import { mathToPlain } from "@/lib/math";
import { asset } from "@/lib/site";
import ProjectCover from "./ProjectCover";
import { IconArrowRight, IconCode, IconFile } from "./Icons";

/** Large alternating rows for projects marked `featured` in data/projects.ts. */
export default function FeaturedResearch() {
  const featured = getPublicProjects().filter((p) => p.featured);
  return (
    <ol className="space-y-10 lg:space-y-14">
      {featured.map((p, i) => {
        const pdf = p.links.paper ?? p.links.report;
        return (
          <li key={p.slug} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10" data-reveal>
            <Link
              href={`/projects/${p.slug}/`}
              tabIndex={-1}
              aria-hidden="true"
              className={`card card-hover block aspect-[16/10] overflow-hidden lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}
            >
              <ProjectCover project={p} />
            </Link>
            <div className="space-y-4 lg:col-span-5">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-subtle">
                <span>{p.date}</span>
                <span aria-hidden="true">·</span>
                <span>{p.categories.join(" / ")}</span>
                {p.confidential && (
                  <span className="rounded-sm bg-warm-soft px-1.5 py-0.5 text-warm">Manuscript in preparation</span>
                )}
              </p>
              <h3 className="text-h3 text-ink sm:text-2xl">
                <Link href={`/projects/${p.slug}/`} className="hover:text-accent">
                  {p.title}
                </Link>
              </h3>
              <p className="leading-relaxed text-muted">{mathToPlain(p.summary)}</p>
              <ul className="flex flex-wrap gap-1.5" aria-label="Tools">
                {p.tools.slice(0, 5).map((t) => (
                  <li key={t} className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href={`/projects/${p.slug}/`}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-strong"
                >
                  Read the write-up <IconArrowRight className="h-4 w-4" />
                </Link>
                {pdf && (
                  <a
                    href={asset(pdf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:border-line-strong"
                  >
                    <IconFile className="h-4 w-4" /> Report PDF
                  </a>
                )}
                {p.links.github && (
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:border-line-strong"
                  >
                    <IconCode className="h-4 w-4" /> Code
                  </a>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
