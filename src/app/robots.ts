import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Note: GitHub Pages serves this at /github-portfolio/robots.txt. Crawlers only
// read robots.txt at the domain root, so the sitemap is also linked from here
// for tools (and Search Console) that accept a sitemap URL directly.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
