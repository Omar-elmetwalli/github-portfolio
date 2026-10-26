// Private career tools. Local only: never part of the website or its bundle.
//
//   node scripts/career-tools.ts tailor        --job posting.txt [--role "R&D Engineer"]
//   node scripts/career-tools.ts cover-letter  --job posting.txt --company "Acme Aero" --role "CFD Engineer" [--tone formal]
//   node scripts/career-tools.ts fit           --job posting.txt
//
// --job also accepts "-" to read the posting from stdin. Output streams to the
// terminal and is saved under career-output/ (git-ignored).
// Uses AI_PROVIDER / AI_MODEL / <PROVIDER>_API_KEY from .env.local.
import fs from "node:fs";
import path from "node:path";
import { profile } from "../data/profile.ts";
import { resume } from "../data/resume.ts";
import { projects } from "../data/projects.ts";
import { awards } from "../data/awards.ts";
import { mathToPlain } from "../src/lib/math.ts";
import { complete } from "./lib/llm.ts";

const [tool, ...rest] = process.argv.slice(2);
const arg = (name: string) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};

const TOOLS = ["tailor", "cover-letter", "fit"];
if (!tool || !TOOLS.includes(tool)) {
  console.log(`Usage: node scripts/career-tools.ts <${TOOLS.join("|")}> --job <file|-> [--company X] [--role Y] [--tone Z]`);
  process.exit(1);
}

const jobPath = arg("job");
if (!jobPath) {
  console.error("Missing --job <file> (or --job - to read from stdin).");
  process.exit(1);
}
const job = (jobPath === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(jobPath, "utf8")).trim();

// Full profile, including details of confidential projects: this stays on your machine.
const background = [
  `Name: ${profile.name}. ${profile.tagline}. ${profile.availability}.`,
  `Education: ${profile.education.map((e) => `${e.degree} (${e.minor}), ${e.institution}, ${e.period}, GPA ${e.gpa} (${e.gpaNote})`).join("; ")}.`,
  `Experience:\n${resume.experience.map((e) => `- ${e.title}, ${e.company}, ${e.period}: ${e.highlights.join(" ")}`).join("\n")}`,
  `Projects:\n${projects.map((p) => `- ${p.title} (${p.date}): ${mathToPlain(p.summary)} Tools: ${p.tools.join(", ")}.`).join("\n")}`,
  `Awards: ${awards.map((a) => `${a.title}, ${a.issuer} (${a.date})`).join("; ")}.`,
  `Certifications: ${resume.certifications.map((c) => `${c.name} (${c.issuer}, ${c.date})`).join("; ")}.`,
  `Skills: ${Object.values(resume.technicalSkills).flat().join(", ")}.`,
].join("\n\n");

const RULES = `Use only facts from the candidate background. Never invent experience, numbers, dates, or skills. If the posting asks for something the background doesn't show, say so plainly instead of stretching.`;

const prompts: Record<string, { system: string; user: string }> = {
  tailor: {
    system: `You are an expert technical resume editor for aerospace, CFD, and ML roles. ${RULES}`,
    user: `Target role: ${arg("role") ?? "(see posting)"}\n\nJob posting:\n${job}\n\nCandidate background:\n${background}\n\nWrite: (1) 6-10 resume bullets tailored to this posting, strongest first, each starting with an action verb and keeping the original numbers; (2) a "Keywords" line with 8-12 terms from the posting that the background genuinely supports; (3) a "Gaps" line listing requirements not covered.`,
  },
  "cover-letter": {
    system: `You write concise, specific cover letters for early-career engineers and researchers. ${RULES}`,
    user: `Company: ${arg("company") ?? "(unknown)"}\nRole: ${arg("role") ?? "(see posting)"}\nTone: ${arg("tone") ?? "professional and direct"}\n\nJob posting:\n${job}\n\nCandidate background:\n${background}\n\nWrite a cover letter under 350 words that connects 2-3 specific projects or roles to the posting. Then, separated by a line "---", a LinkedIn connection note under 300 characters.`,
  },
  fit: {
    system: `You are a candid career advisor. ${RULES} Do not give a score or predict the outcome.`,
    user: `Job posting:\n${job}\n\nCandidate background:\n${background}\n\nList: Strengths (with the matching project or role), Gaps, Keywords to emphasize, and 3 concrete next steps to strengthen the application.`,
  },
};

const { system, user } = prompts[tool];
const text = await complete(system, [{ role: "user", content: user }], { echo: true, maxTokens: 4096 });

const dir = "career-output";
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${tool}-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.md`);
fs.writeFileSync(file, text + "\n");
console.log(`\nSaved to ${file}`);
