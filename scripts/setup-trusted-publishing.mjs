#!/usr/bin/env node

/**
 * Setup Trusted Publishing Script
 *
 * Registers `.github/workflows/publish.yml` in this repository as the npm
 * trusted publisher (OIDC) of the given packages, or of every public package
 * when none are given, so CI can publish without an NPM_TOKEN secret.
 * Packages that already have it fail harmlessly.
 *
 * Packages that are not on npm yet are skipped: npm only allows adding a
 * trusted publisher to an existing package, so publish their first version
 * by hand and run this script again.
 *
 * Requirements:
 *   - `npm login` with an account that can publish the @jmlweb packages
 *   - npm prompts for 2FA when it is enabled
 *
 * Usage:
 *   node scripts/setup-trusted-publishing.mjs [--dry-run] [package...]
 *
 * Packages can be given with or without the `@jmlweb/` scope:
 *   node scripts/setup-trusted-publishing.mjs oxlint-config-base @jmlweb/oxlint-config-react
 *
 * Exit codes:
 *   0 - All published packages configured (or would be, with --dry-run)
 *   1 - One or more packages failed, or an argument is not a public package
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesDir = join(__dirname, '..', 'packages');

const REPOSITORY = 'jmlweb/tooling';
const WORKFLOW_FILE = 'publish.yml';
// `npm trust` ships with npm 11.21+; npx keeps this independent of the local npm
const NPM = 'npm@^11.21.0';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const requestedPackages = args
  .filter((arg) => !arg.startsWith('--'))
  .map((arg) => (arg.startsWith('@') ? arg : `@jmlweb/${arg}`));

/**
 * Run npm through npx with the pinned version
 * @param {string[]} args - npm arguments
 * @param {object} options - Additional exec options
 */
function npm(args, options = {}) {
  return execFileSync('npx', ['--yes', NPM, ...args], {
    encoding: 'utf-8',
    ...options,
  });
}

/**
 * Check whether a package exists on the npm registry
 * @param {string} name - Package name
 * @returns {boolean}
 */
function isPublished(name) {
  try {
    npm(['view', name, 'name'], { stdio: ['ignore', 'pipe', 'ignore'] });
    return true;
  } catch {
    return false;
  }
}

const publicPackages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  // Skip leftovers of other branches, which only hold ignored build output
  .filter((entry) => existsSync(join(packagesDir, entry.name, 'package.json')))
  .map((entry) =>
    JSON.parse(
      readFileSync(join(packagesDir, entry.name, 'package.json'), 'utf-8'),
    ),
  )
  .filter((pkg) => !pkg.private)
  .map((pkg) => pkg.name);

const unknownPackages = requestedPackages.filter(
  (name) => !publicPackages.includes(name),
);

if (unknownPackages.length > 0) {
  console.error(`❌ Not a public package: ${unknownPackages.join(', ')}`);
  process.exit(1);
}

const targetPackages =
  requestedPackages.length > 0 ? requestedPackages : publicPackages;

const failed = [];
const unpublished = [];

for (const name of targetPackages) {
  if (!isPublished(name)) {
    unpublished.push(name);
    continue;
  }

  console.log(`\n🔐 ${name}`);
  try {
    npm(
      [
        'trust',
        'github',
        name,
        '--file',
        WORKFLOW_FILE,
        '--repo',
        REPOSITORY,
        '--allow-publish',
        '--yes',
        ...(isDryRun ? ['--dry-run'] : []),
      ],
      { stdio: 'inherit' },
    );
  } catch {
    failed.push(name);
  }
}

if (unpublished.length > 0) {
  console.log(
    `\n⏭️  Not on npm yet (publish once by hand, then re-run): ${unpublished.join(', ')}`,
  );
}

if (failed.length > 0) {
  console.log(`\n❌ Failed: ${failed.join(', ')}`);
  process.exit(1);
}

console.log(
  `\n✅ ${isDryRun ? 'Dry run finished' : 'Trusted publishing configured'} for ${targetPackages.length - unpublished.length} packages`,
);
