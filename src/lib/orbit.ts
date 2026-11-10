import type { Orbit } from '../data/types';

export type Vec3 = [number, number, number];

/**
 * Position on an elliptical orbit with the sun at one focus.
 * Angle advances uniformly with time (eccentric anomaly), counter-clockwise
 * when seen from +y, and the plane is tilted about the x axis by `inclination`.
 */
export function orbitPosition(orbit: Orbit, time: number): Vec3 {
  const { radius: a, eccentricity: e, period, inclination, phase } = orbit;
  const angle = phase + (2 * Math.PI * time) / period;
  const b = a * Math.sqrt(1 - e * e);

  const x = a * (Math.cos(angle) - e);
  const planeZ = -b * Math.sin(angle);
  return [x, -planeZ * Math.sin(inclination), planeZ * Math.cos(inclination)];
}

/** Closed loop of `segments + 1` points tracing the orbit, starting at angle 0. */
export function orbitPath(orbit: Orbit, segments: number): Vec3[] {
  if (segments < 3) throw new Error('orbitPath needs at least 3 segments');
  const unphased = { ...orbit, phase: 0 };
  return Array.from({ length: segments + 1 }, (_, i) =>
    orbitPosition(unphased, (orbit.period * i) / segments),
  );
}
