import type { NextConfig } from "next";

const repo = "REPO"; // <-- put your GitHub repo name here
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // Needed for https://USERNAME.github.io/REPO/
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
};

export default nextConfig;
