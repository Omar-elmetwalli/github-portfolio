import Link from "next/link";
import { profile } from "../../data/profile";
import { resume } from "../../data/resume";
import { getPublicProjects } from "../../data/projects";
import { awards } from "../../data/awards";
import { publications } from "../../data/publications";
import StreamlineCanvas from "@/components/StreamlineCanvas";
import StatsCounter from "@/components/StatsCounter";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import LeadershipSpotlight from "@/components/LeadershipSpotlight";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ContactSection from "@/components/ContactSection";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";
import { asset } from "@/lib/site";
import { scholarlyArticleJsonLd } from "@/lib/jsonld";

const sectionClass = "py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80";
const altBg = "bg-gray-50/60 dark:bg-gray-900/30";

export default function Home() {
  const education = profile.education[0];

  return (
    <div className="relative min-h-screen aerospace-grid">
      {/* Hero */}
      <section
        id="home"
        aria-labelledby="hero-title"
        className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4 overflow-hidden"
      >
        <StreamlineCanvas />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-semibold text-gray-900 dark:text-gray-100 shadow-sm">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-500" />
            {profile.availability}
          </p>

          <div className="space-y-4">
            <h1 id="hero-title" className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-950 dark:text-white tracking-tight leading-none">
              {profile.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-700 dark:text-cyan-300">{profile.tagline}</p>
            <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {profile.hero.lead} <strong>{profile.hero.highlight}</strong>
              {profile.hero.rest}
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {profile.hero.sub}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#projects"
              className="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-colors"
            >
              View research & projects
            </Link>
            <a
              href={asset(resume.pdfPath)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 font-bold text-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              Download CV (PDF)
            </a>
            <Link
              href="/#contact"
              className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-cyan-300"
            >
              Get in touch →
            </Link>
          </div>

          <StatsCounter stats={profile.stats} />
        </div>
      </section>

      {/* About */}
      <section id="about" aria-labelledby="about-title" className={sectionClass}>
        <div className="max-w-6xl mx-auto space-y-12">
          <SectionHeading id="about" eyebrow="Background" title="About" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6 text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>
                  <RichText text={paragraph} />
                </p>
              ))}

              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Current research collaborations
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.collaborations.map((c) => (
                    <li
                      key={c.name}
                      className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 text-xs"
                    >
                      <span className="font-bold text-gray-900 dark:text-white block">{c.name}</span>
                      <span className="text-gray-700 dark:text-gray-300">{c.focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-cyan-500/20 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300">Education</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{education.degree}</h3>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{education.minor}</p>
              <p className="text-sm text-blue-700 dark:text-cyan-300 font-semibold">{education.institution}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {education.location} • {education.period}
              </p>
              <p className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                <strong>Cumulative GPA: {education.gpa}</strong> ({education.gpaNote})
              </p>
              <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Key coursework</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{education.coursework.join(", ")}.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" aria-labelledby="skills-title" className={`${sectionClass} ${altBg}`}>
        <div className="max-w-6xl mx-auto space-y-10">
          <SectionHeading id="skills" eyebrow="Methods & tools" title="Core competencies" />
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.competencies.map((c) => (
              <li key={c.title} className="glass-panel p-6 rounded-2xl glow-card space-y-3">
                <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-lg">
                  {c.icon}
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{c.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" aria-labelledby="projects-title" className={sectionClass}>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading id="projects" eyebrow="Research & engineering" title="Projects" />
            <p className="text-sm text-gray-700 dark:text-gray-300 max-w-md">
              Filter by area, open a quick view, or go to the full project page for methods, figures, and reports.
            </p>
          </div>
          <ProjectsExplorer projects={getPublicProjects()} />
        </div>
      </section>

      {/* Publications (hidden until data/publications.ts has entries) */}
      {publications.length > 0 && (
        <section id="publications" aria-labelledby="publications-title" className={`${sectionClass} ${altBg}`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <SectionHeading id="publications" eyebrow="Research outputs" title="Publications" />
            <ul className="space-y-4">
              {publications.map((pub) => (
                <li key={pub.title} className="glass-panel p-6 rounded-2xl space-y-2">
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarlyArticleJsonLd(pub)) }}
                  />
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-cyan-200">
                    {pub.status}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{pub.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {pub.authors.join(", ")}
                    {pub.venue && <>. <em>{pub.venue}</em></>}
                    {pub.year && <> ({pub.year})</>}
                  </p>
                  <p className="flex flex-wrap gap-3 text-sm font-semibold">
                    {pub.pdf && <a className="text-blue-700 dark:text-cyan-300 hover:underline" href={asset(pub.pdf)}>PDF</a>}
                    {pub.doi && <a className="text-blue-700 dark:text-cyan-300 hover:underline" href={`https://doi.org/${pub.doi}`}>DOI</a>}
                    {pub.arxiv && <a className="text-blue-700 dark:text-cyan-300 hover:underline" href={`https://arxiv.org/abs/${pub.arxiv}`}>arXiv</a>}
                    {pub.project && <Link className="text-blue-700 dark:text-cyan-300 hover:underline" href={`/projects/${pub.project}/`}>Project</Link>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section id="awards" aria-labelledby="awards-title" className={`${sectionClass} ${publications.length ? "" : altBg}`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <SectionHeading id="awards" eyebrow="Recognition" title="Awards & honors" />
            <ul className="space-y-4">
              {awards.map((award) => (
                <li key={award.title} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
                  <span aria-hidden="true" className="w-12 h-12 flex-shrink-0 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl">
                    🏆
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{award.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{award.issuer}</p>
                    {award.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{award.description}</p>}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-mono">{award.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Leadership */}
      <section id="leadership" aria-labelledby="leadership-title" className={sectionClass}>
        <div className="max-w-6xl mx-auto space-y-8">
          <SectionHeading id="leadership" eyebrow="Community" title="AIAA student branch leadership" />
          <LeadershipSpotlight />
        </div>
      </section>

      {/* Experience */}
      <section id="experience" aria-labelledby="experience-title" className={`${sectionClass} ${altBg}`}>
        <div className="max-w-4xl mx-auto space-y-10">
          <SectionHeading id="experience" eyebrow="Appointments" title="Research & engineering experience" />
          <ExperienceTimeline />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-title" className={sectionClass}>
        <div className="max-w-6xl mx-auto space-y-8">
          <SectionHeading id="contact" eyebrow="Contact" title="Get in touch" center />
          <ContactSection />
        </div>
      </section>
    </div>
  );
}
