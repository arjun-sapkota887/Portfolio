import type { Orbit } from '../data/types';

export type Vec3 = [number, number, number];

export function orbitPosition(_orbit: Orbit, _time: number): Vec3 {
  throw new Error('not implemented');
}

export function orbitPath(_orbit: Orbit, _segments: number): Vec3[] {
  throw new Error('not implemented');
}
