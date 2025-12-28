# @jmlweb/eslint-config-astro

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-astro)](https://www.npmjs.com/package/@jmlweb/eslint-config-astro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.11.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0%2B-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-4.0%2B-FF5D01.svg)](https://astro.build/)

> ESLint configuration for Astro projects with TypeScript. Extends `@jmlweb/eslint-config-base` with Astro-specific rules and best practices for `.astro` files.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- 🚀 **Astro Support**: Enforces Astro-specific rules and patterns
- 📝 **Astro File Handling**: Proper linting for `.astro` files
- 📦 **Import Management**: Enforces type-only imports with inline style + automatic sorting
- 🎯 **Code Quality**: Prevents common Astro pitfalls and anti-patterns
- 🎨 **Prettier Integration**: Disables all ESLint rules that conflict with Prettier
- 🚀 **Flat Config**: Uses ESLint 9+ flat config format (latest stable)

## 📦 Installation

```bash
pnpm add -D @jmlweb/eslint-config-astro eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-astro eslint-plugin-simple-import-sort @jmlweb/eslint-config-base
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import astroConfig from '@jmlweb/eslint-config-astro';

export default [
  ...astroConfig,
  // Add your project-specific overrides here
];
```

## 💡 Examples

### Basic Setup

```javascript
// eslint.config.js
import astroConfig from '@jmlweb/eslint-config-astro';

export default [...astroConfig];
```

### With Project-Specific Overrides

```javascript
// eslint.config.js
import astroConfig from '@jmlweb/eslint-config-astro';

export default [
  ...astroConfig,
  {
    files: ['**/*.test.ts', '**/*.test.astro'],
    rules: {
      // Allow any in tests
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow console in tests
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '*.config.ts'],
  },
];
```

### With Custom Astro Settings

```javascript
// eslint.config.js
import astroConfig from '@jmlweb/eslint-config-astro';

export default [
  ...astroConfig,
  {
    files: ['**/*.astro'],
    rules: {
      // Customize Astro-specific rules
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'warn',
    },
  },
];
```

## 📋 Configuration Details

### Astro Files

This configuration applies Astro-specific rules to:

- `**/*.astro` - Astro component files

### TypeScript Files

TypeScript rules are also applied to:

- `**/*.ts` - TypeScript files
- `**/*.tsx` - TypeScript React files (if used in Astro project)

### Key Rules Enforced

| Rule                                   | Level   | Description                         |
| -------------------------------------- | ------- | ----------------------------------- |
| `astro/no-conflict-set-directives`     | `error` | Prevents conflicting set directives |
| `astro/no-unused-define-vars-in-style` | `warn`  | Warns about unused CSS variables    |
| `simple-import-sort/imports`           | `error` | Enforces import sorting             |
| `simple-import-sort/exports`           | `error` | Enforces export sorting             |

### What's Included

- ✅ All TypeScript ESLint rules from `@jmlweb/eslint-config-base`
- ✅ Astro recommended rules from `eslint-plugin-astro`
- ✅ Proper handling of `.astro` files with TypeScript parser
- ✅ Automatic import/export sorting
- ✅ Prettier conflict resolution

## 🔄 Import Sorting

The configuration automatically sorts imports and enforces type-only imports:

**Before:**

```typescript
import { Component } from './component';
import type { User } from './types';
import fs from 'fs';
```

**After auto-fix:**

```typescript
import fs from 'fs';
import type { User } from './types';
import { Component } from './component';
```

Fix import order automatically:

```bash
pnpm exec eslint --fix .
```

## 🎯 When to Use

Use this configuration when you want:

- ✅ Astro project development with TypeScript
- ✅ Maximum type safety with Astro
- ✅ Strict code quality standards for Astro code
- ✅ Consistent Astro patterns across the team
- ✅ Prevention of common Astro pitfalls

**For non-Astro TypeScript projects**, use [`@jmlweb/eslint-config-base`](../eslint-config-base) instead.

**For React projects**, use [`@jmlweb/eslint-config-react`](../eslint-config-react) instead.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```javascript
import astroConfig from '@jmlweb/eslint-config-astro';

export default [
  ...astroConfig,
  {
    files: ['**/*.test.ts', '**/*.test.astro'],
    rules: {
      // Test-specific rules
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
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
- **Astro** >= 4.0.0
- **TypeScript project service** enabled (automatic with this config)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `eslint` (^9.0.0)
- `@eslint/js` (^9.0.0)
- `typescript-eslint` (^8.0.0)
- `eslint-config-prettier` (^9.1.0)
- `eslint-plugin-astro` (^1.5.0)
- `eslint-plugin-simple-import-sort` (^12.0.0)
- `@jmlweb/eslint-config-base` (^2.0.2)

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - Base TypeScript ESLint config (extended by this package)
- [`@jmlweb/tsconfig-astro`](../tsconfig-astro) - TypeScript configuration for Astro projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

### External Tools

- [ESLint](https://eslint.org/) - Pluggable linting utility for JavaScript and TypeScript
- [Astro](https://astro.build/) - The web framework for content-driven websites
- [eslint-plugin-astro](https://ota-meshi.github.io/eslint-plugin-astro/) - ESLint plugin for Astro components
- [Prettier Plugin Astro](https://github.com/withastro/prettier-plugin-astro) - Prettier plugin for .astro files

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
