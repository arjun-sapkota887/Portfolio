// Phase checkpoint & rollback helpers. Every function takes a `git` runner
// (see createGit) so tests can drive real throwaway repositories.
import { execFileSync } from 'node:child_process';

const TAG_PREFIX = 'phase-';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MODES = ['dry-run', 'revert', 'hard'];

export function createGit(cwd) {
  return (...args) =>
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function isClean(git) {
  return git('status', '--porcelain') === '';
}

function assertClean(git) {
  if (!isClean(git)) {
    throw new Error('Working tree is not clean. Commit or stash your changes first.');
  }
}

function tagExists(git, tag) {
  try {
    git('rev-parse', '--verify', '--quiet', `refs/tags/${tag}`);
    return true;
  } catch {
    return false;
  }
}

function assertTag(git, tag) {
  if (!tagExists(git, tag)) throw new Error(`Unknown tag: ${tag}`);
}

export function checkpoint({ git, verify, number, slug, summary }) {
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`Invalid phase number: ${number}`);
  }
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug "${slug}". Use lowercase words separated by dashes.`);
  }
  const tag = `${TAG_PREFIX}${number}-${slug}`;
  if (tagExists(git, tag)) throw new Error(`Tag ${tag} already exists.`);
  assertClean(git);
  if (!verify()) throw new Error('Verify failed. Fix the failing checks before checkpointing.');
  git('tag', '-a', tag, '-m', summary);
  return tag;
}

export function listPhases(git) {
  const out = git(
    'for-each-ref',
    `refs/tags/${TAG_PREFIX}*`,
    '--format=%(refname:short)%09%(*objectname:short)%09%(creatordate:iso-strict)%09%(contents:subject)',
  );
  if (!out) return [];
  return out
    .split('\n')
    .map((line) => {
      const [tag, commit, date, summary = ''] = line.split('\t');
      const number = Number(tag.slice(TAG_PREFIX.length).split('-')[0]);
      return { tag, number, commit, date, summary };
    })
    .filter((phase) => Number.isInteger(phase.number))
    .sort((a, b) => a.number - b.number);
}

export function planRollback(git, tag) {
  assertTag(git, tag);
  try {
    git('merge-base', '--is-ancestor', tag, 'HEAD');
  } catch {
    throw new Error(`${tag} is not an ancestor of HEAD, so it cannot be rolled back to.`);
  }
  const out = git('log', '--format=%h%x09%s', `${tag}..HEAD`);
  if (!out) return [];
  return out.split('\n').map((line) => {
    const [hash, subject] = line.split('\t');
    return { hash, subject };
  });
}

const timestamp = (date) => date.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);

export function rollback({ git, tag, mode = 'dry-run', now = new Date() }) {
  if (!MODES.includes(mode)) throw new Error(`Unknown mode: ${mode}`);
  const commits = planRollback(git, tag);
  if (mode === 'dry-run' || commits.length === 0) return { mode, commits };

  assertClean(git);
  if (mode === 'revert') {
    git('revert', '--no-edit', `${tag}..HEAD`);
    return { mode, commits };
  }

  const backupBranch = `backup/${timestamp(now)}`;
  git('branch', backupBranch);
  git('reset', '--hard', tag);
  return { mode, commits, backupBranch };
}

export function restore(git, tag) {
  assertTag(git, tag);
  assertClean(git);
  const branch = `restore/${tag}`;
  git('switch', '-c', branch, tag);
  return branch;
}
