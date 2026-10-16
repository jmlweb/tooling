# @jmlweb/oxlint-config-react

[![npm version](https://img.shields.io/npm/v/@jmlweb/oxlint-config-react)](https://www.npmjs.com/package/@jmlweb/oxlint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)

> [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) configuration for React. Extends [`@jmlweb/oxlint-config-base`](../oxlint-config-base) and ports [`@jmlweb/eslint-config-react`](../eslint-config-react). Recommended linter for React projects.

## ✨ Features

- ⚛️ **Hooks and React Compiler rules**: `eslint-plugin-react-hooks`' `recommended` rules, run natively
- 🧩 **@eslint-react**: Its `recommended-typescript` rules, run as an Oxlint JS plugin
- 🔤 **Sorted JSX props**: Reserved first, then shorthand, callbacks last
- 🎨 **JSX style**: PascalCase components, self-closing tags, no needless curly braces
- 🔒 **Everything from the base config**: Strict TypeScript rules, no enums, named exports only

## 📦 Installation

```bash
npm install --save-dev @jmlweb/oxlint-config-react oxlint oxlint-tsgolint @eslint-react/eslint-plugin eslint-plugin-perfectionist
```

> `eslint-plugin-react-hooks` is not needed: Oxlint implements its rules natively.

## 🚀 Quick Start

Create `oxlint.config.ts` in your project root:

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

> ⚠️ **Set `typeAware` in your own config.** Oxlint reads `options` only from the root config, so type-aware rules are skipped without it.

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

**All files** (custom hooks usually live in `.ts` files):

- `eslint-plugin-react-hooks` `recommended` rules, React Compiler ones included, as native `react/*` rules
- `@eslint-react` `recommended-typescript` rules, without its ports of the hooks rules

**JSX files** (`**/*.{tsx,jsx}`):

| Rule                                       | Level   | Description                                        |
| ------------------------------------------ | ------- | -------------------------------------------------- |
| `@eslint-react/jsx-no-children-prop`       | `error` | Pass children as JSX children, not as a prop       |
| `@eslint-react/dom-no-unknown-property`    | `error` | No unknown DOM properties                          |
| `@eslint-react/dom-no-unsafe-target-blank` | `error` | Requires `rel="noreferrer"` with `target="_blank"` |
| `@eslint-react/jsx-no-useless-fragment`    | `error` | No unnecessary fragments                           |
| `react/jsx-pascal-case`                    | `error` | PascalCase components                              |
| `react/self-closing-comp`                  | `error` | Self-close elements without children               |
| `react/jsx-curly-brace-presence`           | `error` | No braces around string props or children          |
| `perfectionist/sort-jsx-props`             | `error` | Reserved, shorthand, other props, callbacks        |

### Differences from `@jmlweb/eslint-config-react`

- **No `naming-convention`**: see [`@jmlweb/oxlint-config-base`](../oxlint-config-base)
- **No import sorting**: [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) sorts imports
- **No hooks `config` and `gating` rules**: they validate React Compiler options and have no Oxlint equivalent

`@eslint-react` runs as a JS plugin, which is still in alpha in Oxlint. Its rule list is derived from its own presets, so it follows new releases.

## 🎯 When to Use

- ✅ Fast linting for React + TypeScript projects (recommended)
- ✅ React Compiler checks without `eslint-plugin-react-hooks`
- ✅ Migrating from `@jmlweb/eslint-config-react` (maintenance mode)

**Without React**, use [`@jmlweb/oxlint-config-base`](../oxlint-config-base).

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

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

```bash
npm run lint      # Lint all files
npm run lint:fix  # Fix auto-fixable problems
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **Oxlint** >= 1.87.0
- **TypeScript project** with a `tsconfig.json` (for type-aware rules)
- **TypeScript** < 6.1: `@eslint-react/eslint-plugin` and `eslint-plugin-perfectionist` depend on `@typescript-eslint/utils`, which does not support TypeScript 7 yet. With TypeScript 7, Oxlint crashes in the JS plugins with `Cannot read properties of undefined (reading 'Intrinsic')`

## 📦 Peer Dependencies

- `oxlint` (>=1.87.0)
- `oxlint-tsgolint` (>=7.0.0, optional): enables type-aware rules
- `@eslint-react/eslint-plugin` (^5.0.0)
- `eslint-plugin-perfectionist` (^5.0.0): provides `sort-jsx-props`

`@jmlweb/oxlint-config-base` is a regular dependency; do not install it separately.

## 🔗 Related Packages

- [`@jmlweb/oxlint-config-base`](../oxlint-config-base) - Base config this package extends
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt config, the formatter to pair with this linter
- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript config for React
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint equivalent (maintenance mode)

## 📄 License

MIT
