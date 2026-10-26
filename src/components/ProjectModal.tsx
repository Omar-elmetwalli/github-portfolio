"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ProjectCard } from "@/lib/projects";
import { asset, describeFile, imageSize, isVideo } from "@/lib/site";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { coverImage } from "./ProjectCover";
import { IconArrowRight, IconCode, IconFile, IconPlay } from "./Icons";

export default function ProjectModal({ project, onClose }: { project: ProjectCard | null; onClose: () => void }) {
  const [zoomed, setZoomed] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleEscape = useCallback(() => {
    if (zoomed) setZoomed(null);
    else onClose();
  }, [zoomed, onClose]);

  useFocusTrap(dialogRef, !!project, handleEscape);

  useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      setZoomed(null);
    };
  }, [project]);

  if (!project) return null;
  const titleId = `modal-title-${project.slug}`;
  const poster = coverImage(project);
  const pdfs = [
    project.links.paper && { href: project.links.paper, label: project.links.paperTitle || "Report PDF" },
    project.links.report && { href: project.links.report, label: project.links.reportTitle || "Report PDF" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-xl border border-line bg-surface shadow-lift animate-scale-up sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
          <div className="space-y-2">
            <p className="flex flex-wrap gap-x-2 font-mono text-xs text-subtle">
              <span>{project.date}</span>
              <span aria-hidden="true">·</span>
              <span>{project.categories.join(" / ")}</span>
            </p>
            <h2 id={titleId} className="text-h3 text-ink sm:text-2xl">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-subtle hover:bg-surface-2 hover:text-ink"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-6">
          <p className="text-base leading-relaxed text-muted">{project.summary}</p>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/projects/${project.slug}/`}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-strong"
            >
              Full write-up <IconArrowRight className="h-4 w-4" />
            </Link>
            {pdfs.map((pdf) => (
              <a
                key={pdf.href}
                href={asset(pdf.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:border-line-strong"
              >
                <IconFile className="h-4 w-4" /> {pdf.label}
              </a>
            ))}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:border-line-strong"
              >
                <IconCode className="h-4 w-4" /> Code
              </a>
            )}
          </div>

          {project.sectionTitles.length > 0 && (
            <div>
              <h3 className="text-eyebrow text-subtle">In the write-up</h3>
              <ol className="mt-2 space-y-1 text-sm text-muted">
                {project.sectionTitles.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-mono text-subtle">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div>
            <h3 className="text-eyebrow text-subtle">Tools & methods</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.tools.map((t) => (
                <li key={t} className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {project.gallery.length > 0 && (
            <div>
              <h3 className="text-eyebrow text-subtle">Figures & media</h3>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.gallery.map((src) => {
                  const label = describeFile(src);
                  return (
                    <li key={src}>
                      <button
                        type="button"
                        onClick={() => setZoomed(src)}
                        aria-label={`Enlarge: ${label}`}
                        className="relative block aspect-[4/3] w-full overflow-hidden rounded-md border border-line bg-white"
                      >
                        {isVideo(src) ? (
                          <>
                            {poster && <img src={asset(poster)} alt="" loading="lazy" className="h-full w-full object-contain p-1 opacity-50" />}
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white">
                                <IconPlay className="h-4 w-4" />
                              </span>
                            </span>
                          </>
                        ) : (
                          <img
                            src={asset(src)}
                            alt={`${project.title}: ${label}`}
                            {...imageSize(src)}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain p-1"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {zoomed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 p-4" onClick={() => setZoomed(null)}>
            {isVideo(zoomed) ? (
              <video
                src={asset(zoomed)}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-md"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img src={asset(zoomed)} alt={`${project.title}: ${describeFile(zoomed)}`} className="max-h-full max-w-full rounded-md bg-white object-contain p-2" />
            )}
            <button
              type="button"
              onClick={() => setZoomed(null)}
              aria-label="Close enlarged view"
              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
