import type { Metadata } from "next";
import { profile } from "../../../data/profile";
import { resume } from "../../../data/resume";
import { awards } from "../../../data/awards";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { absoluteUrl, asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae of ${profile.name}: education, research experience, awards, and skills.`,
  alternates: { canonical: absoluteUrl("/cv/") },
  openGraph: { url: absoluteUrl("/cv/"), title: `CV | ${profile.name}` },
};

const h2 = "text-2xl font-bold text-ink mb-6";

export default function CvPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-14">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-ink">{profile.name}</h1>
            <p className="mt-2 text-lg text-accent font-semibold">{profile.tagline}</p>
            <p className="mt-1 text-sm text-muted">
              {profile.location} •{" "}
              <a className="hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
          </div>
          <a
            href={asset(resume.pdfPath)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent hover:bg-accent-strong text-on-accent text-sm font-bold"
          >
            Download CV (PDF)
          </a>
        </header>

        <section aria-labelledby="cv-education">
          <h2 id="cv-education" className={h2}>Education</h2>
          {profile.education.map((e) => (
            <div key={e.degree} className="card p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <h3 className="text-lg font-bold text-ink">{e.degree}</h3>
                <span className="text-sm text-subtle">{e.period}</span>
              </div>
              <p className="text-sm text-ink">{e.minor}</p>
              <p className="text-sm font-semibold text-accent">{e.institution}, {e.location}</p>
              <p className="mt-2 text-sm text-ink">GPA {e.gpa} ({e.gpaNote})</p>
              <p className="mt-1 text-sm text-muted">Coursework: {e.coursework.join(", ")}.</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="cv-experience">
          <h2 id="cv-experience" className={h2}>Experience</h2>
          <ExperienceTimeline />
        </section>

        {awards.length > 0 && (
          <section aria-labelledby="cv-awards">
            <h2 id="cv-awards" className={h2}>Awards</h2>
            <ul className="space-y-2">
              {awards.map((a) => (
                <li key={a.title} className="text-ink">
                  <strong>{a.title}</strong>, {a.issuer} ({a.date})
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="cv-certs">
          <h2 id="cv-certs" className={h2}>Certifications & training</h2>
          <ul className="space-y-2">
            {resume.certifications.map((c) => (
              <li key={c.name} className="text-ink">
                <strong>{c.name}</strong>, {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cv-skills">
          <h2 id="cv-skills" className={h2}>Technical skills</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(resume.technicalSkills).map(([group, items]) => (
              <div key={group}>
                <dt className="text-xs font-bold uppercase tracking-wider text-subtle mb-2">
                  {{ simulation: "Simulation", cad: "CAD & design", programming: "Programming", other: "Other" }[group] ?? group}
                </dt>
                <dd className="text-sm text-ink">{items.join(" • ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="cv-languages">
          <h2 id="cv-languages" className={h2}>Languages</h2>
          <p className="text-ink">
            {resume.languages.map((l) => `${l.name} (${l.level})`).join(" • ")}
          </p>
        </section>
      </div>
    </div>
  );
}
