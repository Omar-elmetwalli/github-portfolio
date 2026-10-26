// Provider-agnostic streaming text generation. Used by the worker and by the
// local scripts in ../scripts (Node runs this file directly with type stripping),
// so keep it free of Worker-only APIs.
import Anthropic from "@anthropic-ai/sdk";
import { readSse } from "./sse.ts";

/** "mock" needs no key: it echoes the retrieved sources (local dev and tests). */
export type Provider = "gemini" | "anthropic" | "openai" | "mock";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StreamOptions {
  provider: Provider;
  model: string;
  apiKey: string;
  system: string;
  messages: ChatMessage[];
  /** Output cap. On models that think, this includes reasoning tokens. */
  maxTokens: number;
  signal?: AbortSignal;
}

export class ProviderError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export const isProvider = (p: string): p is Provider => p === "gemini" || p === "anthropic" || p === "openai" || p === "mock";

/** The API-key variable each provider reads. */
export const apiKeyName: Record<Provider, string> = {
  gemini: "GEMINI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  mock: "",
};

/** Streams the model's reply as text chunks. */
export function streamText(o: StreamOptions): AsyncGenerator<string> {
  switch (o.provider) {
    case "gemini":
      return streamGemini(o);
    case "anthropic":
      return streamAnthropic(o);
    case "openai":
      return streamOpenAI(o);
    case "mock":
      return streamMock(o);
  }
}

async function failed(res: Response, who: string): Promise<never> {
  const detail = (await res.text().catch(() => "")).slice(0, 300);
  throw new ProviderError(`${who} request failed (${res.status}): ${detail}`, res.status === 429 ? 503 : 502);
}

// Gemini: models.streamGenerateContent with alt=sse.
// https://ai.google.dev/api/generate-content
async function* streamGemini(o: StreamOptions): AsyncGenerator<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(o.model)}:streamGenerateContent?alt=sse`;
  const res = await fetch(url, {
    method: "POST",
    signal: o.signal,
    headers: { "Content-Type": "application/json", "x-goog-api-key": o.apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: o.system }] },
      contents: o.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: o.maxTokens },
    }),
  });
  if (!res.ok || !res.body) return failed(res, "Gemini");
  for await (const { data } of readSse(res.body)) {
    const json = JSON.parse(data) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
      error?: { message?: string };
    };
    if (json.error) throw new ProviderError(`Gemini error: ${json.error.message ?? "unknown"}`);
    for (const part of json.candidates?.[0]?.content?.parts ?? []) {
      if (part.text && !part.thought) yield part.text;
    }
  }
}

// Claude: official SDK, streaming Messages API.
async function* streamAnthropic(o: StreamOptions): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey: o.apiKey });
  const stream = client.messages.stream(
    {
      model: o.model,
      max_tokens: o.maxTokens,
      system: o.system,
      messages: o.messages,
      // Short, factual answers: keep reasoning effort low.
      output_config: { effort: "low" },
    },
    { signal: o.signal }
  );
  try {
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") yield event.delta.text;
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") yield "\n\nI can't help with that request.";
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      throw new ProviderError(`Anthropic request failed (${err.status}): ${err.message}`, err.status === 429 ? 503 : 502);
    }
    throw err;
  }
}

// OpenAI: Responses API with stream: true.
// https://developers.openai.com/api/docs/guides/streaming-responses
async function* streamOpenAI(o: StreamOptions): AsyncGenerator<string> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: o.signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${o.apiKey}` },
    body: JSON.stringify({
      model: o.model,
      instructions: o.system,
      input: o.messages.map((m) => ({ role: m.role, content: m.content })),
      max_output_tokens: o.maxTokens,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) return failed(res, "OpenAI");
  for await (const { data } of readSse(res.body)) {
    if (data === "[DONE]") break;
    const json = JSON.parse(data) as { type?: string; delta?: string; message?: string; error?: { message?: string } };
    if (json.type === "response.output_text.delta" && json.delta) yield json.delta;
    else if (json.type === "error" || json.type === "response.failed") {
      throw new ProviderError(`OpenAI error: ${json.message ?? json.error?.message ?? "unknown"}`);
    }
  }
}

// Mock: no network. Answers with the first few retrieved sources as links,
// streamed word by word, so the UI and SSE path can be tested without a key.
async function* streamMock(o: StreamOptions): AsyncGenerator<string> {
  const sources = [...o.system.matchAll(/^\[S\d+\] (.+)\nurl: (\S+)/gm)].slice(-3); // best matches come last
  const question = o.messages[o.messages.length - 1]?.content ?? "";
  const text = [
    `(Mock answer, no model was called.) For "${question.slice(0, 80)}", the most relevant pages are:`,
    "",
    ...sources.map(([, title, url]) => `- [${title}](${url})`),
  ].join("\n");
  for (const word of text.split(/(?<=\s)/)) {
    if (o.signal?.aborted) return;
    yield word;
    await new Promise((r) => setTimeout(r, 12));
  }
}
