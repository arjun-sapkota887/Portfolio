import { mulberry32 } from './random';

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 5 }, a);
    const seqB = Array.from({ length: 5 }, b);
    expect(seqA).toEqual(seqB);
  });

  it('differs between seeds', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  it('produces values in [0, 1) with a sensible spread', () => {
    const rand = mulberry32(7);
    const values = Array.from({ length: 10_000 }, rand);
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThan(1);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
  });
});
