# @jmlweb/oxlint-config-node

## 0.1.3

### Patch Changes

- 30a45bc: Condense the README and sync versions, peer dependencies, requirements and migration notes with the package.
- Updated dependencies [30a45bc]
  - @jmlweb/oxlint-config-base@0.1.2

## 0.1.2

### Patch Changes

- Updated dependencies [553899a]
  - @jmlweb/oxlint-config-base@0.1.1

## 0.1.1

### Patch Changes

- 5d32645: Document how to extend the Vitest `test` block without losing the base settings, and how to fix `n/hashbang` and `n/no-missing-import` reports for CLIs built to `dist/`.

## 0.1.0

### Minor Changes

- a32dbc9: Add `@jmlweb/oxlint-config-node`, an Oxlint configuration that extends `@jmlweb/oxlint-config-base` and ports `@jmlweb/eslint-config-node`. It runs `eslint-plugin-n`'s `flat/recommended` rules and the same best-practice rules as a JS plugin, uses Oxlint's native `node/*` rules where they exist, and sets Node.js globals for JavaScript and TypeScript files. The naming convention rule is not ported.
