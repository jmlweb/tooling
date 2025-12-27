#!/usr/bin/env node

import { execSync } from 'node:child_process';

import chalk from 'chalk';

import { testBuildToolConfigs } from './test-build-tools.mjs';
import { testCommitlintConfig } from './test-commitlint.mjs';
import { testESLintConfigs } from './test-eslint.mjs';
import { testPrettierConfigs } from './test-prettier.mjs';
import { testTestingConfigs } from './test-testing-configs.mjs';
import { testTSConfigs } from './test-tsconfig.mjs';
import {
  cleanupTestEnvironment,
  createTestEnvironment,
  packPackages,
} from './utils.mjs';

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => {
    console.log(chalk.red('✗'), msg);
  },
  section: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
};

async function main() {
  console.log(chalk.bold.cyan('\n🧪 Integration Tests for @jmlweb Packages\n'));

  let packedPackages = [];
  let hasErrors = false;

  try {
    // Step 1: Ensure packages are built (skip if already built)
    log.section('Step 1: Building packages');
    try {
      const rootDir = process.cwd().replace(/apps\/integration-tests.*/, '');
      execSync('pnpm build', {
        cwd: rootDir,
        stdio: 'inherit',
      });
      log.success('Packages built successfully');
    } catch (error) {
      log.error('Failed to build packages');
      throw error;
    }

    // Step 2: Pack all packages
    log.section('Step 2: Packing packages');
    packedPackages = packPackages();

    if (packedPackages.length === 0) {
      log.error('No packages were packed');
      process.exit(1);
    }

    // Step 3: Create test environment
    log.section('Step 3: Setting up test environment');
    createTestEnvironment();
    log.success('Test environment created');

    // Step 4: Run integration tests for each package type
    log.section('Step 4: Running integration tests');

    try {
      await testPrettierConfigs(packedPackages);
    } catch (error) {
      hasErrors = true;
      log.error(`Prettier config tests failed: ${error.message}`);
    }

    try {
      await testESLintConfigs(packedPackages);
    } catch (error) {
      hasErrors = true;
      log.error(`ESLint config tests failed: ${error.message}`);
    }

    try {
      await testTSConfigs(packedPackages);
    } catch (error) {
      hasErrors = true;
      log.error(`TypeScript config tests failed: ${error.message}`);
    }

    try {
      await testTestingConfigs(packedPackages);
    } catch (error) {
      hasErrors = true;
      log.error(`Testing config tests failed: ${error.message}`);
    }

    try {
      await testBuildToolConfigs(packedPackages);
    } catch (error) {
      hasErrors = true;
      log.error(`Build tool config tests failed: ${error.message}`);
    }

    try {
      await testCommitlintConfig(packedPackages);
    } catch (error) {
      hasErrors = true;
      log.error(`Commitlint config tests failed: ${error.message}`);
    }

    // Step 5: Cleanup
    log.section('Step 5: Cleaning up');
    cleanupTestEnvironment();
    log.success('Test environment cleaned up');

    // Final summary
    console.log('\n');
    if (hasErrors) {
      log.error('❌ Some integration tests failed');
      process.exit(1);
    } else {
      log.success('✅ All integration tests passed!');
      process.exit(0);
    }
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    cleanupTestEnvironment();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  cleanupTestEnvironment();
  process.exit(1);
});
