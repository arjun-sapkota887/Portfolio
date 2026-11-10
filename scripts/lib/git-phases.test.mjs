// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  checkpoint,
  createGit,
  isClean,
  listPhases,
  planRollback,
  restore,
  rollback,
} from './git-phases.mjs';

let dir;
let git;

const sh = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
const write = (file, content) => writeFileSync(join(dir, file), content);
const read = (file) => readFileSync(join(dir, file), 'utf8');
const commit = (file, content, message) => {
  write(file, content);
  sh('add', '-A');
  sh('commit', '-q', '-m', message);
};
const pass = () => true;
const fail = () => false;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'git-phases-'));
  sh('init', '-q', '-b', 'main');
  sh('config', 'user.email', 'test@example.com');
  sh('config', 'user.name', 'Test');
  sh('config', 'commit.gpgsign', 'false');
  sh('config', 'tag.gpgsign', 'false');
  commit('a.txt', 'v0', 'initial');
  git = createGit(dir);
});

afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('isClean', () => {
  it('is true for a clean tree and false with uncommitted changes', () => {
    expect(isClean(git)).toBe(true);
    write('a.txt', 'dirty');
    expect(isClean(git)).toBe(false);
  });

  it('treats untracked files as dirty', () => {
    write('new.txt', 'x');
    expect(isClean(git)).toBe(false);
  });
});

describe('checkpoint', () => {
  it('creates an annotated phase tag on HEAD', () => {
    const tag = checkpoint({ git, verify: pass, number: 1, slug: 'rollback-tools', summary: 'Tools' });
    expect(tag).toBe('phase-1-rollback-tools');
    expect(sh('cat-file', '-t', tag)).toBe('tag');
    expect(sh('rev-list', '-n', '1', tag)).toBe(sh('rev-parse', 'HEAD'));
    expect(sh('tag', '-l', tag, '-n1')).toContain('Tools');
  });

  it('refuses when the working tree is dirty', () => {
    write('a.txt', 'dirty');
    expect(() => checkpoint({ git, verify: pass, number: 1, slug: 'x', summary: 's' })).toThrow(
      /working tree is not clean/i,
    );
    expect(sh('tag', '-l')).toBe('');
  });

  it('refuses when verification fails', () => {
    expect(() => checkpoint({ git, verify: fail, number: 1, slug: 'x', summary: 's' })).toThrow(
      /verify failed/i,
    );
    expect(sh('tag', '-l')).toBe('');
  });

  it('does not run verify when the tree is dirty', () => {
    const verify = vi.fn(pass);
    write('a.txt', 'dirty');
    expect(() => checkpoint({ git, verify, number: 1, slug: 'x', summary: 's' })).toThrow();
    expect(verify).not.toHaveBeenCalled();
  });

  it('rejects invalid phase numbers and slugs', () => {
    expect(() => checkpoint({ git, verify: pass, number: -1, slug: 'x', summary: 's' })).toThrow(
      /phase number/i,
    );
    expect(() => checkpoint({ git, verify: pass, number: 1, slug: 'Bad Slug', summary: 's' })).toThrow(
      /slug/i,
    );
  });

  it('refuses to overwrite an existing tag', () => {
    checkpoint({ git, verify: pass, number: 1, slug: 'x', summary: 's' });
    expect(() => checkpoint({ git, verify: pass, number: 1, slug: 'x', summary: 's' })).toThrow(
      /already exists/i,
    );
  });
});

describe('listPhases', () => {
  it('returns phase tags sorted numerically with commit and summary', () => {
    checkpoint({ git, verify: pass, number: 2, slug: 'two', summary: 'Second phase' });
    commit('a.txt', 'v1', 'more');
    checkpoint({ git, verify: pass, number: 10, slug: 'ten', summary: 'Tenth phase' });
    sh('tag', 'unrelated');

    const phases = listPhases(git);
    expect(phases.map((p) => p.tag)).toEqual(['phase-2-two', 'phase-10-ten']);
    expect(phases[0]).toMatchObject({ number: 2, summary: 'Second phase' });
    expect(phases[1].commit).toBe(sh('rev-parse', '--short', 'HEAD'));
    expect(phases[1].date).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it('returns an empty list when there are no phase tags', () => {
    expect(listPhases(git)).toEqual([]);
  });
});

describe('planRollback', () => {
  it('lists commits after the tag, newest first', () => {
    checkpoint({ git, verify: pass, number: 1, slug: 'base', summary: 's' });
    commit('a.txt', 'v1', 'change one');
    commit('b.txt', 'b', 'change two');
    expect(planRollback(git, 'phase-1-base').map((c) => c.subject)).toEqual([
      'change two',
      'change one',
    ]);
  });

  it('throws for an unknown tag', () => {
    expect(() => planRollback(git, 'phase-9-nope')).toThrow(/unknown tag/i);
  });

  it('throws when the tag is not an ancestor of HEAD', () => {
    sh('switch', '-q', '-c', 'side');
    commit('side.txt', 's', 'side work');
    checkpoint({ git, verify: pass, number: 1, slug: 'side', summary: 's' });
    sh('switch', '-q', 'main');
    expect(() => planRollback(git, 'phase-1-side')).toThrow(/not an ancestor/i);
  });
});

describe('rollback', () => {
  beforeEach(() => {
    checkpoint({ git, verify: pass, number: 1, slug: 'base', summary: 's' });
    commit('a.txt', 'v1', 'change one');
    commit('b.txt', 'b', 'add b');
  });

  it('is a dry run by default and changes nothing', () => {
    const head = sh('rev-parse', 'HEAD');
    const result = rollback({ git, tag: 'phase-1-base' });
    expect(result.mode).toBe('dry-run');
    expect(result.commits).toHaveLength(2);
    expect(sh('rev-parse', 'HEAD')).toBe(head);
    expect(read('a.txt')).toBe('v1');
  });

  it('revert mode restores files while keeping history', () => {
    const head = sh('rev-parse', 'HEAD');
    rollback({ git, tag: 'phase-1-base', mode: 'revert' });
    expect(read('a.txt')).toBe('v0');
    expect(existsSync(join(dir, 'b.txt'))).toBe(false);
    expect(sh('merge-base', '--is-ancestor', head, 'HEAD')).toBe('');
    expect(isClean(git)).toBe(true);
  });

  it('hard mode backs up the current branch before resetting', () => {
    const head = sh('rev-parse', 'HEAD');
    const result = rollback({
      git,
      tag: 'phase-1-base',
      mode: 'hard',
      now: new Date('2026-11-10T18:30:05Z'),
    });
    expect(result.backupBranch).toBe('backup/20261110-183005');
    expect(sh('rev-parse', result.backupBranch)).toBe(head);
    expect(sh('rev-parse', 'HEAD')).toBe(sh('rev-list', '-n', '1', 'phase-1-base'));
    expect(read('a.txt')).toBe('v0');
  });

  it('refuses to roll back a dirty tree', () => {
    write('a.txt', 'dirty');
    expect(() => rollback({ git, tag: 'phase-1-base', mode: 'revert' })).toThrow(/not clean/i);
  });

  it('is a no-op when HEAD is already at the tag', () => {
    sh('reset', '-q', '--hard', 'phase-1-base');
    const result = rollback({ git, tag: 'phase-1-base', mode: 'revert' });
    expect(result.commits).toEqual([]);
  });

  it('rejects unknown modes', () => {
    expect(() => rollback({ git, tag: 'phase-1-base', mode: 'nuke' })).toThrow(/unknown mode/i);
  });
});

describe('restore', () => {
  it('creates and switches to a restore branch at the tag', () => {
    checkpoint({ git, verify: pass, number: 1, slug: 'base', summary: 's' });
    commit('a.txt', 'v1', 'later');
    const branch = restore(git, 'phase-1-base');
    expect(branch).toBe('restore/phase-1-base');
    expect(sh('branch', '--show-current')).toBe(branch);
    expect(read('a.txt')).toBe('v0');
  });

  it('refuses when the working tree is dirty', () => {
    checkpoint({ git, verify: pass, number: 1, slug: 'base', summary: 's' });
    write('a.txt', 'dirty');
    expect(() => restore(git, 'phase-1-base')).toThrow(/not clean/i);
  });
});
