# @jmlweb/tsconfig-base

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-base)](https://www.npmjs.com/package/@jmlweb/tsconfig-base)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)

> Base TypeScript configuration with strict type checking and modern defaults. Designed to be extended by projects without imposing file inclusion/exclusion patterns.

## ✨ Features

- 🔒 **Strict Mode**: All strict flags enabled for maximum type safety
- 🚀 **Modern Defaults**: ES2022 target with NodeNext module resolution
- 🛡️ **Extra Safety**: Additional strict checks beyond the `strict` flag
- 🎯 **Flexible**: No `include`/`exclude` defined - you control what gets compiled
- 🗺️ **Source Maps**: Enabled by default for debugging

## 📦 Installation

```bash
npm install --save-dev @jmlweb/tsconfig-base typescript
```

## 🚀 Quick Start

Create a `tsconfig.json` file in your project root:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Examples

### Node.js Project

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Library with Multiple Entry Points

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Monorepo Package

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### React Project

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Overriding Options

You can override any option in your project's `tsconfig.json`:

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "target": "ES2020",
    "noUncheckedIndexedAccess": false
  },
  "include": ["src/**/*"]
}
```

## 📋 Configuration Details

### Compiler Options Included

| Option                               | Value      | Description                                    |
| ------------------------------------ | ---------- | ---------------------------------------------- |
| `strict`                             | `true`     | Enables all strict type checking options       |
| `target`                             | `ES2022`   | Modern JavaScript features                     |
| `module`                             | `NodeNext` | Node.js ESM module system                      |
| `moduleResolution`                   | `NodeNext` | Node.js module resolution                      |
| `esModuleInterop`                    | `true`     | CommonJS/ESM interoperability                  |
| `skipLibCheck`                       | `true`     | Skip type checking of declaration files        |
| `forceConsistentCasingInFileNames`   | `true`     | Enforce consistent file name casing            |
| `declaration`                        | `true`     | Generate `.d.ts` files                         |
| `declarationMap`                     | `true`     | Generate sourcemaps for `.d.ts` files          |
| `sourceMap`                          | `true`     | Generate sourcemaps for debugging              |
| `noUncheckedIndexedAccess`           | `true`     | Add `undefined` to index signatures            |
| `noImplicitOverride`                 | `true`     | Require `override` keyword                     |
| `noPropertyAccessFromIndexSignature` | `true`     | Require bracket notation for index signatures  |
| `exactOptionalPropertyTypes`         | `true`     | Differentiate between `undefined` and optional |
| `noFallthroughCasesInSwitch`         | `true`     | Report fallthrough cases in switch             |
| `isolatedModules`                    | `true`     | Ensure compatibility with transpilers          |
| `verbatimModuleSyntax`               | `true`     | Enforce explicit type imports/exports          |
| `resolveJsonModule`                  | `true`     | Allow importing JSON files                     |

### What You Need to Configure

Since this base config intentionally omits file patterns, you must configure:

- ✅ `include`: Which files to compile (e.g., `["src/**/*"]`)
- ✅ `exclude`: Which files to ignore (e.g., `["node_modules", "dist"]`)
- ✅ `outDir`: Output directory for compiled files
- ✅ `rootDir`: Root directory of source files (optional but recommended)

## 🎯 Why No File Patterns?

This base config intentionally omits `include` and `exclude` patterns because:

- ✅ Different projects have different file structures
- ✅ You maintain full control over what gets compiled
- ✅ Prevents conflicts with project-specific patterns
- ✅ More flexible for various project types

## 🎯 When to Use

Use this configuration when you want:

- ✅ Strict TypeScript type checking for maximum type safety
- ✅ Modern JavaScript features (ES2022)
- ✅ Node.js ESM module system
- ✅ Flexible file inclusion/exclusion patterns
- ✅ Foundation for extending with framework-specific configs

**For React projects**, use [`@jmlweb/tsconfig-react`](../tsconfig-react) instead.

**For internal tooling projects**, use [`@jmlweb/tsconfig-internal`](../tsconfig-internal) instead.

## 🔧 Extending the Configuration

### Using ES Modules (ESM)

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### Using CommonJS

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
```

### Less Strict Configuration

```json
{
  "extends": "@jmlweb/tsconfig-base",
  "compilerOptions": {
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false
  }
}
```

## 📝 Usage with Scripts

TypeScript compilation is typically handled by your build tool or IDE. For manual compilation:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `typescript` (>= 5.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API example

## 🔗 Related Packages

- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint configuration for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier configuration
- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript configuration for React projects

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
