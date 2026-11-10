# @jmlweb/tsup-config-base

## 2.0.5

### Patch Changes

- b790f95: Fix `createTsupCliConfig` dropping array entries that share a basename when `shebang` names specific entries. Array entries are now named by their path relative to the directory all entries share, without extension, so `['src/cli.ts', 'src/admin/cli.ts']` with `shebang: 'cli'` builds both `dist/cli.js` and `dist/admin/cli.js`, the same paths tsup produces for the array form.

  Nested array entries keep their folder on this path: `['src/bin/cli.ts', 'src/index.ts']` now builds `dist/bin/cli.js` instead of `dist/cli.js`, and the shebang targets it as `'bin/cli'`. A `TsupConfigError` is now thrown when two entries map to the same name, when an array entry is a glob, or when a `shebang` name matches no entry, instead of silently dropping an entry or the shebang.

## 2.0.4

### Patch Changes

- 5f0eeba: `createTsdownCliConfig` keeps the shebang when you set `banner`. The shebang goes on the first line of the shebang entries and your banner (string, object or function form) follows it on every output. Before, a user `banner` replaced the shebang without a warning. The `@jmlweb/tsup-config-base` README now states that a `banner` in `options` replaces the shebang in `createTsupCliConfig`.

## 2.0.3

### Patch Changes

- a0949a3: Document that tsup 9 requires Node.js >= 22.18.0.

## 2.0.2

### Patch Changes

- 30a45bc: Condense the README and sync versions, peer dependencies, requirements and migration notes with the package.

## 2.0.1

### Patch Changes

- 8c18e15: Declare the exported options types with `type` instead of `interface`. Their shape is unchanged; only declaration merging into them is no longer possible. `@jmlweb/jest-config` also omits `setupFilesAfterEnv` and `moduleNameMapper` without deleting keys, with the same resulting config.

## 2.0.0

### Major Changes

- e2b1805: Require Node.js >= 22.12.0. Node.js 18 and 20 are end-of-life, and 22.12.0 is the first Node.js 22 release that can `require()` ES modules without a flag, which the CommonJS builds need to load ESM-only plugins.

## 1.1.5

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.
- 4e175ad: Deprecate this package in favor of `@jmlweb/tsdown-config-base`, which keeps the same helper API and published file names. tsup is maintenance-only and recommends tsdown. The README now links to the migration guide.

## 1.1.4

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions

## 1.1.3

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm

## 1.1.2

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs

## 1.1.1

### Patch Changes

- 21918eb: Standardize repository field format to object format across all packages and configure syncpack to preserve it.

## 1.1.0

### Minor Changes

- 41b71c1: Add CLI preset with shebang support via createTsupCliConfig function

## 1.0.1

### Patch Changes

- 2208f74: Standardize repository field format to object format across all packages and configure syncpack to preserve it.
