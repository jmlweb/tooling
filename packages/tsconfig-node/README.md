# @jmlweb/tsconfig-node

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-node)](https://www.npmjs.com/package/@jmlweb/tsconfig-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)

> TypeScript configuration for Node.js and CLI projects. Extends `@jmlweb/tsconfig-base` without DOM types.

## ✨ Features

- 🔒 **Strict Mode**: inherits every strict flag from the base config
- 🟢 **Node.js Focused**: `lib: ["ES2022"]`, no DOM types
- 🚀 **NodeNext Modules**: Node.js ESM/CJS resolution, inherited from base
- 🎯 **Flexible**: no file patterns imposed

## 📦 Installation

```bash
npm install --save-dev @jmlweb/tsconfig-node @jmlweb/tsconfig-base typescript
```

## 🚀 Quick Start

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Examples

### CLI tool

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### Typecheck only (with a bundler or `tsx`)

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "noEmit": true,
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"]
}
```

## 📋 Configuration Details

Extends [`@jmlweb/tsconfig-base`](../tsconfig-base) and adds:

| Option | Value        | Description                    |
| ------ | ------------ | ------------------------------ |
| `lib`  | `["ES2022"]` | ES2022 APIs only, no DOM types |

All other options (`strict`, `target: ES2022`, `module`/`moduleResolution: NodeNext`, `verbatimModuleSyntax`, …) come from the base config. With `NodeNext`, relative imports need `.js` extensions.

## 🎯 When to Use

- ✅ Node.js applications, APIs and services
- ✅ CLI tools and scripts
- ✅ Server-side libraries

Browser or React code: use [`@jmlweb/tsconfig-react`](../tsconfig-react). Need DOM types in Node.js (for example `fetch` typings): add `"lib": ["ES2022", "DOM"]`.

## 🔧 Extending the Configuration

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "lib": ["ES2023"],
    "types": ["node"]
  }
}
```

## 📝 Usage with Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

```bash
npm run typecheck
```

## 📋 Requirements

- **Node.js** >= 22.12.0
- **TypeScript** >= 5.0.0

## 📦 Peer Dependencies

- `@jmlweb/tsconfig-base` (^2.0.0)
- `typescript` (>=5.0.0)

## 🔗 Related Packages

- [`@jmlweb/tsconfig-base`](../tsconfig-base) - base config extended by this package
- [`@jmlweb/oxlint-config-node`](../oxlint-config-node) - Oxlint configuration for Node.js (recommended)
- [`@jmlweb/oxfmt-config-base`](../oxfmt-config-base) - Oxfmt configuration (recommended)

## 🔄 Migration Guide

### 1.x → 2.0.0

**Breaking:** Node.js `>=22.12.0` is now required (Node.js 18 and 20 are end-of-life).

1. Upgrade Node.js to 22.12.0 or later.
2. Update the package: `npm install --save-dev @jmlweb/tsconfig-node@^2.0.0`.

The `compilerOptions` are unchanged. See the [Changelog](./CHANGELOG.md).

## 📄 License

MIT
