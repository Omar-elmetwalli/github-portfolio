"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  sublabel: string;
}

const stats: StatItem[] = [
  {
    value: 81,
    suffix: "",
    label: "Parametric RANS Cases",
    sublabel: "OpenFOAM v2306 (Camber & AoA Sweep)",
  },
  {
    value: 12000,
    suffix: "×",
    label: "PINN Speedup",
    sublabel: "< 5 ms GPU flow field reconstruction",
  },
  {
    value: 0.9992,
    suffix: "",
    decimals: 4,
    label: "GPR Surrogate R²",
    sublabel: "Multi-output aerodynamic force fidelity",
  },
  {
    value: 200,
    suffix: "+",
    label: "AIAA Branch Members",
    sublabel: "Founded Egypt's 1st Student Branch",
  },
];

export default function StatsCounter() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-12"
    >
      {stats.map((stat, idx) => (
        <StatCard key={idx} stat={stat} active={isInView} delay={idx * 150} />
      ))}
    </div>
  );
}

function StatCard({
  stat,
  active,
  delay,
}: {
  stat: StatItem;
  active: boolean;
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1600;
      const startTime = performance.now();

      function update(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease-out expo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = start + (stat.value - start) * ease;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setDisplayValue(stat.value);
        }
      }

      requestAnimationFrame(update);
    }, delay);

    return () => clearTimeout(timer);
  }, [active, stat.value, delay]);

  const formatted =
    stat.decimals !== undefined
      ? displayValue.toFixed(stat.decimals)
      : Math.floor(displayValue).toLocaleString();

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-baseline">
        <span>{formatted}</span>
        <span className="text-blue-600 dark:text-cyan-400 text-2xl font-bold ml-0.5">
          {stat.suffix}
        </span>
      </div>
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
        {stat.label}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
        {stat.sublabel}
      </div>
    </div>
  );
}
