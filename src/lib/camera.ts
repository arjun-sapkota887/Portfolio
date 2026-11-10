import type { Vec3 } from './orbit';

export interface CameraPose {
  position: Vec3;
  lookAt: Vec3;
}

export const OVERVIEW: CameraPose = { position: [0, 16, 40], lookAt: [0, 0, 0] };

/**
 * Camera pose that frames a body. Planets are viewed from the sunward side,
 * offset sideways so the sun is never directly behind the camera's subject.
 */
export function focusPose(target: Vec3, size: number): CameraPose {
  const [x, y, z] = target;
  const horizontal = Math.hypot(x, z);

  if (horizontal < 1e-6) {
    return { position: [x, y + size * 0.8, z + size * 3.4], lookAt: [x, y, z] };
  }

  const distance = size * 4 + 1.5;
  const toSun: Vec3 = [-x / horizontal, 0, -z / horizontal];
  const side: Vec3 = [-toSun[2], 0, toSun[0]];
  return {
    position: [
      x + toSun[0] * distance * 0.5 + side[0] * distance * 0.8,
      y + distance * 0.35,
      z + toSun[2] * distance * 0.5 + side[2] * distance * 0.8,
    ],
    lookAt: [x, y, z],
  };
}

export function viewOffsetFor(_focused: boolean, _width: number, _height: number) {
  return { x: 0, y: 0 };
}
