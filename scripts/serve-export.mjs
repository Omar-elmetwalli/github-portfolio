// Serves the static export (out/) under /github-portfolio/, the same way
// GitHub Pages does. Run `pnpm build` first, then `pnpm preview`.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const BASE = "/github-portfolio";
const OUT = path.resolve("out");
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (url === "/" || url === BASE) {
      res.writeHead(302, { Location: `${BASE}/` }).end();
      return;
    }
    if (!url.startsWith(`${BASE}/`)) {
      res.writeHead(404).end("Not found");
      return;
    }
    let file = path.join(OUT, url.slice(BASE.length));
    if (!file.startsWith(OUT)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      fs.createReadStream(path.join(OUT, "404.html")).pipe(res);
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
