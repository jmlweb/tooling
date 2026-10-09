#!/usr/bin/env node

import chalk from 'chalk';

import {
  createTestFile,
  execInTestProject,
  initTestProject,
  installDependencies,
  readTestFile,
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

const OXLINT_DEPS = {
  oxlint: '^1.87.0',
  'oxlint-tsgolint': '^7.0.2003',
};

const TSCONFIG = {
  compilerOptions: {
    strict: true,
    module: 'nodenext',
    target: 'es2022',
    jsx: 'react-jsx',
    noEmit: true,
    skipLibCheck: true,
  },
  include: ['oxc-fixtures'],
};

/**
 * Lint fixtures run with every config, so each case asserts the rules that
 * prove its layers work: native, type-aware and JS plugin rules
 */
const OXLINT_CASES = [
  {
    name: '@jmlweb/oxlint-config-base',
    peerDeps: {},
    files: {
      'oxc-fixtures/base.ts': `enum Mode {
  On,
}

const load = async (): Promise<Mode> => Mode.On;

export default load;

load();
`,
    },
    expectedRules: [
      // JS plugin bundled with the package
      'jmlweb(no-enum)',
      // Native rule
      'import(no-default-export)',
      // Type-aware rule
      'typescript(no-floating-promises)',
    ],
  },
  {
    name: '@jmlweb/oxlint-config-react',
    peerDeps: {
      '@eslint-react/eslint-plugin': '^5.24.9',
      'eslint-plugin-perfectionist': '^5.12.1',
    },
    files: {
      'oxc-fixtures/Timer.tsx': `import { useEffect, useState } from 'react';

export const Timer = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    const [start] = useState(Date.now());
    console.log(start);
  }
  useEffect(() => {
    setTimeout(() => undefined, 100);
  }, []);
  return <button onClick={() => undefined} type="button" disabled />;
};
`,
    },
    expectedRules: [
      // Native hooks and React Compiler rules
      'react-hooks(rules-of-hooks)',
      'react(purity)',
      // @eslint-react JS plugin
      '@eslint-react(web-api-no-leaked-timeout)',
      // eslint-plugin-perfectionist JS plugin
      'perfectionist(sort-jsx-props)',
    ],
  },
  {
    name: '@jmlweb/oxlint-config-node',
    peerDeps: {
      'eslint-plugin-n': '^18.4.1',
    },
    files: {
      'oxc-fixtures/server.ts': `import fs from 'fs';

export const start = (): void => {
  fs.readFile(__dirname + '/config.json', () => undefined);
  process.exit(1);
};
`,
    },
    expectedRules: [
      // Native rule
      'node(no-path-concat)',
      // eslint-plugin-n JS plugin
      'n(prefer-node-protocol)',
      'n(no-process-exit)',
      'n(prefer-promises/fs)',
    ],
  },
];

export async function testOxcConfigs(packages) {
  log.section('Testing Oxc Config Packages');

  const oxfmtPackage = packages.find(
    (pkg) => pkg.name === '@jmlweb/oxfmt-config-base',
  );
  if (oxfmtPackage) {
    await testOxfmtPackage(oxfmtPackage, packages);
  } else {
    log.info('No Oxfmt config package found, skipping');
  }

  for (const testCase of OXLINT_CASES) {
    const pkg = packages.find((candidate) => candidate.name === testCase.name);
    if (!pkg) {
      log.info(`${testCase.name} not found, skipping`);
      continue;
    }
    await testOxlintPackage(pkg, testCase, packages);
  }
}

async function testOxfmtPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  initTestProject(allPackages);
  installDependencies({ oxfmt: '^0.72.0' });

  createTestFile(
    'oxfmt.config.ts',
    `import baseConfig from '${pkg.name}';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
});
`,
  );
  createTestFile(
    'oxc-fixtures/format.ts',
    `import { join } from "./paths";
import type { Stats } from "node:fs";
import { readFile } from "node:fs/promises";
export const read = (file: Stats, name: string) => readFile(join(name), "utf8").then((content) => content.trim())
`,
  );

  log.info('Test 1: --check reports the unformatted file...');
  const check = runTool('oxfmt --check oxc-fixtures/format.ts');
  if (check.status === 0) {
    log.error('oxfmt --check passed on an unformatted file');
  }
  log.success('Unformatted file reported');

  log.info('Test 2: Formatting applies the config...');
  runTool('oxfmt oxc-fixtures/format.ts');
  const formatted = readTestFile('oxc-fixtures/format.ts');
  const expected = `import type { Stats } from 'node:fs';

import { readFile } from 'node:fs/promises';

import { join } from './paths';
export const read = (file: Stats, name: string) =>
  readFile(join(name), 'utf8').then((content) => content.trim());
`;
  if (formatted !== expected) {
    log.error(
      `Unexpected formatting.\nExpected:\n${expected}\nReceived:\n${formatted}`,
    );
  }
  log.success('Single quotes, 80 columns and Perfectionist import order');

  log.success(`✅ All tests passed for ${pkg.name}\n`);
}

async function testOxlintPackage(pkg, testCase, allPackages) {
  log.section(`Testing ${pkg.name}`);

  initTestProject(allPackages);
  installDependencies({ ...OXLINT_DEPS, ...testCase.peerDeps });

  createTestFile('tsconfig.json', JSON.stringify(TSCONFIG, null, 2));
  createTestFile(
    'oxlint.config.ts',
    `import sharedConfig from '${pkg.name}';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [sharedConfig],
  options: {
    typeAware: true,
  },
});
`,
  );
  for (const [filename, content] of Object.entries(testCase.files)) {
    createTestFile(filename, content);
  }

  log.info('Test 1: Linting fixtures with the config...');
  const result = runTool(
    `oxlint --format=json ${Object.keys(testCase.files).join(' ')}`,
  );
  const reported = new Set(
    JSON.parse(result.stdout).diagnostics.map(({ code }) => code),
  );
  const missing = testCase.expectedRules.filter((rule) => !reported.has(rule));
  if (missing.length > 0) {
    log.error(
      `Expected rules not reported: ${missing.join(', ')}\nReported: ${[...reported].join(', ')}`,
    );
  }
  log.success(`Reported ${testCase.expectedRules.join(', ')}`);

  log.success(`✅ All tests passed for ${pkg.name}\n`);
}

/**
 * Run a tool binary from the test project, returning its output even when it
 * exits with an error (Oxlint and `oxfmt --check` exit 1 on findings)
 */
function runTool(command) {
  try {
    const stdout = execInTestProject(`pnpm exec ${command}`, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, stdout };
  } catch (error) {
    if (typeof error.status !== 'number') {
      throw error;
    }
    return { status: error.status, stdout: error.stdout ?? '' };
  }
}
