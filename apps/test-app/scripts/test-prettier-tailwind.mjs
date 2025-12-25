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

log.section('Testing @jmlweb/prettier-config-tailwind');

// Test 1: Can import the config
log.info('Test 1: Importing config...');
try {
  const config = await import('@jmlweb/prettier-config-tailwind');
  if (!config.default) {
    throw new Error('Config does not export a default export');
  }
  log.success('Config imported successfully');
} catch (error) {
  log.error(`Failed to import config: ${error.message}`);
  process.exit(1);
}

// Test 2: Config includes Tailwind plugin
log.info('Test 2: Verifying Tailwind plugin...');
try {
  const prettierConfig = await import('@jmlweb/prettier-config-tailwind');
  const config = prettierConfig.default;

  if (config.plugins && config.plugins.includes('prettier-plugin-tailwindcss')) {
    log.success('Tailwind plugin configured');
  } else {
    log.error('Tailwind plugin not found in config');
  }
} catch (error) {
  log.error(`Failed to verify Tailwind plugin: ${error.message}`);
}

// Test 3: Config extends base config
log.info('Test 3: Verifying base config properties...');
try {
  const prettierConfig = await import('@jmlweb/prettier-config-tailwind');
  const config = prettierConfig.default;

  const expectedProps = ['singleQuote', 'tabWidth'];
  const missingProps = expectedProps.filter((prop) => !(prop in config));

  if (missingProps.length === 0) {
    log.success('Config extends base config correctly');
  } else {
    log.error(`Config missing base properties: ${missingProps.join(', ')}`);
  }
} catch (error) {
  log.error(`Failed to verify base config properties: ${error.message}`);
}

// Test 4: Can format Tailwind classes
log.info('Test 4: Testing Tailwind class formatting...');
try {
  const prettierConfig = await import('@jmlweb/prettier-config-tailwind');
  const tailwindPath = resolve(appRoot, 'fixtures/valid/tailwind.tsx');
  const tailwindCode = readFileSync(tailwindPath, 'utf-8');

  const formatted = await format(tailwindCode, {
    ...prettierConfig.default,
    parser: 'typescript',
  });

  if (formatted.includes('className=')) {
    log.success('Tailwind code formatted successfully');
  } else {
    log.error('Tailwind formatting may have failed');
  }
} catch (error) {
  log.error(`Failed to format Tailwind code: ${error.message}`);
}

if (hasErrors) {
  console.log(chalk.red.bold('\n❌ Tests failed\n'));
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n✅ All tests passed\n'));
  process.exit(0);
}
