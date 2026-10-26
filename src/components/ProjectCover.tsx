import type { Project, Category } from "../../data/projects";
import { asset, describeFile, imageSize, isVideo } from "@/lib/site";

const palette: Record<Category, [string, string]> = {
  "Scientific ML": ["#4f46e5", "#06b6d4"],
  "Fluid Mechanics & CFD": ["#0369a1", "#22d3ee"],
  "Aerodynamics & Propulsion": ["#1d4ed8", "#38bdf8"],
  "Dynamics & Controls": ["#047857", "#34d399"],
  "Mechanical Design & Manufacturing": ["#b45309", "#fbbf24"],
  "Software & Computing": ["#7e22ce", "#c084fc"],
};

/** Small deterministic hash so each project gets its own (stable) pattern. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** First still image in a project's gallery (videos are skipped). */
export const coverImage = (project: Project) => project.gallery.find((m) => !isVideo(m));

/**
 * Card/hero cover. Uses the first gallery image, or draws a streamline pattern
 * in the project's category colors when there is no image.
 */
export default function ProjectCover({
  project,
  className = "",
  priority = false,
}: {
  project: Project;
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

  const [from, to] = palette[project.categories[0]] ?? palette["Fluid Mechanics & CFD"];
  const seed = hash(project.slug);
  const id = `cover-${project.slug}`;
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 20 + i * 22;
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
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${project.title} (illustration)`}
      className={`w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${id})`} />
      <g fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5">
        {lines.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <text
        x="24"
        y="200"
        fill="#fff"
        fontSize="15"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.06em"
      >
        {project.categories[0].toUpperCase()}
      </text>
    </svg>
  );
}
