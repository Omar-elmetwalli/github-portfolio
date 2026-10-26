import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProjectBySlug, getPublicProjects } from "../../../../data/projects";
import { profile } from "../../../../data/profile";
import ProjectCover from "@/components/ProjectCover";
import { absoluteUrl, asset, describeFile, imageSize, isVideo } from "@/lib/site";
import { ogImagePath, ogSize } from "@/lib/og";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublicProjects().map((project) => ({ slug: project.slug }));
}

const trim = (text: string, max = 160) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description = trim(project.summary);
  const url = absoluteUrl(`/projects/${project.slug}/`);
  const image = absoluteUrl(ogImagePath(project.slug));
  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url,
      siteName: profile.name,
      images: [{ url: image, ...ogSize, alt: project.title }],
    },
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
    project.links.paper && { href: project.links.paper, label: project.links.paperTitle || "Report (PDF)" },
    project.links.report && { href: project.links.report, label: project.links.reportTitle || "Report (PDF)" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <article className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/#projects" className="inline-flex items-center text-sm font-semibold text-blue-700 dark:text-cyan-300 hover:underline mb-8">
          ← All projects
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.confidential && (
              <span className="px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 rounded-full">
                In progress, details after publication
              </span>
            )}
            {project.categories.map((c) => (
              <span key={c} className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-cyan-200 rounded-full">
                {c}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 font-mono">{project.date}</p>
          <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">{project.summary}</p>

          {(pdfs.length > 0 || project.links.github) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {pdfs.map((pdf) => (
                <a
                  key={pdf.href}
                  href={asset(pdf.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
                >
                  {pdf.label}
                </a>
              ))}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 dark:bg-gray-700 text-white"
                >
                  Code (GitHub)
                </a>
              )}
            </div>
          )}
        </header>

        <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-12 bg-white">
          <ProjectCover project={project} priority />
        </div>

        <section aria-labelledby="tools-title" className="mb-12">
          <h2 id="tools-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tools & methods</h2>
          <ul className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li key={tool} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium">
                {tool}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-10">
          {project.sections.map((section, i) => (
            <section key={section.title} aria-labelledby={`section-${i}`}>
              <h2 id={`section-${i}`} className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h2>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        {project.gallery.length > 0 && (
          <section aria-labelledby="figures-title" className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 id="figures-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Figures & media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((src) => {
                // TODO(Omar): captions are generated from file names; add real ones in Phase 2.
                const caption = describeFile(src);
                return (
                  <figure key={src}>
                    <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white flex items-center justify-center">
                      {isVideo(src) ? (
                        <video src={asset(src)} controls preload="none" playsInline className="w-full h-full object-contain bg-black" />
                      ) : (
                        <img
                          src={asset(src)}
                          alt={`${project.title}: ${caption}`}
                          {...imageSize(src)}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <figcaption className="mt-2 text-sm text-gray-700 dark:text-gray-300">{caption}</figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        <nav aria-label="More projects" className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
          <div>
            {prev && (
              <Link href={`/projects/${prev.slug}/`} className="group block">
                <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">← Previous</span>
                <span className="block text-sm font-semibold text-blue-700 dark:text-cyan-300 group-hover:underline">{prev.title}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/projects/${next.slug}/`} className="group block">
                <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">Next →</span>
                <span className="block text-sm font-semibold text-blue-700 dark:text-cyan-300 group-hover:underline">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </article>
  );
}
