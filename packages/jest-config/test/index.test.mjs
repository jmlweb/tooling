import { runCLI } from 'jest';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

import { createJestConfig } from '../src/index.ts';

const PASSING_TEST = "test('passes', () => { expect(1).toBe(1); });\n";
const FAILING_TEST = "test('fails', () => { expect(1).toBe(2); });\n";
// jest.mock runs after the require only if babel-jest hoists it
const HOISTED_MOCK_TEST = [
  "const dependency = require('./dependency');",
  "jest.mock('./dependency', () => 'mocked');",
  "test('uses the hoisted mock', () => { expect(dependency).toBe('mocked'); });",
  '',
].join('\n');
const DEPENDENCY = "module.exports = 'real';\n";
const SOURCE = 'module.exports = (a, b) => a + b;\n';
const SOURCE_TEST =
  "const sum = require('./sum');\ntest('sums', () => { expect(sum(1, 2)).toBe(3); });\n";

// The temp project has no node_modules, so the default transformers
// would not resolve from its rootDir
const resolveTransformer = (transformer) => {
  const resolveFromHere = createRequire(import.meta.url).resolve;
  if (typeof transformer === 'string') {
    return resolveFromHere(transformer);
  }
  const [name, options] = transformer;
  return [resolveFromHere(name), options];
};

const defaultConfigWithResolvableTransform = () => {
  const { transform } = createJestConfig();
  const resolvedTransform = Object.fromEntries(
    Object.entries(transform).map(([pattern, transformer]) => [
      pattern,
      resolveTransformer(transformer),
    ]),
  );
  // runCLI loads this as a project config, where Jest warns about the
  // global-only coverage options
  const {
    coverageThreshold: _threshold,
    coverageReporters: _reporters,
    ...config
  } = createJestConfig({ transform: resolvedTransform });
  return config;
};

const writeFiles = async (root, files) => {
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(root, path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content);
  }
};

/**
 * Runs Jest with the default config against a project whose ancestor
 * directories include one named after each default ignore pattern
 */
const runInsideAncestor = async (ancestorName, files, cliOptions = {}) => {
  const tempRoot = await realpath(
    await mkdtemp(join(tmpdir(), 'jest-config-')),
  );
  const projectDir = join(tempRoot, ancestorName, 'project');
  await writeFiles(projectDir, files);
  // babel-jest only instruments files for coverage when Jest runs from the
  // project directory, as it does in a real project
  const previousCwd = process.cwd();
  process.chdir(projectDir);

  try {
    const { results } = await runCLI(
      {
        _: [],
        $0: 'jest',
        config: JSON.stringify({
          ...defaultConfigWithResolvableTransform(),
          rootDir: projectDir,
        }),
        ci: true,
        cache: false,
        silent: true,
        watchman: false,
        passWithNoTests: true,
        ...cliOptions,
      },
      [projectDir],
    );
    return results;
  } finally {
    process.chdir(previousCwd);
    await rm(tempRoot, { recursive: true, force: true });
  }
};

/**
 * Resolves <rootDir> the way Jest does before matching absolute paths
 */
const resolvePatterns = (patterns, rootDir) =>
  patterns.map(
    (pattern) =>
      new RegExp(
        pattern.replace(
          '<rootDir>',
          rootDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        ),
      ),
  );

const PATTERN_ANCESTOR_NAMES = ['build', 'dist', '.git', '.cache', 'coverage'];

await test('default ignore patterns are anchored to rootDir', async (t) => {
  const { testPathIgnorePatterns, coveragePathIgnorePatterns } =
    createJestConfig();

  for (const ancestorName of PATTERN_ANCESTOR_NAMES) {
    const rootDir = `/home/user/${ancestorName}/project`;

    await t.test(
      `does not ignore project files under an ancestor named ${ancestorName}`,
      () => {
        const testPatterns = resolvePatterns(testPathIgnorePatterns, rootDir);
        const coveragePatterns = resolvePatterns(
          coveragePathIgnorePatterns,
          rootDir,
        );

        assert.ok(
          !testPatterns.some((pattern) =>
            pattern.test(`${rootDir}/src/app.test.ts`),
          ),
        );
        assert.ok(
          !coveragePatterns.some((pattern) =>
            pattern.test(`${rootDir}/src/app.ts`),
          ),
        );
      },
    );
  }

  await t.test('still ignores the project output directories', () => {
    const rootDir = '/home/user/project';
    const testPatterns = resolvePatterns(testPathIgnorePatterns, rootDir);
    const coveragePatterns = resolvePatterns(
      coveragePathIgnorePatterns,
      rootDir,
    );

    for (const directory of [
      'dist',
      'build',
      '.git',
      '.cache',
      'node_modules',
      'a/node_modules',
    ]) {
      assert.ok(
        testPatterns.some((pattern) =>
          pattern.test(`${rootDir}/${directory}/app.test.ts`),
        ),
      );
    }
    for (const directory of [
      'dist',
      'build',
      'coverage',
      'node_modules',
      'a/node_modules',
    ]) {
      assert.ok(
        coveragePatterns.some((pattern) =>
          pattern.test(`${rootDir}/${directory}/app.ts`),
        ),
      );
    }
  });
});

// Jest itself skips every path containing /.git/ (jest-haste-map VCS
// directories), so .git is only covered by the pattern test above
const ANCESTOR_NAMES = ['build', 'dist', '.cache', 'coverage'];

for (const ancestorName of ANCESTOR_NAMES) {
  await test(`default config inside an ancestor directory named ${ancestorName}`, async (t) => {
    await t.test('finds and runs the project tests', async () => {
      const results = await runInsideAncestor(ancestorName, {
        'src/app.test.js': PASSING_TEST,
      });

      assert.equal(results.numTotalTests, 1);
      assert.equal(results.numPassedTests, 1);
    });

    await t.test('collects coverage from the project sources', async () => {
      const results = await runInsideAncestor(
        ancestorName,
        { 'src/sum.js': SOURCE, 'src/sum.test.js': SOURCE_TEST },
        { coverage: true, coverageReporters: ['json'] },
      );

      const coveredFiles = Object.keys(results.coverageMap?.data ?? {});
      assert.equal(results.numPassedTests, 1);
      assert.equal(coveredFiles.length, 1);
      assert.match(coveredFiles[0], /src[/\\]sum\.js$/);
    });
  });
}

await test('default config still ignores the project output directories', async () => {
  const results = await runInsideAncestor('plain', {
    'src/app.test.js': PASSING_TEST,
    'build/app.test.js': FAILING_TEST,
    'dist/app.test.js': FAILING_TEST,
    '.cache/app.test.js': FAILING_TEST,
    'node_modules/dep/app.test.js': FAILING_TEST,
    'packages/a/node_modules/dep/app.test.js': FAILING_TEST,
  });

  assert.equal(results.numTotalTests, 1);
  assert.equal(results.numPassedTests, 1);
});

const JS_PATTERN = '^.+\\.jsx?$';
const TS_PATTERN = '^.+\\.tsx?$';

await test('default transform', async (t) => {
  const { transform } = createJestConfig();

  await t.test('handles .js and .jsx files with babel-jest', () => {
    assert.equal(transform[JS_PATTERN], 'babel-jest');
    const jsPattern = new RegExp(JS_PATTERN);
    assert.ok(jsPattern.test('src/app.test.js'));
    assert.ok(jsPattern.test('src/app.test.jsx'));
    assert.ok(!jsPattern.test('src/app.test.ts'));
  });

  await t.test('keeps ts-jest for .ts and .tsx files', () => {
    assert.equal(transform[TS_PATTERN][0], 'ts-jest');
  });

  await t.test('hoists jest.mock in .js tests', async () => {
    const results = await runInsideAncestor('plain', {
      'src/dependency.js': DEPENDENCY,
      'src/hoisting.test.js': HOISTED_MOCK_TEST,
    });

    assert.equal(results.numTotalTests, 1);
    assert.equal(results.numPassedTests, 1);
  });
});

await test('a custom transform replaces the default entirely', () => {
  const customTransform = { '^.+\\.mjs$': 'custom-transformer' };

  const { transform } = createJestConfig({ transform: customTransform });

  assert.deepEqual(transform, customTransform);
});
