#!/usr/bin/env node

import chalk from 'chalk';
import { ESLint } from 'eslint';

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

    // Determine peer dependencies based on package
    const peerDeps = {
      eslint: '^9.39.2',
    };

    // Base JS config needs different deps
    if (pkg.name.includes('base-js')) {
      peerDeps['@eslint/js'] = '^9.39.2';
      peerDeps.globals = '^16.5.0';
    } else if (pkg.name.includes('base') || pkg.name.includes('react')) {
      peerDeps['@eslint/js'] = '^9.39.2';
      peerDeps['eslint-config-prettier'] = '^10.1.8';
      peerDeps['eslint-plugin-simple-import-sort'] = '^12.1.1';
      peerDeps['typescript-eslint'] = '^8.34.1';
      peerDeps.typescript = '^5.9.3';
    }

    // Install dependencies
    installDependencies(peerDeps);

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const configModule = await import(`${pkg.packageJson.name}`);
    if (!configModule.default) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config is a valid ESLint config array
    log.info('Test 2: Verifying config structure...');
    const config = configModule.default;
    if (!Array.isArray(config)) {
      throw new Error('Config should export an array');
    }
    if (config.length === 0) {
      throw new Error('Config array should not be empty');
    }
    log.success('Config has valid structure');

    // Test 3: Create ESLint instance and lint code
    log.info('Test 3: Testing ESLint with config...');
    // ESLint flat config needs to be in .mjs format for ESM
    const configString = JSON.stringify(config, null, 2);
    createTestFile('eslint.config.mjs', `export default ${configString};`);

    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfigFile: 'eslint.config.mjs',
    });

    // Create test file based on package type
    let testCode;
    let testFile;
    if (pkg.name.includes('base-js')) {
      testFile = 'test.js';
      testCode = `const x = 1;
const y = 2;
console.log(x, y);
`;
    } else {
      testFile = 'test.ts';
      testCode = `const x: number = 1;
const y: number = 2;
console.log(x, y);
`;
    }

    createTestFile(testFile, testCode);

    const results = await eslint.lintFiles([testFile]);
    if (results.length === 0) {
      throw new Error('ESLint did not return results');
    }

    log.success('ESLint linting works correctly');

    // Test 4: Verify config can be used programmatically
    log.info('Test 4: Testing programmatic usage...');
    const programmaticESLint = new ESLint({
      useEslintrc: false,
      overrideConfig: config,
    });

    const programmaticResults = await programmaticESLint.lintFiles([testFile]);
    if (programmaticResults.length === 0) {
      throw new Error('Programmatic ESLint did not return results');
    }

    log.success('Config works programmatically');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}
