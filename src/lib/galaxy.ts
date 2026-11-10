import { mulberry32 } from './random';

export interface GalaxyOptions {
  count: number;
  radius: number;
  arms: number;
  seed: number;
}

export interface GalaxyPoints {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
}

const CORE: [number, number, number] = [1, 0.85, 0.62];
const RIM: [number, number, number] = [0.45, 0.55, 1];
const NEBULA: [number, number, number] = [1, 0.45, 0.7];
const SPIN = 0.22;

/** Particles on logarithmic-ish spiral arms: dense warm core, cool blue rim, pink star-forming knots. */
export function galaxyPoints({ count, radius, arms, seed }: GalaxyOptions): GalaxyPoints {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = rand() ** 1.8;
    const r = t * radius;
    const angle = ((i % arms) / arms) * Math.PI * 2 + r * SPIN;
    const spread = 0.35 * (1 - t * 0.5);
    const scatter = () => (rand() - 0.5) * 2 * rand() ** 3 * radius * spread;

    positions[i * 3] = Math.cos(angle) * r + scatter();
    positions[i * 3 + 1] = scatter() * 0.12 * (1 - t);
    positions[i * 3 + 2] = Math.sin(angle) * r + scatter();

    const base = rand() < 0.04 && t > 0.3 ? NEBULA : RIM;
    const mix = Math.min(1, t * 1.4);
    for (let c = 0; c < 3; c++) colors[i * 3 + c] = CORE[c] + (base[c] - CORE[c]) * mix;
    sizes[i] = 0.4 + rand() ** 3 * 1.6 + (1 - t) * 0.6;
  }

  return { positions, colors, sizes };
}
