"use client";

import { resume } from "../../data/resume";

export default function ExperienceTimeline() {
  const experiences = resume.experience;

  return (
    <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-500/30 dark:border-cyan-500/30 space-y-10 sm:space-y-12">
      {experiences.map((exp, index) => {
        const isCurrent = exp.period.includes("Present") || exp.period.includes("Upcoming");

        return (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <div
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                isCurrent
                  ? "bg-blue-600 dark:bg-cyan-400 border-white dark:border-gray-950 ring-4 ring-blue-500/20 dark:ring-cyan-400/20 scale-110"
                  : "bg-gray-300 dark:bg-gray-700 border-white dark:border-gray-950 group-hover:bg-blue-500 group-hover:scale-110"
              }`}
            />

            {/* Card Content */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {exp.title}
                  </h3>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {exp.period}
                </span>
              </div>

              <div className="text-sm font-semibold text-blue-600 dark:text-cyan-400 mb-1">
                {exp.company}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {exp.location}
              </div>

              {/* Highlights */}
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-blue-500 dark:text-cyan-400 mt-1 flex-shrink-0 text-xs">
                      ▹
                    </span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
