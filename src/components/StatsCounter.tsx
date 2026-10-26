"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "../../data/profile";

const format = (value: number, decimals?: number) =>
  decimals !== undefined
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");

/**
 * The static HTML always contains the final numbers (for crawlers, link
 * previews, and no-JS visitors). On the client, the count-up runs only when the
 * stats scroll into view after load, and never with reduced motion.
 */
export default function StatsCounter({ stats }: { stats: Stat[] }) {
  const containerRef = useRef<HTMLDListElement | null>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Already visible on load: keep the final values, no animation.
        if (first) {
          first = false;
          if (entry.isIntersecting) {
            observer.disconnect();
            return;
          }
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          setProgress(t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl ref={containerRef} className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col border-line px-4 py-5 text-left even:border-l lg:border-l lg:first:border-l-0 [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0"
        >
          <dt className="order-2 mt-1 text-sm font-medium text-ink">{stat.label}</dt>
          <dd className="order-1 font-mono text-3xl font-semibold tracking-tight text-ink tabular-nums md:text-4xl">
            {format(stat.value * progress, stat.decimals)}
            {stat.suffix && <span className="text-accent text-2xl ml-0.5">{stat.suffix}</span>}
          </dd>
          <dd className="order-3 text-xs text-subtle mt-0.5">{stat.sublabel}</dd>
        </div>
      ))}
    </dl>
  );
}
