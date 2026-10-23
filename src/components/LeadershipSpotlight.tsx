"use client";

import { useState } from "react";
import { leadershipRoles } from "../../data/leadership";

export default function LeadershipSpotlight() {
  const role = leadershipRoles[0]; // AIAA Zewail City Student Branch
  const [activeMedia, setActiveMedia] = useState<string>(
    role?.gallery?.find((g) => g.endsWith(".mp4")) || role?.gallery?.[0] || ""
  );

  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/github-portfolio" : "";
  const prefixPath = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

  if (!role) return null;

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-cyan-500/20 shadow-xl overflow-hidden relative">
      {/* Background glow circle */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center shadow-md flex-shrink-0">
            <img
              src={prefixPath("/images/leadership/aiaa/logo.png")}
              alt="AIAA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                {role.status}
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {role.period} • {role.location}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {role.title}
            </h3>
            <p className="text-base font-semibold text-blue-600 dark:text-cyan-400">
              {role.organization}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-3">
          {role.links?.website && (
            <a
              href={role.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20"
            >
              Branch Website →
            </a>
          )}
          {role.links?.linkedin && (
            <a
              href={role.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="py-6">
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {role.summary}
        </p>
      </div>

      {/* Interactive Media Showcase: Player + Thumbnails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Main active media viewer */}
        <div className="lg:col-span-8 bg-gray-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg aspect-video flex items-center justify-center relative">
          {activeMedia.endsWith(".mp4") ? (
            <video
              key={activeMedia}
              src={prefixPath(activeMedia)}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={prefixPath(activeMedia)}
              alt="AIAA Activity Showcase"
              className="w-full h-full object-contain p-2"
            />
          )}
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-semibold text-white/90">
            {activeMedia.endsWith(".mp4") ? "▶ Interactive Video" : "📷 Photo Gallery"}
          </div>
        </div>

        {/* Media Thumbnail Selector */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[380px] p-1">
          {role.gallery.map((media, idx) => {
            const isVideo = media.endsWith(".mp4");
            const isSelected = activeMedia === media;
            return (
              <button
                key={idx}
                onClick={() => setActiveMedia(media)}
                className={`relative flex-shrink-0 w-36 lg:w-full h-24 rounded-xl overflow-hidden border transition-all text-left cursor-pointer group ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/40 shadow-lg"
                    : "border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100"
                }`}
              >
                {isVideo ? (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      ▶ Video {idx + 1}
                    </span>
                  </div>
                ) : (
                  <img
                    src={prefixPath(media)}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium truncate">
                    {isVideo ? "Branch Event Video" : `Moment #${idx + 1}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Initiatives / Highlights Grid */}
      <div className="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-800">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Key Initiatives & Milestones
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {role.initiatives.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">✦</span>
                <span>{item}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
