import media from "../../data/media.json";

export const SITE_ORIGIN = "https://omar-elmetwalli.github.io";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Public URL of the deployed site, without a trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}/github-portfolio`;

/**
 * Prefix a file in /public with the base path. Next's <Link> does this on its
 * own; plain <a>, <img>, and <video> tags need it.
 */
export const asset = (path: string) => (path.startsWith("/") ? `${BASE_PATH}${path}` : path);

/** Absolute URL for a site path, e.g. absoluteUrl("/cv/"). */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path}`;

export const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

/** Width/height of an image in /public (from data/media.json), if known. */
export const imageSize = (src: string): { width?: number; height?: number } =>
  (media as Record<string, { width: number; height: number }>)[src] ?? {};

const WORDS: Record<string, string> = {
  cl: "Cl", cd: "Cd", cm: "Cm", cp: "Cp", aoa: "AoA", vs: "vs.", ml: "ML", cfd: "CFD", pinn: "PINN",
  yplus: "y+", gui: "GUI", cad: "CAD", aiaa: "AIAA", fig04: "Fig. 4", sp: "short-period", q: "q",
};

/** Turns "/images/x/cl-vs-aoa.webp" into "Cl vs. AoA". Used as fallback captions and alt text. */
export const describeFile = (src: string) => {
  const base = src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
  const text = base
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => WORDS[w.toLowerCase()] ?? w)
    .join(" ")
    .replace(/\bfigures? (\d+)\b/gi, "(Fig. $1)")
    // OpenFOAM study files: "m2.0_AoA4" = camber m = 2.0 %, angle of attack 4°.
    .replace(/\bm(\d) (\d) AoA(\d+)\b/i, "(camber m = $1.$2%, AoA = $3°)");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
