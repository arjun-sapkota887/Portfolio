// @vitest-environment node
import { parseCli } from './cli.mjs';

describe('parseCli', () => {
  it('parses checkpoint with number, slug and summary', () => {
    expect(parseCli(['checkpoint', '2', 'content', 'Content', 'model'])).toEqual({
      command: 'checkpoint',
      number: 2,
      slug: 'content',
      summary: 'Content model',
    });
  });

  it('defaults the checkpoint summary to the slug', () => {
    expect(parseCli(['checkpoint', '3', 'orbit-math'])).toMatchObject({ summary: 'orbit-math' });
  });

  it('parses list', () => {
    expect(parseCli(['list'])).toEqual({ command: 'list' });
  });

  it('parses rollback as a dry run by default', () => {
    expect(parseCli(['rollback', 'phase-1-x'])).toEqual({
      command: 'rollback',
      tag: 'phase-1-x',
      mode: 'dry-run',
    });
  });

  it('maps --yes to revert and --hard to hard', () => {
    expect(parseCli(['rollback', 'phase-1-x', '--yes'])).toMatchObject({ mode: 'revert' });
    expect(parseCli(['rollback', '--hard', 'phase-1-x'])).toMatchObject({ mode: 'hard' });
  });

  it('parses restore', () => {
    expect(parseCli(['restore', 'phase-1-x'])).toEqual({ command: 'restore', tag: 'phase-1-x' });
  });

  it('throws a usage error for missing arguments or unknown commands', () => {
    expect(() => parseCli([])).toThrow(/usage/i);
    expect(() => parseCli(['checkpoint', 'x', 'slug'])).toThrow(/usage/i);
    expect(() => parseCli(['rollback'])).toThrow(/usage/i);
    expect(() => parseCli(['restore'])).toThrow(/usage/i);
    expect(() => parseCli(['explode'])).toThrow(/usage/i);
  });
});
