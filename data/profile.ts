// Content lives in data/content/profile.json; edit it there or with `pnpm admin`.
import data from "./content/profile.json" with { type: "json" };

export interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

export const profile = data as Omit<typeof data, "stats"> & { stats: Stat[] };
