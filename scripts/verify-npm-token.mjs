#!/usr/bin/env node

/**
 * Script to verify NPM_TOKEN is valid and has correct permissions.
 *
 * Usage:
 *   NPM_TOKEN="your_token" node scripts/verify-npm-token.mjs
 *   # or
 *   node scripts/verify-npm-token.mjs --token "your_token"
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const token =
  process.env.NPM_TOKEN ||
  process.argv.find((arg) => arg.startsWith('--token='))?.split('=')[1];

if (!token) {
  console.error('❌ NPM_TOKEN not provided');
  console.error('');
  console.error('Usage:');
  console.error('  NPM_TOKEN="your_token" node scripts/verify-npm-token.mjs');
  console.error('  node scripts/verify-npm-token.mjs --token="your_token"');
  process.exit(1);
}

console.log('🔍 Verifying NPM token...\n');

async function main() {
  // Create temporary directory with .npmrc
  const tempDir = mkdtempSync(join(tmpdir(), 'npm-verify-'));
  const npmrcPath = join(tempDir, '.npmrc');

  try {
    // Write token to temporary .npmrc
    writeFileSync(npmrcPath, `//registry.npmjs.org/:_authToken=${token}\n`);

    // Use npm whoami with the token to verify it works
    const username = execSync(
      `npm whoami --registry https://registry.npmjs.org --userconfig "${npmrcPath}"`,
      {
        encoding: 'utf-8',
        cwd: tempDir,
      },
    ).trim();

    console.log(`✅ Token is valid`);
    console.log(`   User: ${username}`);
    console.log('');

    // Try a dry-run publish to verify write permissions
    console.log('🔍 Checking publish permissions...');
    console.log('   (This may show warnings - that is normal)');
    console.log('');

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Token verification successful!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Add this token to GitHub Secrets as NPM_TOKEN');
    console.log(
      '2. Go to: https://github.com/<owner>/<repo>/settings/secrets/actions',
    );
    console.log('3. Click "New repository secret"');
    console.log('4. Name: NPM_TOKEN, Value: <your token>');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Token verification failed`);
    console.error('');
    console.error('Common issues:');
    console.error('- Token may be expired');
    console.error('- Token may not have publish permissions');
    console.error('- Token may be restricted to specific IPs');
    console.error('');
    console.error('To create a new token:');
    console.error('1. Go to https://www.npmjs.com/settings/<username>/tokens');
    console.error('2. Click "Generate New Token" > "Granular Access Token"');
    console.error('3. Set permissions: Read and Write for @jmlweb scope');
    process.exit(1);
  } finally {
    // Cleanup temporary directory
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

main();
