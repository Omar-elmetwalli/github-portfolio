import { defineConfig, devices } from "@playwright/test";

// Smoke tests run against the static export (`pnpm build` first), served
// under the GitHub Pages base path. For the chat test, build with
// NEXT_PUBLIC_AI_ENDPOINT=https://ai.mock.test (see `pnpm test:e2e:build`);
// the tests intercept that endpoint, so no worker or API key is needed.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // Several Chrome instances at once are flaky on Windows dev machines.
  workers: 2,
  reporter: isCI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:4173/github-portfolio/",
    trace: "retain-on-failure",
    // Locally, use the installed Chrome (no browser download). CI installs Chromium.
    ...(isCI ? {} : { channel: "chrome" }),
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...(isCI ? {} : { channel: "chrome" }) } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(isCI ? {} : { channel: "chrome" }) } },
  ],
  webServer: {
    command: "node scripts/serve-export.mjs",
    url: "http://localhost:4173/github-portfolio/",
    reuseExistingServer: !isCI,
  },
});
