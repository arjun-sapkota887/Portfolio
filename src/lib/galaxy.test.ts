import { galaxyPoints } from './galaxy';

const options = { count: 5000, radius: 30, arms: 4, seed: 3 };

const radii = (positions: Float32Array) => {
  const out: number[] = [];
  for (let i = 0; i < positions.length; i += 3)
    out.push(Math.hypot(positions[i], positions[i + 2]));
  return out;
};

describe('galaxyPoints', () => {
  it('returns xyz, rgb and size per particle', () => {
    const g = galaxyPoints(options);
    expect(g.positions).toHaveLength(options.count * 3);
    expect(g.colors).toHaveLength(options.count * 3);
    expect(g.sizes).toHaveLength(options.count);
  });

  it('is deterministic for a seed', () => {
    expect(galaxyPoints(options).positions).toEqual(galaxyPoints(options).positions);
    expect(galaxyPoints({ ...options, seed: 4 }).positions).not.toEqual(
      galaxyPoints(options).positions,
    );
  });

  it('keeps particles within the radius and close to a thin disk', () => {
    const g = galaxyPoints(options);
    for (const r of radii(g.positions)) expect(r).toBeLessThanOrEqual(options.radius * 1.3);
    for (let i = 1; i < g.positions.length; i += 3)
      expect(Math.abs(g.positions[i])).toBeLessThan(options.radius * 0.15);
  });

  it('is densest at the core', () => {
    const r = radii(galaxyPoints(options).positions);
    const inner = r.filter((d) => d < options.radius * 0.25).length;
    const outer = r.filter((d) => d > options.radius * 0.75).length;
    expect(inner).toBeGreaterThan(outer * 2);
  });

  it('colours the core warmer than the rim', () => {
    const g = galaxyPoints(options);
    const r = radii(g.positions);
    const warmth = (pick: (d: number) => boolean) => {
      let sum = 0;
      let n = 0;
      r.forEach((d, i) => {
        if (!pick(d)) return;
        sum += g.colors[i * 3] - g.colors[i * 3 + 2];
        n++;
      });
      return sum / n;
    };
    expect(warmth((d) => d < options.radius * 0.15)).toBeGreaterThan(
      warmth((d) => d > options.radius * 0.7),
    );
  });
});
