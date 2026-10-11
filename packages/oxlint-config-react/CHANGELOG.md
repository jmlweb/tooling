# @jmlweb/oxlint-config-react

## 0.1.1

### Patch Changes

- 553899a: Publish from CI to validate npm trusted publishing. No code changes.
- Updated dependencies [553899a]
  - @jmlweb/oxlint-config-base@0.1.1

## 0.1.0

### Minor Changes

- dff9089: Add `@jmlweb/oxlint-config-react`, an Oxlint configuration that extends `@jmlweb/oxlint-config-base` and ports `@jmlweb/eslint-config-react`. It runs `eslint-plugin-react-hooks`' `recommended` rules (React Compiler ones included) natively, `@eslint-react`'s `recommended-typescript` rules and `perfectionist/sort-jsx-props` as JS plugins, and the JSX style rules natively. Naming convention and the hooks `config`/`gating` rules are not ported.
