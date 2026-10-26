"use client";

import { AI_ENDPOINT, TURNSTILE_SITE_KEY } from "./aiConfig";
import { getTurnstileToken } from "./turnstile";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export class AiError extends Error {
  code: string;
  constructor(message: string, code = "error") {
    super(message);
    this.code = code;
  }
}

const SESSION_KEY = "ai-session";

function readSession(): string | undefined {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return undefined;
    const { token, exp } = JSON.parse(raw) as { token: string; exp: number };
    return exp * 1000 > Date.now() + 30_000 ? token : undefined;
  } catch {
    return undefined;
  }
}

function saveSession(s: { token: string; exp: number }) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    // Without storage the visitor is just verified again next time.
  }
}

/**
 * Sends a question to the AI worker and streams the answer through `onText`.
 * Handles the Turnstile check on first use. Resolves when the stream ends.
 */
export async function streamAi(opts: {
  mode: "chat" | "fit";
  messages: AiMessage[];
  onText: (chunk: string) => void;
  turnstileContainer?: HTMLElement | null;
  signal?: AbortSignal;
}): Promise<void> {
  const session = readSession();
  let turnstileToken: string | undefined;
  if (!session && TURNSTILE_SITE_KEY && opts.turnstileContainer) {
    turnstileToken = await getTurnstileToken(opts.turnstileContainer);
  }

  let res: Response;
  try {
    res = await fetch(`${AI_ENDPOINT}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: opts.mode, messages: opts.messages, session, turnstileToken }),
      signal: opts.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new AiError("Couldn't reach the assistant. Check your connection and try again.", "network");
  }

  if (!res.ok || !res.body) {
    const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
    if (data.code === "turnstile") {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
    }
    throw new AiError(data.error ?? "The assistant is unavailable right now.", data.code ?? String(res.status));
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) >= 0) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      let event = "message";
      let data = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;
      const payload = JSON.parse(data);
      if (event === "session") saveSession(payload);
      else if (event === "error") throw new AiError(payload.message ?? "Something went wrong.", "stream");
      else if (event === "done") return;
      else if (typeof payload.text === "string") opts.onText(payload.text);
    }
  }
}
