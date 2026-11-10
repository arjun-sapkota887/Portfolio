import { damp, easeInOutCubic } from './easing';

describe('easeInOutCubic', () => {
  it('maps 0, 0.5 and 1 to themselves', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('starts slow and ends slow', () => {
    expect(easeInOutCubic(0.1)).toBeLessThan(0.1);
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.9);
  });

  it('clamps input outside [0, 1]', () => {
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(2)).toBe(1);
  });
});

describe('damp', () => {
  it('does not move when no time passes', () => {
    expect(damp(0, 10, 4, 0)).toBe(0);
  });

  it('moves toward the target and converges', () => {
    const step = damp(0, 10, 4, 1 / 60);
    expect(step).toBeGreaterThan(0);
    expect(step).toBeLessThan(10);
    expect(damp(0, 10, 4, 10)).toBeCloseTo(10, 5);
  });

  it('is frame-rate independent', () => {
    let a = 0;
    for (let i = 0; i < 2; i++) a = damp(a, 10, 4, 1 / 60);
    expect(a).toBeCloseTo(damp(0, 10, 4, 2 / 60), 10);
  });
});
