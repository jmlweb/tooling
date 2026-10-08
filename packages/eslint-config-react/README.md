# @jmlweb/eslint-config-react

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-react)](https://www.npmjs.com/package/@jmlweb/eslint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9%20%7C%2010-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://react.dev/)

> ESLint configuration for React libraries with TypeScript. Extends `@jmlweb/eslint-config-base` with React-specific rules, hooks validation, and JSX best practices.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- ⚛️ **React Best Practices**: React rules from `@eslint-react/eslint-plugin`, which supports ESLint 9 and 10
- 🪝 **Hooks Validation**: Rules of Hooks, exhaustive dependencies and the React Compiler rules from the official plugin
- 🎨 **JSX Support**: Optimized for modern JSX transform (React 17+)
- 📦 **Import Management**: Enforces type-only imports with inline style + automatic sorting
- 🎯 **Code Quality**: Prevents common React pitfalls and anti-patterns
- 🎨 **Prettier Integration**: Disables all ESLint rules that conflict with Prettier
- 🚀 **Flat Config**: Uses ESLint 9 and 10 flat config format (latest stable)

## 📦 Installation

```bash
pnpm add -D @jmlweb/eslint-config-react eslint @eslint/js typescript-eslint eslint-config-prettier @eslint-react/eslint-plugin @stylistic/eslint-plugin eslint-plugin-perfectionist eslint-plugin-react-hooks eslint-plugin-simple-import-sort @jmlweb/eslint-config-base
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  // Add your project-specific overrides here
];
```

## 💡 Examples

### Basic Setup

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [...reactConfig];
```

### With Project-Specific Overrides

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    files: ['**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      // Allow any in tests
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow console in tests
      'no-console': 'off',
      // Relax React rules in tests
      '@eslint-react/no-array-index-key': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/', '*.config.ts'],
  },
];
```

### With Custom React Settings

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    settings: {
      'react-x': {
        version: '19.2', // Specify React version explicitly (default: 'detect')
      },
    },
  },
];
```

## 📋 Configuration Details

### React Files

This configuration applies React-specific rules to:

- `**/*.tsx` - TypeScript React files
- `**/*.jsx` - JavaScript React files

The React and hooks rules from the `@eslint-react` and `eslint-plugin-react-hooks` presets apply to every file, so custom hooks in `.ts` files are checked too.

### Key Rules Enforced

| Rule                                              | Level   | Description                                          |
| ------------------------------------------------- | ------- | ---------------------------------------------------- |
| `react-hooks/rules-of-hooks`                      | `error` | Enforces Rules of Hooks                              |
| `react-hooks/exhaustive-deps`                     | `warn`  | Validates exhaustive dependencies in hooks           |
| `react-hooks/purity`, `refs`, `immutability`, ... | `error` | React Compiler rules (see below)                     |
| `@eslint-react/no-missing-key`                    | `error` | Prevents missing keys in lists                       |
| `@eslint-react/no-array-index-key`                | `warn`  | Warns against using array index as key               |
| `@eslint-react/jsx-no-children-prop`              | `error` | Prevents passing `children` as a prop                |
| `@eslint-react/jsx-no-useless-fragment`           | `error` | Prevents unnecessary fragments                       |
| `@eslint-react/dom-no-unknown-property`           | `error` | Prevents unknown DOM properties (`class`, ...)       |
| `@eslint-react/dom-no-unsafe-target-blank`        | `error` | Requires `rel="noreferrer noopener"` on `_blank`     |
| `@stylistic/jsx-pascal-case`                      | `error` | Enforces PascalCase for component names              |
| `@stylistic/jsx-self-closing-comp`                | `error` | Self-closes elements without children                |
| `@stylistic/jsx-curly-brace-presence`             | `error` | Prevents unnecessary curly braces                    |
| `perfectionist/sort-jsx-props`                    | `error` | Reserved props first, then shorthand, callbacks last |

Plus `eslint-plugin-react-hooks`' `recommended` preset (Rules of Hooks and the React Compiler rules such as `purity`, `refs`, `immutability`, `set-state-in-effect` and `static-components`) and the rest of `@eslint-react`'s `recommended-typescript` preset (for example `no-nested-component-definitions`, `no-leaked-conditional-rendering` and the `web-api-no-leaked-*` rules).

### What's Included

- ✅ All TypeScript ESLint rules from `@jmlweb/eslint-config-base`
- ✅ `@eslint-react` recommended rules for TypeScript
- ✅ React Hooks and React Compiler rules from the official `eslint-plugin-react-hooks` (`recommended` preset)
- ✅ JSX best practices and anti-pattern prevention
- ✅ Automatic import/export sorting
- ✅ Prettier conflict resolution
- ✅ React version auto-detection (`settings['react-x'].version: 'detect'`)

## 🔄 Import Sorting

The configuration automatically sorts imports and enforces type-only imports:

**Before:**

```typescript
import { Component } from './component';
import React, { useState } from 'react';
import type { User } from './types';
import fs from 'fs';
```

**After auto-fix:**

```typescript
import fs from 'fs';
import React, { useState } from 'react';
import type { User } from './types';
import { Component } from './component';
```

Fix import order automatically:

```bash
pnpm exec eslint --fix .
```

## 🤔 Why Use This?

> **Philosophy**: React components should be predictable, composable, and easy to reason about. Strict linting catches bugs before they reach production.

This package extends the base TypeScript config with React-specific rules that enforce best practices, prevent common pitfalls, and ensure proper Hook usage. React's declarative nature requires different patterns than traditional imperative code.

### Design Decisions

**React Hooks Rules (`eslint-plugin-react-hooks`)**: Enforces Rules of Hooks and exhaustive dependencies

- **Why**: Hooks rely on call order and closure capture. Violating Hook rules causes subtle bugs that are hard to debug. Exhaustive dependencies prevent stale closures and missing reactive updates
- **Trade-off**: May require adding dependencies you think are unnecessary, but this prevents bugs from stale values
- **When to override**: Never for rules of hooks. For exhaustive deps, only when you understand the implications (use `eslint-disable-next-line` with a comment explaining why)

**`@eslint-react` instead of `eslint-plugin-react`**: Maintained React rules with ESLint 10 support

- **Why**: `eslint-plugin-react` has had no release since April 2025 and does not support ESLint 10. `@eslint-react/eslint-plugin` is actively maintained, supports ESLint 9 and 10, and covers the same problems
- **Trade-off**: Rules that TypeScript already catches (duplicate props, undefined components, string refs, missing `render` return) have no counterpart, and `jsx-boolean-value`, `jsx-fragments` and `no-unescaped-entities` are no longer enforced. JSX style rules come from `@stylistic/eslint-plugin` and prop sorting from `eslint-plugin-perfectionist`
- **When to override**: Turn individual `@eslint-react/*` rules off if a recommended rule does not fit your codebase

**Official Hooks plugin**: `eslint-plugin-react-hooks` owns the hooks rules

- **Why**: `@eslint-react` ships ports of the hooks and React Compiler rules. The official plugin is maintained by the React team and keeps the `react-hooks/*` names used in existing `eslint-disable` comments, so the config uses its `recommended` preset and turns the ports off instead of running both. Each problem is reported once
- **Trade-off**: The React Compiler rules are strict (most are errors) and catch problems even if you don't use the React Compiler, such as reading refs during render or calling `setState` synchronously in an effect. Older codebases may get many reports, especially from `set-state-in-effect`
- **When to override**: Lower individual rules to `warn` while migrating, for example `'react-hooks/set-state-in-effect': 'warn'`

**Modern JSX Transform**: Configured for React 17+ (no `React` import needed)

- **Why**: The new JSX transform is more efficient and doesn't require importing React in every file. It's the modern standard
- **Trade-off**: None - this is the recommended approach for React 17+
- **When to override**: If stuck on React 16 or earlier (but you should upgrade)

**Extends Base TypeScript Config**: Inherits all strict type checking rules

- **Why**: React components benefit from strict typing. Props, state, and event handlers should all be explicitly typed
- **Trade-off**: More verbose component definitions, but prevents prop drilling bugs and refactoring issues
- **When to override**: Follow the same guidelines as the base TypeScript config

## 🎯 When to Use

Use this configuration when you want:

- ✅ React library development with TypeScript
- ✅ Maximum type safety with React
- ✅ Strict code quality standards for React code
- ✅ Consistent React patterns across the team
- ✅ Prevention of common React pitfalls
- ✅ Best practices enforcement for hooks and JSX

**For non-React TypeScript projects**, use [`@jmlweb/eslint-config-base`](../eslint-config-base) instead.

**For JavaScript-only React projects**, you can extend `@jmlweb/eslint-config-base-js` and add React plugins manually.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```javascript
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    files: ['**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      // Test-specific rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@eslint-react/no-array-index-key': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
];
```

## 📝 Usage with Scripts

Add linting scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Then run:

```bash
pnpm lint      # Lint all files
pnpm lint:fix  # Fix auto-fixable issues
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **ESLint** ^9.0.0 || ^10.0.0 (flat config format)
- **TypeScript** project with `tsconfig.json`
- **React** >= 17.0.0 (for JSX runtime support)
- **TypeScript project service** enabled (automatic with this config)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `eslint` (^9.0.0 || ^10.0.0)
- `@eslint/js` (^9.0.0 || ^10.0.0)
- `typescript-eslint` (^8.0.0)
- `eslint-config-prettier` (^9.1.0 || ^10.0.0)
- `@eslint-react/eslint-plugin` (^5.0.0)
- `@stylistic/eslint-plugin` (^5.0.0)
- `eslint-plugin-perfectionist` (^5.0.0)
- `eslint-plugin-react-hooks` (^7.0.0)
- `eslint-plugin-simple-import-sort` (^12.0.0 || ^13.0.0 || ^14.0.0)
- `@jmlweb/eslint-config-base` (^1.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-react-typescript-app`](../../apps/example-react-typescript-app) - React TypeScript app example

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - Base TypeScript ESLint config (extended by this package)
- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript configuration for React libraries
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

### External Tools

- [ESLint](https://eslint.org/) - Pluggable linting utility for JavaScript and TypeScript
- [TypeScript ESLint](https://typescript-eslint.io/) - TypeScript tooling for ESLint
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [@eslint-react/eslint-plugin](https://eslint-react.xyz/) - React-specific linting rules
- [@stylistic/eslint-plugin](https://eslint.style/) - JSX style rules
- [eslint-plugin-perfectionist](https://perfectionist.dev/) - JSX prop sorting
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) - Enforces Rules of Hooks
- [Prettier](https://prettier.io/) - Opinionated code formatter

## ⚠️ Common Issues

> **Note:** This section documents known issues and their solutions. If you encounter a problem not listed here, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

### React Hooks Exhaustive Dependencies Warning

**Symptoms:**

- Warning: "React Hook useEffect has a missing dependency"
- ESLint suggests adding dependencies to the dependency array

**Cause:**

- `eslint-plugin-react-hooks` enforces the Rules of Hooks
- Missing dependencies can cause stale closures and bugs

**Solution:**

Add the missing dependencies:

```typescript
// Before
useEffect(() => {
  fetchData(userId);
}, []); // Missing dependency: userId

// After
useEffect(() => {
  fetchData(userId);
}, [userId]); // Include all dependencies
```

If you intentionally want to omit a dependency (use sparingly):

```typescript
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Explicitly disable the rule with a comment
```

### JSX Not Recognized in .tsx Files

**Symptoms:**

- Parsing errors in `.tsx` files with JSX
- "Unexpected token <" errors

**Cause:**

- TypeScript parser not configured correctly
- File extension not recognized

**Solution:**

This config should handle `.tsx` files automatically. If you're having issues:

1. Ensure your file has the `.tsx` extension (not `.ts`)
2. Verify TypeScript is installed:

```bash
pnpm add -D typescript
```

3. Check that your tsconfig.json is in the project root

### Peer Dependency Warnings

**Symptoms:**

- npm warnings about unmet peer dependencies for one of the ESLint plugins

**Cause:**

- A plugin may not have updated its peer dependencies for the latest ESLint release yet

**Solution:**

```bash
# pnpm automatically handles peer dependencies
pnpm install
```

The warnings are usually safe to ignore if linting works correctly.

## 🔄 Migration Guide

### Upgrading to a New Version

> **Note:** If no breaking changes were introduced in a version, it's safe to upgrade without additional steps.

### From 5.x to 6.0

Hooks rules now come from `eslint-plugin-react-hooks`' `recommended` preset instead of two hand-picked rules.

**Breaking Changes:**

- The React Compiler rules are enabled, most of them as errors (`purity`, `refs`, `immutability`, `set-state-in-effect`, `static-components`, ...). They report problems even if you don't use the React Compiler
- Hooks rules now also apply to `.ts` files, so custom hooks outside `.tsx` are checked

**Migration Steps:**

1. Run `pnpm exec eslint .` and fix the new reports
2. To migrate gradually, lower individual rules to warnings in your config, for example `'react-hooks/set-state-in-effect': 'warn'`

### From 4.x to 5.0

`eslint-plugin-react` is replaced by `@eslint-react/eslint-plugin`, which adds ESLint 10 support.

**Breaking Changes:**

- Peer dependencies: remove `eslint-plugin-react`, add `@eslint-react/eslint-plugin`, `@stylistic/eslint-plugin` and `eslint-plugin-perfectionist`
- Rule names change from `react/*` to `@eslint-react/*`, `@stylistic/*` and `perfectionist/sort-jsx-props`. Update any overrides and `eslint-disable` comments
- `@eslint-react`'s recommended preset reports problems the old config did not (for example nested component definitions and leaked event listeners)
- `jsx-boolean-value`, `jsx-fragments` and `no-unescaped-entities` are no longer enforced
- The React version setting moves from `settings.react.version` to `settings['react-x'].version`

**Migration Steps:**

1. Update dependencies:

   ```bash
   pnpm remove eslint-plugin-react
   pnpm add -D @eslint-react/eslint-plugin @stylistic/eslint-plugin eslint-plugin-perfectionist
   ```

2. Rename `react/*` rules in your overrides and `eslint-disable` comments (for example `react/no-array-index-key` becomes `@eslint-react/no-array-index-key`)
3. Run `pnpm exec eslint --fix .` and review the remaining reports

For version history, see the [Changelog](./CHANGELOG.md).

**Need Help?** If you encounter issues during migration, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
