#!/usr/bin/env node

import { exec } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import chalk from 'chalk';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = resolve(__dirname, '..');

let hasErrors = false;

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => {
    console.log(chalk.red('✗'), msg);
    hasErrors = true;
  },
  section: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
};

log.section('Testing @jmlweb/tsconfig-base');

// Test 1: Config file exists and is valid JSON
log.info('Test 1: Verifying config file...');
try {
  const configPath = resolve(
    appRoot,
    '../../packages/tsconfig-base/tsconfig.json',
  );
  const configContent = readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent);

  if (config.compilerOptions) {
    log.success('Config file is valid JSON with compilerOptions');
  } else {
    log.error('Config file missing compilerOptions');
  }
} catch (error) {
  log.error(`Failed to read config file: ${error.message}`);
}

// Test 2: Config can be extended
log.info('Test 2: Testing config extension...');
try {
  const testTsConfigPath = resolve(appRoot, 'tsconfig.json');
  const testTsConfig = JSON.parse(readFileSync(testTsConfigPath, 'utf-8'));

  if (testTsConfig.extends === '@jmlweb/tsconfig-base') {
    log.success('Config can be extended in tsconfig.json');
  } else {
    log.error('Failed to extend config in tsconfig.json');
  }
} catch (error) {
  log.error(`Failed to test config extension: ${error.message}`);
}

// Test 3: TypeScript can compile valid code
log.info('Test 3: Testing TypeScript compilation of valid code...');
try {
  const validTsPath = resolve(appRoot, 'fixtures/valid/typescript.ts');
  const { stderr } = await execAsync(
    `npx tsc --noEmit --project ${appRoot}/tsconfig.json ${validTsPath}`,
    { cwd: appRoot },
  );

  if (!stderr || stderr.trim() === '') {
    log.success('Valid TypeScript code compiles successfully');
  } else {
    log.error('Valid TypeScript code failed to compile');
    console.log(chalk.yellow('\nCompiler output:'));
    console.log(stderr);
  }
} catch (error) {
  // tsc exits with code 1 on errors, so we need to check the error
  if (error.stderr && error.stderr.includes('error TS')) {
    log.error('Valid TypeScript code has compilation errors');
    console.log(chalk.yellow('\nCompiler errors:'));
    console.log(error.stderr);
  } else if (error.stderr) {
    log.error(`Compilation failed: ${error.stderr}`);
  }
}

// Test 4: TypeScript detects type errors
log.info('Test 4: Testing that config detects type errors...');
try {
  const typeErrorsPath = resolve(appRoot, 'fixtures/invalid/type-errors.ts');
  const { stdout, stderr } = await execAsync(
    `npx tsc --noEmit --project ${appRoot}/tsconfig.json ${typeErrorsPath}`,
    { cwd: appRoot },
  );

  // TypeScript errors go to stdout, not stderr
  const output = stdout || stderr || '';

  if (output.includes('error TS')) {
    log.success('Config correctly detects type errors');
  } else {
    log.error('Config failed to detect type errors in invalid file');
  }
} catch (error) {
  // tsc exits with code 2 when there are errors, which is expected
  const output = error.stdout || error.stderr || '';
  if (output.includes('error TS')) {
    log.success('Config correctly detects type errors');
  } else {
    log.error(`Unexpected compilation error: ${error.message}`);
  }
}

// Test 5: Verify strict mode is enabled
log.info('Test 5: Verifying strict mode...');
try {
  const configPath = resolve(
    appRoot,
    '../../packages/tsconfig-base/tsconfig.json',
  );
  const configContent = readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent);

  if (config.compilerOptions.strict === true) {
    log.success('Strict mode is enabled');
  } else {
    log.error('Strict mode is not enabled');
  }
} catch (error) {
  log.error(`Failed to verify strict mode: ${error.message}`);
}

if (hasErrors) {
  console.log(chalk.red.bold('\n❌ Tests failed\n'));
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n✅ All tests passed\n'));
  process.exit(0);
}
