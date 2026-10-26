// Post-build fix for Next 16 static export: prefetch segment files are written
// as nested folders (cv/__next.cv/__PAGE__.txt) but the client requests the
// dotted name (cv/__next.cv.__PAGE__.txt), which 404s on GitHub Pages. This
// copies each nested file to its dotted name. Runs as part of `pnpm build`.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let copied = 0;

function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) flatten(full, dir, entry.name);
    else visit(full);
  }
}

function flatten(dir, target, prefix) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(full, target, name);
    else {
      const dest = path.join(target, name);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(full, dest);
        copied++;
      }
    }
  }
}

if (fs.existsSync(OUT)) {
  visit(OUT);
  console.log(`fix-export-segments: added ${copied} prefetch files`);
}
