# @jmlweb/eslint-config-node

## 3.0.0

### Minor Changes

- adc9c6a: Support ESLint 10 and align the peer dependency ranges across the ESLint configs.
  - `@jmlweb/eslint-config-base-js`, `-base`, `-node` and `-astro`: `eslint` and `@eslint/js` peers are now `^9.0.0 || ^10.0.0`. ESLint 9 keeps working.
  - `@jmlweb/eslint-config-node`: `globals` peer is now `^15.0.0 || ^16.0.0 || ^17.0.0` (was `^15.0.0`).
  - `@jmlweb/eslint-config-node`, `-react` and `-astro`: `eslint-config-prettier` peer is now `^9.1.0 || ^10.0.0`, matching `-base` and `-base-js` (was `^9.1.0`).
  - `@jmlweb/eslint-config-react`: still ESLint 9 only. `eslint-plugin-react` 7.37.5 does not support ESLint 10, and its `settings.react.version: 'detect'` crashes on it. Only the `eslint-config-prettier` peer range changed.

### Patch Changes

- Updated dependencies [adc9c6a]
  - @jmlweb/eslint-config-base@2.1.0

## 2.0.11

### Patch Changes

- Updated dependencies [438edae]
  - @jmlweb/eslint-config-base@2.0.10

## 2.0.10

### Patch Changes

- @jmlweb/eslint-config-base@2.0.9

## 2.0.9

### Patch Changes

- Updated dependencies [c1cbae0]
  - @jmlweb/eslint-config-base@2.0.8

## 2.0.8

### Patch Changes

- ecb3620: Update dev dependencies to latest stable versions
- Updated dependencies [ecb3620]
  - @jmlweb/eslint-config-base@2.0.7

## 2.0.7

### Patch Changes

- 0c32641: Update dependencies to latest stable versions
- Updated dependencies [0c32641]
  - @jmlweb/eslint-config-base@2.0.6

## 2.0.6

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions
- Updated dependencies [30f8ffb]
  - @jmlweb/eslint-config-base@2.0.5

## 2.0.5

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm
- Updated dependencies [4a9ece1]
  - @jmlweb/eslint-config-base@2.0.4

## 2.0.4

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs
- Updated dependencies [6b73301]
  - @jmlweb/eslint-config-base@2.0.3

## 2.0.3

### Patch Changes

- beae5ae: Add trailing newlines to source files for consistency.

## 2.0.2

### Patch Changes

- 21918eb: Standardize repository field format to object format across all packages and configure syncpack to preserve it.
- Updated dependencies [21918eb]
  - @jmlweb/eslint-config-base@2.0.2

## 2.0.1

### Patch Changes

- 2208f74: Standardize repository field format to object format across all packages and configure syncpack to preserve it.
- Updated dependencies [2208f74]
  - @jmlweb/eslint-config-base@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [fb7ebe3]
  - @jmlweb/eslint-config-base@2.0.0
