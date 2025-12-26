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
npm install --save-dev @jmlweb/tsconfig-node typescript @jmlweb/tsconfig-base
```

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
npm install --save-dev @types/node
```

This provides Node.js-specific type definitions like `Buffer`, `process`, `fs`, etc.

## 📚 Examples

See real-world usage examples:

- [`example-nodejs-typescript-api`](../../apps/example-nodejs-typescript-api) - Node.js TypeScript API example

## 🔗 Related Packages

- [`@jmlweb/tsconfig-base`](../tsconfig-base) - Base TypeScript configuration (extended by this package)
- [`@jmlweb/eslint-config-base`](../eslint-config-base) - ESLint configuration for TypeScript projects
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

## 📄 License

MIT
