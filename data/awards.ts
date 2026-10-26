// Content lives in data/content/awards.json; edit it there or with `pnpm admin`.
import data from "./content/awards.json" with { type: "json" };

export interface Award {
  title: string;
  /** Competition, society, or institution that gave the award. */
  issuer: string;
  date: string;
  description?: string;
  link?: string;
}

export const awards = data as Award[];
