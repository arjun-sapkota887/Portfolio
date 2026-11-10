export interface Flags {
  /** Frozen, deterministic rendering for screenshots (`?static=1`) or reduced motion. */
  static: boolean;
}

export function readFlags(search: string, reducedMotion: boolean): Flags {
  return { static: reducedMotion || new URLSearchParams(search).get('static') === '1' };
}

export const flags: Flags = readFlags(
  typeof location === 'undefined' ? '' : location.search,
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
);
