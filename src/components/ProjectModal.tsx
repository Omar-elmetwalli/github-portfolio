"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "../../data/projects";
import { asset, describeFile, imageSize, isVideo } from "@/lib/site";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { coverImage } from "./ProjectCover";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleEscape = useCallback(() => {
    if (selectedMedia) setSelectedMedia(null);
    else onClose();
  }, [selectedMedia, onClose]);

  useFocusTrap(dialogRef, !!project, handleEscape);

  useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      setSelectedMedia(null);
    };
  }, [project]);

  if (!project) return null;
  const titleId = `modal-title-${project.slug}`;
  const poster = coverImage(project);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-cyan-500/20 shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80">
          <div className="space-y-2 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-cyan-200">
                {project.date}
              </span>
              {project.confidential && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200">
                  In progress, details after publication
                </span>
              )}
            </div>
            <h2 id={titleId} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight font-display">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/projects/${project.slug}/`}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl bg-blue-700 hover:bg-blue-800 text-white transition-colors"
            >
              Full project page →
            </Link>
            {project.links.paper && (
              <a
                href={asset(project.links.paper)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-600"
              >
                {project.links.paperTitle || "Report (PDF)"}
              </a>
            )}
            {project.links.report && (
              <a
                href={asset(project.links.report)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-600"
              >
                {project.links.reportTitle || "Report (PDF)"}
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-600"
              >
                Code (GitHub)
              </a>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Overview</h3>
            <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">{project.summary}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Tools & methods</h3>
            <ul className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <li key={tool} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold">
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {project.sections.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              {project.sections.map((sec) => (
                <div key={sec.title} className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-cyan-200 font-display">{sec.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{sec.content}</p>
                </div>
              ))}
            </div>
          )}

          {project.gallery.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Figures & media</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((src) => {
                  const label = describeFile(src);
                  const { width, height } = imageSize(src);
                  return (
                    <li key={src}>
                      <button
                        type="button"
                        onClick={() => setSelectedMedia(src)}
                        className="group relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white aspect-video flex items-center justify-center"
                        aria-label={`Enlarge: ${label}`}
                      >
                        {isVideo(src) ? (
                          <>
                            {poster ? (
                              <img src={asset(poster)} alt="" className="w-full h-full object-contain p-2 opacity-60" loading="lazy" />
                            ) : (
                              <span className="w-full h-full bg-gray-900" />
                            )}
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="px-3 py-1.5 rounded-full bg-black/75 text-white text-xs font-semibold">▶ Play video</span>
                            </span>
                          </>
                        ) : (
                          <img
                            src={asset(src)}
                            alt={`${project.title}: ${label}`}
                            width={width}
                            height={height}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                            decoding="async"
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

        {selectedMedia && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedMedia(null)}
          >
            {isVideo(selectedMedia) ? (
              <video
                src={asset(selectedMedia)}
                className="max-w-full max-h-full rounded-2xl"
                controls
                autoPlay
                playsInline
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={asset(selectedMedia)}
                alt={`${project.title}: ${describeFile(selectedMedia)}`}
                className="max-w-full max-h-full object-contain rounded-2xl bg-white p-2"
              />
            )}
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full hover:bg-black"
              aria-label="Close enlarged view"
            >
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
