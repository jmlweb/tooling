# @jmlweb/eslint-config-node

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-node)](https://www.npmjs.com/package/@jmlweb/eslint-config-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.11.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0%2B-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)

> ESLint configuration for Node.js projects with TypeScript. Extends `@jmlweb/eslint-config-base` with Node.js-specific rules, globals, and best practices for Node.js development.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- 🟢 **Node.js Best Practices**: Enforces Node.js-specific rules and patterns
- 🌐 **Node.js Globals**: Automatically enables Node.js global variables
- 📦 **Import Management**: Enforces type-only imports with inline style + automatic sorting
- 🎯 **Code Quality**: Prevents common Node.js pitfalls and anti-patterns
- 🎨 **Prettier Integration**: Disables all ESLint rules that conflict with Prettier
- 🚀 **Flat Config**: Uses ESLint 9+ flat config format (latest stable)

## 📦 Installation

```bash
pnpm add -D @jmlweb/eslint-config-node eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-n eslint-plugin-simple-import-sort globals @jmlweb/eslint-config-base
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import nodeConfig from '@jmlweb/eslint-config-node';

export default [
  ...nodeConfig,
  // Add your project-specific overrides here
];
```

## 💡 Examples

### Basic Setup

```javascript
// eslint.config.js
import nodeConfig from '@jmlweb/eslint-config-node';

export default [...nodeConfig];
```

### With Project-Specific Overrides

```javascript
// eslint.config.js
import nodeConfig from '@jmlweb/eslint-config-node';

export default [
  ...nodeConfig,
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      // Allow any in tests
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow console in tests
      'no-console': 'off',
      // Relax Node.js rules in tests
      'n/no-process-exit': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/', '*.config.ts'],
  },
];
```

### With Custom Node.js Settings

```javascript
// eslint.config.js
import nodeConfig from '@jmlweb/eslint-config-node';

export default [
  ...nodeConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      // Customize Node.js rules
      'n/no-process-exit': 'warn', // Warn instead of error
      'n/no-deprecated-api': 'error', // Error on deprecated APIs
    },
  },
];
```

## 📋 Configuration Details

### Node.js Files

This configuration applies Node.js-specific rules to:

- `**/*.ts` - TypeScript files
- `**/*.js` - JavaScript files
- `**/*.mjs` - ES modules
- `**/*.cjs` - CommonJS files

### Key Rules Enforced

| Rule                       | Level   | Description                                   |
| -------------------------- | ------- | --------------------------------------------- |
| `n/no-process-exit`        | `error` | Prevents direct `process.exit()` calls        |
| `n/no-missing-import`      | `error` | Prevents missing imports                      |
| `n/no-missing-require`     | `error` | Prevents missing require statements           |
| `n/no-unpublished-import`  | `error` | Prevents importing unpublished packages       |
| `n/no-unpublished-require` | `error` | Prevents requiring unpublished packages       |
| `n/no-extraneous-import`   | `error` | Prevents extraneous imports                   |
| `n/no-extraneous-require`  | `error` | Prevents extraneous require statements        |
| `n/no-deprecated-api`      | `warn`  | Warns about deprecated Node.js APIs           |
| `n/process-exit-as-throw`  | `error` | Treats process.exit as throw                  |
| `n/no-callback-literal`    | `error` | Prevents callback literal patterns            |
| `n/no-new-require`         | `error` | Prevents `new require()`                      |
| `n/no-path-concat`         | `error` | Prevents string concatenation for paths       |
| `n/prefer-global/buffer`   | `error` | Prefers global Buffer                         |
| `n/prefer-global/console`  | `error` | Prefers global console                        |
| `n/prefer-global/process`  | `error` | Prefers global process                        |
| `n/prefer-promises/dns`    | `error` | Prefers promise-based DNS APIs                |
| `n/prefer-promises/fs`     | `error` | Prefers promise-based fs APIs                 |
| `n/prefer-node-protocol`   | `error` | Prefers `node:` protocol for built-in modules |

### What's Included

- ✅ All TypeScript ESLint rules from `@jmlweb/eslint-config-base`
- ✅ Node.js recommended rules from `eslint-plugin-n`
- ✅ Node.js globals automatically enabled
- ✅ Node.js best practices and anti-pattern prevention
- ✅ Automatic import/export sorting
- ✅ Prettier conflict resolution

## 🔄 Import Sorting

The configuration automatically sorts imports and enforces type-only imports:

**Before:**

```typescript
import { Component } from './component';
import fs from 'fs';
import type { User } from './types';
import express from 'express';
```

**After auto-fix:**

```typescript
import fs from 'fs';
import express from 'express';
import type { User } from './types';
import { Component } from './component';
```

Fix import order automatically:

```bash
pnpm exec eslint --fix .
```

## 🎯 When to Use

Use this configuration when you want:

- ✅ Node.js library or application development with TypeScript
- ✅ Maximum type safety with Node.js
- ✅ Strict code quality standards for Node.js code
- ✅ Consistent Node.js patterns across the team
- ✅ Prevention of common Node.js pitfalls
- ✅ Best practices enforcement for Node.js APIs

**For non-Node.js TypeScript projects**, use [`@jmlweb/eslint-config-base`](../eslint-config-base) instead.

**For JavaScript-only Node.js projects**, you can extend `@jmlweb/eslint-config-base-js` and add Node.js plugins manually.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```javascript
import nodeConfig from '@jmlweb/eslint-config-node';

export default [
  ...nodeConfig,
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      // Test-specific rules
      '@typescript-eslint/no-explicit-any': 'off',
      'n/no-process-exit': 'off',
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
- **TypeScript project service** enabled (automatic with this config)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `eslint` (^9.0.0)
- `@eslint/js` (^9.0.0)
- `typescript-eslint` (^8.0.0)
- `eslint-config-prettier` (^9.1.0)
- `eslint-plugin-n` (^0.4.0)
- `eslint-plugin-simple-import-sort` (^12.0.0)
- `globals` (^15.0.0)
- `@jmlweb/eslint-config-base` (^1.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API example

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - Base TypeScript ESLint config (extended by this package)
- [`@jmlweb/tsconfig-node`](../tsconfig-node) - TypeScript configuration for Node.js libraries
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

### External Tools

- [ESLint](https://eslint.org/) - Pluggable linting utility for JavaScript and TypeScript
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 engine
- [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) - ESLint rules for Node.js
- [tsx](https://github.com/privatenumber/tsx) - TypeScript execute (ts-node alternative)

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
