# @jmlweb/eslint-config-astro

## 1.1.1

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.
- Updated dependencies [4e175ad]
  - @jmlweb/eslint-config-base@2.1.1

## 1.1.0

### Minor Changes

- 0a600dd: Support ESLint 10 and align the peer dependency ranges across the ESLint configs.
  - `@jmlweb/eslint-config-base-js`, `-base`, `-node` and `-astro`: `eslint` and `@eslint/js` peers are now `^9.0.0 || ^10.0.0`. ESLint 9 keeps working.
  - `@jmlweb/eslint-config-node`: `globals` peer is now `^15.0.0 || ^16.0.0 || ^17.0.0` (was `^15.0.0`).
  - `@jmlweb/eslint-config-node`, `-react` and `-astro`: `eslint-config-prettier` peer is now `^9.1.0 || ^10.0.0`, matching `-base` and `-base-js` (was `^9.1.0`).
  - `@jmlweb/eslint-config-react`: still ESLint 9 only. `eslint-plugin-react` 7.37.5 does not support ESLint 10, and its `settings.react.version: 'detect'` crashes on it. Only the `eslint-config-prettier` peer range changed.

### Patch Changes

- 5f9bdc6: Disable type-checked `@typescript-eslint` rules for `.astro` files. The base config enables them globally but only provides `projectService` for `.ts`/`.tsx`, so linting any `.astro` file crashed with "You have used a rule which requires type information". Verified on ESLint 10.
- Updated dependencies [0a600dd]
  - @jmlweb/eslint-config-base@2.1.0

## 1.0.10

### Patch Changes

- Updated dependencies [438edae]
  - @jmlweb/eslint-config-base@2.0.10

## 1.0.9

### Patch Changes

- @jmlweb/eslint-config-base@2.0.9

## 1.0.8

### Patch Changes

- Updated dependencies [c1cbae0]
  - @jmlweb/eslint-config-base@2.0.8

## 1.0.7

### Patch Changes

- ecb3620: Update dev dependencies to latest stable versions
- Updated dependencies [ecb3620]
  - @jmlweb/eslint-config-base@2.0.7

## 1.0.6

### Patch Changes

- 0c32641: Update dependencies to latest stable versions
- Updated dependencies [0c32641]
  - @jmlweb/eslint-config-base@2.0.6

## 1.0.5

### Patch Changes

- 30f8ffb: Add "Why Use This?" sections to package READMEs explaining configuration philosophy and design decisions
- Updated dependencies [30f8ffb]
  - @jmlweb/eslint-config-base@2.0.5

## 1.0.4

### Patch Changes

- 4a9ece1: Update documentation to use pnpm commands instead of npm
- Updated dependencies [4a9ece1]
  - @jmlweb/eslint-config-base@2.0.4

## 1.0.3

### Patch Changes

- 6b73301: Add changelog section with link to CHANGELOG.md in package READMEs
- Updated dependencies [6b73301]
  - @jmlweb/eslint-config-base@2.0.3

## 1.0.2

### Patch Changes

- beae5ae: Add trailing newlines to source files for consistency.

## 1.0.1

### Patch Changes

- 9553ece: Fix package.json formatting by sorting keywords alphabetically to comply with syncpack rules.

## 1.0.0

### Added

- Initial release
- ESLint configuration for Astro projects
- Extends `@jmlweb/eslint-config-base` with Astro-specific rules
- Support for `.astro` files with proper TypeScript parsing
- Integration with `eslint-plugin-astro` recommended config
