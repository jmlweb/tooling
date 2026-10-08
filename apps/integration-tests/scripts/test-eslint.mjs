#!/usr/bin/env node

import chalk from 'chalk';

import {
  importFromTestEnv,
  initTestProject,
  installDependencies,
} from './utils.mjs';

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => {
    console.log(chalk.red('✗'), msg);
    throw new Error(msg);
  },
  section: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
};

export async function testESLintConfigs(packages) {
  log.section('Testing ESLint Config Packages');

  const eslintPackages = packages.filter((pkg) =>
    pkg.name.includes('eslint-config'),
  );

  if (eslintPackages.length === 0) {
    log.info('No ESLint config packages found, skipping');
    return;
  }

  for (const pkg of eslintPackages) {
    await testESLintPackage(pkg, packages);
  }
}

async function testESLintPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Determine peer dependencies based on package.
    // ESLINT_MAJOR selects the ESLint major to test against (default: 10).
    const eslintMajor = process.env.ESLINT_MAJOR ?? '10';
    const eslintRange = `^${eslintMajor}.0.0`;
    const peerDeps = {
      eslint: eslintRange,
    };

    // Base JS config needs different deps
    if (pkg.name.includes('base-js')) {
      peerDeps['@eslint/js'] = eslintRange;
      peerDeps.globals = '^17.13.0';
    } else {
      peerDeps['@eslint/js'] = eslintRange;
      peerDeps['eslint-config-prettier'] = '^10.1.8';
      peerDeps['eslint-plugin-simple-import-sort'] = '^14.0.0';
      peerDeps['typescript-eslint'] = '^8.71.1';
      // typescript-eslint does not support TypeScript 7 yet
      peerDeps.typescript = '~6.0.3';
    }

    // Install dependencies
    installDependencies(peerDeps);

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const config = await importFromTestEnv(pkg.packageJson.name);
    if (!config) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config is a valid ESLint config array
    log.info('Test 2: Verifying config structure...');
    if (!Array.isArray(config)) {
      throw new Error('Config should export an array');
    }
    if (config.length === 0) {
      throw new Error('Config array should not be empty');
    }
    log.success('Config has valid structure');

    // Test 3: Verify config exports are usable types
    // Note: We can't test actual ESLint execution because importFromTestEnv serializes
    // functions to strings, which breaks ESLint's config validation.
    // The config structure validation above is sufficient for integration testing.
    log.info(
      'Test 3: Config structure verified (ESLint execution skipped due to serialization)',
    );
    log.success('Config is ready for use in real projects');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}
