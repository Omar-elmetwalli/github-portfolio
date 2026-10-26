import type { MetadataRoute } from "next";
import { getPublicProjects } from "../../data/projects";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/cv/"), changeFrequency: "monthly", priority: 0.8 },
    ...getPublicProjects().map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}/`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
