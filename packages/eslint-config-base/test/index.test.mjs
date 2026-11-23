import { ESLint } from 'eslint';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import config from '../src/index.ts';

const JAVASCRIPT_FILES = ['plain.js', 'module.mjs', 'common.cjs'];
const TYPESCRIPT_FILES = ['plain.ts', 'component.tsx'];

// `debugger` trips `no-debugger` from @eslint/js recommended (base-js)
const JAVASCRIPT_SOURCE = 'debugger;\n';
// An unhandled promise trips a rule that needs type information
const TYPESCRIPT_SOURCE =
  'export const run = (): void => {\n  Promise.resolve(1);\n};\n';

const TSCONFIG = {
  compilerOptions: { strict: true, jsx: 'preserve', noEmit: true },
  include: ['**/*.ts', '**/*.tsx'],
};

const ruleIdsOf = (result) => result.messages.map((message) => message.ruleId);

const createProject = async () => {
  // realpath: typescript-eslint matches files against the resolved tsconfig path
  const cwd = await realpath(
    await mkdtemp(join(tmpdir(), 'eslint-config-base-')),
  );
  await writeFile(join(cwd, 'tsconfig.json'), JSON.stringify(TSCONFIG));
  await Promise.all([
    ...JAVASCRIPT_FILES.map((file) =>
      writeFile(join(cwd, file), JAVASCRIPT_SOURCE),
    ),
    ...TYPESCRIPT_FILES.map((file) =>
      writeFile(join(cwd, file), TYPESCRIPT_SOURCE),
    ),
  ]);
  return cwd;
};

const cwd = await createProject();
const eslint = new ESLint({
  cwd,
  overrideConfigFile: true,
  overrideConfig: config,
});

try {
  await test('eslint-config-base on JavaScript files', async (t) => {
    for (const file of JAVASCRIPT_FILES) {
      await t.test(
        `lints ${file} with base-js rules instead of throwing`,
        async () => {
          const [result] = await eslint.lintFiles([file]);
          assert.equal(result.fatalErrorCount, 0);
          assert.ok(ruleIdsOf(result).includes('no-debugger'));
        },
      );
    }
  });

  await test('eslint-config-base on TypeScript files', async (t) => {
    for (const file of TYPESCRIPT_FILES) {
      await t.test(`runs type-aware rules on ${file}`, async () => {
        const [result] = await eslint.lintFiles([file]);
        assert.equal(result.fatalErrorCount, 0);
        assert.ok(
          ruleIdsOf(result).includes('@typescript-eslint/no-floating-promises'),
        );
      });
    }
  });
} finally {
  await rm(cwd, { recursive: true, force: true });
}
