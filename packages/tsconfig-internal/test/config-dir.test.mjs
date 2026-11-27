import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const fixtureProject = fileURLToPath(
  new URL('./fixture/tsconfig.json', import.meta.url),
);

const showConfig = (project) =>
  JSON.parse(
    execFileSync('tsc', ['--showConfig', '-p', project], { encoding: 'utf8' }),
  );

const { compilerOptions } = showConfig(fixtureProject);

await test('outDir resolves to the extending package, not tsconfig-internal', () => {
  assert.equal(compilerOptions.outDir, './dist');
});

await test('rootDir resolves to the extending package src/', () => {
  assert.equal(compilerOptions.rootDir, './src');
});
