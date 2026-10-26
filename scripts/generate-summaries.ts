// Generates plain-language project overviews for the Overview/Technical toggle
// and writes them to data/summaries.json with "reviewed": false.
// Nothing goes live until you set "reviewed": true on an entry.
//
//   node scripts/generate-summaries.ts            # only projects without an entry
//   node scripts/generate-summaries.ts --force    # regenerate all
//   node scripts/generate-summaries.ts --only <slug>
//
// Uses AI_PROVIDER / AI_MODEL / <PROVIDER>_API_KEY from .env.local.
import fs from "node:fs";
import { getPublicProjects } from "../data/projects.ts";
import { mathToPlain } from "../src/lib/math.ts";
import { complete, llmConfig } from "./lib/llm.ts";

const FILE = "data/summaries.json";

interface PlainSummary {
  text: string;
  reviewed: boolean;
  model: string;
  generatedAt: string;
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : undefined;

const SYSTEM = `You write plain-language overviews of engineering research projects for a personal academic website.
Readers are smart non-specialists (recruiters, admissions staff, students in other fields).
Rules:
- 80 to 120 words, one or two short paragraphs, plain text (no markdown, no headings, no bullet points).
- Use only facts in the project text. Do not add numbers, results, collaborators, or claims that are not there. You may leave numbers out.
- Explain what was studied, how, and why it matters, avoiding jargon or briefly explaining any term you keep.
- Third person ("Omar built..."), factual, no hype words like "groundbreaking" or "cutting-edge".`;

const existing: Record<string, PlainSummary> = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : {};
const { provider, model } = llmConfig();
const out: Record<string, PlainSummary> = { ...existing };
let made = 0;

for (const p of getPublicProjects()) {
  if (only && p.slug !== only) continue;
  if (!force && !only && existing[p.slug]) continue;
  const body = [
    `Title: ${p.title}`,
    `Date: ${p.date}`,
    `Summary: ${mathToPlain(p.summary)}`,
    ...p.sections.map((s) => `${s.title}: ${mathToPlain(s.content)}`),
    `Tools: ${p.tools.join(", ")}`,
  ].join("\n\n");
  process.stdout.write(`- ${p.slug} ... `);
  try {
    const text = await complete(SYSTEM, [{ role: "user", content: `Project text:\n\n${body}` }], { maxTokens: 2048 });
    out[p.slug] = { text, reviewed: false, model: `${provider}:${model}`, generatedAt: new Date().toISOString().slice(0, 10) };
    made++;
    console.log(`${text.split(/\s+/).length} words`);
  } catch (err) {
    console.log(`failed: ${(err as Error).message}`);
  }
}

const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(FILE, JSON.stringify(sorted, null, 2) + "\n");
console.log(`\nWrote ${made} summaries to ${FILE}. Review each one, then set "reviewed": true to publish it.`);
