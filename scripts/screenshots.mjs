// Captures review screenshots of the static export with the locally installed
// Chrome (no browser download). Run `pnpm build` first, then:
//   node scripts/screenshots.mjs [outDir]
// Also reports horizontal overflow and console errors per page/viewport.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const OUT = path.resolve(process.argv[2] ?? "screenshots");
const PORT = 4179;
const BASE = `http://localhost:${PORT}/github-portfolio`;
const pages = [
  { name: "home", path: "/" },
  { name: "project", path: "/projects/openfoam-parametric-airfoil-study/" },
];
const viewports = [
  { name: "mobile", width: 360, height: 780 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];
const themes = ["light", "dark"];

fs.mkdirSync(OUT, { recursive: true });
const server = spawn(process.execPath, ["scripts/serve-export.mjs"], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch({ channel: "chrome" });
const report = [];
try {
  for (const vp of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
      await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
      for (const pg of pages) {
        const page = await context.newPage();
        const errors = [];
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(BASE + pg.path, { waitUntil: "networkidle" });
        // Reveal all scroll-in content so full-page shots aren't blank.
        await page.evaluate(async () => {
          document.querySelectorAll("[data-reveal]").forEach((e) => e.setAttribute("data-revealed", ""));
          // Load lazy images too, so full-page shots show everything.
          const imgs = [...document.images];
          imgs.forEach((img) => (img.loading = "eager"));
          await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
        });
        // Scroll through once so lazy images are painted, then return to the top.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
          await Promise.all([...document.images].map((img) => img.decode().catch(() => null)));
        });
        await page.waitForTimeout(1200);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        const file = `${pg.name}-${vp.name}-${theme}`;
        await page.screenshot({ path: path.join(OUT, `${file}.png`) });
        await page.screenshot({ path: path.join(OUT, `${file}-full.png`), fullPage: true });
        report.push({ shot: file, overflowPx: overflow, consoleErrors: errors.length, firstError: errors[0] });
        await page.close();
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}
console.table(report);
