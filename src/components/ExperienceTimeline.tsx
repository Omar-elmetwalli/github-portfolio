import { resume } from "../../data/resume";

export default function ExperienceTimeline() {
  return (
    <ol className="relative pl-6 sm:pl-8 border-l-2 border-blue-500/30 dark:border-cyan-500/30 space-y-10 sm:space-y-12">
      {resume.experience.map((exp) => {
        // Only roles whose period runs to "Present" are marked current.
        const isCurrent = /present/i.test(exp.period);
        return (
          <li key={`${exp.title}-${exp.company}`} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 ${
                isCurrent ? "bg-blue-600 dark:bg-cyan-400 ring-4 ring-blue-500/20 dark:ring-cyan-400/20" : "bg-gray-400 dark:bg-gray-600"
              }`}
            />
            <article className="glass-panel p-6 sm:p-7 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">{exp.title}</h3>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">{exp.period}</span>
              </div>
              <p className="text-sm font-semibold text-blue-700 dark:text-cyan-300 mb-1">{exp.company}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{exp.location}</p>
              <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="text-blue-600 dark:text-cyan-400 mt-1 flex-shrink-0 text-xs">
                      ▹
                    </span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
