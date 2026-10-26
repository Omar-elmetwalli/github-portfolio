import { profile } from "../../../../data/profile";
import { getPublicProjectBySlug, getPublicProjects } from "../../../../data/projects";
import { renderOgImage } from "@/lib/og";

// Link-preview images, exported as real .png files (/og/home.png,
// /og/<project-slug>.png) so GitHub Pages serves them as image/png.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ image: "home.png" }, ...getPublicProjects().map((p) => ({ image: `${p.slug}.png` }))];
}

export async function GET(_req: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  const slug = image.replace(/\.png$/, "");
  const project = slug === "home" ? undefined : getPublicProjectBySlug(slug);

  if (!project) {
    return renderOgImage({ eyebrow: profile.availability, title: profile.name, subtitle: profile.tagline });
  }
  return renderOgImage({
    eyebrow: `${project.categories.join(" • ")} • ${project.date}`,
    title: project.title,
    subtitle: project.tools.slice(0, 5).join(" · "),
  });
}
