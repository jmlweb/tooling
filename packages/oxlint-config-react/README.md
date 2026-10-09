# @jmlweb/oxlint-config-react

[![npm version](https://img.shields.io/npm/v/@jmlweb/oxlint-config-react)](https://www.npmjs.com/package/@jmlweb/oxlint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://react.dev/)

> [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) configuration for React projects. Extends [`@jmlweb/oxlint-config-base`](../oxlint-config-base) and ports the rules of [`@jmlweb/eslint-config-react`](../eslint-config-react).

## ✨ Features

- ⚛️ **Hooks and React Compiler rules**: Every rule of `eslint-plugin-react-hooks`' `recommended` preset, run natively by Oxlint
- 🧩 **@eslint-react**: Its `recommended-typescript` rules, run as an Oxlint JS plugin
- 🔤 **Sorted JSX props**: Reserved props first, then shorthand props, callbacks last
- 🎨 **JSX style**: PascalCase components, self-closing tags, no unnecessary curly braces
- 🔒 **Everything from the base config**: Strict TypeScript rules, no enums, named exports only

## 📦 Installation

```bash
pnpm add -D @jmlweb/oxlint-config-react oxlint oxlint-tsgolint @eslint-react/eslint-plugin eslint-plugin-perfectionist
```

> `eslint-plugin-react-hooks` is not needed: Oxlint implements its rules natively.

## 🚀 Quick Start

Create an `oxlint.config.ts` file in your project root:

```typescript
import reactConfig from '@jmlweb/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig],
  options: {
    typeAware: true,
  },
});
```

> ⚠️ **`typeAware` must be set in your own config**: Oxlint only reads `options` from the root config file, so the base config's type-aware rules are skipped without it.

## 💡 Examples

### Before

```tsx
import { useEffect, useState } from 'react';

export const Timer = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    const [start] = useState(Date.now());
  }
  useEffect(() => {
    setTimeout(() => {}, 100);
  }, []);
  return <button onClick={() => {}} type={'button'} disabled />;
};
```

### Problems Reported

```text
src/Timer.tsx:5:12: error eslint(no-unused-vars): Variable 'start' is declared but never used.
src/Timer.tsx:5:21: error react-hooks(rules-of-hooks): React Hook "useState" is called conditionally.
src/Timer.tsx:5:30: error react(purity): Cannot call impure function during render
src/Timer.tsx:8:5: warning @eslint-react(web-api-no-leaked-timeout): A 'setTimeout' must be assigned to a variable for proper cleanup.
src/Timer.tsx:8:22: error eslint(no-empty-function): Unexpected empty function
src/Timer.tsx:10:33: error eslint(no-empty-function): Unexpected empty function
src/Timer.tsx:10:37: error perfectionist(sort-jsx-props): Expected "type" (unknown) to come before "onClick" (callback).
src/Timer.tsx:10:43: error react(jsx-curly-brace-presence): Curly braces are unnecessary here.
src/Timer.tsx:10:53: error perfectionist(sort-jsx-props): Expected "disabled" (shorthand-prop) to come before "type" (unknown).
```

## 📋 Configuration Details

### All Files

Hooks run in `.ts` files too, since custom hooks usually live there:

- `eslint-plugin-react-hooks` `recommended` rules, including the React Compiler ones, as Oxlint's native `react/*` rules
- `@eslint-react` `recommended-typescript` rules, without its ports of the hooks rules

### JSX Files

Applied to `**/*.{tsx,jsx}`:

| Rule                                       | Level   | Description                                        |
| ------------------------------------------ | ------- | -------------------------------------------------- |
| `@eslint-react/jsx-no-children-prop`       | `error` | Pass children as JSX children, not as a prop       |
| `@eslint-react/dom-no-unknown-property`    | `error` | Prevents unknown DOM properties                    |
| `@eslint-react/dom-no-unsafe-target-blank` | `error` | Requires `rel="noreferrer"` with `target="_blank"` |
| `@eslint-react/jsx-no-useless-fragment`    | `error` | Prevents unnecessary fragments                     |
| `react/jsx-pascal-case`                    | `error` | Components must use PascalCase                     |
| `react/self-closing-comp`                  | `error` | Self-close elements without children               |
| `react/jsx-curly-brace-presence`           | `error` | No braces around string props or children          |
| `perfectionist/sort-jsx-props`             | `error` | Reserved, shorthand, other props, callbacks        |

### Differences from `@jmlweb/eslint-config-react`

- **No naming convention rule**: Same as [`@jmlweb/oxlint-config-base`](../oxlint-config-base#differences-from-jmlwebeslint-config-base)
- **No import sorting rule**: [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) sorts imports
- **No `config` and `gating` hooks rules**: They validate React Compiler options and have no Oxlint equivalent

## 🤔 Why Use This?

> **Philosophy**: The React rules of the ESLint config, with the hooks rules running at native speed.

### Design Decisions

**Native hooks rules**: Oxlint's `react` plugin implements `eslint-plugin-react-hooks`' rules, React Compiler ones included

- **Why**: Native rules are much faster than JS plugins and need no extra dependency
- **Trade-off**: Diagnostics are reported as `react-hooks(...)` or `react(...)` instead of `react-hooks/...`
- **When to override**: Not needed

**@eslint-react as a JS plugin**: Its rule list is derived from its own presets

- **Why**: Keeps parity with `@jmlweb/eslint-config-react` and follows new @eslint-react releases without changes here
- **Trade-off**: Runs through Oxlint's JS plugin support, which is still in alpha
- **When to override**: Turn off single `@eslint-react/*` rules in your config

## 🎯 When to Use

Use this package when you want:

- ✅ Fast linting for React projects with TypeScript (recommended over ESLint)
- ✅ React Compiler checks without installing `eslint-plugin-react-hooks`
- ✅ To migrate from `@jmlweb/eslint-config-react`

**For projects without React**, use [`@jmlweb/oxlint-config-base`](../oxlint-config-base) instead.

## 🔧 Extending the Configuration

```typescript
import reactConfig from '@jmlweb/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig],
  options: {
    typeAware: true,
  },
  env: {
    browser: true,
  },
  rules: {
    'react/exhaustive-deps': 'error',
    '@eslint-react/no-array-index-key': 'off',
  },
});
```

## 📝 Usage with Scripts

Add linting scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

Then run:

```bash
pnpm lint      # Lint all files
pnpm lint:fix  # Fix auto-fixable problems
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Oxlint** >= 1.87.0
- **React** >= 18
- **TypeScript project** with a `tsconfig.json` (for type-aware rules)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `oxlint` (>= 1.87.0)
- `oxlint-tsgolint` (>= 7.0.0, optional, enables type-aware rules)
- `@eslint-react/eslint-plugin` (^5.0.0)
- `eslint-plugin-perfectionist` (^5.0.0)

**Note**: `@jmlweb/oxlint-config-base` is a regular dependency, so you do not need to install it.

## 📚 Examples

See real-world usage examples:

- [`@jmlweb/eslint-config-react`](../eslint-config-react) - The ESLint configuration this package ports

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/oxlint-config-base`](../oxlint-config-base) - Base Oxlint config this package extends
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt config, the formatter to pair with this linter
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint equivalent of this configuration
- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript config for React projects

### External Tools

- [Oxlint React rules](https://oxc.rs/docs/guide/usage/linter/rules.html) - Native rules, including the React Compiler ones
- [@eslint-react](https://eslint-react.xyz/) - React rules run as a JS plugin
- [Perfectionist](https://perfectionist.dev/) - Provides `sort-jsx-props`

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### "Failed to load JS plugin"

**Symptoms:**

- Oxlint cannot find `@eslint-react/eslint-plugin` or `eslint-plugin-perfectionist`

**Cause:**

- The peer dependencies are not installed in your project

**Solution:**

```bash
pnpm add -D @eslint-react/eslint-plugin eslint-plugin-perfectionist
```

### Oxlint Is Slow or Reports Problems in `node_modules`

**Symptoms:**

- Oxlint takes minutes or reports problems in dependencies

**Cause:**

- The project has no `.gitignore` listing `node_modules`, so Oxlint lints it

**Solution:**

Add `node_modules` to `.gitignore`, or to `ignorePatterns` in your Oxlint config.

## 🔄 Migration Guide

### Migrating from `@jmlweb/eslint-config-react`

1. Install this package and its peer dependencies
2. Create `oxlint.config.ts` as shown in [Quick Start](#-quick-start)
3. Format with [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base), which sorts imports
4. Replace `eslint` with `oxlint` in your scripts and `lint-staged` config
5. Remove `eslint.config.*`, the ESLint packages and `eslint-plugin-react-hooks`
6. Run `pnpm lint` and fix the reported problems

### Upgrading to a New Version

> **Note:** If no breaking changes were introduced in a version, it's safe to upgrade without additional steps.

**No breaking changes have been introduced yet.** This package follows semantic versioning. When breaking changes are introduced, detailed migration instructions will be provided here.

For version history, see the [Changelog](./CHANGELOG.md).

**Need Help?** If you encounter issues during migration, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
