#!/usr/bin/env node

/**
 * Setup Trusted Publishing Script
 *
 * Registers `.github/workflows/publish.yml` in this repository as the npm
 * trusted publisher (OIDC) of every public package, so CI can publish
 * without an NPM_TOKEN secret.
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
 *   node scripts/setup-trusted-publishing.mjs [--dry-run]
 *
 * Exit codes:
 *   0 - All published packages configured (or would be, with --dry-run)
 *   1 - One or more packages failed
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesDir = join(__dirname, '..', 'packages');

const REPOSITORY = 'jmlweb/tooling';
const WORKFLOW_FILE = 'publish.yml';
// `npm trust` ships with npm 11.21+; npx keeps this independent of the local npm
const NPM = 'npm@^11.21.0';

const isDryRun = process.argv.includes('--dry-run');

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
  .map((entry) =>
    JSON.parse(
      readFileSync(join(packagesDir, entry.name, 'package.json'), 'utf-8'),
    ),
  )
  .filter((pkg) => !pkg.private)
  .map((pkg) => pkg.name);

const failed = [];
const unpublished = [];

for (const name of publicPackages) {
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
  `\n✅ ${isDryRun ? 'Dry run finished' : 'Trusted publishing configured'} for ${publicPackages.length - unpublished.length} packages`,
);
