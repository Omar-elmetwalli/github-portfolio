import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { getPublicProjectBySlug, getPublicProjects } from "../../../../data/projects";
import { profile } from "../../../../data/profile";
import ProjectCover from "@/components/ProjectCover";
import MathText from "@/components/MathText";
import { IconArrowRight, IconCode, IconFile } from "@/components/Icons";
import { absoluteUrl, asset, describeFile, imageSize, isVideo } from "@/lib/site";
import { mathToPlain } from "@/lib/math";
import { ogImagePath, ogSize } from "@/lib/og";

type Params = { params: Promise<{ slug: string }> };

function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <ol className="space-y-1 border-l border-line">
      {items.map((t, i) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="-ml-px flex gap-2 border-l border-transparent py-1 pl-3 text-sm text-muted hover:border-accent hover:text-ink">
            <span className="font-mono text-xs text-subtle">{String(i).padStart(2, "0")}</span>
            <span>{t.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function generateStaticParams() {
  return getPublicProjects().map((project) => ({ slug: project.slug }));
}

const trim = (text: string, max = 160) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);
const anchor = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description = trim(mathToPlain(project.summary));
  const url = absoluteUrl(`/projects/${project.slug}/`);
  const image = absoluteUrl(ogImagePath(project.slug));
  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: project.title, description, url, siteName: profile.name, images: [{ url: image, ...ogSize, alt: project.title }] },
    twitter: { card: "summary_large_image", title: project.title, description, images: [image] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const all = getPublicProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const project = all[index];
  if (!project) notFound();

  const prev = all[index - 1];
  const next = all[index + 1];
  const pdfs = [
    project.links.paper && { href: project.links.paper, label: project.links.paperTitle || "Report PDF" },
    project.links.report && { href: project.links.report, label: project.links.reportTitle || "Report PDF" },
  ].filter(Boolean) as { href: string; label: string }[];

  const toc = [
    { id: "overview", label: "Overview" },
    ...project.sections.map((s) => ({ id: anchor(s.title), label: s.title })),
    ...(project.gallery.length ? [{ id: "figures", label: "Figures & media" }] : []),
  ];


  return (
    <article className="pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/#projects" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
          ← All projects
        </Link>

        <header className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-5 lg:col-span-7">
            <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-subtle">
              <span>{project.date}</span>
              <span aria-hidden="true">·</span>
              <span>{project.categories.join(" / ")}</span>
            </p>
            <h1 className="text-h2 text-ink sm:text-[2.75rem]">{project.title}</h1>
            <p className="text-lg leading-relaxed text-muted">
              <MathText text={project.summary} />
            </p>
            {project.confidential && (
              <p className="rounded-md border border-warm/40 bg-warm-soft px-4 py-3 text-sm text-ink">
                This is ongoing research with a manuscript in preparation. Technical details will be added after publication.
              </p>
            )}
            {(pdfs.length > 0 || project.links.github) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {pdfs.map((pdf, i) => (
                  <a
                    key={pdf.href}
                    href={asset(pdf.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${
                      i === 0 ? "bg-accent text-on-accent hover:bg-accent-strong" : "border border-line-strong text-ink hover:border-accent"
                    }`}
                  >
                    <IconFile className="h-4 w-4" /> {pdf.label}
                  </a>
                ))}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2 text-sm font-semibold text-ink hover:border-accent"
                  >
                    <IconCode className="h-4 w-4" /> Code
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="card aspect-[16/10] overflow-hidden lg:col-span-5">
            <ProjectCover project={project} priority />
          </div>
        </header>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-3">
            <details className="card p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-ink">On this page</summary>
              <div className="mt-3">
                <Toc items={toc} />
              </div>
            </details>
            <nav aria-label="On this page" className="sticky top-24 hidden lg:block">
              <p className="mb-3 text-eyebrow text-subtle">On this page</p>
              <Toc items={toc} />
              <div className="mt-8">
                <p className="mb-2 text-eyebrow text-subtle">Tools & methods</p>
                <ul className="flex flex-wrap gap-1.5">
                  {project.tools.map((t) => (
                    <li key={t} className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          <div className="min-w-0 space-y-12 lg:col-span-9 xl:col-span-8">
            <section id="overview" aria-labelledby="overview-title" className="space-y-4">
              <h2 id="overview-title" className="text-h3 text-ink">
                Overview
              </h2>
              <div className="prose-research">
                <p>
                  <MathText text={project.summary} />
                </p>
              </div>
              <ul className="flex flex-wrap gap-1.5 lg:hidden" aria-label="Tools">
                {project.tools.map((t) => (
                  <li key={t} className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            {project.sections.map((s, i) => (
              <section key={s.title} id={anchor(s.title)} aria-labelledby={`${anchor(s.title)}-title`} className="space-y-3">
                <h2 id={`${anchor(s.title)}-title`} className="flex items-baseline gap-3 text-h3 text-ink">
                  <span className="font-mono text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="prose-research">
                  <p>
                    <MathText text={s.content} />
                  </p>
                </div>
              </section>
            ))}

            {project.gallery.length > 0 && (
              <section id="figures" aria-labelledby="figures-title" className="space-y-5">
                <h2 id="figures-title" className="text-h3 text-ink">
                  Figures & media
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {project.gallery.map((src, i) => {
                    // TODO(Omar): captions come from file names; replace with real ones.
                    const caption = describeFile(src);
                    return (
                      <figure key={src} className="space-y-2">
                        <div className="overflow-hidden rounded-md border border-line bg-white">
                          {isVideo(src) ? (
                            <video src={asset(src)} controls preload="none" playsInline className="aspect-video w-full bg-black" />
                          ) : (
                            <a href={asset(src)} target="_blank" rel="noopener noreferrer" aria-label={`Open figure ${i + 1} full size`}>
                              <img
                                src={asset(src)}
                                alt={`${project.title}: ${caption}`}
                                {...imageSize(src)}
                                loading="lazy"
                                decoding="async"
                                className="h-auto w-full"
                              />
                            </a>
                          )}
                        </div>
                        <figcaption className="text-sm text-subtle">
                          <span className="font-semibold text-ink">Figure {i + 1}.</span> {caption}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </section>
            )}

            <nav aria-label="More projects" className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? (
                <Link href={`/projects/${prev.slug}/`} className="card card-hover block p-5">
                  <span className="text-eyebrow text-subtle">← Previous</span>
                  <span className="mt-2 block font-display font-semibold text-ink">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/projects/${next.slug}/`} className="card card-hover block p-5 sm:text-right">
                  <span className="text-eyebrow text-subtle">Next →</span>
                  <span className="mt-2 block font-display font-semibold text-ink">{next.title}</span>
                </Link>
              )}
            </nav>
            <p>
              <Link href="/#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
                Questions about this project? Get in touch <IconArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
