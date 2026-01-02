#!/usr/bin/env node

/**
 * CI Build Script
 *
 * Handles intelligent build strategy based on GitHub event type.
 * - For pull requests: Builds only changed packages using git-based filtering
 * - For pushes to main: Builds all packages
 *
 * Required environment variables:
 *   - GITHUB_EVENT_NAME: Event type (pull_request or push)
 *   - GITHUB_BASE_REF: Base branch for PRs (e.g., "main")
 *   - TURBO_TOKEN: Turborepo remote cache token (optional)
 *   - TURBO_TEAM: Turborepo team identifier (optional)
 *
 * Usage:
 *   node scripts/ci-build.mjs
 *
 * Exit codes:
 *   0 - Build successful
 *   1 - Build failed
 */

import { execSync } from 'node:child_process';

/**
 * Execute command with stdio inheritance (shows output in real-time)
 * @param {string} cmd - Command to execute
 * @param {object} options - Additional exec options
 */
function exec(cmd, options = {}) {
  execSync(cmd, {
    encoding: 'utf-8',
    stdio: 'inherit',
    ...options,
  });
}

/**
 * Execute command and capture output
 * @param {string} cmd - Command to execute
 * @returns {string} Command output (trimmed)
 */
function execCapture(cmd) {
  return execSync(cmd, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

/**
 * Build packages for pull requests with filtering
 */
function buildForPullRequest() {
  const baseRef = process.env.GITHUB_BASE_REF;

  if (!baseRef) {
    console.log(
      '::error title=Build Failed::GITHUB_BASE_REF environment variable is required for PR builds',
    );
    process.exit(1);
  }

  console.log('🔍 PR detected - Building only changed packages...');
  console.log(`Base branch: ${baseRef}`);

  try {
    // Fetch the base branch to calculate merge base
    console.log(`Fetching origin/${baseRef}...`);
    exec(`git fetch origin ${baseRef}:refs/remotes/origin/${baseRef}`);

    // Get the merge base with the target branch
    const mergeBase = execCapture(`git merge-base HEAD origin/${baseRef}`);
    console.log(`Merge base commit: ${mergeBase}`);

    // Use Turborepo filter to build only changed packages
    // Filter syntax: [<base>...HEAD] compares changes from base to HEAD
    const filter = `[${mergeBase}...HEAD]`;
    console.log(`Using filter: ${filter}`);

    try {
      exec(`pnpm build --filter="${filter}"`);
      console.log('✅ Filtered build completed successfully');
    } catch (error) {
      // If filter fails, fallback to building all packages
      console.log(
        '⚠️  Filter build failed, falling back to building all packages...',
      );
      exec('pnpm build');
      console.log('✅ Full build completed successfully (fallback)');
    }
  } catch (error) {
    console.log(
      '::error title=Build Failed::PR build failed. Check the build output above for details.',
    );
    process.exit(1);
  }
}

/**
 * Build all packages (for pushes to main)
 */
function buildAll() {
  console.log('📦 Push to main - Building all packages...');

  try {
    exec('pnpm build');
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.log(
      '::error title=Build Failed::Build failed. Check the build output above for details.',
    );
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  const eventName = process.env.GITHUB_EVENT_NAME;

  if (!eventName) {
    console.log(
      '::error title=Build Failed::GITHUB_EVENT_NAME environment variable is required',
    );
    process.exit(1);
  }

  console.log(`GitHub event: ${eventName}\n`);

  if (eventName === 'pull_request') {
    buildForPullRequest();
  } else {
    buildAll();
  }
}

main();
