// Shared model access for local scripts. Reuses the worker's provider code.
// Needs the worker's dependencies: pnpm --dir ai-worker install
import { apiKeyName, isProvider, streamText, type ChatMessage, type Provider } from "../../ai-worker/src/providers.ts";
import { loadEnv } from "./env.ts";

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-3.8-flash",
  anthropic: "claude-haiku-5-5",
  openai: "gpt-6-luna",
  mock: "mock",
};

/** Provider/model from AI_PROVIDER / AI_MODEL (in .env.local), defaulting to Gemini. */
export function llmConfig() {
  loadEnv();
  const provider = process.env.AI_PROVIDER ?? "gemini";
  if (!isProvider(provider)) throw new Error(`AI_PROVIDER must be gemini, anthropic, or openai (got "${provider}")`);
  const apiKey = provider === "mock" ? "mock" : process.env[apiKeyName[provider]];
  if (!apiKey) throw new Error(`Set ${apiKeyName[provider]} in .env.local`);
  return { provider, apiKey, model: process.env.AI_MODEL ?? DEFAULT_MODEL[provider] };
}

/** Runs one prompt and returns the full text, echoing it to stdout if asked. */
export async function complete(system: string, messages: ChatMessage[], opts: { maxTokens?: number; echo?: boolean } = {}) {
  const cfg = llmConfig();
  let out = "";
  for await (const chunk of streamText({ ...cfg, system, messages, maxTokens: opts.maxTokens ?? 4096 })) {
    out += chunk;
    if (opts.echo) process.stdout.write(chunk);
  }
  if (opts.echo) process.stdout.write("\n");
  return out.trim();
}
