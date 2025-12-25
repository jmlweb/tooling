#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ESLint } from 'eslint';
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

log.section('Testing @jmlweb/eslint-config-base');

// Test 1: Can import the config
log.info('Test 1: Importing config...');
try {
  const config = await import('@jmlweb/eslint-config-base');
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
  const config = await import('@jmlweb/eslint-config-base');
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config.default,
    baseConfig: config.default,
  });
  log.success('Config loaded by ESLint successfully');
} catch (error) {
  log.error(`Failed to load config with ESLint: ${error.message}`);
}

// Test 3: Config lints valid TypeScript correctly
log.info('Test 3: Testing valid TypeScript file...');
try {
  const config = await import('@jmlweb/eslint-config-base');
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config.default,
    baseConfig: config.default,
  });

  const validTsPath = resolve(appRoot, 'fixtures/valid/typescript.ts');
  const results = await eslint.lintFiles([validTsPath]);

  const errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);

  if (errorCount === 0) {
    log.success('Valid TypeScript file passes linting');
  } else {
    log.error(`Valid TypeScript file has ${errorCount} error(s)`);
    console.log(chalk.yellow('\nErrors:'));
    results.forEach((result) => {
      result.messages.forEach((msg) => {
        console.log(`  ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
      });
    });
  }
} catch (error) {
  log.error(`Failed to lint valid TypeScript: ${error.message}`);
}

// Test 4: Config detects lint errors
log.info('Test 4: Testing that config detects errors...');
try {
  const config = await import('@jmlweb/eslint-config-base');
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config.default,
    baseConfig: config.default,
  });

  const lintErrorsPath = resolve(appRoot, 'fixtures/invalid/lint-errors.ts');
  const results = await eslint.lintFiles([lintErrorsPath]);

  const errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);

  if (errorCount > 0) {
    log.success(`Config correctly detects ${errorCount} error(s) in invalid file`);
  } else {
    log.error('Config failed to detect errors in invalid file');
  }
} catch (error) {
  log.error(`Failed to lint invalid TypeScript: ${error.message}`);
}

// Test 5: Verify config extends base-js config
log.info('Test 5: Verifying config extends base-js...');
try {
  const config = await import('@jmlweb/eslint-config-base');
  const flatConfig = config.default;

  // Check that config has TypeScript-specific configuration
  const hasTypeScriptConfig = flatConfig.some(cfg =>
    cfg.languageOptions?.parserOptions?.project !== undefined ||
    cfg.files?.some(pattern => pattern.includes('.ts'))
  );

  if (hasTypeScriptConfig) {
    log.success('Config includes TypeScript-specific configuration');
  } else {
    log.error('Config missing TypeScript-specific configuration');
  }
} catch (error) {
  log.error(`Failed to verify config structure: ${error.message}`);
}

if (hasErrors) {
  console.log(chalk.red.bold('\n❌ Tests failed\n'));
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n✅ All tests passed\n'));
  process.exit(0);
}
