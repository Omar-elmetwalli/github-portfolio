// Cloudflare Worker: AI proxy for the portfolio site (chat + fit check).
//
// POST /chat   { mode: "chat" | "fit", messages: [{role, content}], turnstileToken?, session? }
//   -> text/event-stream:
//        event: session  data: {"token": "...", "exp": 1730000000}   (after a passed Turnstile check)
//        data: {"text": "..."}                                       (reply chunks)
//        event: error    data: {"message": "..."}
//        event: done     data: {}
//   Errors before streaming starts are JSON: { error: "...", code: "..." }.
// GET /health  -> { ok: true, provider, model }

import { apiKeyName, isProvider, ProviderError, streamText, type ChatMessage } from "./providers.ts";
import { Bm25Index, formatContext, selectContext, type KnowledgeBase } from "./retrieval.ts";
import { chatSystem, fitSystem } from "./prompts.ts";
import { checkRateLimit, corsHeaders, issueSession, memoryStore, verifySession, verifyTurnstile, type CounterStore } from "./security.ts";
import { sseEvent } from "./sse.ts";

export interface Env {
  AI_PROVIDER: string;
  AI_MODEL: string;
  ALLOWED_ORIGINS: string;
  KNOWLEDGE_URL: string;
  RATE_LIMIT_PER_HOUR?: string;
  MAX_INPUT_CHARS?: string;
  MAX_FIT_INPUT_CHARS?: string;
  MAX_OUTPUT_TOKENS?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  SESSION_SECRET?: string;
  TURNSTILE_SECRET?: string;
  RATE_LIMIT?: CounterStore;
}

const MAX_HISTORY = 8; // messages kept from the conversation
const KB_TTL_MS = 10 * 60 * 1000;

let kbCache: { kb: KnowledgeBase; index: Bm25Index; at: number; url: string } | null = null;
const fallbackStore = memoryStore();

async function loadKnowledge(url: string) {
  if (kbCache && kbCache.url === url && Date.now() - kbCache.at < KB_TTL_MS) return kbCache;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    if (kbCache) return kbCache; // serve stale rather than fail
    throw new ProviderError(`Could not load knowledge base (${res.status})`, 503);
  }
  const kb = (await res.json()) as KnowledgeBase;
  kbCache = { kb, index: new Bm25Index(kb.chunks), at: Date.now(), url };
  return kbCache;
}

const num = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) ? Number(v) : d);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
    const cors = corsHeaders(origin, allowed);
    const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
      Response.json(body, { status, headers: { ...cors, ...extra } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    if (url.pathname === "/health") {
      return json({ ok: true, provider: env.AI_PROVIDER, model: env.AI_MODEL });
    }
    if (url.pathname !== "/chat" || request.method !== "POST") return json({ error: "Not found" }, 404);

    // Browsers only: the Origin must be on the allow-list.
    if (!origin || !allowed.includes(origin)) return json({ error: "Origin not allowed", code: "origin" }, 403);

    const provider = env.AI_PROVIDER;
    if (!isProvider(provider)) return json({ error: "Server misconfigured: AI_PROVIDER", code: "config" }, 500);
    const apiKey = provider === "mock" ? "mock" : env[apiKeyName[provider] as "GEMINI_API_KEY" | "ANTHROPIC_API_KEY" | "OPENAI_API_KEY"];
    if (!apiKey) return json({ error: `Server misconfigured: ${apiKeyName[provider]} is not set`, code: "config" }, 500);

    let body: { mode?: string; messages?: unknown; turnstileToken?: string; session?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON", code: "input" }, 400);
    }

    const mode = body.mode === "fit" ? "fit" : "chat";
    const maxChars = mode === "fit" ? num(env.MAX_FIT_INPUT_CHARS, 6000) : num(env.MAX_INPUT_CHARS, 1500);
    const raw = Array.isArray(body.messages) ? body.messages : [];
    const messages: ChatMessage[] = raw
      .filter(
        (m): m is ChatMessage =>
          !!m && typeof m === "object" && ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") && typeof (m as ChatMessage).content === "string"
      )
      .slice(mode === "fit" ? -1 : -MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.trim() }));
    // Conversations must start with the visitor and end with their new message.
    while (messages.length && messages[0].role !== "user") messages.shift();
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || !last.content) return json({ error: "Empty question", code: "input" }, 400);
    if (last.content.length > maxChars) {
      return json({ error: `Please keep it under ${maxChars} characters.`, code: "too_long" }, 413);
    }
    for (const m of messages) m.content = m.content.slice(0, maxChars * 2);

    const ip = request.headers.get("CF-Connecting-IP") ?? "local";

    // Bot check on first use, then a signed session token for an hour.
    let newSession: { token: string; exp: number } | null = null;
    if (env.TURNSTILE_SECRET) {
      const secret = env.SESSION_SECRET ?? "";
      if (secret.length < 32) return json({ error: "Server misconfigured: SESSION_SECRET", code: "config" }, 500);
      const sessionOk = await verifySession(secret, body.session);
      if (!sessionOk) {
        if (!body.turnstileToken || !(await verifyTurnstile(env.TURNSTILE_SECRET, body.turnstileToken, ip))) {
          return json({ error: "Please complete the verification check.", code: "turnstile" }, 403);
        }
        newSession = await issueSession(secret);
      }
    }

    // If KV is unavailable (e.g. the free tier's daily write quota is used up), fail open.
    const limit = await checkRateLimit(env.RATE_LIMIT ?? fallbackStore, ip, num(env.RATE_LIMIT_PER_HOUR, 20)).catch((err) => {
      console.error("Rate limit store failed", err);
      return { ok: true, remaining: -1, retryAfter: 0 };
    });
    if (!limit.ok) {
      return json(
        { error: "You've reached the hourly question limit. Please try again later or contact Omar directly.", code: "rate_limited" },
        429,
        { "Retry-After": String(limit.retryAfter) }
      );
    }

    let system: string;
    try {
      const { kb, index } = await loadKnowledge(env.KNOWLEDGE_URL);
      // Retrieve on the latest question plus a little recent context for follow-ups.
      const query = mode === "fit" ? last.content : messages.slice(-3).map((m) => m.content).join("\n");
      const context = formatContext(selectContext(kb, index, query, mode === "fit" ? 10 : 6));
      system = mode === "fit" ? fitSystem(kb.owner, context) : chatSystem(kb.owner, context);
    } catch (err) {
      return json({ error: "The assistant is temporarily unavailable.", code: "knowledge" }, err instanceof ProviderError ? err.status : 503);
    }

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const write = (s: string) => writer.write(encoder.encode(s));

    const run = async () => {
      try {
        if (newSession) await write(sseEvent(newSession, "session"));
        for await (const text of streamText({
          provider,
          model: env.AI_MODEL,
          apiKey,
          system,
          messages,
          maxTokens: num(env.MAX_OUTPUT_TOKENS, 1024),
          signal: request.signal,
        })) {
          await write(sseEvent({ text }));
        }
        await write(sseEvent({}, "done"));
      } catch (err) {
        console.error("AI stream failed", err);
        await write(sseEvent({ message: "Something went wrong while generating the answer. Please try again." }, "error")).catch(() => {});
      } finally {
        await writer.close().catch(() => {});
      }
    };
    // Keep streaming after the handler returns.
    ctx.waitUntil(run());

    return new Response(readable, {
      headers: {
        ...cors,
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  },
};
