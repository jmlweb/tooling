# @jmlweb/eslint-config-base

## 2.1.1

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.
- Updated dependencies [4e175ad]
  - @jmlweb/eslint-config-base-js@1.1.1

## 2.1.0

### Minor Changes

- 0a600dd: Support ESLint 10 and align the peer dependency ranges across the ESLint configs.
  - `@jmlweb/eslint-config-base-js`, `-base`, `-node` and `-astro`: `eslint` and `@eslint/js` peers are now `^9.0.0 || ^10.0.0`. ESLint 9 keeps working.
  - `@jmlweb/eslint-config-node`: `globals` peer is now `^15.0.0 || ^16.0.0 || ^17.0.0` (was `^15.0.0`).
  - `@jmlweb/eslint-config-node`, `-react` and `-astro`: `eslint-config-prettier` peer is now `^9.1.0 || ^10.0.0`, matching `-base` and `-base-js` (was `^9.1.0`).
  - `@jmlweb/eslint-config-react`: still ESLint 9 only. `eslint-plugin-react` 7.37.5 does not support ESLint 10, and its `settings.react.version: 'detect'` crashes on it. Only the `eslint-config-prettier` peer range changed.

### Patch Changes

- Updated dependencies [0a600dd]
  - @jmlweb/eslint-config-base-js@1.1.0

## 2.0.10

### Patch Changes

- 438edae: Disable explicit-function-return-type rule by default

  This rule was too strict for utility libraries and functional programming patterns where return types can be inferred. Projects that want stricter enforcement can re-enable it in their own eslint.config.js.

## 2.0.9

### Patch Changes

- Updated dependencies [42de51d]
  - @jmlweb/eslint-config-base-js@1.0.6

## 2.0.8

### Patch Changes

- c1cbae0: Support eslint-config-prettier v9 and v10 in peer dependencies

## 2.0.7

### Patch Changes

- ecb3620: Update dev dependencies to latest stable versions

## 2.0.6

### Patch Changes

- 0c32641: Update dependencies to latest stable versions

## 2.0.5

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions
- Updated dependencies [30f8ffb]
  - @jmlweb/eslint-config-base-js@1.0.5

## 2.0.4

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm
- Updated dependencies [4a9ece1]
  - @jmlweb/eslint-config-base-js@1.0.4

## 2.0.3

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs
- Updated dependencies [6b73301]
  - @jmlweb/eslint-config-base-js@1.0.3

## 2.0.2

### Patch Changes

- 21918eb: Standardize repository field format to object format across all packages and configure syncpack to preserve it.
- Updated dependencies [21918eb]
  - @jmlweb/eslint-config-base-js@1.0.2

## 2.0.1

### Patch Changes

- 2208f74: Standardize repository field format to object format across all packages and configure syncpack to preserve it.
- Updated dependencies [2208f74]
  - @jmlweb/eslint-config-base-js@1.0.1

## 2.0.0

### Major Changes

- fb7ebe3: Enforce named exports only by adding no-restricted-exports rule
