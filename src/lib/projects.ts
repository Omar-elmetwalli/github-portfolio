import { getPublicProjects, type Project } from "../../data/projects";
import { mathToPlain } from "./math";

/**
 * What the browser needs to render a project card or quick view: no section
 * text (that stays on the server-rendered project page), and math flattened to
 * plain text.
 */
export type ProjectCard = Omit<Project, "sections"> & { sectionTitles: string[] };

export const toCard = ({ sections, ...p }: Project): ProjectCard => ({
  ...p,
  summary: mathToPlain(p.summary),
  sectionTitles: sections.map((s) => s.title),
});

export const getProjectCards = (): ProjectCard[] => getPublicProjects().map(toCard);
