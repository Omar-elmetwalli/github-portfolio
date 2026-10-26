// Inviscid flow past a Joukowski airfoil.
//
// A circle of radius R centred at mu in the zeta-plane maps to an airfoil in
// the z-plane through z = zeta + 1/zeta. The circle passes through zeta = 1,
// which becomes the sharp trailing edge. Circulation Gamma is fixed by the
// Kutta condition (finite velocity at the trailing edge):
//   Gamma = 4 pi U R sin(alpha + beta),  beta = -arg(1 - mu)
// Complex potential (U = 1):
//   w(zeta) = (zeta - mu) e^{-i alpha} + R^2 e^{i alpha} / (zeta - mu) + i Gamma/(2 pi) ln(zeta - mu)

export interface Airfoil {
  mux: number;
  muy: number;
  R: number;
  beta: number;
  /** Chord and leading/trailing-edge x positions in the z-plane. */
  chord: number;
  xLE: number;
  xTE: number;
  thickness: number; // t/c
  camber: number; // max camber / c
}

export function makeAirfoil(mux = -0.08, muy = 0.09): Airfoil {
  const R = Math.hypot(1 - mux, -muy);
  const beta = -Math.atan2(-muy, 1 - mux);
  // Sample the surface to measure chord, thickness, and camber.
  const n = 720;
  const pts: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    const t = (2 * Math.PI * k) / n;
    pts.push(mapToZ(mux + R * Math.cos(t), muy + R * Math.sin(t)));
  }
  const xs = pts.map((p) => p[0]);
  const xLE = Math.min(...xs);
  const xTE = Math.max(...xs);
  const chord = xTE - xLE;
  let thickness = 0;
  let camber = 0;
  const bins = 60;
  for (let b = 1; b < bins; b++) {
    const x = xLE + (chord * b) / bins;
    const ys = pts.filter((p) => Math.abs(p[0] - x) < chord / (bins * 1.5)).map((p) => p[1]);
    if (ys.length < 2) continue;
    const top = Math.max(...ys);
    const bot = Math.min(...ys);
    thickness = Math.max(thickness, top - bot);
    camber = Math.max(camber, (top + bot) / 2);
  }
  return { mux, muy, R, beta, chord, xLE, xTE, thickness: thickness / chord, camber: camber / chord };
}

/** z = zeta + 1/zeta */
export function mapToZ(zr: number, zi: number): [number, number] {
  const d = zr * zr + zi * zi;
  return [zr + zr / d, zi - zi / d];
}

export const circulation = (a: Airfoil, alpha: number) => 4 * Math.PI * a.R * Math.sin(alpha + a.beta);

/** Lift coefficient from Kutta–Joukowski: Cl = 2 Gamma / (U c). */
export const liftCoefficient = (a: Airfoil, alpha: number) => (2 * circulation(a, alpha)) / a.chord;

/**
 * Inverse map z -> zeta, choosing the branch outside the circle.
 * Returns null when the point is inside the airfoil.
 */
export function mapToZeta(a: Airfoil, x: number, y: number): [number, number] | null {
  // s = sqrt(z^2 - 4)
  const re = x * x - y * y - 4;
  const im = 2 * x * y;
  const mod = Math.hypot(re, im);
  let sr = Math.sqrt((mod + re) / 2);
  let si = Math.sqrt(Math.max(0, (mod - re) / 2));
  if (im < 0) si = -si;
  const z1r = (x + sr) / 2, z1i = (y + si) / 2;
  sr = -sr;
  si = -si;
  const z2r = (x + sr) / 2, z2i = (y + si) / 2;
  const d1 = Math.hypot(z1r - a.mux, z1i - a.muy);
  const d2 = Math.hypot(z2r - a.mux, z2i - a.muy);
  const [zr, zi, d] = d1 >= d2 ? [z1r, z1i, d1] : [z2r, z2i, d2];
  return d < a.R ? null : [zr, zi];
}

/** Stream function psi at zeta. */
export function streamFunction(a: Airfoil, alpha: number, gamma: number, zr: number, zi: number) {
  const xr = zr - a.mux;
  const xi = zi - a.muy;
  const r2 = xr * xr + xi * xi;
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);
  // Im[(X) e^{-ia}] = xi ca - xr sa ; Im[R^2 e^{ia} / X] = R^2 (sa xr - ca xi) / r2
  return xi * ca - xr * sa + (a.R * a.R * (sa * xr - ca * xi)) / r2 + (gamma / (2 * Math.PI)) * 0.5 * Math.log(r2);
}

/** Velocity (u, v) in the z-plane at the point whose preimage is zeta. */
export function velocity(a: Airfoil, alpha: number, gamma: number, zr: number, zi: number): [number, number] {
  const xr = zr - a.mux;
  const xi = zi - a.muy;
  const r2 = xr * xr + xi * xi;
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);
  // 1/X^2
  const inv2r = (xr * xr - xi * xi) / (r2 * r2);
  const inv2i = (-2 * xr * xi) / (r2 * r2);
  const R2 = a.R * a.R;
  // W = e^{-ia} - R^2 e^{ia} / X^2 + i G / (2 pi X)
  let wr = ca - R2 * (ca * inv2r - sa * inv2i);
  let wi = -sa - R2 * (ca * inv2i + sa * inv2r);
  const g = gamma / (2 * Math.PI);
  wr += (g * xi) / r2; // i g / X = i g conj(X)/r2 = g (xi + i xr) / r2
  wi += (g * xr) / r2;
  // dz/dzeta = 1 - 1/zeta^2
  const q2 = zr * zr + zi * zi;
  const jr = 1 - (zr * zr - zi * zi) / (q2 * q2);
  const ji = (2 * zr * zi) / (q2 * q2);
  const jd = jr * jr + ji * ji;
  if (jd < 1e-6) return [0, 0];
  // (u - iv) = W / J
  const ur = (wr * jr + wi * ji) / jd;
  const ui = (wi * jr - wr * ji) / jd;
  return [ur, -ui];
}

/** Surface Cp around the airfoil as (x/c, Cp) pairs, plus the minimum Cp. */
export function surfaceCp(a: Airfoil, alpha: number, samples = 160) {
  const gamma = circulation(a, alpha);
  const thetaTE = Math.atan2(-a.muy, 1 - a.mux);
  const points: [number, number][] = [];
  let cpMin = Infinity;
  for (let k = 1; k < samples; k++) {
    const t = thetaTE + (2 * Math.PI * k) / samples;
    const zr = a.mux + a.R * 1.0005 * Math.cos(t);
    const zi = a.muy + a.R * 1.0005 * Math.sin(t);
    const [u, v] = velocity(a, alpha, gamma, zr, zi);
    const cp = 1 - (u * u + v * v);
    const [x] = mapToZ(zr, zi);
    points.push([(x - a.xLE) / a.chord, cp]);
    cpMin = Math.min(cpMin, cp);
  }
  return { points, cpMin };
}
