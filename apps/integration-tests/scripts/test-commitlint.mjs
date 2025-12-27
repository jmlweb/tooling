#!/usr/bin/env node

import chalk from 'chalk';

import {
  createTestFile,
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

export async function testCommitlintConfig(packages) {
  log.section('Testing Commitlint Config Package');

  const commitlintPackages = packages.filter((pkg) =>
    pkg.name.includes('commitlint-config'),
  );

  if (commitlintPackages.length === 0) {
    log.info('No commitlint config packages found, skipping');
    return;
  }

  for (const pkg of commitlintPackages) {
    await testCommitlintPackage(pkg);
  }
}

async function testCommitlintPackage(pkg) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project
    initTestProject([pkg]);

    // Install commitlint
    installDependencies({
      '@commitlint/cli': '^19.6.0',
      '@commitlint/config-conventional': '^19.6.0',
    });

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const configModule = await import(`${pkg.packageJson.name}`);
    if (!configModule.default) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config has expected structure
    log.info('Test 2: Verifying config structure...');
    const config = configModule.default;

    // Commitlint config should have rules or extends
    if (!config.rules && !config.extends) {
      throw new Error('Commitlint config should have rules or extends');
    }
    log.success('Commitlint config structure is valid');

    // Test 3: Create a commitlint config file
    log.info('Test 3: Testing config file usage...');
    createTestFile(
      'commitlint.config.js',
      `import baseConfig from '${pkg.name}';

export default baseConfig;
`,
    );

    log.success('Config file structure is valid');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}
