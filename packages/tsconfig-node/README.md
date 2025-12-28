# @jmlweb/tsconfig-node

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-node)](https://www.npmjs.com/package/@jmlweb/tsconfig-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)

> TypeScript configuration for Node.js and CLI projects. Extends `@jmlweb/tsconfig-base` with Node.js-specific settings, excluding DOM types and including only ES library types.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- 🖥️ **Node.js Optimized**: Excludes DOM types, includes only ES2022 library types
- 📦 **NodeNext Modules**: Uses NodeNext module resolution (inherited from base)
- 🎯 **Clean Types**: No browser/DOM APIs, only Node.js and ES APIs
- 🚀 **Extensible**: Extends base config, easy to customize

## 📦 Installation

```bash
pnpm add -D @jmlweb/tsconfig-node typescript @jmlweb/tsconfig-base
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create a `tsconfig.json` file in your project root:

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

### Basic Node.js API

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

### CLI Tool

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Library Package

```json
{
  "extends": "@jmlweb/tsconfig-node",
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

### With Path Mapping

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🤔 Why Use This?

> **Philosophy**: Node.js projects should use only Node.js and ES types, avoiding browser APIs that don't exist in the runtime.

This package provides a TypeScript configuration specifically for Node.js server-side development and CLI tools. It extends the strict base configuration while carefully excluding browser/DOM types that would allow you to accidentally use APIs that don't exist in Node.js.

### Design Decisions

**ES-Only Library Types (`lib: ["ES2022"]`)**: Excludes DOM and browser APIs

- **Why**: Node.js doesn't have browser APIs like `window`, `document`, or DOM event types. Including DOM types in a Node.js project allows you to accidentally write code that compiles but crashes at runtime. This config prevents that entire class of bugs
- **Trade-off**: Must install `@types/node` separately for Node.js-specific types. But you need that anyway for Node.js development
- **When to override**: If building a universal library that runs in both Node.js and browsers (but consider having separate tsconfigs for each environment)

**NodeNext Module Resolution (`moduleResolution: "NodeNext"`)**: Matches Node.js module behavior

- **Why**: Node.js has specific module resolution rules, especially with ESM. `NodeNext` resolution matches exactly how Node.js resolves modules, preventing mismatches between TypeScript compilation and runtime behavior
- **Trade-off**: Requires following Node.js ESM rules (explicit file extensions, package.json exports). But these are Node.js requirements anyway
- **When to override**: For legacy CommonJS-only projects, you might use `node` resolution, but `NodeNext` works for both CommonJS and ESM

**Dual Module Support**: Works with both CommonJS and ESM

- **Why**: Node.js supports both module systems through package.json `type` field and file extensions. This config respects those conventions, making it work seamlessly whether you're using CommonJS, ESM, or gradually migrating
- **Trade-off**: Must be deliberate about module format choices in your package.json
- **When to override**: Never - this flexibility is essential for modern Node.js development

## 📋 Configuration Details

### What's Included

This configuration extends `@jmlweb/tsconfig-base` and adds:

- ✅ **ES Library Types Only**: `lib: ["ES2022"]` - excludes DOM types
- ✅ **Node.js Module Resolution**: Inherits `NodeNext` from base config
- ✅ **All Base Config**: Inherits strict type checking and best practices

### Library Types

This config explicitly sets `lib: ["ES2022"]` to:

- ✅ Include ES2022 language features and APIs
- ✅ Exclude DOM types (no `window`, `document`, etc.)
- ✅ Rely on `@types/node` for Node.js-specific types (installed separately)

**Why exclude DOM types?**

For Node.js projects, DOM types are unnecessary and can lead to:

- Accidental use of browser APIs
- Larger type definitions
- Confusion between Node.js and browser APIs

### Module Resolution

Uses `NodeNext` (inherited from base config), which:

- ✅ Supports both CommonJS and ESM
- ✅ Respects `package.json` `type` field
- ✅ Works with modern Node.js module systems
- ✅ Supports `.mjs` and `.cjs` extensions

## 🎯 When to Use

Use this configuration when you want:

- ✅ Node.js API servers
- ✅ CLI tools and utilities
- ✅ Node.js libraries and packages
- ✅ Backend services
- ✅ Scripts and automation tools
- ✅ Pure Node.js projects (no browser code)

**For React projects**, use [`@jmlweb/tsconfig-react`](../tsconfig-react) instead.

**For Next.js projects**, use [`@jmlweb/tsconfig-nextjs`](../tsconfig-nextjs) instead.

**For internal tooling projects**, use [`@jmlweb/tsconfig-internal`](../tsconfig-internal) instead.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```json
{
  "extends": "@jmlweb/tsconfig-node",
  "compilerOptions": {
    "outDir": "./dist",
    "target": "ES2020",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 📝 Usage with Scripts

TypeScript compilation is typically handled by your build tool. For manual compilation:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "watch": "tsc --watch"
  }
}
```

### Usage with Build Tools

#### tsup

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
});
```

#### tsx (for development)

```bash
# Run TypeScript files directly
tsx src/index.ts
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0
- **@types/node** (recommended) - Install separately for Node.js type definitions

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `typescript` (>= 5.0.0)
- `@jmlweb/tsconfig-base` (^1.0.0)

### Recommended Dependencies

For Node.js projects, you should also install:

```bash
pnpm add -D @types/node
```

This provides Node.js-specific type definitions like `Buffer`, `process`, `fs`, etc.

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API example

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/tsconfig-base`](../tsconfig-base) - Base TypeScript configuration (extended by this package)
- [`@jmlweb/eslint-config-node`](../eslint-config-node) - ESLint configuration for Node.js projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

### External Tools

- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 engine
- [tsx](https://github.com/privatenumber/tsx) - TypeScript execute (ts-node alternative)
- [ts-node](https://typestrong.org/ts-node/) - TypeScript execution engine for Node.js

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
