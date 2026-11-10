import type { Orbit } from '../data/types';
import { orbitPath, orbitPosition, type Vec3 } from './orbit';

const circle: Orbit = { radius: 10, period: 40, eccentricity: 0, inclination: 0, phase: 0 };

const expectVec = (actual: Vec3, expected: Vec3) =>
  actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 6));

const length = ([x, y, z]: Vec3) => Math.hypot(x, y, z);

describe('orbitPosition', () => {
  it('starts on the +x axis at t=0 with no phase', () => {
    expectVec(orbitPosition(circle, 0), [10, 0, 0]);
  });

  it('moves a quarter turn in a quarter period (counter-clockwise seen from above)', () => {
    expectVec(orbitPosition(circle, 10), [0, 0, -10]);
  });

  it('applies the starting phase', () => {
    expectVec(orbitPosition({ ...circle, phase: Math.PI }, 0), [-10, 0, 0]);
  });

  it('is periodic', () => {
    expectVec(orbitPosition(circle, 53), orbitPosition(circle, 53 + circle.period));
  });

  it('places the sun at a focus for eccentric orbits', () => {
    const ellipse = { ...circle, eccentricity: 0.5 };
    expectVec(orbitPosition(ellipse, 0), [5, 0, 0]); // perihelion a(1-e)
    expectVec(orbitPosition(ellipse, 20), [-15, 0, 0]); // aphelion  a(1+e)
  });

  it('tilts the orbital plane by the inclination without changing distance', () => {
    const tilted = { ...circle, inclination: Math.PI / 6 };
    const p = orbitPosition(tilted, 10);
    expect(p[1]).toBeCloseTo(10 * Math.sin(Math.PI / 6), 6);
    expect(length(p)).toBeCloseTo(10, 6);
  });
});

describe('orbitPath', () => {
  it('returns segments + 1 points forming a closed loop', () => {
    const path = orbitPath(circle, 64);
    expect(path).toHaveLength(65);
    expectVec(path[0], path[64]);
  });

  it('traces the same ellipse as orbitPosition', () => {
    const ellipse = { ...circle, eccentricity: 0.3, inclination: 0.2, phase: 1 };
    const path = orbitPath(ellipse, 4);
    expectVec(path[1], orbitPosition({ ...ellipse, phase: 0 }, ellipse.period / 4));
  });

  it('rejects fewer than 3 segments', () => {
    expect(() => orbitPath(circle, 2)).toThrow(/segments/);
  });
});
