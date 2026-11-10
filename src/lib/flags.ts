export interface Flags {
  /** Frozen, deterministic rendering for screenshots (`?static=1`) or reduced motion. */
  static: boolean;
}

export function readFlags(_search: string, _reducedMotion: boolean): Flags {
  throw new Error('not implemented');
}
