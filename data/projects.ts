// Content lives in data/content/projects.json; edit it there or with `pnpm admin`.
import data from "./content/projects.json" with { type: "json" };

export interface ProjectSection {
  title: string;
  content: string;
}

export const CATEGORIES = [
  "Scientific ML",
  "Fluid Mechanics & CFD",
  "Aerodynamics & Propulsion",
  "Dynamics & Controls",
  "Mechanical Design & Manufacturing",
  "Software & Computing",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Project {
  slug: string;
  title: string;
  date: string;
  /** Used by the project filter. Labels must come from CATEGORIES. */
  categories: Category[];
  tags: string[];
  tools: string[];
  summary: string;
  /** Shown large in "Selected research" on the home page. */
  featured?: boolean;
  confidential?: boolean;
  /** Shown instead of summary/sections when confidential is true. */
  publicSummary?: string;
  sections: ProjectSection[];
  links: {
    github?: string;
    demo?: string;
    paper?: string;
    paperTitle?: string;
    report?: string;
    reportTitle?: string;
  };
  gallery: string[];
}

export const projects = data as Project[];

/**
 * Projects safe to show publicly. Confidential projects keep only their
 * publicSummary: the detailed summary and sections never leave the server.
 */
export const getPublicProjects = (): Project[] =>
  projects.map((p) =>
    p.confidential
      ? { ...p, summary: p.publicSummary ?? "Details available after publication.", sections: [] }
      : p
  );

export const getPublicProjectBySlug = (slug: string): Project | undefined =>
  getPublicProjects().find((p) => p.slug === slug);
