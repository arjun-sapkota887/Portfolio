import { readFlags } from './flags';

describe('readFlags', () => {
  it('is animated by default', () => {
    expect(readFlags('', false)).toEqual({ static: false });
  });

  it('enables static mode with ?static=1', () => {
    expect(readFlags('?static=1', false).static).toBe(true);
    expect(readFlags('?foo=bar&static=1', false).static).toBe(true);
    expect(readFlags('?static=0', false).static).toBe(false);
  });

  it('enables static mode when the user prefers reduced motion', () => {
    expect(readFlags('', true).static).toBe(true);
  });
});
