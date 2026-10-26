// Project text can contain inline math between $...$ (LaTeX) and a literal
// dollar sign written as \$. These helpers split and simplify that text.

export type MathPart = { type: "text" | "math"; value: string };

/** Splits "a $x^2$ b" into text and math parts. "\$" stays a literal "$". */
export function splitMath(input: string): MathPart[] {
  const parts: MathPart[] = [];
  let buf = "";
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === "\\" && input[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }
    if (ch === "$") {
      const close = input.indexOf("$", i + 1);
      if (close > i + 1) {
        if (buf) parts.push({ type: "text", value: buf });
        parts.push({ type: "math", value: input.slice(i + 1, close) });
        buf = "";
        i = close + 1;
        continue;
      }
    }
    buf += ch;
    i++;
  }
  if (buf) parts.push({ type: "text", value: buf });
  return parts;
}

const SYMBOLS: Record<string, string> = {
  alpha: "α", beta: "β", gamma: "γ", Gamma: "Γ", delta: "δ", Delta: "Δ", epsilon: "ε",
  zeta: "ζ", eta: "η", theta: "θ", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", pi: "π",
  rho: "ρ", sigma: "σ", tau: "τ", phi: "φ", psi: "ψ", omega: "ω", Omega: "Ω",
  pm: "±", times: "×", approx: "≈", infty: "∞", circ: "°", cdot: "·", le: "≤", ge: "≥",
  partial: "∂", nabla: "∇",
};

/** Turns LaTeX into readable plain text (for cards, meta tags, and the AI knowledge base). */
export function mathToPlain(input: string): string {
  return splitMath(input)
    .map((p) =>
      p.type === "text"
        ? p.value
        : p.value
            .replace(/\\([A-Za-z]+)/g, (m, name: string) => SYMBOLS[name] ?? name)
            .replace(/\^\\?circ/g, "°")
            .replace(/[{}]/g, "")
            .replace(/\s+/g, " ")
            .trim()
    )
    .join("");
}
