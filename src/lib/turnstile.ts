"use client";

import { TURNSTILE_SITE_KEY } from "./aiConfig";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

let loading: Promise<Turnstile> | null = null;

function loadScript(): Promise<Turnstile> {
  const w = window as unknown as { turnstile?: Turnstile };
  if (w.turnstile) return Promise.resolve(w.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => (w.turnstile ? resolve(w.turnstile) : reject(new Error("Turnstile failed to load")));
    s.onerror = () => {
      loading = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/**
 * Runs a Cloudflare Turnstile check in `container` and resolves with its token.
 * Usually invisible; it shows a checkbox only when Cloudflare needs one.
 * Resolves with "" when no site key is configured (local development).
 */
export async function getTurnstileToken(container: HTMLElement): Promise<string> {
  if (!TURNSTILE_SITE_KEY) return "";
  const ts = await loadScript();
  return new Promise((resolve, reject) => {
    const id = ts.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: "interaction-only",
      callback: (token: string) => {
        resolve(token);
        setTimeout(() => ts.remove(id), 0);
      },
      "error-callback": () => reject(new Error("Verification failed. Please try again.")),
      "expired-callback": () => reject(new Error("Verification expired. Please try again.")),
    });
  });
}
