# @jmlweb/eslint-config-react

[![npm version](https://img.shields.io/npm/v/@jmlweb/eslint-config-react)](https://www.npmjs.com/package/@jmlweb/eslint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9%20%7C%2010-4B32C3.svg)](https://eslint.org/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB.svg)](https://react.dev/)

> ESLint flat config for React with TypeScript. Extends [`@jmlweb/eslint-config-base`](../eslint-config-base) with React, Hooks and JSX rules.

> 🔧 **Maintenance mode**: only dependency and security updates, no new rules. For new projects use [`@jmlweb/oxlint-config-react`](../oxlint-config-react). To move an existing project, see the [migration guide](https://jmlweb.github.io/tooling/guides/migrate-to-oxc/).

## ✨ Features

- ⚛️ **React rules**: `@eslint-react` `recommended-typescript` preset
- 🪝 **Hooks and React Compiler rules**: official `eslint-plugin-react-hooks` `recommended` preset, applied to every file
- 🧩 **JSX style**: PascalCase, self-closing, no needless braces or fragments, sorted props
- 🔒 **Strict TypeScript**: everything from `@jmlweb/eslint-config-base`
- 🎨 **Prettier compatible**: disables rules that conflict with Prettier

## 📦 Installation

```bash
npm install --save-dev @jmlweb/eslint-config-react @jmlweb/eslint-config-base eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-simple-import-sort @eslint-react/eslint-plugin @stylistic/eslint-plugin eslint-plugin-perfectionist eslint-plugin-react-hooks
```

> 💡 **Upgrading?** See the [Migration Guide](#-migration-guide).

## 🚀 Quick Start

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  // Project-specific overrides
];
```

## 💡 Examples

### Test overrides and ignores

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    files: ['**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@eslint-react/no-array-index-key': 'off',
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
];
```

### Explicit React version

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    settings: {
      'react-x': {
        version: '19.2', // default: 'detect'
      },
    },
  },
];
```

### Lower a strict Hooks rule while adopting

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
```

## 📋 Configuration Details

### Scope

| Rules                                                | Applied to                 |
| ---------------------------------------------------- | -------------------------- |
| `@eslint-react` preset, `react-hooks` preset         | all files (hooks in `.ts`) |
| JSX style, import sorting, PascalCase function names | `**/*.tsx`, `**/*.jsx`     |

Hooks rules come from `eslint-plugin-react-hooks`. `@eslint-react`'s ports of the same rules are turned off, so each problem is reported once as `react-hooks/*`.

### Key rules

| Rule                                              | Level   | Description                                  |
| ------------------------------------------------- | ------- | -------------------------------------------- |
| `react-hooks/rules-of-hooks`                      | `error` | Rules of Hooks                               |
| `react-hooks/exhaustive-deps`                     | `warn`  | Hook dependencies                            |
| `react-hooks/purity`, `refs`, `immutability`, ... | `error` | React Compiler rules                         |
| `@eslint-react/no-missing-key`                    | `error` | Missing keys in lists                        |
| `@eslint-react/no-array-index-key`                | `warn`  | Array index as key                           |
| `@eslint-react/jsx-no-children-prop`              | `error` | `children` passed as a prop                  |
| `@eslint-react/jsx-no-useless-fragment`           | `error` | Unnecessary fragments                        |
| `@eslint-react/dom-no-unknown-property`           | `error` | Unknown DOM properties (`class`, ...)        |
| `@eslint-react/dom-no-unsafe-target-blank`        | `error` | `target="_blank"` without `rel`              |
| `@stylistic/jsx-pascal-case`                      | `error` | PascalCase component names                   |
| `@stylistic/jsx-self-closing-comp`                | `error` | Self-close elements without children         |
| `@stylistic/jsx-curly-brace-presence`             | `error` | No unnecessary curly braces                  |
| `perfectionist/sort-jsx-props`                    | `error` | Reserved, shorthand, regular, then callbacks |

The naming convention is relaxed so functions may be `PascalCase` (components). The React version is auto-detected.

## 🔄 Import Sorting

Imports are sorted and type-only imports are enforced.

**Before:**

```typescript
import { Component } from './component';
import React, { useState } from 'react';
import { User } from './types';
```

**After `eslint --fix`:**

```typescript
import React, { useState } from 'react';
import { type User } from './types';
import { Component } from './component';
```

## 🎯 When to Use

- ✅ React libraries and apps written in TypeScript
- ✅ Strict Hooks and React Compiler checks, even without the Compiler
- ✅ Consistent JSX style across a team

For non-React TypeScript use [`@jmlweb/eslint-config-base`](../eslint-config-base). For new projects prefer [`@jmlweb/oxlint-config-react`](../oxlint-config-react).

## 🔧 Extending the Configuration

Spread the config, then add objects after it. Later entries win.

```javascript
// eslint.config.js
import reactConfig from '@jmlweb/eslint-config-react';

export default [
  ...reactConfig,
  {
    files: ['**/*.tsx'],
    rules: {
      '@stylistic/jsx-curly-brace-presence': 'off',
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
- **React** >= 17 (modern JSX transform)
- **TypeScript** project with a `tsconfig.json` (versions supported by typescript-eslint 8)

## 📦 Peer Dependencies

- `eslint` (`^9.0.0 || ^10.0.0`)
- `@eslint/js` (`^9.0.0 || ^10.0.0`)
- `typescript-eslint` (`^8.0.0`)
- `eslint-config-prettier` (`^9.1.0 || ^10.0.0`)
- `eslint-plugin-simple-import-sort` (`^12.0.0 || ^13.0.0 || ^14.0.0`)
- `@eslint-react/eslint-plugin` (`^5.0.0`)
- `@stylistic/eslint-plugin` (`^5.0.0`)
- `eslint-plugin-perfectionist` (`^5.0.0`)
- `eslint-plugin-react-hooks` (`^7.0.0`)
- `@jmlweb/eslint-config-base` (`^3.0.3`)

## 🔗 Related Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base): TypeScript config (extended by this package)
- [`@jmlweb/oxlint-config-react`](../oxlint-config-react): Oxlint equivalent, recommended for new projects
- [`@jmlweb/tsconfig-react`](../tsconfig-react): TypeScript config for React
- [`@jmlweb/prettier-config-base`](../prettier-config-base): Prettier config (maintenance mode)

## 🔄 Migration Guide

### 5.x to 6.0

Hooks rules now come from `eslint-plugin-react-hooks`' `recommended` preset instead of two hand-picked rules.

- React Compiler rules are enabled, most as errors (`purity`, `refs`, `immutability`, `set-state-in-effect`, `static-components`, ...)
- Hooks rules also apply to `.ts` files

1. Run `npx eslint .` and fix the new reports.
2. To adopt gradually, lower rules to `warn`, for example `'react-hooks/set-state-in-effect': 'warn'`.

### 4.x to 5.0

`eslint-plugin-react` is replaced by `@eslint-react/eslint-plugin`, which supports ESLint 10.

- Remove `eslint-plugin-react`; add `@eslint-react/eslint-plugin`, `@stylistic/eslint-plugin` and `eslint-plugin-perfectionist`
- `react/*` rules are now `@eslint-react/*`, `@stylistic/*` or `perfectionist/sort-jsx-props`
- `jsx-boolean-value`, `jsx-fragments` and `no-unescaped-entities` are no longer enforced
- `settings.react.version` is now `settings['react-x'].version`

1. Swap the dependencies:

   ```bash
   npm uninstall eslint-plugin-react
   npm install --save-dev @eslint-react/eslint-plugin @stylistic/eslint-plugin eslint-plugin-perfectionist
   ```

2. Rename `react/*` rules in overrides and `eslint-disable` comments (`react/no-array-index-key` becomes `@eslint-react/no-array-index-key`).
3. Run `npx eslint --fix .` and review the remaining reports.

### 3.x to 4.0

Node.js >= 22.12.0 is now required (see the [Changelog](./CHANGELOG.md)).

## 📄 License

MIT
