#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tests = [
  { name: 'Prettier Base', script: 'test-prettier-base.mjs' },
  { name: 'Prettier Tailwind', script: 'test-prettier-tailwind.mjs' },
  { name: 'ESLint JavaScript', script: 'test-eslint-js.mjs' },
  { name: 'ESLint TypeScript', script: 'test-eslint-ts.mjs' },
  { name: 'TypeScript Config', script: 'test-tsconfig.mjs' },
];

const results = [];

console.log(chalk.bold.cyan('\n🧪 Running all validation tests...\n'));

const runTest = (test) => {
  return new Promise((resolvePromise) => {
    const startTime = Date.now();
    const scriptPath = resolve(__dirname, test.script);

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: false,
    });

    child.on('exit', (code) => {
      const duration = Date.now() - startTime;
      const passed = code === 0;

      results.push({
        name: test.name,
        passed,
        duration,
      });

      resolvePromise();
    });

    child.on('error', (error) => {
      results.push({
        name: test.name,
        passed: false,
        duration: Date.now() - startTime,
        error: error.message,
      });

      resolvePromise();
    });
  });
};

const runAllTests = async () => {
  for (const test of tests) {
    await runTest(test);
  }

  // Print summary
  console.log(chalk.bold.cyan('\n📊 Test Summary\n'));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  results.forEach((result) => {
    const icon = result.passed ? chalk.green('✓') : chalk.red('✗');
    const status = result.passed ? chalk.green('PASS') : chalk.red('FAIL');
    const duration = chalk.gray(`(${result.duration}ms)`);

    console.log(`${icon} ${status} ${result.name} ${duration}`);

    if (result.error) {
      console.log(chalk.red(`  Error: ${result.error}`));
    }
  });

  console.log();

  if (failed === 0) {
    console.log(
      chalk.green.bold(`✅ All ${total} test suites passed!\n`),
    );
    process.exit(0);
  } else {
    console.log(
      chalk.red.bold(`❌ ${failed} of ${total} test suites failed\n`),
    );
    process.exit(1);
  }
};

runAllTests().catch((error) => {
  console.error(chalk.red('Fatal error running tests:'), error);
  process.exit(1);
});
