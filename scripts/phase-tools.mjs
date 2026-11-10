#!/usr/bin/env node
// Thin CLI over scripts/lib: phase checkpoints and rollback.
import { spawnSync } from 'node:child_process';
import { parseCli } from './lib/cli.mjs';
import { checkpoint, createGit, listPhases, restore, rollback } from './lib/git-phases.mjs';

const git = createGit(process.cwd());
const runVerify = () => {
  console.log('Running npm run verify ...');
  return spawnSync('npm', ['run', 'verify'], { stdio: 'inherit' }).status === 0;
};

try {
  const cli = parseCli(process.argv.slice(2));

  if (cli.command === 'checkpoint') {
    const tag = checkpoint({ git, verify: runVerify, ...cli });
    console.log(`\nCheckpoint created: ${tag}`);
  } else if (cli.command === 'list') {
    const phases = listPhases(git);
    if (phases.length === 0) console.log('No phase checkpoints yet.');
    for (const p of phases)
      console.log(`${p.tag.padEnd(28)} ${p.commit}  ${p.date.slice(0, 10)}  ${p.summary}`);
  } else if (cli.command === 'rollback') {
    const result = rollback({ git, tag: cli.tag, mode: cli.mode });
    if (result.commits.length === 0) {
      console.log(`HEAD is already at ${cli.tag}. Nothing to roll back.`);
    } else {
      const verb = result.mode === 'dry-run' ? 'Would undo' : 'Undid';
      console.log(`${verb} ${result.commits.length} commit(s) since ${cli.tag}:`);
      for (const c of result.commits) console.log(`  ${c.hash}  ${c.subject}`);
      if (result.mode === 'dry-run') {
        console.log(
          '\nDry run only. Re-run with --yes (safe revert commits) or --hard (reset; backup branch kept).',
        );
      }
      if (result.backupBranch)
        console.log(`\nPrevious state saved on branch ${result.backupBranch}`);
    }
  } else if (cli.command === 'restore') {
    console.log(`Switched to ${restore(git, cli.tag)}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
