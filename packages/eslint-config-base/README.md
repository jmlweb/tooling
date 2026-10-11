# @jmlweb/eslint-config-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-base)](https://www.npmjs.com/package/@jmlweb/eslint-config-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9%20%7C%2010-4B32C3.svg)](https://eslint.org/)

> Strict ESLint flat config for TypeScript projects. Extends [`@jmlweb/eslint-config-base-js`](../eslint-config-base-js) with strict type-checked rules.

> 🔧 **Maintenance mode**: only dependency and security updates, no new rules. For new projects use [`@jmlweb/oxlint-config-base`](../oxlint-config-base). To move an existing project, see the [migration guide](https://jmlweb.github.io/tooling/guides/migrate-to-oxc/).

## ✨ Features

- 🔒 **Strict type checking**: `strictTypeChecked` and `stylisticTypeChecked` from typescript-eslint, with `projectService`
- 🛡️ **No `any`**: `no-explicit-any` is an error
- 📦 **Type-only imports**: inline `type` style, plus automatic import and export sorting
- 🎯 **Opinionated**: no enums (use const maps), no default exports, no parameter mutation
- 🎨 **Prettier compatible**: disables rules that conflict with Prettier

## 📦 Installation

```bash
npm install --save-dev @jmlweb/eslint-config-base eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-simple-import-sort
```

`@jmlweb/eslint-config-base-js` is a regular dependency and installs automatically.

> 💡 **Upgrading?** See the [Migration Guide](#-migration-guide).

## 🚀 Quick Start

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  // Project-specific overrides
];
```

## 💡 Examples

### Test overrides and ignores

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
];
```

### Allow default exports in config files

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['*.config.ts', '*.config.js'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },
];
```

### Less strict

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
```

## 📋 Configuration Details

Applied to `**/*.ts` and `**/*.tsx` (plus the JavaScript rules from `base-js` for `.js`, `.mjs` and `.cjs`).

### Included

- ✅ typescript-eslint `recommended`, `strictTypeChecked` and `stylisticTypeChecked`
- ✅ `parserOptions.projectService: true` (requires a `tsconfig.json`)
- ✅ Import and export sorting, Prettier conflict resolution
- ✅ All rules from `@jmlweb/eslint-config-base-js`

### Key rules

| Rule                                               | Setting                                          |
| -------------------------------------------------- | ------------------------------------------------ |
| `@typescript-eslint/no-explicit-any`               | `error`                                          |
| `@typescript-eslint/explicit-function-return-type` | `off` (return types are inferred)                |
| `@typescript-eslint/no-unused-vars`                | `error`, `_`-prefixed args and variables ignored |
| `@typescript-eslint/consistent-type-imports`       | `error`, `type-imports` with inline fix          |
| `@typescript-eslint/consistent-type-definitions`   | `error`, prefer `type`                           |
| `@typescript-eslint/no-require-imports`            | `error`                                          |
| `@typescript-eslint/naming-convention`             | `error`, see below                               |
| `no-restricted-syntax` (`TSEnumDeclaration`)       | `error`, use const maps                          |
| `no-restricted-exports`                            | `error`, no default exports                      |
| `no-param-reassign`                                | `error`, including properties                    |

Naming: types `PascalCase`; variables `camelCase` or `UPPER_CASE` (exported consts may also be `PascalCase`); functions `camelCase`.

## 🔄 Import Sorting

Imports are sorted and type-only imports are enforced.

**Before:**

```typescript
import { Component } from './component';
import React, { useState } from 'react';
import { User } from './types';
import fs from 'fs';
```

**After `eslint --fix`:**

```typescript
import fs from 'fs';
import React, { useState } from 'react';
import { type User } from './types';
import { Component } from './component';
```

## 🎯 When to Use

- ✅ TypeScript projects that want strict, type-aware linting
- ✅ Teams that want one consistent style (named exports, const maps, immutability)
- ✅ A base for the React, Node.js and Astro configs

For JavaScript-only projects use [`@jmlweb/eslint-config-base-js`](../eslint-config-base-js). For React, Node.js or Astro use [`-react`](../eslint-config-react), [`-node`](../eslint-config-node) or [`-astro`](../eslint-config-astro). For new projects prefer [`@jmlweb/oxlint-config-base`](../oxlint-config-base).

## 🔧 Extending the Configuration

Spread the config, then add objects after it. Later entries win.

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
];
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

```bash
npm run lint
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **ESLint** ^9.0.0 || ^10.0.0 (flat config)
- **TypeScript** project with a `tsconfig.json` (versions supported by typescript-eslint 8)

## 📦 Peer Dependencies

- `eslint` (`^9.0.0 || ^10.0.0`)
- `@eslint/js` (`^9.0.0 || ^10.0.0`)
- `typescript-eslint` (`^8.0.0`)
- `eslint-config-prettier` (`^9.1.0 || ^10.0.0`)
- `eslint-plugin-simple-import-sort` (`^12.0.0 || ^13.0.0 || ^14.0.0`)

## 🔗 Related Packages

- [`@jmlweb/eslint-config-base-js`](../eslint-config-base-js): JavaScript foundation (extended by this package)
- [`@jmlweb/eslint-config-react`](../eslint-config-react): React config that extends this one
- [`@jmlweb/eslint-config-node`](../eslint-config-node): Node.js config that extends this one
- [`@jmlweb/eslint-config-astro`](../eslint-config-astro): Astro config that extends this one
- [`@jmlweb/oxlint-config-base`](../oxlint-config-base): Oxlint equivalent, recommended for new projects
- [`@jmlweb/tsconfig-base`](../tsconfig-base): TypeScript config
- [`@jmlweb/prettier-config-base`](../prettier-config-base): Prettier config (maintenance mode)

## 🔄 Migration Guide

### 2.x to 3.0

Node.js 18 and 20 are end-of-life. Node.js >= 22.12.0 is now required: it is the first Node.js 22 release that can `require()` ES modules without a flag, which the CommonJS build needs to load ESM-only plugins. Peer ranges were also widened (`eslint-plugin-simple-import-sort` 13 and 14).

1. Upgrade Node.js to 22.12.0 or later.
2. Update the package: `npm install --save-dev @jmlweb/eslint-config-base@latest`.

See the [Changelog](./CHANGELOG.md).

## 📄 License

MIT
