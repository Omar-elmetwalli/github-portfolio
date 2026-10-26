import Link from "next/link";
import type { ReactNode } from "react";

// Minimal, safe markdown for AI answers: paragraphs, headings, lists, bold,
// italic, inline code, and links. Builds React elements (never raw HTML).
// Site links ("/projects/...") use Next's Link so the base path is applied.

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*\s][^*]*)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) {
      const label = m[2];
      const href = m[3];
      if (href.startsWith("/") && !href.startsWith("//")) {
        out.push(
          <Link key={k} href={href} className="font-medium text-accent underline underline-offset-2">
            {label}
          </Link>
        );
      } else if (/^(https?:|mailto:)/i.test(href)) {
        out.push(
          <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-2">
            {label}
          </a>
        );
      } else out.push(label);
    } else if (m[4]) out.push(<strong key={k}>{m[5]}</strong>);
    else if (m[6]) out.push(<code key={k} className="rounded bg-surface-2 px-1 font-mono text-[0.9em]">{m[7]}</code>);
    else if (m[8]) out.push(<em key={k}>{m[9]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  let b = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const key = `b${b++}`;
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push(
        <p key={key} className="font-semibold text-ink">
          {inline(heading[2], key)}
        </p>
      );
      i++;
      continue;
    }
    if (/^\s*([-*•]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) {
        items.push(<li key={`${key}-${items.length}`}>{inline(lines[i].replace(/^\s*([-*•]|\d+[.)])\s+/, ""), `${key}-${items.length}`)}</li>);
        i++;
      }
      blocks.push(
        ordered ? (
          <ol key={key} className="list-decimal space-y-1 pl-5">
            {items}
          </ol>
        ) : (
          <ul key={key} className="list-disc space-y-1 pl-5">
            {items}
          </ul>
        )
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*([-*•]|\d+[.)])\s+/.test(lines[i]) && !/^#{1,3}\s/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key}>{inline(para.join(" "), key)}</p>);
  }
  return <div className="space-y-2.5" dir="auto">{blocks}</div>;
}
