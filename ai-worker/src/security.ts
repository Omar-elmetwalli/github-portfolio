// CORS allow-list, per-IP rate limiting, Turnstile, and signed session tokens.

export function corsHeaders(origin: string | null, allowed: string[]): Record<string, string> {
  const ok = origin && allowed.includes(origin);
  return {
    ...(ok ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "Retry-After, X-RateLimit-Remaining",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Minimal KV interface, so tests and local dev can pass an in-memory store. */
export interface CounterStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export const memoryStore = (): CounterStore => {
  const m = new Map<string, string>();
  return { get: async (k) => m.get(k) ?? null, put: async (k, v) => void m.set(k, v) };
};

/**
 * Fixed one-hour window per IP. KV is eventually consistent, so a burst can
 * slightly exceed the limit; that is acceptable for abuse prevention here.
 */
export async function checkRateLimit(store: CounterStore, ip: string, limit: number) {
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = `rl:${ip}:${hour}`;
  const used = Number((await store.get(key)) ?? 0);
  const retryAfter = 3600 - Math.floor((Date.now() / 1000) % 3600);
  if (used >= limit) return { ok: false, remaining: 0, retryAfter };
  await store.put(key, String(used + 1), { expirationTtl: 3700 });
  return { ok: true, remaining: limit - used - 1, retryAfter };
}

export async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Issued after a passed Turnstile check so visitors aren't challenged on every message. */
export async function issueSession(secret: string, ttlSeconds = 3600) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return { token: `${exp}.${await hmac(secret, `session:${exp}`)}`, exp };
}

export async function verifySession(secret: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || exp < Date.now() / 1000 || !sig) return false;
  const expected = await hmac(secret, `session:${exp}`);
  // Constant-time compare.
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
