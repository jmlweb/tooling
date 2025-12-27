#!/usr/bin/env node

import chalk from 'chalk';

import {
  createTestFile,
  initTestProject,
  installDependencies,
  readTestFile,
  testFileExists,
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

export async function testTSConfigs(packages) {
  log.section('Testing TypeScript Config Packages');

  const tsconfigPackages = packages.filter(
    (pkg) => pkg.name.includes('tsconfig') && !pkg.name.includes('internal'),
  );

  if (tsconfigPackages.length === 0) {
    log.info('No TypeScript config packages found, skipping');
    return;
  }

  for (const pkg of tsconfigPackages) {
    await testTSConfigPackage(pkg, packages);
  }
}

async function testTSConfigPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Install TypeScript
    installDependencies({
      typescript: '^5.9.3',
    });

    // Test 1: Verify tsconfig.json can be accessed
    log.info('Test 1: Verifying tsconfig.json exists in package...');
    const packagePath = `node_modules/${pkg.name}`;
    const tsconfigPath = `${packagePath}/tsconfig.json`;

    if (!testFileExists(tsconfigPath)) {
      throw new Error(`tsconfig.json not found at ${tsconfigPath}`);
    }
    log.success('tsconfig.json found in package');

    // Test 2: Read and parse tsconfig.json
    log.info('Test 2: Reading and parsing tsconfig.json...');
    const tsconfigContent = readTestFile(tsconfigPath);
    const tsconfig = JSON.parse(tsconfigContent);

    if (!tsconfig || typeof tsconfig !== 'object') {
      throw new Error('tsconfig.json is not a valid JSON object');
    }
    log.success('tsconfig.json is valid JSON');

    // Test 3: Verify extends field if present
    if (tsconfig.extends) {
      log.info('Test 3: Verifying extends field...');
      if (typeof tsconfig.extends !== 'string') {
        throw new Error('extends field should be a string');
      }
      log.success('extends field is valid');
    }

    // Test 4: Create a test tsconfig.json that extends the package config
    log.info('Test 4: Testing extends usage...');
    const testTSConfig = {
      extends: pkg.name,
      compilerOptions: {
        outDir: './dist',
      },
      include: ['src/**/*'],
    };

    createTestFile('tsconfig.json', JSON.stringify(testTSConfig, null, 2));
    createTestFile('src/test.ts', 'const x: number = 1;');

    // Test 5: Verify package exports are configured correctly
    log.info('Test 5: Verifying package exports...');
    const packageJson = JSON.parse(readTestFile(`${packagePath}/package.json`));
    if (!packageJson.exports || !packageJson.exports['.']) {
      throw new Error('Package should export tsconfig.json via exports field');
    }
    log.success('Package exports are configured correctly');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}
