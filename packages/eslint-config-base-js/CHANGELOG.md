# @jmlweb/eslint-config-base-js

## 1.1.1

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.

## 1.1.0

### Minor Changes

- 0a600dd: Support ESLint 10 and align the peer dependency ranges across the ESLint configs.
  - `@jmlweb/eslint-config-base-js`, `-base`, `-node` and `-astro`: `eslint` and `@eslint/js` peers are now `^9.0.0 || ^10.0.0`. ESLint 9 keeps working.
  - `@jmlweb/eslint-config-node`: `globals` peer is now `^15.0.0 || ^16.0.0 || ^17.0.0` (was `^15.0.0`).
  - `@jmlweb/eslint-config-node`, `-react` and `-astro`: `eslint-config-prettier` peer is now `^9.1.0 || ^10.0.0`, matching `-base` and `-base-js` (was `^9.1.0`).
  - `@jmlweb/eslint-config-react`: still ESLint 9 only. `eslint-plugin-react` 7.37.5 does not support ESLint 10, and its `settings.react.version: 'detect'` crashes on it. Only the `eslint-config-prettier` peer range changed.

## 1.0.6

### Patch Changes

- 42de51d: Update eslint-config-prettier peer dependency to support both v9 and v10

## 1.0.5

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions

## 1.0.4

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm

## 1.0.3

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs

## 1.0.2

### Patch Changes

- 21918eb: Standardize repository field format to object format across all packages and configure syncpack to preserve it.

## 1.0.1

### Patch Changes

- 2208f74: Standardize repository field format to object format across all packages and configure syncpack to preserve it.
