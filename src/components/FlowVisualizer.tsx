"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  circulation,
  liftCoefficient,
  makeAirfoil,
  mapToZ,
  mapToZeta,
  streamFunction,
  surfaceCp,
  velocity,
} from "@/lib/joukowski";

const DEG = Math.PI / 180;
const CELL = 4; // field sampling cell, CSS px
const PSI_STEP = 0.15;

type Palette = { line: string; lineStrong: string; body: string; bodyEdge: string; particle: string; low: number[]; high: number[] };

function readPalette(): Palette {
  const dark = document.documentElement.classList.contains("dark");
  return dark
    ? { line: "rgba(148,197,214,0.28)", lineStrong: "rgba(103,232,249,0.9)", body: "#0c121c", bodyEdge: "#e8eef6", particle: "rgba(232,238,246,0.9)", low: [34, 211, 238], high: [251, 191, 36] }
    : { line: "rgba(30,64,90,0.22)", lineStrong: "rgba(14,116,144,0.95)", body: "#ffffff", bodyEdge: "#0b1220", particle: "rgba(11,18,32,0.75)", low: [14, 116, 144], high: [217, 119, 6] };
}

/**
 * Hero visual: inviscid flow past a Joukowski airfoil. Colour shows the
 * pressure coefficient, lines are streamlines (contours of the stream
 * function), and particles move with the exact velocity field.
 */
export default function FlowVisualizer({ projectSlug }: { projectSlug?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLCanvasElement | null>(null);
  const flowRef = useRef<HTMLCanvasElement | null>(null);
  const alphaRef = useRef(4);
  const redrawRef = useRef<() => void>(() => {});
  const [alphaDeg, setAlphaDeg] = useState(4);
  const airfoil = useMemo(() => makeAirfoil(), []);

  const alpha = alphaDeg * DEG;
  const cl = liftCoefficient(airfoil, alpha);
  const { points: cpPoints, cpMin } = useMemo(() => surfaceCp(airfoil, alpha), [airfoil, alpha]);

  useEffect(() => {
    alphaRef.current = alphaDeg;
    redrawRef.current();
  }, [alphaDeg]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const field = fieldRef.current;
    const flow = flowRef.current;
    if (!wrap || !field || !flow) return;
    const fctx = field.getContext("2d");
    const pctx = flow.getContext("2d");
    if (!fctx || !pctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, scale = 1, cx = 0, cy = 0;
    let palette = readPalette();
    let gamma = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    type P = { x: number; y: number; age: number; life: number };
    let particles: P[] = [];

    // World <-> screen. World x spans about 6.6 units, centred on the airfoil.
    const toScreen = (x: number, y: number): [number, number] => [cx + x * scale, cy - y * scale];
    const xMin = () => -cx / scale;
    const xMax = () => (W - cx) / scale;
    const yMax = () => cy / scale;

    function layout() {
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      for (const c of [field!, flow!]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      fctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(W / 6.6, H / 3.4);
      cx = W / 2 - ((airfoil.xLE + airfoil.xTE) / 2) * scale;
      cy = H / 2;
    }

    function spawn(p?: P, anywhere = false): P {
      const yr = yMax();
      for (let tries = 0; tries < 20; tries++) {
        const x = anywhere ? xMin() + Math.random() * (xMax() - xMin()) : xMin() - Math.random() * 0.3;
        const y = (Math.random() * 2 - 1) * yr;
        if (mapToZeta(airfoil, x, y)) {
          const q = p ?? { x: 0, y: 0, age: 0, life: 0 };
          q.x = x;
          q.y = y;
          q.age = 0;
          q.life = 140 + Math.random() * 260;
          return q;
        }
      }
      return p ?? { x: xMin(), y: 0, age: 0, life: 200 };
    }

    function drawField() {
      const a = alphaRef.current * DEG;
      gamma = circulation(airfoil, a);
      const gw = Math.ceil(W / CELL) + 1;
      const gh = Math.ceil(H / CELL) + 1;
      const psi = new Float32Array(gw * gh);
      const img = new ImageData(gw, gh);
      const { low, high } = palette;
      for (let j = 0; j < gh; j++) {
        for (let i = 0; i < gw; i++) {
          const x = (i * CELL - cx) / scale;
          const y = (cy - j * CELL) / scale;
          const k = j * gw + i;
          const zeta = mapToZeta(airfoil, x, y);
          if (!zeta) {
            psi[k] = NaN;
            continue;
          }
          psi[k] = streamFunction(airfoil, a, gamma, zeta[0], zeta[1]);
          const [u, v] = velocity(airfoil, a, gamma, zeta[0], zeta[1]);
          const cp = Math.max(-3, Math.min(1, 1 - (u * u + v * v)));
          const c = cp < 0 ? low : high;
          const s = cp < 0 ? Math.min(1, -cp / 1.6) : cp;
          img.data[k * 4] = c[0];
          img.data[k * 4 + 1] = c[1];
          img.data[k * 4 + 2] = c[2];
          img.data[k * 4 + 3] = Math.round(Math.pow(s, 1.1) * 115);
        }
      }

      fctx!.clearRect(0, 0, W, H);
      // Pressure field, upscaled smoothly.
      const small = document.createElement("canvas");
      small.width = gw;
      small.height = gh;
      small.getContext("2d")!.putImageData(img, 0, 0);
      fctx!.imageSmoothingEnabled = true;
      fctx!.drawImage(small, 0, 0, gw * CELL, gh * CELL);

      // Streamlines: marching squares on psi, levels offset from the body streamline.
      const psiBody = (gamma / (2 * Math.PI)) * Math.log(airfoil.R);
      const normal = new Path2D();
      const dividing = new Path2D();
      const lerp = (v0: number, v1: number, lv: number) => (lv - v0) / (v1 - v0);
      for (let j = 0; j < gh - 1; j++) {
        for (let i = 0; i < gw - 1; i++) {
          const tl = psi[j * gw + i], tr = psi[j * gw + i + 1];
          const bl = psi[(j + 1) * gw + i], br = psi[(j + 1) * gw + i + 1];
          if (Number.isNaN(tl) || Number.isNaN(tr) || Number.isNaN(bl) || Number.isNaN(br)) continue;
          const lo = Math.min(tl, tr, bl, br), hi = Math.max(tl, tr, bl, br);
          const k0 = Math.ceil((lo - psiBody) / PSI_STEP), k1 = Math.floor((hi - psiBody) / PSI_STEP);
          for (let k = k0; k <= k1; k++) {
            const lv = psiBody + k * PSI_STEP;
            const x0 = i * CELL, y0 = j * CELL;
            const pts: [number, number][] = [];
            if ((tl < lv) !== (tr < lv)) pts.push([x0 + lerp(tl, tr, lv) * CELL, y0]);
            if ((tr < lv) !== (br < lv)) pts.push([x0 + CELL, y0 + lerp(tr, br, lv) * CELL]);
            if ((bl < lv) !== (br < lv)) pts.push([x0 + lerp(bl, br, lv) * CELL, y0 + CELL]);
            if ((tl < lv) !== (bl < lv)) pts.push([x0, y0 + lerp(tl, bl, lv) * CELL]);
            const path = k === 0 ? dividing : normal;
            for (let m = 0; m + 1 < pts.length; m += 2) {
              path.moveTo(pts[m][0], pts[m][1]);
              path.lineTo(pts[m + 1][0], pts[m + 1][1]);
            }
          }
        }
      }
      fctx!.lineWidth = 1;
      fctx!.strokeStyle = palette.line;
      fctx!.stroke(normal);
      fctx!.lineWidth = 1.6;
      fctx!.strokeStyle = palette.lineStrong;
      fctx!.stroke(dividing);

      // Airfoil body.
      const body = new Path2D();
      for (let k = 0; k <= 240; k++) {
        const t = (2 * Math.PI * k) / 240;
        const [x, y] = mapToZ(airfoil.mux + airfoil.R * Math.cos(t), airfoil.muy + airfoil.R * Math.sin(t));
        const [sx, sy] = toScreen(x, y);
        if (k === 0) body.moveTo(sx, sy);
        else body.lineTo(sx, sy);
      }
      body.closePath();
      fctx!.fillStyle = palette.body;
      fctx!.fill(body);
      fctx!.lineWidth = 1.5;
      fctx!.strokeStyle = palette.bodyEdge;
      fctx!.stroke(body);
    }

    function step() {
      const a = alphaRef.current * DEG;
      // Fade old trails.
      pctx!.globalCompositeOperation = "destination-out";
      pctx!.fillStyle = "rgba(0,0,0,0.14)";
      pctx!.fillRect(0, 0, W, H);
      pctx!.globalCompositeOperation = "source-over";
      pctx!.strokeStyle = palette.particle;
      pctx!.lineWidth = 1.2;
      pctx!.beginPath();
      const dt = 0.022;
      for (const p of particles) {
        const z0 = mapToZeta(airfoil, p.x, p.y);
        if (!z0) {
          spawn(p);
          continue;
        }
        const [u0, v0] = velocity(airfoil, a, gamma, z0[0], z0[1]);
        const mx = p.x + 0.5 * dt * u0, my = p.y + 0.5 * dt * v0;
        const zm = mapToZeta(airfoil, mx, my);
        const [u, v] = zm ? velocity(airfoil, a, gamma, zm[0], zm[1]) : [u0, v0];
        const sp = Math.hypot(u, v);
        const k = sp > 3 ? 3 / sp : 1;
        const nx = p.x + dt * u * k, ny = p.y + dt * v * k;
        const [sx0, sy0] = toScreen(p.x, p.y);
        const [sx1, sy1] = toScreen(nx, ny);
        pctx!.moveTo(sx0, sy0);
        pctx!.lineTo(sx1, sy1);
        p.x = nx;
        p.y = ny;
        p.age++;
        if (p.x > xMax() + 0.2 || Math.abs(p.y) > yMax() + 0.2 || p.age > p.life || !mapToZeta(airfoil, p.x, p.y)) {
          spawn(p, Math.random() < 0.5);
        }
      }
      pctx!.stroke();
    }

    function loop() {
      if (!visible) {
        running = false;
        return;
      }
      step();
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (reduced || running || !visible) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }

    function resetParticles() {
      const count = Math.round(Math.min(320, (W * H) / 1400));
      particles = Array.from({ length: count }, () => spawn(undefined, true));
      pctx!.clearRect(0, 0, W, H);
    }

    let pending = 0;
    redrawRef.current = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(drawField);
    };

    layout();
    drawField();
    resetParticles();
    start();

    const resize = new ResizeObserver(() => {
      layout();
      drawField();
      resetParticles();
    });
    resize.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      start();
    });
    io.observe(wrap);

    const onVisibility = () => {
      visible = !document.hidden;
      start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const themeWatch = new MutationObserver(() => {
      palette = readPalette();
      drawField();
      pctx!.clearRect(0, 0, W, H);
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      resize.disconnect();
      io.disconnect();
      themeWatch.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      redrawRef.current = () => {};
    };
  }, [airfoil]);

  // -Cp vs x/c mini plot (SVG, 0..1 on x, -Cp from -1 to 3 on y).
  const plotW = 160, plotH = 72;
  const cpPath = cpPoints
    .map(([x, cp], i) => {
      const px = 4 + x * (plotW - 8);
      const py = plotH - 4 - ((Math.max(-1, Math.min(3, -cp)) + 1) / 4) * (plotH - 8);
      return `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  const zeroY = plotH - 4 - (1 / 4) * (plotH - 8);

  return (
    <figure className="card overflow-hidden">
      <div ref={wrapRef} className="relative aspect-[16/10] w-full bg-surface">
        <canvas ref={fieldRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <canvas ref={flowRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <span className="absolute left-3 top-3 rounded-sm bg-surface/85 px-2 py-1 text-eyebrow text-subtle backdrop-blur">
          Fig. 1 · Potential flow
        </span>
      </div>

      <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-3">
          <label htmlFor="aoa" className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
            <span>Angle of attack</span>
            <span className="font-mono tabular-nums text-accent">α = {alphaDeg.toFixed(1)}°</span>
          </label>
          <input
            id="aoa"
            type="range"
            min={-6}
            max={14}
            step={0.5}
            value={alphaDeg}
            onChange={(e) => setAlphaDeg(Number(e.target.value))}
            aria-valuetext={`${alphaDeg.toFixed(1)} degrees, lift coefficient ${cl.toFixed(2)}`}
            className="w-full accent-[var(--accent)]"
          />
          <dl className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="rounded-md bg-surface-2 px-2 py-1.5">
              <dt className="text-subtle">C<sub>l</sub></dt>
              <dd className="text-base font-semibold tabular-nums text-ink">{cl.toFixed(2)}</dd>
            </div>
            <div className="rounded-md bg-surface-2 px-2 py-1.5">
              <dt className="text-subtle">C<sub>p,min</sub></dt>
              <dd className="text-base font-semibold tabular-nums text-ink">{cpMin.toFixed(2)}</dd>
            </div>
            <div className="rounded-md bg-surface-2 px-2 py-1.5">
              <dt className="text-subtle">Profile</dt>
              <dd className="text-sm font-semibold leading-6 tabular-nums text-ink" title="Thickness / camber, as % of chord">
                {Math.round(airfoil.thickness * 100)}/{(airfoil.camber * 100).toFixed(1)}
                <span className="sr-only"> percent thickness and camber</span>
              </dd>
            </div>
          </dl>
        </div>
        <div className="hidden sm:block" aria-hidden="true">
          <p className="mb-1 font-mono text-[11px] text-subtle">−C<sub>p</sub> vs x/c</p>
          <svg width={plotW} height={plotH} className="text-accent">
            <rect x="0.5" y="0.5" width={plotW - 1} height={plotH - 1} rx="6" fill="none" stroke="var(--line)" />
            <line x1="4" x2={plotW - 4} y1={zeroY} y2={zeroY} stroke="var(--line-strong)" strokeDasharray="3 3" />
            <path d={cpPath} fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <figcaption className="border-t border-line px-4 py-3 text-xs leading-relaxed text-subtle">
        Inviscid flow past a Joukowski airfoil, solved live in your browser by conformal mapping. Circulation is set by
        the Kutta condition; colour shows the pressure coefficient (blue: suction, amber: stagnation).
        {projectSlug && (
          <>
            {" "}
            <Link href={`/projects/${projectSlug}/`} className="font-medium text-accent hover:underline">
              Related project →
            </Link>
          </>
        )}
      </figcaption>
    </figure>
  );
}
