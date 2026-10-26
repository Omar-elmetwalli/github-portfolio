import type { NextConfig } from "next";

// The site is served from https://omar-elmetwalli.github.io/github-portfolio/
// in production and from the root in `pnpm dev`.
const repo = "github-portfolio";
const basePath = process.env.NODE_ENV === "production" ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  // Exposed to the client so plain <a>/<img>/<video> tags can prefix public files.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
