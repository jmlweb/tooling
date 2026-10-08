# @jmlweb/vitest-config

## 3.0.0

### Major Changes

- e2b1805: Require Node.js >= 22.12.0. Node.js 18 and 20 are end-of-life, and 22.12.0 is the first Node.js 22 release that can `require()` ES modules without a flag, which the CommonJS builds need to load ESM-only plugins.

## 2.0.1

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.

## 2.0.0

### Major Changes

- b2e7aa5: Update to Vitest v4 with automatic thread pool management

## 1.0.7

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions

## 1.0.6

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm

## 1.0.5

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs

## 1.0.4

### Patch Changes

- beae5ae: Add trailing newlines to source files for consistency.

## 1.0.3

### Patch Changes

- 21918eb: Standardize repository field format to object format across all packages and configure syncpack to preserve it.

## 1.0.2

### Patch Changes

- 2208f74: Standardize repository field format to object format across all packages and configure syncpack to preserve it.

## 1.0.1

### Patch Changes

- d75c258: fix: update vitest peer dependency to support newer versions

  Updated the vitest peer dependency from `^1.0.0` to `>=1.0.0` to support vitest 2.x, 3.x, and 4.x versions, resolving peer dependency warnings in modern projects.
