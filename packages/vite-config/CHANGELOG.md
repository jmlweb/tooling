# @jmlweb/vite-config

## 2.0.2

### Patch Changes

- 980c029: Fix production builds on Vite 8. The config no longer sets `minify: 'esbuild'`, which fails on Vite 8 unless `esbuild` is installed; Vite's own default minifier is used instead (esbuild up to Vite 7, Oxc from Vite 8). The `minify` option now accepts every value of the installed Vite, including `'oxc'`. A no-op `rollupOptions` block (deprecated in Vite 8) is removed.

## 2.0.1

### Patch Changes

- 8c18e15: Declare the exported options types with `type` instead of `interface`. Their shape is unchanged; only declaration merging into them is no longer possible. `@jmlweb/jest-config` also omits `setupFilesAfterEnv` and `moduleNameMapper` without deleting keys, with the same resulting config.

## 2.0.0

### Major Changes

- e2b1805: Require Node.js >= 22.12.0. Node.js 18 and 20 are end-of-life, and 22.12.0 is the first Node.js 22 release that can `require()` ES modules without a flag, which the CommonJS builds need to load ESM-only plugins.

## 1.0.1

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.

## 1.0.0

### Major Changes

- b2e7aa5: Update to Vite v7 and @vitejs/plugin-react v5

## 0.1.5

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions

## 0.1.4

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm

## 0.1.3

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs

## 0.1.2

### Patch Changes

- 21918eb: Standardize repository field format to object format across all packages and configure syncpack to preserve it.

## 0.1.1

### Patch Changes

- 2208f74: Standardize repository field format to object format across all packages and configure syncpack to preserve it.

## 0.1.0

### Minor Changes

- f2898aa: Create shared Vite configuration package with base config factory and React helper
