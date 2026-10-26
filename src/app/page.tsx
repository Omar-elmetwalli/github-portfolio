import Link from "next/link";
import { profile } from "../../data/profile";
import { resume } from "../../data/resume";
import { awards } from "../../data/awards";
import { publications } from "../../data/publications";
import FlowVisualizer from "@/components/FlowVisualizer";
import StatsCounter from "@/components/StatsCounter";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import LeadershipSpotlight from "@/components/LeadershipSpotlight";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ContactSection from "@/components/ContactSection";
import SectionHeading from "@/components/SectionHeading";
import ResearchInterests from "@/components/ResearchInterests";
import FeaturedResearch from "@/components/FeaturedResearch";
import { IconArrowRight, IconCap, IconDownload, IconTrophy } from "@/components/Icons";
import { getProjectCards } from "@/lib/projects";
import { asset } from "@/lib/site";
import { scholarlyArticleJsonLd } from "@/lib/jsonld";

const wrap = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "border-t border-line py-20 sm:py-24";

export default function Home() {
  const education = profile.education[0];
  // Section numbers follow what is actually rendered.
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      {/* Hero */}
      <section id="home" aria-labelledby="hero-title" className="paper-grid relative overflow-hidden pt-24 sm:pt-28">
        <div className={`${wrap} grid items-center gap-10 pb-14 lg:grid-cols-12 lg:gap-12 lg:pb-20`}>
          <div className="space-y-7 lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-good/40 bg-good-soft px-3 py-1 text-sm font-medium text-good">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-good" />
              {profile.availability}
            </p>
            <div className="space-y-4">
              <h1 id="hero-title" className="text-display text-ink">
                {profile.name}
              </h1>
              <p className="max-w-xl font-display text-xl font-medium leading-snug text-accent sm:text-2xl">
                {profile.tagline}
              </p>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {profile.hero.lead} {profile.hero.highlight}
              {profile.hero.rest}
            </p>
            <p className="font-mono text-sm text-subtle">
              {education.degree} · {profile.affiliation.name}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#research"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-on-accent hover:bg-accent-strong"
              >
                View research <IconArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={asset(resume.pdfPath)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-5 py-3 text-sm font-semibold text-ink hover:border-accent"
              >
                <IconDownload className="h-4 w-4" /> Download CV
              </a>
              <Link href="/#contact" className="inline-flex items-center px-3 py-3 text-sm font-semibold text-muted hover:text-ink">
                Get in touch
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <FlowVisualizer projectSlug="joukowski-airfoil-aerodynamics" />
          </div>
        </div>
        <div className="border-t border-line bg-surface/70 backdrop-blur-sm">
          <div className={wrap}>
            <StatsCounter stats={profile.stats} />
          </div>
        </div>
      </section>

      {/* Research interests */}
      <section id="research" aria-labelledby="research-title" className={section}>
        <div className={`${wrap} space-y-12`}>
          <SectionHeading id="research" index={num()} eyebrow="Research" title="Research interests" />
          <ResearchInterests />
        </div>
      </section>

      {/* Selected research */}
      <section id="selected" aria-labelledby="selected-title" className={`${section} bg-surface`}>
        <div className={`${wrap} space-y-12`}>
          <SectionHeading
            id="selected"
            index={num()}
            eyebrow="Selected work"
            title="Selected research"
            intro="Three projects that show how I work: building data pipelines, enforcing physics in learned models, and checking them against theory and simulation."
          />
          <FeaturedResearch />
        </div>
      </section>

      {/* Publications (hidden until data/publications.ts has entries) */}
      {publications.length > 0 && (
        <section id="publications" aria-labelledby="publications-title" className={section}>
          <div className={`${wrap} space-y-10`}>
            <SectionHeading id="publications" index={num()} eyebrow="Outputs" title="Publications & research outputs" />
            <ol className="divide-y divide-line border-y border-line">
              {publications.map((pub) => (
                <li key={pub.title} className="grid gap-2 py-6 md:grid-cols-12 md:gap-8" data-reveal>
                  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarlyArticleJsonLd(pub)) }} />
                  <div className="md:col-span-3">
                    <span className="rounded-sm bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent">{pub.status}</span>
                    {pub.year && <p className="mt-2 font-mono text-sm text-subtle">{pub.year}</p>}
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-h3 text-ink">{pub.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {pub.authors.join(", ")}
                      {pub.venue && (
                        <>
                          {" · "}
                          <em>{pub.venue}</em>
                        </>
                      )}
                    </p>
                    <p className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
                      {pub.pdf && <a className="text-accent hover:underline" href={asset(pub.pdf)}>PDF</a>}
                      {pub.doi && <a className="text-accent hover:underline" href={`https://doi.org/${pub.doi}`}>DOI</a>}
                      {pub.arxiv && <a className="text-accent hover:underline" href={`https://arxiv.org/abs/${pub.arxiv}`}>arXiv</a>}
                      {pub.project && <Link className="text-accent hover:underline" href={`/projects/${pub.project}/`}>Project</Link>}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* All projects */}
      <section id="projects" aria-labelledby="projects-title" className={section}>
        <div className={`${wrap} space-y-10`}>
          <SectionHeading
            id="projects"
            index={num()}
            eyebrow="Archive"
            title="All projects"
            intro="Coursework, competitions, and research, from CFD and propulsion to controls and manufacturing. Filter by area or search by tool."
          />
          <ProjectsExplorer projects={getProjectCards()} />
        </div>
      </section>

      {/* Awards */}
      {awards.length > 0 && (
        <section id="awards" aria-labelledby="awards-title" className={`${section} bg-surface`}>
          <div className={`${wrap} space-y-10`}>
            <SectionHeading id="awards" index={num()} eyebrow="Recognition" title="Awards & honors" />
            <ul className="grid gap-4 md:grid-cols-2">
              {awards.map((a) => (
                <li key={a.title} className="card flex gap-4 p-6" data-reveal>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-warm-soft text-warm">
                    <IconTrophy className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-subtle">{a.date}</p>
                    <h3 className="mt-1 text-h3 text-ink">{a.title}</h3>
                    <p className="text-sm text-muted">{a.issuer}</p>
                    {a.description && <p className="mt-2 text-sm text-muted">{a.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Leadership */}
      <section id="leadership" aria-labelledby="leadership-title" className={section}>
        <div className={`${wrap} space-y-10`}>
          <SectionHeading id="leadership" index={num()} eyebrow="Community" title="Leadership" />
          <LeadershipSpotlight />
        </div>
      </section>

      {/* Experience */}
      <section id="experience" aria-labelledby="experience-title" className={`${section} bg-surface`}>
        <div className={`${wrap} space-y-10`}>
          <SectionHeading id="experience" index={num()} eyebrow="Appointments" title="Experience" />
          <ExperienceTimeline />
        </div>
      </section>

      {/* Education */}
      <section id="education" aria-labelledby="education-title" className={section}>
        <div className={`${wrap} space-y-10`}>
          <SectionHeading id="education" index={num()} eyebrow="Training" title="Education" />
          <div className="grid gap-6 lg:grid-cols-12">
            <article className="card p-6 sm:p-8 lg:col-span-5" data-reveal>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-soft text-accent">
                <IconCap className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-h3 text-ink">{education.degree}</h3>
              <p className="text-sm text-muted">{education.minor}</p>
              <p className="mt-3 text-sm font-medium text-accent">{education.institution}</p>
              <p className="font-mono text-sm text-subtle">
                {education.location} · {education.period}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
                <div>
                  <dt className="text-eyebrow text-subtle">GPA</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold text-ink">{education.gpa}</dd>
                </div>
                <div>
                  <dt className="text-eyebrow text-subtle">Standing</dt>
                  <dd className="mt-1 text-sm text-ink">{education.gpaNote}</dd>
                </div>
              </dl>
              <p className="mt-5 text-eyebrow text-subtle">Key coursework</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {education.coursework.map((c) => (
                  <li key={c} className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </article>
            <div className="lg:col-span-7" data-reveal>
              <h3 className="text-eyebrow text-subtle">Methods & tools</h3>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {profile.competencies.map((c) => (
                  <div key={c.title} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                    <dt className="text-sm font-semibold text-ink">{c.title}</dt>
                    <dd className="text-sm leading-relaxed text-muted sm:col-span-2">{c.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-title" className={`${section} bg-surface`}>
        <div className={`${wrap} space-y-10`}>
          <SectionHeading
            id="contact"
            index={num()}
            eyebrow="Contact"
            title="Get in touch"
            intro="I'm looking for PhD positions starting Fall 2027 in turbulence modeling, scientific ML, and flow control. I'm also happy to talk about research collaborations."
          />
          <ContactSection />
        </div>
      </section>
    </>
  );
}
