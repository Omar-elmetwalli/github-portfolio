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

// TODO(Omar): add entries. The section stays hidden while this list is empty.
// Example:
// {
//   title: "…",
//   authors: ["…", "O. Elmetwalli", "…"],
//   status: "In preparation",
//   project: "ml-augmented-turbulence-modeling",
// },
export const publications: Publication[] = [];
