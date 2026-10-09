# @jmlweb/oxfmt-config-base

## 0.2.0

### Minor Changes

- 24e66ae: Enable `sortImports` with `eslint-plugin-perfectionist`'s default `sort-imports` groups. Oxfmt already shares Perfectionist's other defaults, so imports are now sorted in the same order. Set `sortImports: false` in projects whose imports are still sorted by ESLint.

## 0.1.0

### Minor Changes

- db0e4a1: Add `@jmlweb/oxfmt-config-base`, an Oxfmt configuration that produces the same output as `@jmlweb/prettier-config-base`. It reuses the Prettier options and sets `printWidth: 80` and `sortPackageJson: false` so Oxfmt matches Prettier's defaults.
