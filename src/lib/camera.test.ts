import { focusPose } from './camera';
import type { Vec3 } from './orbit';

const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('focusPose', () => {
  it('looks at the target', () => {
    expect(focusPose([10, 0, 0], 1).lookAt).toEqual([10, 0, 0]);
  });

  it('frames the body at a distance proportional to its size', () => {
    const small = focusPose([10, 0, 0], 0.5);
    const big = focusPose([10, 0, 0], 2);
    expect(dist(small.position, [10, 0, 0])).toBeLessThan(dist(big.position, [10, 0, 0]));
    expect(dist(small.position, [10, 0, 0])).toBeGreaterThan(0.5 * 2);
  });

  it('views the planet from slightly above and from the sunward side so it is lit', () => {
    const { position } = focusPose([10, 0, 0], 1);
    expect(position[1]).toBeGreaterThan(0);
    expect(Math.hypot(position[0], position[2])).toBeLessThan(10);
  });

  it('frames the sun (at the origin) from the front', () => {
    const { position, lookAt } = focusPose([0, 0, 0], 3);
    expect(lookAt).toEqual([0, 0, 0]);
    expect(position[2]).toBeGreaterThan(0);
    expect(dist(position, [0, 0, 0])).toBeGreaterThan(6);
  });
});
