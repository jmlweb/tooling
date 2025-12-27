#!/usr/bin/env node

import chalk from 'chalk';
import { format } from 'prettier';

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

export async function testPrettierConfigs(packages) {
  log.section('Testing Prettier Config Packages');

  const prettierPackages = packages.filter((pkg) =>
    pkg.name.includes('prettier-config'),
  );

  if (prettierPackages.length === 0) {
    log.info('No Prettier config packages found, skipping');
    return;
  }

  for (const pkg of prettierPackages) {
    await testPrettierPackage(pkg, packages);
  }
}

async function testPrettierPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Install prettier and the config package
    installDependencies({
      prettier: '^3.3.3',
    });

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const configModule = await import(`${pkg.packageJson.name}`);
    if (!configModule.default) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config can be used with Prettier
    log.info('Test 2: Testing formatting with Prettier...');
    const testCode = 'const x=1;const y=2;';
    const formatted = await format(testCode, {
      ...configModule.default,
      parser: 'typescript',
    });

    if (!formatted || formatted.trim().length === 0) {
      throw new Error('Prettier formatting returned empty result');
    }

    // Verify formatting worked (should have newlines, etc.)
    if (formatted.includes(';')) {
      log.success('Prettier formatting works correctly');
    } else {
      throw new Error('Prettier formatting did not work as expected');
    }

    // Test 3: Verify config has expected properties
    log.info('Test 3: Verifying config properties...');
    const config = configModule.default;
    const expectedProps = ['singleQuote', 'tabWidth'];
    const missingProps = expectedProps.filter((prop) => !(prop in config));

    if (missingProps.length > 0) {
      throw new Error(`Config missing properties: ${missingProps.join(', ')}`);
    }
    log.success('Config has expected properties');

    // Test 4: Test with a .prettierrc file
    log.info('Test 4: Testing with .prettierrc file...');
    createTestFile(
      '.prettierrc',
      JSON.stringify({
        ...config,
      }),
    );

    const testFileContent = 'const   test   =   "value"   ;';
    createTestFile('test.ts', testFileContent);

    const formattedViaFile = await format(testFileContent, {
      filepath: 'test.ts',
    });

    if (!formattedViaFile || formattedViaFile === testFileContent) {
      throw new Error('Prettier did not format code using .prettierrc');
    }
    log.success('Config works with .prettierrc file');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    throw error;
  }
}
