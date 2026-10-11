#!/usr/bin/env node

/**
 * Package Exports Check
 *
 * Runs publint (strict) and Are The Types Wrong over every built package that
 * ships JavaScript entry points. Packages without a dist/ folder (for example
 * the JSON-only tsconfig packages) are skipped.
 *
 * Usage:
 *   node scripts/check-package-exports.mjs
 *
 * Note: Packages must be built before running this script.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = join(rootDir, 'packages');
const bin = (name) => join(rootDir, 'node_modules', '.bin', name);

const run = (command, args, cwd) =>
  spawnSync(command, args, { cwd, encoding: 'utf-8' }).status === 0;

const failures = readdirSync(packagesDir)
  .map((name) => ({ name, dir: join(packagesDir, name) }))
  .filter(({ dir }) => existsSync(join(dir, 'dist')))
  .flatMap(({ name, dir }) => {
    const checks = [
      ['publint', run(bin('publint'), ['--strict', '.'], dir)],
      ['attw', run(bin('attw'), ['--pack', '.', '--profile', 'node16'], dir)],
    ];
    checks.forEach(([tool, ok]) =>
      console.log(`${ok ? '✓' : '✗'} ${name} (${tool})`),
    );
    return checks.filter(([, ok]) => !ok).map(([tool]) => `${name} (${tool})`);
  });

if (failures.length > 0) {
  console.error(
    `\nExports check failed for:\n${failures.map((f) => `  - ${f}`).join('\n')}`,
  );
  process.exit(1);
}
