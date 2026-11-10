import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { createTsupCliConfig, TsupConfigError } from '../src/index.ts';

const execFileAsync = promisify(execFile);
const SHEBANG = '#!/usr/bin/env node';
const BUILD_SCRIPT = fileURLToPath(
  new URL('./fixtures/build.mjs', import.meta.url),
);

const asArray = (config) => (Array.isArray(config) ? config : [config]);

const entriesWithShebang = (config) =>
  Object.assign(
    {},
    ...asArray(config)
      .filter((part) => part.banner?.js === SHEBANG)
      .map((part) => part.entry),
  );

const entriesWithoutShebang = (config) =>
  Object.assign(
    {},
    ...asArray(config)
      .filter((part) => part.banner === undefined)
      .map((part) => part.entry),
  );

const listFiles = async (directory) => {
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(directory, join(entry.parentPath, entry.name)))
    .toSorted();
};

/**
 * Builds the configs with tsup in a child process whose cwd is the fixture,
 * because tsup resolves entries against the cwd at build time
 */
const buildInDirectory = async (cwd, configs) => {
  await execFileAsync(
    process.execPath,
    [BUILD_SCRIPT, JSON.stringify(configs)],
    { cwd },
  );
};

await test('createTsupCliConfig with an array entry and a selective shebang', async (t) => {
  await t.test('keeps entries that share a basename', () => {
    const config = createTsupCliConfig({
      entry: ['src/cli.ts', 'src/admin/cli.ts'],
      shebang: 'cli',
    });

    assert.deepEqual(entriesWithShebang(config), { cli: 'src/cli.ts' });
    assert.deepEqual(entriesWithoutShebang(config), {
      'admin/cli': 'src/admin/cli.ts',
    });
  });

  await t.test(
    'names nested entries by their path relative to the common directory',
    () => {
      const config = createTsupCliConfig({
        entry: ['./src/bin/cli.ts', 'src/index.ts'],
        shebang: 'bin/cli',
      });

      assert.deepEqual(entriesWithShebang(config), {
        'bin/cli': './src/bin/cli.ts',
      });
      assert.deepEqual(entriesWithoutShebang(config), {
        index: 'src/index.ts',
      });
    },
  );

  await t.test('names a single entry by its basename', () => {
    const config = createTsupCliConfig({
      entry: ['src/cli.ts'],
      shebang: 'cli',
    });

    assert.deepEqual(entriesWithShebang(config), { cli: 'src/cli.ts' });
  });

  await t.test(
    'keeps the common directory when entries live in sibling folders',
    () => {
      const config = createTsupCliConfig({
        entry: ['src/cli.ts', 'lib/index.ts'],
        shebang: 'src/cli',
      });

      assert.deepEqual(entriesWithShebang(config), { 'src/cli': 'src/cli.ts' });
      assert.deepEqual(entriesWithoutShebang(config), {
        'lib/index': 'lib/index.ts',
      });
    },
  );

  await t.test('throws when two entries map to the same output name', () => {
    assert.throws(
      () =>
        createTsupCliConfig({
          entry: ['src/cli.ts', 'src/cli.js'],
          shebang: 'cli',
        }),
      (error) =>
        error instanceof TsupConfigError &&
        error.message.includes('src/cli.ts') &&
        error.message.includes('src/cli.js'),
    );
  });

  await t.test('throws when a shebang name matches no entry', () => {
    assert.throws(
      () =>
        createTsupCliConfig({
          entry: ['src/bin/cli.ts', 'src/index.ts'],
          shebang: 'cli',
        }),
      (error) =>
        error instanceof TsupConfigError &&
        error.message.includes('"cli"') &&
        error.message.includes('bin/cli'),
    );
  });

  await t.test('throws on glob patterns, which it cannot name', () => {
    assert.throws(
      () => createTsupCliConfig({ entry: ['src/**/*.ts'], shebang: 'cli' }),
      (error) =>
        error instanceof TsupConfigError &&
        error.message.includes('src/**/*.ts'),
    );
  });

  await t.test('produces the same output paths as the array form', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'tsup-config-base-'));
    t.after(() => rm(directory, { recursive: true, force: true }));
    await mkdir(join(directory, 'src/admin'), { recursive: true });
    await writeFile(join(directory, 'package.json'), '{"type":"module"}\n');
    await writeFile(join(directory, 'src/cli.ts'), 'export const cli = 1;\n');
    await writeFile(
      join(directory, 'src/admin/cli.ts'),
      'export const admin = 2;\n',
    );

    const entry = ['src/cli.ts', 'src/admin/cli.ts'];
    const common = { format: ['esm'], dts: false, target: 'node22' };
    await buildInDirectory(directory, [
      createTsupCliConfig({
        entry,
        shebang: false,
        outDir: 'dist-array',
        ...common,
      }),
    ]);
    await buildInDirectory(
      directory,
      asArray(
        createTsupCliConfig({
          entry,
          shebang: 'cli',
          outDir: 'dist-selective',
          ...common,
        }),
      ),
    );

    const arrayFiles = await listFiles(join(directory, 'dist-array'));
    assert.deepEqual(arrayFiles, ['admin/cli.js', 'cli.js']);
    assert.deepEqual(
      await listFiles(join(directory, 'dist-selective')),
      arrayFiles,
    );
  });
});

await test('createTsupCliConfig keeps the array form untouched without a selective shebang', () => {
  const entry = ['src/cli.ts', 'src/admin/cli.ts'];

  assert.deepEqual(createTsupCliConfig({ entry, shebang: true }).entry, entry);
  assert.deepEqual(createTsupCliConfig({ entry, shebang: false }).entry, entry);
});
