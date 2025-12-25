#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { format } from 'prettier';
import chalk from 'chalk';

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

log.section('Testing @jmlweb/prettier-config-base');

// Test 1: Can import the config
log.info('Test 1: Importing config...');
try {
  const config = await import('@jmlweb/prettier-config-base');
  if (!config.default) {
    throw new Error('Config does not export a default export');
  }
  log.success('Config imported successfully');
} catch (error) {
  log.error(`Failed to import config: ${error.message}`);
  process.exit(1);
}

// Test 2: Config can be loaded by Prettier
log.info('Test 2: Loading config with Prettier...');
try {
  const prettierConfig = await import('@jmlweb/prettier-config-base');
  const testCode = 'const x=1;';
  await format(testCode, { ...prettierConfig.default, parser: 'typescript' });
  log.success('Config loaded by Prettier successfully');
} catch (error) {
  log.error(`Failed to load config with Prettier: ${error.message}`);
}

// Test 3: Config formats code correctly
log.info('Test 3: Testing formatting...');
try {
  const prettierConfig = await import('@jmlweb/prettier-config-base');
  const badFormatPath = resolve(appRoot, 'fixtures/invalid/bad-formatting.ts');
  const expectedPath = resolve(
    appRoot,
    'fixtures/expected/bad-formatting.ts',
  );

  const badFormat = readFileSync(badFormatPath, 'utf-8');
  const expected = readFileSync(expectedPath, 'utf-8');

  const formatted = await format(badFormat, {
    ...prettierConfig.default,
    parser: 'typescript',
  });

  if (formatted === expected) {
    log.success('Code formatted correctly');
  } else {
    log.error('Formatted output does not match expected output');
    console.log(chalk.yellow('\nExpected:'));
    console.log(expected);
    console.log(chalk.yellow('\nActual:'));
    console.log(formatted);
  }
} catch (error) {
  log.error(`Failed to format code: ${error.message}`);
}

// Test 4: Verify config has expected properties
log.info('Test 4: Verifying config properties...');
try {
  const prettierConfig = await import('@jmlweb/prettier-config-base');
  const config = prettierConfig.default;

  const expectedProps = ['singleQuote', 'tabWidth'];
  const missingProps = expectedProps.filter((prop) => !(prop in config));

  if (missingProps.length === 0) {
    log.success('Config has expected properties');
  } else {
    log.error(`Config missing properties: ${missingProps.join(', ')}`);
  }
} catch (error) {
  log.error(`Failed to verify config properties: ${error.message}`);
}

if (hasErrors) {
  console.log(chalk.red.bold('\n❌ Tests failed\n'));
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n✅ All tests passed\n'));
  process.exit(0);
}
