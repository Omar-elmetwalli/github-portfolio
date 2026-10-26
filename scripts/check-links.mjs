// Checks every internal link in the static export (pages, anchors, PDFs,
// images, videos, scripts, styles) and every url in the AI knowledge base.
// Run after `pnpm build`. Exits with code 1 on any broken link.
//
//   node scripts/check-links.mjs           # internal links only
//   node scripts/check-links.mjs --external  # also HEAD-check external links (slow, network)
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const BASE = "/github-portfolio";
const SITE = "https://omar-elmetwalli.github.io";
const checkExternal = process.argv.includes("--external");

if (!fs.existsSync(OUT)) {
  console.error("out/ not found. Run `pnpm build` first.");
  process.exit(1);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html"));
const idsCache = new Map();

/** Resolves a site path (without the base path) to a file in out/, or null. */
function resolveFile(sitePath) {
  const clean = decodeURIComponent(sitePath.split(/[?#]/)[0]);
  const candidates = [clean, path.posix.join(clean, "index.html"), `${clean}.html`];
  for (const c of candidates) {
    const f = path.join(OUT, c);
    if (f.startsWith(OUT) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

function idsOf(file) {
  if (!idsCache.has(file)) {
    const html = fs.readFileSync(file, "utf8");
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

const broken = [];
const external = new Set();
let checked = 0;

function checkSitePath(sitePath, from) {
  checked++;
  const [pathPart, hash] = sitePath.split("#");
  const target = pathPart ? resolveFile(pathPart) : from;
  if (!target) return broken.push({ from, link: sitePath, reason: "file not found" });
  if (hash && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(hash))) {
    broken.push({ from, link: sitePath, reason: `no element with id="${hash}"` });
  }
}

for (const file of htmlFiles) {
  const rel = path.relative(OUT, file);
  const html = fs.readFileSync(file, "utf8");
  const urls = [];
  for (const m of html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) urls.push(m[1]);
  // <meta content="..."> only matters when it is a URL (og:image, canonical-like values).
  for (const m of html.matchAll(/\scontent="((?:https?:\/\/|\/)[^"]+)"/g)) urls.push(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) urls.push(...m[1].split(",").map((s) => s.trim().split(/\s+/)[0]));

  for (let raw of urls) {
    raw = raw.replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|data:|javascript:|blob:)/i.test(raw)) continue;
    if (raw.startsWith(`${SITE}${BASE}`)) raw = raw.slice(SITE.length);
    if (/^https?:\/\//i.test(raw)) {
      external.add(raw);
      continue;
    }
    if (raw.startsWith("#")) {
      if (raw.length > 1 && !idsOf(file).has(decodeURIComponent(raw.slice(1)))) broken.push({ from: rel, link: raw, reason: "missing anchor" });
      checked++;
      continue;
    }
    if (!raw.startsWith("/")) continue; // meta content text, relative refs we don't emit
    if (!raw.startsWith(`${BASE}/`) && raw !== BASE) {
      broken.push({ from: rel, link: raw, reason: `missing base path ${BASE}` });
      continue;
    }
    checkSitePath(raw.slice(BASE.length) || "/", file);
  }
}

// Links the AI assistant may cite (knowledge base urls are site paths without the base path).
const kbFile = path.join(OUT, "ai", "knowledge.json");
if (fs.existsSync(kbFile)) {
  const kb = JSON.parse(fs.readFileSync(kbFile, "utf8"));
  for (const c of kb.chunks) checkSitePath(c.url, `knowledge.json#${c.id}`);
} else {
  broken.push({ from: "build", link: "/ai/knowledge.json", reason: "knowledge base missing" });
}

// Sitemap entries must exist.
const sitemap = path.join(OUT, "sitemap.xml");
if (fs.existsSync(sitemap)) {
  for (const m of fs.readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    checkSitePath(m[1].replace(`${SITE}${BASE}`, "") || "/", "sitemap.xml");
  }
}

if (checkExternal) {
  for (const url of external) {
    try {
      // Some hosts mishandle HEAD; fall back to GET.
      const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10_000) }).catch(() =>
        fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15_000) })
      );
      if (res.status >= 400 && res.status !== 405 && res.status !== 403 && res.status !== 999) {
        broken.push({ from: "external", link: url, reason: `HTTP ${res.status}` });
      }
    } catch (err) {
      broken.push({ from: "external", link: url, reason: err.message });
    }
  }
}

const unique = [...new Map(broken.map((b) => [`${b.link}|${b.reason}`, b])).values()];
console.log(`Checked ${checked} internal links in ${htmlFiles.length} pages${checkExternal ? ` and ${external.size} external links` : ` (${external.size} external links skipped)`}.`);
if (unique.length) {
  console.error(`\n${unique.length} broken link(s):`);
  for (const b of unique) console.error(`  ${b.link}  <- ${path.isAbsolute(b.from) ? path.relative(OUT, b.from) : b.from}  (${b.reason})`);
  process.exit(1);
}
console.log("No broken links.");
