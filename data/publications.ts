// Content lives in data/content/publications.json; edit it there or with `pnpm admin`.
import data from "./content/publications.json" with { type: "json" };

export type PublicationStatus = "In preparation" | "Under review" | "Preprint" | "Published";

export interface Publication {
  title: string;
  /** Author list in publication order, e.g. ["A. Hamada", "O. Elmetwalli", "M. Ayyad"]. */
  authors: string[];
  status: PublicationStatus;
  /** Journal or conference, if known. */
  venue?: string;
  year?: string;
  pdf?: string;
  doi?: string;
  arxiv?: string;
  /** Related project slug, for linking to /projects/<slug>. */
  project?: string;
}

// The publications section stays hidden while this list is empty.
export const publications = data as Publication[];
