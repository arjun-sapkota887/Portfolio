export const USAGE = `Usage:
  npm run checkpoint -- <number> <slug> [summary...]   Verify, then tag HEAD as phase-<number>-<slug>
  npm run phases                                      List phase checkpoints
  npm run rollback -- <tag> [--yes | --hard]          Dry run by default; --yes reverts, --hard resets (with backup branch)
  npm run restore -- <tag>                            Check out a phase on a new restore/<tag> branch`;

const usageError = (reason) => new Error(`${reason}\n\n${USAGE}`);

export function parseCli(argv) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  const [command, ...rest] = argv.filter((arg) => !arg.startsWith('--'));

  switch (command) {
    case 'checkpoint': {
      const [rawNumber, slug, ...summaryWords] = rest;
      const number = Number(rawNumber);
      if (!slug || !Number.isInteger(number)) {
        throw usageError('checkpoint needs a phase number and a slug.');
      }
      return { command, number, slug, summary: summaryWords.join(' ') || slug };
    }
    case 'list':
      return { command };
    case 'rollback': {
      if (!rest[0]) throw usageError('rollback needs a tag.');
      const mode = flags.has('--hard') ? 'hard' : flags.has('--yes') ? 'revert' : 'dry-run';
      return { command, tag: rest[0], mode };
    }
    case 'restore':
      if (!rest[0]) throw usageError('restore needs a tag.');
      return { command, tag: rest[0] };
    default:
      throw usageError(command ? `Unknown command: ${command}` : 'No command given.');
  }
}
