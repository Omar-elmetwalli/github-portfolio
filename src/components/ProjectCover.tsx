import type { Project, Category } from "../../data/projects";
import { asset, describeFile, imageSize, isVideo } from "@/lib/site";

/** Line colour per category, drawn over a dark "figure" background. */
const palette: Record<Category, string> = {
  "Scientific ML": "#818cf8",
  "Fluid Mechanics & CFD": "#22d3ee",
  "Aerodynamics & Propulsion": "#38bdf8",
  "Dynamics & Controls": "#34d399",
  "Mechanical Design & Manufacturing": "#fbbf24",
  "Software & Computing": "#c084fc",
};

/** Small deterministic hash so each project gets its own (stable) pattern. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** First still image in a project's gallery (videos are skipped). */
export const coverImage = (project: Pick<Project, "gallery">) => project.gallery.find((m) => !isVideo(m));

/**
 * Card/hero cover. Uses the first gallery image, or draws a streamline pattern
 * in the project's category colors when there is no image.
 */
export default function ProjectCover({
  project,
  className = "",
  priority = false,
}: {
  project: Pick<Project, "slug" | "title" | "gallery" | "categories">;
  className?: string;
  priority?: boolean;
}) {
  const image = coverImage(project);

  if (image) {
    const { width, height } = imageSize(image);
    return (
      <img
        src={asset(image)}
        alt={`${project.title}: ${describeFile(image)}`}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`w-full h-full object-contain p-2 bg-white ${className}`}
      />
    );
  }

  const color = palette[project.categories[0]] ?? palette["Fluid Mechanics & CFD"];
  const seed = hash(project.slug);
  const id = `cover-${project.slug}`;
  const lines = Array.from({ length: 11 }, (_, i) => {
    const y = 18 + i * 22;
    const amp = 6 + ((seed >>> i) % 14);
    const phase = ((seed >>> (i + 3)) % 100) / 10;
    let d = `M -10 ${y}`;
    for (let x = 0; x <= 420; x += 30) {
      d += ` L ${x} ${(y + amp * Math.sin(x / 45 + phase)).toFixed(1)}`;
    }
    return d;
  });

  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${project.title} (illustration)`}
      className={`w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1220" />
          <stop offset="1" stopColor="#132238" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${id})`} />
      <rect width="400" height="250" fill={`url(#${id}-grid)`} />
      <g fill="none" stroke={color} strokeOpacity="0.55" strokeWidth="1.3">
        {lines.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <rect x="16" y="208" width={project.categories[0].length * 7.4 + 20} height="26" rx="4" fill="#0b1220" fillOpacity="0.85" />
      <text x="26" y="225" fill={color} fontSize="12" fontFamily="ui-monospace, SFMono-Regular, monospace" letterSpacing="0.04em">
        {project.categories[0]}
      </text>
    </svg>
  );
}
