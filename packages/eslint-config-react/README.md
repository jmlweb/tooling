# @jmlweb/eslint-config-react

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-react)](https://www.npmjs.com/package/@jmlweb/eslint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.11.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0%2B-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://react.dev/)

> ESLint configuration for React libraries with TypeScript. Extends `@jmlweb/eslint-config-base` with React-specific rules, hooks validation, and JSX best practices.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- ⚛️ **React Best Practices**: Enforces React-specific rules and patterns
- 🪝 **Hooks Validation**: Validates React Hooks rules and exhaustive dependencies
- 🎨 **JSX Support**: Optimized for modern JSX transform (React 17+)
- 📦 **Import Management**: Enforces type-only imports with inline style + automatic sorting
- 🎯 **Code Quality**: Prevents common React pitfalls and anti-patterns
- 🎨 **Prettier Integration**: Disables all ESLint rules that conflict with Prettier
- 🚀 **Flat Config**: Uses ESLint 9+ flat config format (latest stable)

## 📦 Installation

```bash
pnpm add -D @jmlweb/eslint-config-react eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-simple-import-sort @jmlweb/eslint-config-base
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
      'react/display-name': 'off',
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
    files: ['**/*.tsx', '**/*.jsx'],
    settings: {
      react: {
        version: '18.2', // Specify React version explicitly
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

### Key Rules Enforced

| Rule                             | Level   | Description                                |
| -------------------------------- | ------- | ------------------------------------------ |
| `react-hooks/rules-of-hooks`     | `error` | Enforces Rules of Hooks                    |
| `react-hooks/exhaustive-deps`    | `warn`  | Validates exhaustive dependencies in hooks |
| `react/jsx-key`                  | `error` | Prevents missing keys in lists             |
| `react/jsx-no-duplicate-props`   | `error` | Prevents duplicate props                   |
| `react/jsx-pascal-case`          | `error` | Enforces PascalCase for component names    |
| `react/no-array-index-key`       | `warn`  | Warns against using array index as key     |
| `react/jsx-boolean-value`        | `error` | Enforces `{prop}` over `prop={true}`       |
| `react/jsx-curly-brace-presence` | `error` | Prevents unnecessary curly braces          |
| `react/jsx-fragments`            | `error` | Enforces shorthand fragment syntax         |
| `react/jsx-sort-props`           | `error` | Enforces consistent prop ordering          |

### What's Included

- ✅ All TypeScript ESLint rules from `@jmlweb/eslint-config-base`
- ✅ React recommended rules
- ✅ React JSX runtime rules (for React 17+)
- ✅ React Hooks rules and exhaustive deps validation
- ✅ JSX best practices and anti-pattern prevention
- ✅ Automatic import/export sorting
- ✅ Prettier conflict resolution
- ✅ React version auto-detection

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

**JSX Accessibility (`eslint-plugin-jsx-a11y`)**: Enforces accessibility best practices (included via recommended)

- **Why**: Accessibility is not optional. Many common React patterns create inaccessible UIs by default. These rules catch issues early
- **Trade-off**: May require more verbose markup (explicit labels, ARIA attributes), but creates inclusive applications
- **When to override**: Rarely. If you must, document why the pattern is accessible despite the warning

**Modern JSX Transform**: Configured for React 17+ (no `React` import needed)

- **Why**: The new JSX transform is more efficient and doesn't require importing React in every file. It's the modern standard
- **Trade-off**: None - this is the recommended approach for React 17+
- **When to override**: If stuck on React 16 or earlier (but you should upgrade)

**Component Display Names**: Enforces display names for debugging

- **Why**: Display names improve debugging in React DevTools and error messages. Anonymous components are harder to track down
- **Trade-off**: Requires naming arrow function components or adding explicit displayName
- **When to override**: For simple, obvious components where the name is clear from context (rare)

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
      'react/display-name': 'off',
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

- **Node.js** >= 20.11.0 (required for `import.meta.dirname` in config files)
- **ESLint** >= 9.0.0 (flat config format)
- **TypeScript** project with `tsconfig.json`
- **React** >= 17.0.0 (for JSX runtime support)
- **TypeScript project service** enabled (automatic with this config)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `eslint` (^9.0.0)
- `@eslint/js` (^9.0.0)
- `typescript-eslint` (^8.0.0)
- `eslint-config-prettier` (^9.1.0)
- `eslint-plugin-react` (^7.37.0)
- `eslint-plugin-react-hooks` (^5.0.0)
- `eslint-plugin-simple-import-sort` (^12.0.0)
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
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) - React-specific linting rules
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

### React Version Not Detected

**Symptoms:**

- Warning: "Warning: React version not specified in eslint-plugin-react settings"
- Or incorrect React version being used

**Cause:**

- This config uses `detect` to auto-detect React version from package.json
- May fail if React is not installed or in an unexpected location

**Solution:**

Ensure React is installed:

```bash
pnpm add react
```

Or explicitly specify the React version:

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    settings: {
      react: {
        version: '18.2', // Specify your React version
      },
    },
  },
];
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

- npm warnings about unmet peer dependencies for `eslint-plugin-react` or `eslint-plugin-react-hooks`

**Cause:**

- These plugins may not have updated peer dependencies for ESLint 9.x yet

**Solution:**

```bash
# pnpm automatically handles peer dependencies
pnpm install
```

The warnings are usually safe to ignore if linting works correctly.

## 🔄 Migration Guide

### Upgrading to a New Version

> **Note:** If no breaking changes were introduced in a version, it's safe to upgrade without additional steps.

**No breaking changes have been introduced yet.** This package follows semantic versioning. When breaking changes are introduced, detailed migration instructions will be provided here.

For version history, see the [Changelog](./CHANGELOG.md).

**Need Help?** If you encounter issues during migration, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
