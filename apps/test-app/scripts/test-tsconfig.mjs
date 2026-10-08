#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import chalk from 'chalk';

const execFileAsync = promisify(execFile);
const tscBin = createRequire(import.meta.url).resolve('typescript/bin/tsc');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = resolve(__dirname, '..');

let hasErrors = false;

// tsc rejects --project combined with file arguments, so check a single
// fixture through a throwaway tsconfig that extends the app one.
const runTsc = async (file) => {
  const dir = mkdtempSync(resolve(tmpdir(), 'tsc-'));
  const configPath = resolve(dir, 'tsconfig.json');
  writeFileSync(
    configPath,
    JSON.stringify({
      extends: resolve(appRoot, 'tsconfig.json'),
      compilerOptions: { noEmit: true },
      include: [],
      files: [file],
    }),
  );
  try {
    return await execFileAsync(
      process.execPath,
      [tscBin, '--project', configPath],
      { cwd: appRoot },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

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
  // Direct tsc invocation (no npx) so npm env warnings never reach stderr.
  // A zero exit code is the success signal; stderr content is irrelevant.
  await runTsc(validTsPath);
  log.success('Valid TypeScript code compiles successfully');
} catch (error) {
  // tsc exits with code 1 on errors, so we need to check the error
  if ((error.stdout ?? '').includes('error TS')) {
    log.error('Valid TypeScript code has compilation errors');
    console.log(chalk.yellow('\nCompiler errors:'));
    console.log(error.stdout);
  } else {
    log.error(`Compilation failed: ${error.stdout || error.message}`);
  }
}

// Test 4: TypeScript detects type errors
log.info('Test 4: Testing that config detects type errors...');
try {
  const typeErrorsPath = resolve(appRoot, 'fixtures/invalid/type-errors.ts');
  const { stdout, stderr } = await runTsc(typeErrorsPath);

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
