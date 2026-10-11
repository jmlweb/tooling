#!/usr/bin/env node

import chalk from 'chalk';

import {
  createTestFile,
  execInTestProject,
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
    await testCommitlintPackage(pkg, packages);
  }
}

async function testCommitlintPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Install commitlint
    installDependencies({
      '@commitlint/cli': '^19.6.0',
      '@commitlint/config-conventional': '^19.6.0',
    });

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const config = await importFromTestEnv(pkg.packageJson.name);
    if (!config) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config has expected structure
    log.info('Test 2: Verifying config structure...');

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

    // Test 4: Lint real messages, including the subjectCase option
    log.info('Test 4: Linting commit messages...');
    const lintMessage = (message, config = 'commitlint.config.js') => {
      try {
        execInTestProject(`npx commitlint --config ${config}`, {
          input: message,
          stdio: 'pipe',
        });
        return true;
      } catch {
        return false;
      }
    };

    createTestFile(
      'commitlint.strict.config.js',
      `import { createCommitlintConfig } from '${pkg.name}';

export default createCommitlintConfig({ subjectCase: ['always', 'lower-case'] });
`,
    );

    const cases = [
      ['feat: add parser (TSK-010)', undefined, true],
      ['feat: Add parser', undefined, false],
      ['feat: add parser (TSK-010)', 'commitlint.strict.config.js', false],
    ];
    for (const [message, config, expected] of cases) {
      if (lintMessage(message, config) !== expected) {
        throw new Error(
          `Expected "${message}" to ${expected ? 'pass' : 'fail'}${config ? ` with ${config}` : ''}`,
        );
      }
    }
    log.success('Commit messages are linted as expected');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}
