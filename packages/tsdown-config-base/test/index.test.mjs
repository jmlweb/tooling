import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { build } from 'tsdown';

import { createTsdownCliConfig, TsdownConfigError } from '../src/index.ts';

const SHEBANG = '#!/usr/bin/env node';
const USER_BANNER = '/* license */';

/**
 * Calls the composed banner the way tsdown does, once per output chunk
 */
const bannerFor = (banner, fileName) => {
  assert.equal(typeof banner, 'function', 'banner should be a function');
  return banner({ format: 'es', fileName });
};

const BANNER_FORMS = [
  { form: 'string', banner: USER_BANNER },
  { form: 'object', banner: { js: USER_BANNER, dts: USER_BANNER } },
  { form: 'function', banner: () => ({ js: USER_BANNER, dts: USER_BANNER }) },
  { form: 'function returning a string', banner: () => USER_BANNER },
];

for (const { form, banner } of BANNER_FORMS) {
  const resolveUserBanner = (fileName) =>
    typeof banner === 'function' ? banner({ format: 'es', fileName }) : banner;

  await test(`createTsdownCliConfig with a ${form} banner`, async (t) => {
    await t.test('prepends the shebang to the targeted JS output', () => {
      const config = createTsdownCliConfig({ banner });
      const userBanner = resolveUserBanner('cli.js');
      // tsdown applies a string banner to every output type
      const userBannerObject =
        typeof userBanner === 'string'
          ? { js: userBanner, css: userBanner, dts: userBanner }
          : userBanner;

      assert.deepEqual(bannerFor(config.banner, 'cli.js'), {
        ...userBannerObject,
        js: `${SHEBANG}\n${USER_BANNER}`,
      });
    });

    await t.test('keeps the user banner on declaration files', () => {
      const config = createTsdownCliConfig({ banner });
      const result = bannerFor(config.banner, 'cli.d.ts');

      const dts = typeof result === 'string' ? result : result?.dts;
      assert.equal(dts, USER_BANNER);
    });

    await t.test(
      'returns the user banner unchanged for entries without a shebang',
      () => {
        const config = createTsdownCliConfig({ banner, shebang: 'cli' });

        assert.deepEqual(
          bannerFor(config.banner, 'index.js'),
          resolveUserBanner('index.js'),
        );
      },
    );
  });
}

await test('createTsdownCliConfig banner edge cases', async (t) => {
  await t.test('keeps the user banner when the shebang is disabled', () => {
    const config = createTsdownCliConfig({
      banner: USER_BANNER,
      shebang: false,
    });

    assert.equal(config.banner, USER_BANNER);
  });

  await t.test('takes the banner from the deprecated options bag too', () => {
    const config = createTsdownCliConfig({ options: { banner: USER_BANNER } });

    assert.deepEqual(bannerFor(config.banner, 'cli.js'), {
      js: `${SHEBANG}\n${USER_BANNER}`,
      css: USER_BANNER,
      dts: USER_BANNER,
    });
  });

  await t.test(
    'does not add a second shebang when the user banner has one',
    () => {
      const config = createTsdownCliConfig({ banner: { js: SHEBANG } });

      assert.deepEqual(bannerFor(config.banner, 'cli.js'), { js: SHEBANG });
    },
  );

  await t.test(
    'still rejects a banner set both at the top level and in options',
    () => {
      assert.throws(
        () =>
          createTsdownCliConfig({
            banner: USER_BANNER,
            options: { banner: USER_BANNER },
          }),
        TsdownConfigError,
      );
    },
  );
});

await test('createTsdownCliConfig build emits the shebang on the first line, followed by the user banner', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'tsdown-config-base-'));
  try {
    // `fixedExtension: false` derives `.js` for ESM from the package type
    await writeFile(join(cwd, 'package.json'), '{ "type": "module" }\n');
    await writeFile(join(cwd, 'cli.ts'), 'console.log("hello");\n');
    await writeFile(join(cwd, 'index.ts'), 'export const answer = 42;\n');

    await build({
      ...createTsdownCliConfig({
        entry: { cli: 'cli.ts', index: 'index.ts' },
        shebang: 'cli',
        banner: USER_BANNER,
        dts: false,
        target: 'node22',
      }),
      cwd,
      config: false,
      logLevel: 'silent',
    });

    const readLines = async (file) =>
      (await readFile(join(cwd, file), 'utf8')).split('\n');
    const cliLines = await readLines('dist/cli.js');
    const indexLines = await readLines('dist/index.js');

    assert.equal(cliLines[0], SHEBANG);
    assert.equal(cliLines[1], USER_BANNER);
    assert.equal(indexLines[0], USER_BANNER);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
