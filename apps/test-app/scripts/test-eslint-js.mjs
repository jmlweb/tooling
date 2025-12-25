#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { ESLint } from 'eslint';

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

log.section('Testing @jmlweb/eslint-config-base-js');

// Test 1: Can import the config
log.info('Test 1: Importing config...');
try {
  const config = await import('@jmlweb/eslint-config-base-js');
  if (!config.default || !Array.isArray(config.default)) {
    throw new Error('Config does not export a valid ESLint flat config array');
  }
  log.success('Config imported successfully');
} catch (error) {
  log.error(`Failed to import config: ${error.message}`);
  process.exit(1);
}

// Test 2: Config can be loaded by ESLint
log.info('Test 2: Loading config with ESLint...');
try {
  const config = await import('@jmlweb/eslint-config-base-js');
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config.default,
    baseConfig: config.default,
  });
  log.success('Config loaded by ESLint successfully');
} catch (error) {
  log.error(`Failed to load config with ESLint: ${error.message}`);
}

// Test 3: Config lints valid JavaScript correctly
log.info('Test 3: Testing valid JavaScript file...');
try {
  const config = await import('@jmlweb/eslint-config-base-js');
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config.default,
    baseConfig: config.default,
  });

  const validJsPath = resolve(appRoot, 'fixtures/valid/javascript.js');
  const results = await eslint.lintFiles([validJsPath]);

  const errorCount = results.reduce(
    (sum, result) => sum + result.errorCount,
    0,
  );

  if (errorCount === 0) {
    log.success('Valid JavaScript file passes linting');
  } else {
    log.error(`Valid JavaScript file has ${errorCount} error(s)`);
    console.log(chalk.yellow('\nErrors:'));
    results.forEach((result) => {
      result.messages.forEach((msg) => {
        console.log(
          `  ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`,
        );
      });
    });
  }
} catch (error) {
  log.error(`Failed to lint valid JavaScript: ${error.message}`);
}

// Test 4: Verify config has expected rules
log.info('Test 4: Verifying config includes expected rules...');
try {
  const config = await import('@jmlweb/eslint-config-base-js');
  const flatConfig = config.default;

  // Check that config has rules defined
  const hasRules = flatConfig.some(
    (cfg) => cfg.rules && Object.keys(cfg.rules).length > 0,
  );

  if (hasRules) {
    log.success('Config includes rules');
  } else {
    log.error('Config does not include any rules');
  }
} catch (error) {
  log.error(`Failed to verify config rules: ${error.message}`);
}

if (hasErrors) {
  console.log(chalk.red.bold('\n❌ Tests failed\n'));
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n✅ All tests passed\n'));
  process.exit(0);
}
