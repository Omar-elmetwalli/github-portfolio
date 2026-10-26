// One-off image optimizer. Run with: pnpm optimize:images
//
// 1. Converts every PNG/JPG under public/images to a kebab-case WebP
//    (max 1920 px wide), deletes the original, and rewrites references to it
//    in data/ and src/.
// 2. Regenerates data/media.json with the width/height of every image, so
//    components can set explicit dimensions (no layout shift).
//
// Safe to re-run: already-converted files are left alone.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const IMAGES = path.join(PUBLIC, "images");
const MAX_WIDTH = 1920;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const toUrl = (abs) => "/" + path.relative(PUBLIC, abs).split(path.sep).join("/");

const kebab = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const renames = new Map();
for (const file of walk(IMAGES)) {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
  const out = path.join(path.dirname(file), kebab(path.basename(file, path.extname(file))) + ".webp");
  await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
  const before = fs.statSync(file).size;
  const after = fs.statSync(out).size;
  fs.unlinkSync(file);
  renames.set(toUrl(file), toUrl(out));
  console.log(`${toUrl(file)} -> ${toUrl(out)}  ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}

if (renames.size) {
  const sources = [...walk(path.join(ROOT, "data")), ...walk(path.join(ROOT, "src"))].filter((f) =>
    /\.(ts|tsx|json)$/.test(f)
  );
  for (const f of sources) {
    let text = fs.readFileSync(f, "utf8");
    let changed = false;
    for (const [from, to] of renames) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
    }
    if (changed) fs.writeFileSync(f, text);
  }
}

const manifest = {};
for (const file of walk(IMAGES).sort()) {
  if (!/\.(webp|png|jpe?g|svg)$/i.test(file)) continue;
  const { width, height } = await sharp(file).metadata();
  manifest[toUrl(file)] = { width, height };
}
fs.writeFileSync(path.join(ROOT, "data", "media.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote data/media.json (${Object.keys(manifest).length} images)`);
