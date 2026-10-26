import { ImageResponse } from "next/og";
import { profile } from "../../data/profile";

export const ogSize = { width: 1200, height: 630 };

/** Absolute-path helper for metadata: the OG image for "home" or a project slug. */
export const ogImagePath = (name: string) => `/og/${name}.png`;

/** Streamlines bending around an airfoil-like bump, drawn as SVG paths. */
function streamlines() {
  const paths: string[] = [];
  for (let i = 0; i < 16; i++) {
    const y0 = 40 + i * 38;
    const dist = Math.abs(y0 - 360);
    const bump = Math.max(0, 1 - dist / 260) * 60 * (y0 < 360 ? -1 : 1);
    paths.push(`M -20 ${y0} C 500 ${y0}, 640 ${y0 + bump}, 820 ${y0 + bump * 0.6} S 1100 ${y0}, 1240 ${y0}`);
  }
  return paths;
}

/** Shared 1200×630 card used for the site and per-project link previews. */
export function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #020617 0%, #0b1f3a 55%, #0e4a6b 100%)",
          color: "#f8fafc",
          position: "relative",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          {streamlines().map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#38bdf8" strokeOpacity={0.18 + (i % 3) * 0.06} strokeWidth={2} />
          ))}
          <path d="M 560 360 C 640 300, 820 310, 900 352 C 820 372, 640 380, 560 360 Z" fill="#e0f2fe" fillOpacity={0.12} />
        </svg>
        <div style={{ display: "flex", fontSize: 26, color: "#67e8f9", letterSpacing: 2, textTransform: "uppercase" }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 54 : 68, fontWeight: 700, lineHeight: 1.1, marginTop: 16, maxWidth: 1050 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#cbd5e1", marginTop: 20, maxWidth: 1000 }}>{subtitle}</div>
        <div style={{ display: "flex", fontSize: 22, color: "#94a3b8", marginTop: 36 }}>
          {profile.name} • omar-elmetwalli.github.io/github-portfolio
        </div>
      </div>
    ),
    ogSize
  );
}
