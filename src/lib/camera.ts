import type { Vec3 } from './orbit';

export interface CameraPose {
  position: Vec3;
  lookAt: Vec3;
}

export const OVERVIEW: CameraPose = { position: [0, 16, 40], lookAt: [0, 0, 0] };

export function focusPose(_target: Vec3, _size: number): CameraPose {
  throw new Error('not implemented');
}
