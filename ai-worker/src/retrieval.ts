// Keyword retrieval (BM25) over the site's knowledge chunks.

export interface KnowledgeChunk {
  id: string;
  title: string;
  url: string;
  text: string;
  core?: boolean;
}

export interface KnowledgeBase {
  generatedAt: string;
  owner: string;
  chunks: KnowledgeChunk[];
}

const STOP = new Set(
  "a an and are as at be but by can did do does for from has have he his how i in is it its me my of on or our s so that the their them they this to was what when where which who why will with you your omar omar's elmetwalli".split(" ")
);

export const tokenize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));

export const hasArabic = (text: string) => /[؀-ۿ]/.test(text);

export class Bm25Index {
  private docs: { chunk: KnowledgeChunk; tf: Map<string, number>; len: number }[];
  private df = new Map<string, number>();
  private avgLen: number;

  constructor(chunks: KnowledgeChunk[]) {
    this.docs = chunks.map((chunk) => {
      // Titles count double: they name the project or role.
      const tokens = [...tokenize(chunk.title), ...tokenize(chunk.title), ...tokenize(chunk.text)];
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
      return { chunk, tf, len: tokens.length };
    });
    this.avgLen = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(1, this.docs.length);
  }

  search(query: string, k: number): { chunk: KnowledgeChunk; score: number }[] {
    const terms = [...new Set(tokenize(query))];
    const N = this.docs.length;
    const k1 = 1.4;
    const b = 0.75;
    return this.docs
      .map((d) => {
        let score = 0;
        for (const t of terms) {
          const f = d.tf.get(t);
          if (!f) continue;
          const df = this.df.get(t) ?? 0;
          const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
          score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / this.avgLen)));
        }
        return { chunk: d.chunk, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b2) => b2.score - a.score)
      .slice(0, k);
  }
}

/**
 * Picks the chunks to send with a question: always the core chunks, then the
 * best BM25 matches. Arabic questions (no English keyword overlap) get every
 * overview chunk instead, so the model can still answer from the whole site.
 */
export function selectContext(kb: KnowledgeBase, index: Bm25Index, query: string, k: number): KnowledgeChunk[] {
  const picked = new Map<string, KnowledgeChunk>();
  for (const c of kb.chunks) if (c.core) picked.set(c.id, c);
  if (hasArabic(query)) {
    for (const c of kb.chunks) if (!/-s\d+$/.test(c.id)) picked.set(c.id, c);
  }
  for (const { chunk } of index.search(query, k)) picked.set(chunk.id, chunk);
  return [...picked.values()];
}

export const formatContext = (chunks: KnowledgeChunk[]) =>
  chunks.map((c, i) => `[S${i + 1}] ${c.title}\nurl: ${c.url}\n${c.text}`).join("\n\n");
