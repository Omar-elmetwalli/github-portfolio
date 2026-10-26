"use client";

import { useState } from "react";
import { leadershipRoles } from "../../data/leadership";
import { asset, imageSize, isVideo } from "@/lib/site";

export default function LeadershipSpotlight() {
  const role = leadershipRoles[0];
  const [activeIndex, setActiveIndex] = useState(0);
  if (!role) return null;

  const active = role.gallery[activeIndex];
  const logo = "/images/leadership/aiaa/logo.webp";
  const logoSize = imageSize(logo);

  return (
    <div className="card p-6 sm:p-10 rounded-xl border border-line  overflow-hidden relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg border border-line p-2 flex items-center justify-center shadow-md flex-shrink-0">
            <img
              src={asset(logo)}
              alt="AIAA logo"
              width={logoSize.width}
              height={logoSize.height}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-good-soft text-good text-xs font-bold rounded-full">
                {role.status}
              </span>
              <span className="text-xs font-semibold text-subtle">
                {role.period} • {role.location}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-ink font-display">{role.title}</h3>
            <p className="text-base font-semibold text-accent">{role.organization}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {role.links?.website && (
            <a
              href={role.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-accent hover:bg-accent-strong text-on-accent transition-colors"
            >
              Branch website →
            </a>
          )}
          {role.links?.linkedin && (
            <a
              href={role.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-surface-2 hover:bg-line text-ink transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <p className="py-6 text-base sm:text-lg text-ink leading-relaxed">{role.summary}</p>

      {active && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <figure className="lg:col-span-8">
            <div className="bg-black rounded-lg overflow-hidden border border-line shadow-lg aspect-video flex items-center justify-center">
              {isVideo(active.src) ? (
                <video
                  key={active.src}
                  src={asset(active.src)}
                  poster={active.poster ? asset(active.poster) : undefined}
                  controls
                  preload="none"
                  playsInline
                  className="w-full h-full object-contain"
                >
                </video>
              ) : (
                <img
                  src={asset(active.src)}
                  alt={active.alt ?? active.caption}
                  {...imageSize(active.src)}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <figcaption className="mt-2 text-sm text-muted">{active.caption}</figcaption>
          </figure>

          <ul
            aria-label="AIAA gallery"
            className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[420px] p-1"
          >
            {role.gallery.map((item, idx) => {
              const thumb = isVideo(item.src) ? item.poster : item.src;
              return (
                <li key={item.src} className="flex-shrink-0 w-36 lg:w-full">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-pressed={idx === activeIndex}
                    className={`relative w-full h-24 rounded-xl overflow-hidden border text-left ${
                      idx === activeIndex
                        ? "border-accent ring-2 ring-accent/40"
                        : "border-line opacity-80 hover:opacity-100"
                    }`}
                  >
                    {thumb ? (
                      <img src={asset(thumb)} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="block w-full h-full bg-black" />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-2">
                      <span className="text-[11px] text-white font-medium truncate">
                        {isVideo(item.src) && "▶ "}
                        {item.caption}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-line">
        <h4 className="text-sm font-bold uppercase tracking-wider text-subtle mb-4">
          Key initiatives & milestones
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {role.initiatives.map((item) => (
            <li
              key={item}
              className="p-4 rounded-xl bg-surface-2 border border-line text-sm text-ink leading-relaxed flex items-start gap-2"
            >
              <span aria-hidden="true" className="text-accent font-bold mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
