// Local admin for the portfolio. Run: pnpm admin  ->  http://localhost:4321
//
// Edits the JSON content in data/content/, uploads files into public/
// (images become WebP), runs checks, and publishes with git commit + push.
// Listens on 127.0.0.1 only and never becomes part of the website.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";

// Don't keep uploaded files open (Windows would block replacing or deleting them).
sharp.cache(false);

const ROOT = process.cwd();
const PORT = Number(process.env.ADMIN_PORT) || 4321;
const PUBLIC = path.join(ROOT, "public");
const MEDIA_JSON = path.join(ROOT, "data", "media.json");
const UI = path.join(ROOT, "scripts", "admin", "index.html");
const MAX_UPLOAD = 60 * 1024 * 1024;

/** Editable content files: name -> file on disk. */
const FILES = {
  projects: "data/content/projects.json",
  profile: "data/content/profile.json",
  resume: "data/content/resume.json",
  leadership: "data/content/leadership.json",
  awards: "data/content/awards.json",
  publications: "data/content/publications.json",
  summaries: "data/summaries.json",
};

const CATEGORIES = [
  "Scientific ML",
  "Fluid Mechanics & CFD",
  "Aerodynamics & Propulsion",
  "Dynamics & Controls",
  "Mechanical Design & Manufacturing",
  "Software & Computing",
];

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const send = (res, status, body, type = "application/json; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const readBody = (req, limit = 5 * 1024 * 1024) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error(`Upload too large (max ${Math.round(limit / 1048576)} MB)`));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

/** Resolves a path inside public/ and refuses anything that escapes it. */
function publicPath(rel) {
  const full = path.resolve(PUBLIC, rel.replace(/^\/+/, ""));
  if (full !== PUBLIC && !full.startsWith(PUBLIC + path.sep)) throw new Error("Path outside public/");
  return full;
}

const toUrl = (abs) => "/" + path.relative(PUBLIC, abs).split(path.sep).join("/");

/** Checks content before saving. Returns a list of human-readable problems. */
function validate(name, data) {
  const problems = [];
  const fileExists = (p) => typeof p !== "string" || !p.startsWith("/") || fs.existsSync(publicPath(p));
  if (name === "projects") {
    if (!Array.isArray(data)) return ["Projects must be a list."];
    const slugs = new Set();
    data.forEach((p, i) => {
      const where = `Project ${i + 1} (${p.title || "untitled"})`;
      if (!p.slug || p.slug !== kebab(p.slug)) problems.push(`${where}: slug must be lowercase-with-dashes (e.g. "${kebab(p.title || "my-project")}").`);
      if (slugs.has(p.slug)) problems.push(`${where}: slug "${p.slug}" is used twice.`);
      slugs.add(p.slug);
      if (!p.title) problems.push(`${where}: title is required.`);
      if (!p.summary) problems.push(`${where}: summary is required.`);
      if (!Array.isArray(p.categories) || p.categories.length === 0) problems.push(`${where}: pick at least one category.`);
      for (const c of p.categories ?? []) if (!CATEGORIES.includes(c)) problems.push(`${where}: unknown category "${c}".`);
      if (p.confidential && !p.publicSummary) problems.push(`${where}: confidential projects need a public summary.`);
      for (const g of p.gallery ?? []) if (!fileExists(g)) problems.push(`${where}: gallery file not found: ${g}`);
      for (const [k, v] of Object.entries(p.links ?? {})) if (!k.endsWith("Title") && !fileExists(v)) problems.push(`${where}: link "${k}" points to a missing file: ${v}`);
    });
  }
  if (name === "leadership" && Array.isArray(data)) {
    for (const r of data) for (const g of r.gallery ?? []) if (!fileExists(g.src)) problems.push(`Leadership gallery file not found: ${g.src}`);
  }
  if (name === "resume" && data?.pdfPath && !fileExists(data.pdfPath)) problems.push(`CV PDF not found: ${data.pdfPath}`);
  return problems;
}

async function updateMediaJson(absFiles) {
  const media = fs.existsSync(MEDIA_JSON) ? JSON.parse(fs.readFileSync(MEDIA_JSON, "utf8")) : {};
  for (const f of absFiles) {
    if (!/\.(webp|png|jpe?g|svg)$/i.test(f)) continue;
    const { width, height } = await sharp(f).metadata();
    media[toUrl(f)] = { width, height };
  }
  const sorted = Object.fromEntries(Object.entries(media).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MEDIA_JSON, JSON.stringify(sorted, null, 2) + "\n");
}

/** Runs a command and resolves with { code, output }. Only fixed commands are ever run. */
function run(cmd, args) {
  return new Promise((resolve) => {
    // pnpm is a .cmd shim on Windows and needs a shell; git does not (so messages pass through untouched).
    const child = spawn(cmd, args, { cwd: ROOT, shell: process.platform === "win32" && cmd === "pnpm", env: process.env });
    let output = "";
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    child.on("close", (code) => resolve({ code, output: output.slice(-20000) }));
  });
}

async function handle(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Only this admin page may call the API (blocks other websites in your browser).
  const origin = req.headers.origin;
  if (req.method !== "GET" && origin && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return send(res, 403, { error: "Forbidden origin" });
  }

  if (req.method === "GET" && url.pathname === "/") {
    return send(res, 200, fs.readFileSync(UI), "text/html; charset=utf-8");
  }

  // Serve public/ files so the admin can show thumbnails.
  if (req.method === "GET" && url.pathname.startsWith("/public/")) {
    const file = publicPath(decodeURIComponent(url.pathname.slice("/public".length)));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, { error: "Not found" });
    const ext = path.extname(file).toLowerCase();
    const types = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".mp4": "video/mp4" };
    return send(res, 200, fs.readFileSync(file), types[ext] ?? "application/octet-stream");
  }

  if (req.method === "GET" && url.pathname === "/api/meta") {
    const status = await run("git", ["status", "--short"]);
    return send(res, 200, { files: Object.keys(FILES), categories: CATEGORIES, gitStatus: status.output.trim() });
  }

  const contentMatch = /^\/api\/content\/([a-z]+)$/.exec(url.pathname);
  if (contentMatch) {
    const name = contentMatch[1];
    if (!FILES[name]) return send(res, 404, { error: "Unknown content file" });
    const file = path.join(ROOT, FILES[name]);
    if (req.method === "GET") return send(res, 200, fs.readFileSync(file, "utf8"));
    if (req.method === "PUT") {
      let data;
      try {
        data = JSON.parse((await readBody(req)).toString("utf8"));
      } catch {
        return send(res, 400, { error: "Invalid JSON" });
      }
      const problems = validate(name, data);
      if (problems.length) return send(res, 422, { error: "Please fix these first", problems });
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
      return send(res, 200, { ok: true });
    }
  }

  // POST /api/upload?dir=images/projects/my-slug&name=photo.png  (body = file bytes)
  if (req.method === "POST" && url.pathname === "/api/upload") {
    const dir = url.searchParams.get("dir") ?? "";
    const name = url.searchParams.get("name") ?? "";
    if (!/^(images|files)(\/[a-z0-9-]+)*$/.test(dir)) return send(res, 400, { error: "Folder must be under images/ or files/, lowercase-with-dashes" });
    const ext = path.extname(name).toLowerCase();
    if (!/^\.(png|jpe?g|webp|gif|svg|pdf|mp4|webm|txt|m)$/.test(ext)) return send(res, 400, { error: `File type ${ext || "(none)"} not allowed` });
    const base = kebab(path.basename(name, path.extname(name))) || "file";
    const body = await readBody(req, MAX_UPLOAD).catch((e) => e);
    if (body instanceof Error) return send(res, 413, { error: body.message });
    const folder = publicPath(dir);
    fs.mkdirSync(folder, { recursive: true });
    let out;
    if (/^\.(png|jpe?g)$/.test(ext)) {
      out = path.join(folder, `${base}.webp`);
      await sharp(body).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
    } else {
      // PDFs keep underscores-or-dashes names readable; everything else kebab-case.
      out = path.join(folder, `${base}${ext}`);
      fs.writeFileSync(out, body);
    }
    await updateMediaJson([out]);
    return send(res, 200, { path: toUrl(out), bytes: fs.statSync(out).size });
  }

  // Checks: typecheck, production build, link check.
  if (req.method === "POST" && url.pathname === "/api/check") {
    const steps = [
      ["pnpm", ["typecheck"]],
      ["pnpm", ["build"]],
      ["pnpm", ["check:links"]],
    ];
    let log = "";
    for (const [cmd, args] of steps) {
      const r = await run(cmd, args);
      log += `\n$ ${cmd} ${args.join(" ")}\n${r.output}`;
      if (r.code !== 0) return send(res, 200, { ok: false, log });
    }
    return send(res, 200, { ok: true, log });
  }

  // Publish: commit content + uploads, then push (GitHub Actions deploys).
  if (req.method === "POST" && url.pathname === "/api/publish") {
    const { message = "Update site content" } = JSON.parse((await readBody(req)).toString("utf8") || "{}");
    const msg = String(message).slice(0, 200).replace(/[\r\n]+/g, " ") || "Update site content";
    let log = "";
    const add = await run("git", ["add", "data", "public"]);
    log += add.output;
    const diff = await run("git", ["diff", "--cached", "--quiet"]);
    if (diff.code === 0) return send(res, 200, { ok: false, log: "Nothing to publish: no changes in data/ or public/." });
    const commit = await run("git", ["commit", "-m", msg]);
    log += `\n$ git commit\n${commit.output}`;
    if (commit.code !== 0) return send(res, 200, { ok: false, log });
    const push = await run("git", ["push"]);
    log += `\n$ git push\n${push.output}`;
    return send(res, 200, { ok: push.code === 0, log });
  }

  return send(res, 404, { error: "Not found" });
}

http
  .createServer((req, res) =>
    handle(req, res).catch((err) => {
      console.error(err);
      send(res, 500, { error: err.message });
    })
  )
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Portfolio admin: http://localhost:${PORT}`);
    console.log("Tip: run `pnpm dev` in another terminal to preview changes at http://localhost:3000");
  });
