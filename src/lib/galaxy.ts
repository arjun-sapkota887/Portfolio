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

export function galaxyPoints(_options: GalaxyOptions): GalaxyPoints {
  throw new Error('not implemented');
}
