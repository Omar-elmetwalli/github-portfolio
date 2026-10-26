import { profile } from "../../data/profile";
import { resume } from "../../data/resume";
import { getPublicProjects } from "../../data/projects";
import type { PaletteItem } from "@/components/CommandPalette";
import { navSections } from "./nav";
import { aiEnabled } from "./aiConfig";

/** Everything the command palette can jump to. Built on the server, sent as plain data. */
export function getPaletteItems(): PaletteItem[] {
  return [
    ...navSections.map((s) => ({
      id: `section-${s.id}`,
      group: "Sections" as const,
      label: s.label,
      href: `/#${s.id}`,
      kind: "page" as const,
    })),
    ...(aiEnabled
      ? [{ id: "section-fit", group: "Sections" as const, label: "Fit check (paste a lab or job description)", keywords: "lab job posting match", href: "/#fit", kind: "page" as const }]
      : []),
    ...getPublicProjects().map((p) => ({
      id: `project-${p.slug}`,
      group: "Projects" as const,
      label: p.title,
      keywords: [...p.categories, ...p.tags, ...p.tools].join(" "),
      hint: p.date.slice(0, 4),
      href: `/projects/${p.slug}/`,
      kind: "page" as const,
    })),
    { id: "cv-page", group: "CV & links", label: "CV (web page)", keywords: "resume curriculum vitae", href: "/cv/", kind: "page" },
    { id: "cv-pdf", group: "CV & links", label: "Download CV (PDF)", keywords: "resume pdf", hint: "PDF", href: resume.pdfPath, kind: "file" },
    { id: "email", group: "CV & links", label: `Email ${profile.email}`, keywords: "contact mail", href: `mailto:${profile.email}`, kind: "external" },
    { id: "github", group: "CV & links", label: "GitHub", keywords: "code repositories", href: profile.github, kind: "external" },
    { id: "linkedin", group: "CV & links", label: "LinkedIn", keywords: "profile", href: profile.linkedin, kind: "external" },
  ];
}
