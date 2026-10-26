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

/** Turns "/images/x/cl-vs-aoa.webp" into "Cl vs aoa". Used as fallback alt text. */
export const describeFile = (src: string) => {
  const base = src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
  const words = base.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};
