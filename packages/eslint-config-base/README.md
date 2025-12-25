# @jmlweb/eslint-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-base)](https://www.npmjs.com/package/@jmlweb/eslint-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.11.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0%2B-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)

> Strict ESLint configuration for TypeScript projects. Maximum type safety, best practices, and consistent code quality. Extends `@jmlweb/eslint-config-base-js` with strict type checking.

## ✨ Features

- 🔒 **Strict Type Checking**: Enables `strictTypeChecked` and `stylisticTypeChecked` configs
- 🛡️ **Type Safety**: Enforces explicit return types and prevents `any` usage
- 📦 **Import Management**: Enforces type-only imports with inline style + automatic sorting
- 🎯 **Best Practices**: Prevents enum usage, encourages immutability, enforces naming conventions
- 🎨 **Prettier Integration**: Disables all ESLint rules that conflict with Prettier
- 🚀 **Flat Config**: Uses ESLint 9+ flat config format (latest stable)
- 🔧 **Extensible**: Built on `@jmlweb/eslint-config-base-js` foundation

## 📦 Installation

```bash
npm install --save-dev @jmlweb/eslint-config-base eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-simple-import-sort @jmlweb/eslint-config-base-js
```

## 🚀 Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  // Add your project-specific overrides here
];
```

## 💡 Examples

### Basic Setup

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [...baseConfig];
```

### With Project-Specific Overrides

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      // Allow any in tests
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow console in tests
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/', '*.config.ts'],
  },
];
```

### React Project Example

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.tsx'],
    rules: {
      // React-specific overrides if needed
    },
  },
];
```

### Less Strict Configuration

This config uses strict type checking by default. If you need non-strict rules, you have two options:

**Option 1: Use base-js config and add only recommended TypeScript rules**

```javascript
import baseJsConfig from '@jmlweb/eslint-config-base-js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  ...baseJsConfig,
  // Use only recommended TypeScript rules (non-strict)
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      ...config.plugins,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...config.rules,
      ...prettierConfig.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  })),
];
```

**Option 2: Override specific strict rules**

```javascript
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Override strict rules to be less strict
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
```

## 📋 Configuration Details

### TypeScript Files

This configuration applies strict TypeScript rules to:

- `**/*.ts` - TypeScript files
- `**/*.tsx` - TypeScript React files

### Key Rules Enforced

| Rule                                               | Level   | Description                                  |
| -------------------------------------------------- | ------- | -------------------------------------------- |
| `@typescript-eslint/no-explicit-any`               | `error` | Prevents `any` type usage                    |
| `@typescript-eslint/explicit-function-return-type` | `error` | Requires explicit return types               |
| `@typescript-eslint/consistent-type-imports`       | `error` | Enforces `import type` for type-only imports |
| `@typescript-eslint/consistent-type-definitions`   | `error` | Prefers `type` over `interface`              |
| `@typescript-eslint/no-enum`                       | `error` | Prevents enum usage (prefer const maps)      |
| `@typescript-eslint/no-parameter-properties`       | `error` | Prevents parameter properties                |
| `@typescript-eslint/naming-convention`             | `error` | Enforces naming conventions                  |

### What's Included

- ✅ TypeScript ESLint recommended rules
- ✅ Strict type checking (`strictTypeChecked`)
- ✅ Stylistic type checking (`stylisticTypeChecked`)
- ✅ TypeScript parser configuration with project service
- ✅ Automatic import/export sorting
- ✅ Prettier conflict resolution
- ✅ All JavaScript rules from `@jmlweb/eslint-config-base-js`

## 🔄 Import Sorting

The configuration automatically sorts imports and enforces type-only imports:

**Before:**

```typescript
import { Component } from './component';
import React, { useState } from 'react';
import { User } from './types';
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
npx eslint --fix .
```

## 🎯 When to Use

Use this configuration when you want:

- ✅ Maximum type safety with strict TypeScript rules
- ✅ Strict code quality standards
- ✅ Consistent code style across the team
- ✅ Prevention of common TypeScript pitfalls
- ✅ Best practices enforcement

**For JavaScript-only projects**, use [`@jmlweb/eslint-config-base-js`](../eslint-config-base-js) instead.

**For React projects**, use [`@jmlweb/eslint-config-react`](../eslint-config-react) instead.

**For less strict projects**, you can override the strict rules as shown in the examples above.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```javascript
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      // Test-specific rules
      '@typescript-eslint/no-explicit-any': 'off',
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
npm run lint      # Lint all files
npm run lint:fix  # Fix auto-fixable issues
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
- `eslint-plugin-simple-import-sort` (^12.0.0)
- `@jmlweb/eslint-config-base-js` (workspace or published version)

## 🔗 Related Packages

- [`@jmlweb/eslint-config-base-js`](../eslint-config-base-js) - JavaScript ESLint config (extended by this package)
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint config for React projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/tsconfig-base`](../tsconfig-base) - TypeScript configuration

## 📄 License

MIT
