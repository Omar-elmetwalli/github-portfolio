export interface Award {
  title: string;
  /** Competition, society, or institution that gave the award. */
  issuer: string;
  date: string;
  description?: string;
  link?: string;
}

export const awards: Award[] = [
  {
    title: "3rd Place Worldwide, eVTOL Design Category",
    issuer: "ROTORTHON International Competition",
    date: "2024",
  },
];
