// Inlined at build time. When the endpoint is unset, every AI element hides.
const raw = (process.env.NEXT_PUBLIC_AI_ENDPOINT ?? "").trim().replace(/\/+$/, "");
/** Only an absolute http(s) URL turns the AI features on; anything else (e.g. a stale relative path) leaves them off. */
export const AI_ENDPOINT = /^https?:\/\/[^\s]+$/.test(raw) ? raw : "";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const aiEnabled = AI_ENDPOINT.length > 0;
