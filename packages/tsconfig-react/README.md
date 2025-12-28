# @jmlweb/tsconfig-react

[![npm version](https://img.shields.io/npm/v/@jmlweb/tsconfig-react)](https://www.npmjs.com/package/@jmlweb/tsconfig-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB.svg)](https://react.dev/)

> TypeScript configuration for React libraries. Extends `@jmlweb/tsconfig-base` with JSX support, DOM types, and bundler-optimized module resolution.

## ✨ Features

- 🔒 **Strict Type Checking**: Inherits all strict TypeScript rules from base config
- ⚛️ **JSX Support**: Modern JSX transform (React 17+) with `react-jsx`
- 🌐 **DOM Types**: Includes DOM and DOM.Iterable libs for browser APIs
- 📦 **Bundler Resolution**: Optimized `moduleResolution: "bundler"` for modern build tools
- 🎯 **Modern Modules**: Uses ESNext modules for optimal bundling
- 🚀 **Extensible**: Extends base config, easy to customize

## 📦 Installation

```bash
pnpm add -D @jmlweb/tsconfig-react typescript @jmlweb/tsconfig-base
```

> 💡 **Upgrading from a previous version?** See the [Migration Guide](#-migration-guide) for breaking changes and upgrade instructions.

## 🚀 Quick Start

Create a `tsconfig.json` file in your project root:

```json
{
  "extends": "@jmlweb/tsconfig-react",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Examples

### Basic Setup

```json
{
  "extends": "@jmlweb/tsconfig-react",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### With Custom Output Directory

```json
{
  "extends": "@jmlweb/tsconfig-react",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

### With Additional Compiler Options

```json
{
  "extends": "@jmlweb/tsconfig-react",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### For React Library with Path Mapping

```json
{
  "extends": "@jmlweb/tsconfig-react",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 📋 Configuration Details

### What's Included

This configuration extends `@jmlweb/tsconfig-base` and adds:

- ✅ **JSX Support**: `jsx: "react-jsx"` for modern React JSX transform
- ✅ **DOM Types**: Includes `DOM` and `DOM.Iterable` libs
- ✅ **Bundler Resolution**: `moduleResolution: "bundler"` for modern build tools
- ✅ **ESNext Modules**: `module: "ESNext"` for optimal bundling
- ✅ **All Base Config**: Inherits strict type checking and best practices

### JSX Transform

Uses the modern `react-jsx` transform (React 17+), which means:

- ✅ No need to import React in every file
- ✅ Automatic JSX runtime handling
- ✅ Smaller bundle sizes
- ✅ Better performance

**Example:**

```typescript
// No React import needed!
export function Button() {
  return <button>Click me</button>;
}
```

### Module Resolution

Uses `bundler` resolution, which is optimized for:

- ✅ Vite
- ✅ Webpack 5+
- ✅ Rollup
- ✅ esbuild
- ✅ Other modern bundlers

This allows for better tree-shaking and modern module features.

## 🎯 When to Use

Use this configuration when you want:

- ✅ React library development
- ✅ React component libraries
- ✅ React applications with TypeScript
- ✅ Modern JSX transform support
- ✅ Strict type checking for React code
- ✅ DOM API type support

**For non-React TypeScript projects**, use [`@jmlweb/tsconfig-base`](../tsconfig-base) instead.

**For internal tooling projects**, use [`@jmlweb/tsconfig-internal`](../tsconfig-internal) instead.

## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```json
{
  "extends": "@jmlweb/tsconfig-react",
  "compilerOptions": {
    "outDir": "./dist",
    "jsx": "react-jsxdev", // For development builds
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 📝 Usage with Scripts

TypeScript compilation is typically handled by your build tool. For manual compilation:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

### Usage with Build Tools

#### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

#### Webpack

```typescript
// webpack.config.ts
import type { Configuration } from 'webpack';

const config: Configuration = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
};
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0
- **React** >= 17.0.0 (for JSX runtime support)

## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `typescript` (>= 5.0.0)
- `@jmlweb/tsconfig-base` (^1.0.0)

## 📚 Examples

See real-world usage examples:

- [`example-react-typescript-app`](../../apps/example-react-typescript-app) - React TypeScript app example

## 🔗 Related Packages

### Internal Packages

- [`@jmlweb/tsconfig-base`](../tsconfig-base) - Base TypeScript configuration (extended by this package)
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint configuration for React libraries
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting
- [`@jmlweb/vite-config`](../vite-config) - Vite configuration for React projects

### External Tools

- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [Vite](https://vite.dev/) - Build tool with first-class TypeScript support
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) - Official React plugin for Vite

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
