import { resume } from "../../data/resume";

/** Experience as a dated list: period in the left column, role on the right. */
export default function ExperienceTimeline() {
  return (
    <ol className="border-t border-line">
      {resume.experience.map((exp) => {
        // Only roles whose period runs to "Present" are marked current.
        const isCurrent = /present/i.test(exp.period);
        return (
          <li key={`${exp.title}-${exp.company}`} className="grid gap-2 border-b border-line py-7 md:grid-cols-12 md:gap-8" data-reveal>
            <div className="md:col-span-3">
              <p className="font-mono text-sm text-subtle">{exp.period}</p>
              {isCurrent && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs text-good">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-good" />
                  Current
                </p>
              )}
            </div>
            <article className="md:col-span-9">
              <h3 className="text-h3 text-ink">{exp.title}</h3>
              <p className="mt-1 text-sm font-medium text-accent">{exp.company}</p>
              <p className="text-sm text-subtle">{exp.location}</p>
              <ul className="mt-4 space-y-2">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" />
                    <span>{h}</span>
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
