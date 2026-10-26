import { profile } from "../../data/profile";
import { resume } from "../../data/resume";
import { leadershipRoles } from "../../data/leadership";
import { awards } from "../../data/awards";
import { publications } from "../../data/publications";
import { getPublicProjects } from "../../data/projects";
import { mathToPlain } from "./math";

/**
 * One retrievable piece of site content. `url` is a site path the assistant
 * cites (e.g. "/projects/<slug>/"); `core` chunks are always sent to the model.
 */
export interface KnowledgeChunk {
  id: string;
  title: string;
  url: string;
  text: string;
  core?: boolean;
}

export interface KnowledgeBase {
  generatedAt: string;
  owner: string;
  chunks: KnowledgeChunk[];
}

const join = (...lines: (string | false | undefined)[]) => lines.filter(Boolean).join("\n");

/**
 * Builds the AI knowledge base from data/*.ts. Confidential projects only
 * contribute their publicSummary (getPublicProjects strips the rest).
 */
export function buildKnowledge(): KnowledgeBase {
  const chunks: KnowledgeChunk[] = [];
  const edu = profile.education[0];

  chunks.push({
    id: "profile",
    title: `About ${profile.name}`,
    url: "/#research",
    core: true,
    text: join(
      `${profile.name}: ${profile.tagline}.`,
      `Status: ${profile.availability}.`,
      `Education: ${edu.degree} (${edu.minor}), ${edu.institution}, ${edu.period}. GPA ${edu.gpa} (${edu.gpaNote}).`,
      `Location: ${profile.location}.`,
      profile.bio.map((b) => b.replace(/\*\*/g, "")).join(" "),
      `Research interests: ${profile.interests.join("; ")}.`
    ),
  });

  chunks.push({
    id: "contact",
    title: "Contact",
    url: "/#contact",
    core: true,
    text: join(
      `Email: ${profile.email}. Academic emails: ${profile.academicEmails.map((a) => `${a.address} (${a.label})`).join(", ")}.`,
      `LinkedIn: ${profile.linkedin}. GitHub: ${profile.github}.`,
      `CV: /cv/ (web) and ${resume.pdfPath} (PDF).`,
      `Contact form on the home page: /#contact.`
    ),
  });

  chunks.push({
    id: "research-interests",
    title: "Research interests",
    url: "/#research",
    core: true,
    text: profile.researchInterests
      .map((r) => `${r.title}: ${r.summary} Methods: ${r.methods.join(", ")}. Related projects: ${r.projects.map((s) => `/projects/${s}/`).join(", ")}.`)
      .join("\n"),
  });

  chunks.push({
    id: "collaborations",
    title: "Research collaborations",
    url: "/#research",
    text: profile.collaborations.map((c) => `${c.name}: ${c.focus}.`).join("\n"),
  });

  chunks.push({
    id: "stats",
    title: "Key numbers",
    url: "/",
    text: profile.stats
      .map((s) => `${s.label}: ${s.decimals !== undefined ? s.value.toFixed(s.decimals) : s.value}${s.suffix ?? ""} (${s.sublabel}).`)
      .join("\n"),
  });

  chunks.push({
    id: "skills",
    title: "Methods, tools, and skills",
    url: "/cv/",
    text: join(
      ...profile.competencies.map((c) => `${c.title}: ${c.description}`),
      ...Object.entries(resume.technicalSkills).map(([k, v]) => `${k}: ${v.join(", ")}.`),
      `Languages: ${resume.languages.map((l) => `${l.name} (${l.level})`).join(", ")}.`
    ),
  });

  chunks.push({
    id: "education",
    title: "Education",
    url: "/#education",
    text: `${edu.degree}, ${edu.minor}. ${edu.institution}, ${edu.location}, ${edu.period}. GPA ${edu.gpa} (${edu.gpaNote}). Coursework: ${edu.coursework.join(", ")}.`,
  });

  resume.experience.forEach((e, i) => {
    chunks.push({
      id: `experience-${i}`,
      title: `${e.title} at ${e.company}`,
      url: "/#experience",
      text: join(`${e.title}, ${e.company} (${e.location}), ${e.period}.`, ...e.highlights.map((h) => `- ${h}`)),
    });
  });

  for (const role of leadershipRoles) {
    chunks.push({
      id: `leadership-${role.id}`,
      title: `${role.title}, ${role.shortName}`,
      url: "/#leadership",
      text: join(
        `${role.title}, ${role.organization}. ${role.period}. ${role.subtitle ?? ""}`,
        role.summary,
        ...role.achievements.map((a) => `- ${a}`),
        ...role.initiatives.map((a) => `- ${a}`)
      ),
    });
  }

  if (awards.length) {
    chunks.push({
      id: "awards",
      title: "Awards and honors",
      url: "/#awards",
      text: awards.map((a) => `${a.title}, ${a.issuer} (${a.date}).${a.description ? ` ${a.description}` : ""}`).join("\n"),
    });
  }

  chunks.push({
    id: "certifications",
    title: "Certifications and training",
    url: "/cv/",
    text: resume.certifications.map((c) => `${c.name}, ${c.issuer} (${c.date}).`).join("\n"),
  });

  chunks.push({
    id: "publications",
    title: "Publications",
    // The publications section only renders when there are entries.
    url: publications.length ? "/#publications" : "/cv/",
    text: publications.length
      ? publications
          .map((p) => `${p.title}. ${p.authors.join(", ")}. Status: ${p.status}.${p.venue ? ` ${p.venue}.` : ""}${p.year ? ` ${p.year}.` : ""}`)
          .join("\n")
      : "No publications are listed on the site yet. A manuscript on ML-augmented turbulence modeling is in preparation (see the experience section); do not invent titles, venues, or dates.",
  });

  for (const p of getPublicProjects()) {
    const url = `/projects/${p.slug}/`;
    chunks.push({
      id: `project-${p.slug}`,
      title: p.title,
      url,
      text: join(
        `Project: ${p.title} (${p.date}). Areas: ${p.categories.join(", ")}.`,
        p.confidential && "Status: ongoing research, manuscript in preparation; only a public summary is available.",
        mathToPlain(p.summary),
        `Tools: ${p.tools.join(", ")}.`,
        `Tags: ${p.tags.join(", ")}.`,
        p.links.github && `Code: ${p.links.github}`,
        p.links.paper && `Report PDF: ${p.links.paper}`,
        p.links.report && `Second report PDF: ${p.links.report}`
      ),
    });
    p.sections.forEach((s, i) => {
      chunks.push({
        id: `project-${p.slug}-s${i + 1}`,
        title: `${p.title}: ${s.title}`,
        url,
        text: mathToPlain(s.content),
      });
    });
  }

  return { generatedAt: new Date().toISOString(), owner: profile.name, chunks };
}
