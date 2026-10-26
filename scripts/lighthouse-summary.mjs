// Prints category scores and failing audits from Lighthouse JSON reports.
//   node scripts/lighthouse-summary.mjs lighthouse/home.json [more.json...]
import fs from "node:fs";

for (const file of process.argv.slice(2)) {
  const r = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`\n${file} (${r.configSettings.formFactor})`);
  console.log(Object.values(r.categories).map((c) => `${c.title}: ${Math.round(c.score * 100)}`).join(" | "));
  const m = (id) => r.audits[id]?.displayValue ?? "-";
  console.log(`FCP ${m("first-contentful-paint")} · LCP ${m("largest-contentful-paint")} · TBT ${m("total-blocking-time")} · CLS ${m("cumulative-layout-shift")} · SI ${m("speed-index")}`);
  const failing = Object.values(r.categories)
    .flatMap((c) => c.auditRefs.filter((a) => a.weight > 0 || c.id !== "performance").map((a) => r.audits[a.id]))
    .filter((a) => a && a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable");
  for (const a of [...new Map(failing.map((a) => [a.id, a])).values()]) {
    console.log(`  ✗ ${a.id} (${Math.round(a.score * 100)}): ${a.title}${a.displayValue ? ` — ${a.displayValue}` : ""}`);
  }
}
